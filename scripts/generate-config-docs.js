const fs = require('fs');
const path = require('path');
const BufferList = require('bl');
const compiled_data = require('../src/data.compiled.json');

const output_dir = "./docs/"
const outpit_file = "config.md"
const pre_example_config = new BufferList("---\ntitle: Configuring Parity Ethereum\n---\n\nParity can be configured using either the [CLI options](#cli-options) or a [config file](#config-file). Should the CLI flags and the config file disagree about a setting, the CLI takes precedence.\n\nYou can list all CLI options by running `$parity --help`. The vast majority of CLI options map to a setting in the TOML file, for example `--mode-timeout 500` can be set by creating a config file:\n\n```toml\n[parity]\nmode_timeout = 500\n```\n\n## Config File\n\nParity can be configured using a [TOML](https://github.com/toml-lang/toml) file. The file can be generated using the [Parity Config Generator](https://paritytech.github.io/parity-config-generator/). To start parity with a config file, the file needs to be located in:\n\n* Windows: `%UserProfile%\\AppData\\Roaming\\Parity\\Ethereum\\config.toml`\n* Linux: `~/.local/share/io.parity.ethereum/config.toml`\n* macOS: `$HOME/Library/Application Support/io.parity.ethereum/config.toml`\n\nTo use a custom path run `$ parity --config path/to/config.toml`.\n\n\n## Default config.toml\n\nThe following is a representation of a configuration file with all default values.\n```toml\n");
const post_example_config = new BufferList("\n```\n");
const pre_config_doc = new BufferList("## Presets\nParity can be launched with a [preset configuration file](https://github.com/paritytech/parity-ethereum/tree/1d9542fe88044d0831471510beb23626050f1bbf/parity/cli/presets) using `--config` flag with one of the following value:\n- `dev`: uses [dev chain specifications](Private-development-chain) with [Instant-seal](Pluggable-Consensus#instant-seal) consensus engine. The gas price is set to 0.\n- `dev-insecure`: uses the same configuration as `dev`, plus sets the flag `no_consensus`, allows all RPC APIs and accepts all RPC interfaces and hosts, as well as all IPFS hosts. \n- `insecure`: uses the Mainnet default configuration, plus sets the flag `no_consensus`, allows all RPC APIs and accepts all RPC interfaces and hosts, as well as all IPFS hosts. \n- `mining`: uses the Mainnet default configuration, plus increases the number of peers to min 50 and max 100, it disables the Dapps and IPC interface. It forces the sealing of blocks with a minimum of 4 seconds interval, forces the reseal for any new transaction (external or local), reduces the transaction queue size to 2048 while increasing the cache size to 256 MB and setting the `trace` logging level for the `miner` and `own_tx` modules.\n- `non-standard-ports`: sets the client to listen to the port 30305 and 8645 for RPC connections.\n\n## CLI Options for Parity Ethereum client\n```bash\n");
const post_config_doc = new BufferList("\n```\n");

function compiledToml () {
	var compiled_buffer = new BufferList();
	//TODO format compiled_data into toml  and put into compiled_buffer.
	return compiled_buffer;
}

function compiledMd () {
	var compiled_buffer = new BufferList();
	//TODO format compiled_data into markdown documentation and...
	return compiled_buffer;
}

function buildPage () {
	var compiled_buffer = new BufferList();
	compiled_buffer.append(pre_example_config);
	compiled_buffer.append(compiledToml());
	compiled_buffer.append(post_example_config);
	compiled_buffer.append(pre_config_doc);
	compiled_buffer.append(compiledMd());
	compiled_buffer.append(post_config_doc);
	return compiled_buffer;
}

console.log(buildPage().toString());


