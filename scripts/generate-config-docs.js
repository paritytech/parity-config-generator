const fs = require('fs');
const path = require('path');
const BufferList = require('bl');
const docTemplate = require('../docs/docTemplate.js');
const data = require('./generate-config-data.js');

const outputDir = '../docs/';
const outputFile = 'config.md';

function dirtySerialize (valueItem) {
  if (typeof valueItem !== 'undefined') {
    const rawDefaultValue = valueItem;
    var defaultValue;
    if (typeof rawDefaultValue === 'object') {
      if (rawDefaultValue === null) {
        defaultValue = 'null';
      } else {
        defaultValue = JSON.stringify(rawDefaultValue);
      }
    } else {
      if (rawDefaultValue === '') {
        defaultValue = '""';
      } else {
        defaultValue = rawDefaultValue;
      }
    }
    return defaultValue;
  }
}

function compiledToml (compiledData) {
  var compiledBuffer = new BufferList();
  for (const key in compiledData) {
    if (key[0] !== '_') {
      const sectionValues = compiledData[key];
      compiledBuffer.append('[' + key + ']\n');
      for (const value in sectionValues) {
        if (value.indexOf('section') < 0 && value.indexOf('description') < 0) {
          const valueItem = sectionValues[value]['default'];
          compiledBuffer.append(value + ' = ' + dirtySerialize(valueItem) + '\n');
        }
      }
      compiledBuffer.append('\n');
    }
  }
  return compiledBuffer;
}

// Command line options, configs, and descriptions.
function compiledMd (cliOptions) {
  const compiledBuffer = new BufferList();
  const builtTree = {};
  for (const option in cliOptions) {
    const configSection = cliOptions[option]['configSection'];
    const configProp = cliOptions[option]['configProp'];
    const helpText = cliOptions[option]['help'];
    const variableName = cliOptions[option]['variableName'];
    const defaultValue = dirtySerialize(cliOptions[option]['defaultValue']);
    var cliName = variableName.replace(/_/g, '-').slice(4);
    if (cliName[0] === '-') {
      cliName = cliName.slice(1);
    }
    cliName = '--' + cliName;
    const toAppend = BufferList('\n');
    toAppend.append('## ' + cliName.slice(2) + '\n');
    toAppend.append(helpText + '\n'); // description
    toAppend.append('#### Command line option \n `' + cliName + '`\n'); // cli flag
    if (typeof configSection !== 'undefined') {
      toAppend.append('#### Config file option \n```toml\n' + '[' + configSection + ']' + '\n' + configProp + ' = ' + defaultValue + '\n```\n'); // config item
    }
    toAppend.append('#### Default Value \n`' + defaultValue + '`\n');
    if (typeof builtTree[configSection] !== 'undefined') {
      builtTree[configSection].append(toAppend);
    } else {
      builtTree[configSection] = toAppend;
    }
  }
  for (var section in builtTree) {
    var sectionText = section;
    if (section === 'undefined') {
      sectionText = 'CLI Only';
    }
    compiledBuffer.append('# ' + sectionText + '\n');
    compiledBuffer.append(builtTree[section]);
    compiledBuffer.append('\n');
  }

  return compiledBuffer;
}

async function buildPage () {
  var compiledBuffer = new BufferList();
  const source = await data.fetchSource();
  compiledBuffer.append(docTemplate.preExampleConfig);
  compiledBuffer.append(compiledToml(data.getData(source)));
  compiledBuffer.append(docTemplate.postExampleConfig);
  compiledBuffer.append(docTemplate.preConfigDoc);
  compiledBuffer.append(compiledMd(data.getCliOptions(source)));
  compiledBuffer.append(docTemplate.postConfigDoc);
  return compiledBuffer;
}

(async function () {
  fs.writeFileSync(path.resolve(__dirname, outputDir + outputFile), (await buildPage()).toString());
})().catch(e => {
  console.error(e);
  process.exit(1);
});

