const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchSource () {
  return new Promise(resolve => {
    https.get('https://raw.githubusercontent.com/paritytech/parity/master/parity/cli/mod.rs', res => {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', data => { body += data; });
      res.on('end', () => { resolve(body); });
    });
  });
}

function getCliOptions (source) {
  const regex = /^\s*(FLAG|ARG) (\w+): *\([\w<>]+?\) *= (.+?)(?:u\d+|usize)?, or (.+),\n.+\n\s*"(.+)",(?:\s+\/\/.+)?$/gm;

  const cliOptions = [];
  for (const [, type, variableName, defaultValueString, configCallbackString, helpString] of execAll(regex, source)) {
    cliOptions.push({type, variableName, defaultValueString, configCallbackString, helpString});
  }

  const parsedCliOptions = cliOptions.map(({defaultValueString, configCallbackString, helpString, ...rest}) => {
    const defaultValue = parseDefaultValue(defaultValueString);
    const help = helpString.replace(/\\"/g, '"');
    const {configSection, configProp, configIs} = parseConfigCallback(configCallbackString);
    return {defaultValue, help, configSection, configProp, configIs, ...rest};
  });

  return parsedCliOptions;
}

function* execAll (regex, str) {
  const localCopy = new RegExp(regex, regex.flags);
  let match;
  while ((match = localCopy.exec(str))) {
    yield match;
  }
}

function parseDefaultValue (defaultValue) {
  switch (defaultValue) {
    case 'None':
      return null;
    case 'Vec::new()':
      return [];
    default:
      try {
        return JSON.parse(defaultValue);
      } catch (e) {
        console.warn('Warning: Failed to parse default value', defaultValue);
      }
  }
}

function parseConfigCallback (configCallback) {
  const regexToConfigIs = [
    [
      /^\|c: &Config\| c.([a-zA-Z_]+).as_ref\(\)\?\.([a-zA-Z_]+)(?:\.clone\(\))?$/,
      'same'
    ],
    [
      /^\|c: &Config\| c.([a-zA-Z_]+).as_ref\(\)\?\.([a-zA-Z_]+)(?:\.clone\(\))?\.map\(\|([a-zA-Z_]+)\| !\3\)(\.clone\(\))?$/,
      'opposite'
    ],
    [
      /^\|c: &Config\| c.([a-zA-Z_]+).as_ref\(\)\?\.([a-zA-Z_]+)(?:\.clone\(\)|\.as_ref\(\))?\.map\(\|vec\| vec.join\(","\)\)?$/,
      'array_of'
    ],
    [
      /^\|_\| None$/,
      'none'
    ]
  ];

  for (const [regex, configIs] of regexToConfigIs) {
    const parts = regex.exec(configCallback);
    if (parts !== null) {
      const [, configSection, configProp] = parts;
      return {configIs, configSection, configProp};
    }
  }

  console.warn('Warning: Failed to recognize callback', configCallback);
  return {configIs: 'unknown'};
}

function makeCliConfigTree (parsedCliOptions) {
  const configCliOptions = parsedCliOptions.filter(({configIs}) =>
        configIs !== 'none' && configIs !== 'unknown'
    );

  const tree = {};
  configCliOptions.forEach(({configSection, configProp, ...rest}) => {
    tree[configSection] = tree[configSection] || {};
    tree[configSection][configProp] = {...rest};
  });
  return tree;
}

function getStructFields (name, source) {
  const subsource = source.match(new RegExp(`^struct ${name} {[^]+?}`, 'm'))[0];

  const fields = subsource.split('\n').slice(1, -1);

  const parsedFields = fields.map(line => {
    const matches = line.match(/^\s*(\w+): Option<([\w<>]+)>,$/);
    const [, name, type] = matches;
    return {name, type};
  });

  return parsedFields;
}

function hydrateConfigWithCli (config, cliConfig) {
  const data = {};

  for (const section of config) {
    data[section.name] = {};
    data[section.name].section = section.name_friendly;

    for (const prop of section.props) {
      data[section.name][prop.name] = {};
      data[section.name][prop.name].name = prop.name.replace(/_/g, ' ').replace(/^./, a => a.toUpperCase());
      data[section.name][prop.name].type = prop.type;

      // If the config prop is linked to a CLI command
      if (section.name in cliConfig &&
          prop.name in cliConfig[section.name]) {
        const cliConfigProp = cliConfig[section.name][prop.name];
        const dataProp = data[section.name][prop.name];

        if (cliConfigProp.configIs === 'same') {
          dataProp.description = cliConfigProp.help;
          dataProp.default = cliConfigProp.defaultValue;
        } else if (cliConfigProp.configIs === 'array_of') {
          dataProp.description = cliConfigProp.help;
          if (cliConfigProp.defaultValue !== null) {
            dataProp.default = cliConfigProp.defaultValue.split(',');
          }
        } else if (cliConfigProp.configIs === 'opposite') {
          dataProp.default = !cliConfigProp.defaultValue;
        } else {
          console.error("Error: Unreachable: configIs can be 'same', 'array_of', 'opposite', 'none', 'unknown'; is none of the first three; last two are pruned in makeCliConfigTree; qed.");
        }
      } else {
        console.warn('Warning: Config option %s.%s is not linked to any CLI option.', section.name, prop.name);
      }
    }
  }

  return data;
}

function augment (data, extra) {
  const dataAugmented = Object.assign({}, data);

  for (const section in extra) {
    if (!(section in dataAugmented)) {
      dataAugmented[section] = extra[section];
      continue;
    }

    for (const prop in extra[section]) {
      if (prop === 'section' || prop === 'description' || prop === 'condition') {
        dataAugmented[section][prop] = extra[section][prop];
        continue;
      }

      dataAugmented[section][prop] = {...dataAugmented[section][prop], ...extra[section][prop]};
    }
  }

  return dataAugmented;
}

(async function () {
  const source = await fetchSource();

  // Parse CLI options

  const cliOptions = getCliOptions(source);
  const configCliOptions = makeCliConfigTree(cliOptions);

  // Parse config structs

  const configSections = getStructFields('Config', source).map(({name: section, type: sectionStructName}) =>
      ({
        name: section,
        name_friendly: sectionStructName,
        props: getStructFields(sectionStructName, source).map(prop => {
          prop.type = prop.type.toLowerCase().replace(/vec<(.+)>/,"$1[]").replace(/u16|u32|u64|usize/,"number");
          return prop; })
      })
  );

  // Hydrate config structs with CLI options

  const data = hydrateConfigWithCli(configSections, configCliOptions);

  // Augment with data.extra.json

  const extra = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data.extra.json'), 'UTF-8'));
  const dataAugmented = augment(data, extra);

  // Write to file

  fs.writeFileSync(path.resolve(__dirname, '../src/data.compiled.json'), JSON.stringify(dataAugmented, null, 2));
})();
