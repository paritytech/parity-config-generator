
const BufferList = require('bl');

module.exports = {
  preExampleConfig: new BufferList(`
---
title: Configuring Parity Ethereum
---

Parity can be configured using either the [CLI options](#cli-options) or a [config file](#config-file). Should the CLI flags and the config file disagree about a setting, the CLI takes precedence.

You can list all CLI options by running \`$parity --help\`. The vast majority of CLI options map to a setting in the TOML file, for example \`--mode-timeout 500\` can be set by creating a config file:

\`\`\`toml
[parity]
mode_timeout = 500
\`\`\`

## Config File

Parity can be configured using a [TOML](https://github.com/toml-lang/toml) file. The file can be generated using the [Parity Config Generator](https://paritytech.github.io/parity-config-generator/). To start parity with a config file, the file needs to be located in:

  * Windows: \`%UserProfile%\\AppData\\Roaming\\Parity\\Ethereum\\config.toml\`
  * Linux: \`~/.local/share/io.parity.ethereum/config.toml\`
  * macOS: \`$HOME/Library/Application Support/io.parity.ethereum/config.toml\`

To use a custom path run \`$ parity --config path/to/config.toml\`.

## Default config.toml

The following is a representation of a configuration file with all default values (*note: the \`[stratum]\` section is not present by default, and including it in your config currently enables stratum*).

\`\`\`toml`),
  postExampleConfig: new BufferList('\n```\n'),
  preConfigDoc: new BufferList(`
## Presets

Parity can also be launched with a [preset configuration file](https://github.com/paritytech/parity-ethereum/tree/master/parity/cli/presets) using the \`--config\` flag with one of the following values:
  * \`dev\`: uses [dev chain specifications](Private-development-chain) with [Instant-seal](Pluggable-Consensus#instant-seal) consensus engine. The gas price is set to 0.
  * \`dev-insecure\`: uses the same configuration as \`dev\`, plus sets the flag \`no_consensus\`, allows all RPC APIs and accepts all RPC interfaces and hosts, as well as all IPFS hosts.
  * \`insecure\`: uses the Mainnet default configuration, plus sets the flag \`no_consensus\`, allows all RPC APIs and accepts all RPC interfaces and hosts, as well as all IPFS hosts.
  * \`mining\`: uses the Mainnet default configuration, plus increases the number of peers to min 50 and max 100, it disables the Dapps and IPC interface. It forces the sealing of blocks with a minimum of 4 seconds interval, forces the reseal for any new transaction (external or local), reduces the transaction queue size to 2048 while increasing the cache size to 256 MB and setting the \`trace\` logging level for the \`miner\` and \`own_tx\` modules.
  * \`non-standard-ports\`: sets the client to listen to the port 30305 and 8645 for RPC connections.

## Configuration options

`),
  postConfigDoc: new BufferList(``)
};
