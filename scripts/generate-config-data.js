const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const bl = require('bl');

const CONFIG_IS = {
  SAME: 'same',
  OPPOSITE: 'opposite',
  ARRAY_OF: 'array_of',
  NONE: 'none',
  UNKNOWN: 'unknown'
};

function fetchSource () {
  if (process.env.AUTOGENSCRIPT) {
    return fs.readFile(path.resolve(__dirname, '../../parity/cli/mod.rs'), 'UTF-8');
  }
  return new Promise((resolve, reject) => {
    https.get('https://raw.githubusercontent.com/paritytech/parity/master/parity/cli/mod.rs', res => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to load source code, status code: ${res.statusCode}`));
      }

      res.pipe(bl(function (err, data) {
        if (err) {
          reject(new Error(err));
        }

        resolve(data.toString());
      }));
    });
  }
  );
}

function getCliOptions (source) {
  const regex = /^\s*(FLAG|ARG) (\w+): *\([\w<>]+?\) *= (.+?)(?:u\d+|usize)?, or (.+),\n.+\n\s*"(.+)",(?:\s+\/\/.+)?$/gm;

  const cliOptions = [];
  for (const [, type, variableName, defaultValueString, configCallbackString, helpString] of execAll(regex, source)) {
    if (configCallbackString.includes('_legacy')) {
      continue;
    }
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
        // Remove thousands separators if numeric value
        if (/^\d[\d_]+\d$/.test(defaultValue)) {
          defaultValue = defaultValue.replace(/_/g, '');
        }

        defaultValue = defaultValue.replace(/^Some\((".+").into\(\)\)$/, '$1');

        return JSON.parse(defaultValue);
      } catch (e) {
        console.warn('Warning: Failed to parse default value', defaultValue, e.message);
      }
  }
}

function parseConfigCallback (configCallback) {
  const regexToConfigIs = [
    [
      /^\|c: &Config\| c\.([a-zA-Z_]+)\.as_ref\(\)\?\.([a-zA-Z_]+)(?:\.clone\(\))?$/,
      CONFIG_IS.SAME
    ],
    [
      /^\|c: &Config\| c\.([a-zA-Z_]+)\.as_ref\(\)\?\.([a-zA-Z_]+)(?:\.clone\(\))?\.map\(\|([a-zA-Z_]+)\| !\3\)(\.clone\(\))?$/,
      CONFIG_IS.OPPOSITE
    ],
    [
      /^\|c: &Config\| c\.([a-zA-Z_]+)\.as_ref\(\)\?\.([a-zA-Z_]+)(?:\.clone\(\)|\.as_ref\(\))?\.map\(\|vec\| vec\.join\(","\)\)?$/,
      CONFIG_IS.ARRAY_OF
    ],
    [
      /^\|_\| None$/,
      CONFIG_IS.UNKNOWN
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
  return {configIs: CONFIG_IS.UNKNOWN};
}

function makeCliConfigTree (parsedCliOptions) {
  const configCliOptions = parsedCliOptions
    .filter(({configIs}) => configIs !== CONFIG_IS.NONE && configIs !== CONFIG_IS.UNKNOWN);

  const tree = {};
  configCliOptions.forEach(({configSection, configProp, ...rest}) => {
    tree[configSection] = tree[configSection] || {};
    tree[configSection][configProp] = {...rest};
  });
  return tree;
}

function getStructFields (name, source) {
  const subsource = source.match(new RegExp(`^struct ${name} {[^]+?}`, 'm'))[0];

  const fields = subsource.split('\n').slice(1, -1).filter(s => s.trim() && !s.trim().startsWith('#') && !s.trim().startsWith('_legacy'));

  const parsedFields = fields.reduce( function (out, line){
    const matches = line.match(/^\s*(\w+): Option<([\w<>]+)>,$/);
    if (matches !== null) {
      const [, name, type] = matches;
      out.push({name, type});
    }
    return out;
  }, []);
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

        switch (cliConfigProp.configIs) {
          case CONFIG_IS.SAME:
            dataProp.description = cliConfigProp.help;
            dataProp.default = cliConfigProp.defaultValue;
            break;
          case CONFIG_IS.ARRAY_OF:
            dataProp.description = cliConfigProp.help;
            if (cliConfigProp.defaultValue !== null) {
              dataProp.default = cliConfigProp.defaultValue.split(',');
            } else {
              dataProp.default = [];
            }
            break;
          case CONFIG_IS.OPPOSITE:
            dataProp.default = !cliConfigProp.defaultValue;
            break;
          default:
            throw new Error(`Error: Unreachable: configIs with value '${cliConfigProp.configIs}' can be 'same', 'array_of', 'opposite', 'none', 'unknown'; is none of the first three; last two are pruned in makeCliConfigTree; qed.`);
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
  const overwritten = [];

  for (const section in extra) {
    if (!(section in dataAugmented)) {
      dataAugmented[section] = extra[section];
      overwritten.push(section);
      continue;
    }

    for (const prop in extra[section]) {
      if (prop === 'section' || prop === 'description' || prop === 'condition') {
        dataAugmented[section][prop] = extra[section][prop];
        continue;
      }

      overwritten.push(`${section}.${prop}`);
      dataAugmented[section][prop] = {...dataAugmented[section][prop], ...extra[section][prop]};
    }
  }

  // Quick hack to retain the key order of data.extra.json
  // (make new object and insert data.extra.json props first)

  const dataAugmentedOrdered = {};

  overwritten.forEach(id => {
    if (!id.includes('.')) {
      dataAugmentedOrdered[id] = dataAugmented[id];
    } else {
      const [section, prop] = id.split('.');
      dataAugmentedOrdered[section] = dataAugmentedOrdered[section] || {};
      dataAugmentedOrdered[section][prop] = dataAugmented[section][prop];
    }
  });

  Object.keys(dataAugmented)
    .filter(section => !overwritten.includes(section))
    .forEach(section => {
      dataAugmentedOrdered[section] = dataAugmentedOrdered[section] || {};

      Object.keys(dataAugmented[section])
        .filter(prop => !overwritten.includes(`${section}.${prop}`))
        .forEach(prop => {
          dataAugmentedOrdered[section][prop] = dataAugmented[section][prop];
        });
    });

  return dataAugmentedOrdered;
}

function generateAugmentedData (source, extra) {
  // Parse CLI options

  const cliOptions = getCliOptions(source);
  const configCliOptions = makeCliConfigTree(cliOptions);

  // Parse config structs

  const configSections = getStructFields('Config', source).map(({name: section, type: sectionStructName}) =>
      ({
        name: section,
        name_friendly: sectionStructName,
        props: getStructFields(sectionStructName, source).map(prop => {
          prop.type = prop.type.toLowerCase().replace(/vec<(.+)>/, '$1[]').replace(/u16|u32|u64|usize/, 'number');
          return prop;
        })
      })
  ).filter(({props}) => props.length);

  // Hydrate config structs with CLI options

  const data = hydrateConfigWithCli(configSections, configCliOptions);

  // Augment with data.extra.json

  return augment(data, extra);
}

async function fetchExtraData(){
  return JSON.parse(await fs.readFile(path.resolve(__dirname, '../src/data.extra.json'), 'UTF-8'));
}

if (!module.parent) {
  (async function () {
  // Make sure that config items with unrecognized default values
  // were set a default value in data.extra.json
    const dataAugmented = generateAugmentedData(await fetchSource(), await fetchExtraData());
  

    Object.keys(dataAugmented).forEach(section => {
      const undefinedDefaults = Object.keys(dataAugmented[section])
        .filter(prop => {
          const item = dataAugmented[section][prop];
          return typeof item === 'object' && typeof item.default === 'undefined';
        })
        .map(prop => `${section}.${prop}`);

      if (undefinedDefaults.length) {
        throw new Error(`Couldn't parse the default CLI value for the following config items: ${undefinedDefaults.join(', ')}. Please set a default value for them in data.extra.json.`);
      }
    });

  // Write to file

    await fs.writeFile(path.resolve(__dirname, '../src/data.compiled.json'), JSON.stringify(dataAugmented, null, 2));
  })().catch(e => {
    console.error(e);
    process.exit(1);
  });
} else {
  module.exports = {
    fetchSource: fetchSource,
    fetchExtra: fetchExtraData,
    getCliOptions: getCliOptions,
    getData: generateAugmentedData
  };
}
