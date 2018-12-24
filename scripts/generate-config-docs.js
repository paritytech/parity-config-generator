const fs = require('fs');
const path = require('path');
const BufferList = require('bl');
const compiled_data = require('../src/data.compiled.json');
const Data = require('./generate-config-data.js');


const output_dir = "./docs/"
const outpit_file = "config.md"
const pre_example_config = new BufferList("---\ntitle: Configuring Parity Ethereum\n---\n\nParity can be configured using either the [CLI options](#cli-options) or a [config file](#config-file). Should the CLI flags and the config file disagree about a setting, the CLI takes precedence.\n\nYou can list all CLI options by running `$parity --help`. The vast majority of CLI options map to a setting in the TOML file, for example `--mode-timeout 500` can be set by creating a config file:\n\n```toml\n[parity]\nmode_timeout = 500\n```\n\n## Config File\n\nParity can be configured using a [TOML](https://github.com/toml-lang/toml) file. The file can be generated using the [Parity Config Generator](https://paritytech.github.io/parity-config-generator/). To start parity with a config file, the file needs to be located in:\n\n* Windows: `%UserProfile%\\AppData\\Roaming\\Parity\\Ethereum\\config.toml`\n* Linux: `~/.local/share/io.parity.ethereum/config.toml`\n* macOS: `$HOME/Library/Application Support/io.parity.ethereum/config.toml`\n\nTo use a custom path run `$ parity --config path/to/config.toml`.\n\n\n## Default config.toml\n\nThe following is a representation of a configuration file with all default values (*note: the `[stratum]` section is not present by default, and including it in your config currently enables stratum*).\n```toml\n");
const post_example_config = new BufferList("\n```\n");
const pre_config_doc = new BufferList("## Presets \nParity can also be launched with a [preset configuration file](https://github.com/paritytech/parity-ethereum/tree/master/parity/cli/presets) using the `--config` flag with one of the following values:\n- `dev`: uses [dev chain specifications](Private-development-chain) with [Instant-seal](Pluggable-Consensus#instant-seal) consensus engine. The gas price is set to 0.\n- `dev-insecure`: uses the same configuration as `dev`, plus sets the flag `no_consensus`, allows all RPC APIs and accepts all RPC interfaces and hosts, as well as all IPFS hosts. \n- `insecure`: uses the Mainnet default configuration, plus sets the flag `no_consensus`, allows all RPC APIs and accepts all RPC interfaces and hosts, as well as all IPFS hosts. \n- `mining`: uses the Mainnet default configuration, plus increases the number of peers to min 50 and max 100, it disables the Dapps and IPC interface. It forces the sealing of blocks with a minimum of 4 seconds interval, forces the reseal for any new transaction (external or local), reduces the transaction queue size to 2048 while increasing the cache size to 256 MB and setting the `trace` logging level for the `miner` and `own_tx` modules.\n- `non-standard-ports`: sets the client to listen to the port 30305 and 8645 for RPC connections.\n\n## Configuration options \n\n");
const post_config_doc = new BufferList("");

function dirtySerialize (valueItem) {
if(typeof valueItem !== 'undefined'){
            const raw_default_value = valueItem;
            var default_value;
            if(typeof raw_default_value == 'object'){
              if(raw_default_value === null){
                default_value = 'null';
              } else {
                default_value = JSON.stringify(raw_default_value);
              }
            } else {
              if(raw_default_value === ""){
                default_value = "\"\""
              } else {
                default_value = raw_default_value;
              }
            }
          return default_value;
          }

}

function compiledToml () {
	var compiled_buffer = new BufferList();
  for(const key in compiled_data){
    if(key[0] !== "_"){
      const section_values = compiled_data[key];
      compiled_buffer.append("["+key+"]\n");
        for(const value in section_values){
          if(value.indexOf("section") < 0 && value.indexOf("description") < 0){
            const valueItem = section_values[value]["default"];
            compiled_buffer.append(value+" = "+dirtySerialize(valueItem)+"\n");
          }
        }
        compiled_buffer.append('\n');
      }
    }
	return compiled_buffer;
}

//Command line options, configs, and descriptions.
function compiledMd (cliOptions) {
	  const compiled_buffer = new BufferList();
    const builtTree = {};
    for(const option in cliOptions){
      const configSection = cliOptions[option]['configSection'];
      const configProp = cliOptions[option]['configProp'];
      const helpText = cliOptions[option]['help'];
      const variableName = cliOptions[option]['variableName'];
      const defaultValue = dirtySerialize(cliOptions[option]['defaultValue']);
      var cliName = variableName.replace(/_/g,"-").slice(4);
      if(cliName[0] == '-'){
        cliName = cliName.slice(1)
      }
      cliName = "--"+cliName;
      const toAppend = BufferList('\n');
      toAppend.append("## "+cliName.slice(2)+"\n");
      toAppend.append(helpText+"\n"); //description
      toAppend.append("#### Command line option \n `"+cliName+"`\n"); //cli flag
      if(typeof configSection !== 'undefined'){
        toAppend.append("#### Config file option \n```toml\n"+"["+configSection+"]"+"\n"+configProp+" = "+defaultValue+"\n```\n"); //config item
      }
      toAppend.append("#### Default Value \n`"+defaultValue+"`\n");
      if(typeof builtTree[configSection] !== 'undefined'){
        builtTree[configSection].append(toAppend);
      } else {
        builtTree[configSection] = toAppend;
      }
    }
    for(var section in builtTree){
      var sectionText = section;
      if(section == 'undefined'){
        sectionText = "CLI Only";
      }
      compiled_buffer.append("# "+sectionText+"\n");
      compiled_buffer.append(builtTree[section]);
      compiled_buffer.append("\n");
    }

 return compiled_buffer;
}

async function buildPage () {
	var compiled_buffer = new BufferList();
	compiled_buffer.append(pre_example_config);
	compiled_buffer.append(compiledToml());
	compiled_buffer.append(post_example_config);
	compiled_buffer.append(pre_config_doc);
	compiled_buffer.append(
  compiledMd(
    Data.getCliOptions(
     await Data.fetchSource()
  )));
	compiled_buffer.append(post_config_doc);
	return compiled_buffer;
}

(async function (){
fs.writeFileSync(path.resolve(__dirname,"../docs/config.md"),(await buildPage()).toString());
})().catch(e => {
  console.error(e);
  process.exit(1);
});

