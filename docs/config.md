---
title: Configuring Parity Ethereum
---

Parity can be configured using either the [CLI options](#cli-options) or a [config file](#config-file). Should the CLI flags and the config file disagree about a setting, the CLI takes precedence.

You can list all CLI options by running `$parity --help`. The vast majority of CLI options map to a setting in the TOML file, for example `--mode-timeout 500` can be set by creating a config file:

```toml
[parity]
mode_timeout = 500
```

## Config File

Parity can be configured using a [TOML](https://github.com/toml-lang/toml) file. The file can be generated using the [Parity Config Generator](https://paritytech.github.io/parity-config-generator/). To start parity with a config file, the file needs to be located in:

* Windows: `%UserProfile%\AppData\Roaming\Parity\Ethereum\config.toml`
* Linux: `~/.local/share/io.parity.ethereum/config.toml`
* macOS: `$HOME/Library/Application Support/io.parity.ethereum/config.toml`

To use a custom path run `$ parity --config path/to/config.toml`.


## Default config.toml

The following is a representation of a configuration file with all default values (*note: the `[stratum]` section is not present by default, and including it in your config currently enables stratum*).
```toml
[parity]
chain = foundation
mode = last
mode_timeout = 300
mode_alarm = 3600
auto_update = critical
auto_update_delay = 100
auto_update_check_frequency = 20
release_track = current
no_download = false
no_consensus = false
base_path = $BASE
db_path = $LOCAL/chains
keys_path = $BASE/keys
identity = ""
no_persistent_txqueue = false
light = false
no_hardcoded_sync = false

[account]
unlock = [""]
password = [""]
keys_iterations = 10240
refresh_time = 5
disable_hardware = false
fast_unlock = false

[ui]
path = $BASE/signer

[network]
warp = true
warp_barrier = null
port = 30303
min_peers = 25
max_peers = 50
snapshot_peers = 0
max_pending_peers = 64
nat = any
id = 0
bootnodes = [""]
discovery = true
node_key = ""
reserved_peers = ""
reserved_only = false
allow_ips = all
no_serve_light = false
interface = all
condition = undefined

[rpc]
disable = false
port = 8545
interface = local
cors = []
hosts = ["none"]
apis = ["web3","eth","pubsub","net","parity","private","parity_pubsub","traces","rpc","shh","shh_pubsub"]
server_threads = 1
processing_threads = 4
max_payload = null
keep_alive = false
experimental_rpcs = false
poll_lifetime = 60
allow_missing_blocks = false

[websockets]
disable = false
port = 8546
interface = local
origins = ["parity://*","chrome-extension://*","moz-extension://*"]
hosts = ["none"]
apis = ["web3","eth","pubsub","net","parity","parity_pubsub","private","traces","rpc","shh","shh_pubsub"]
max_connections = 100

[ipc]
disable = false
path = $HOME/.local/share/io.parity.ethereum/jsonrpc.ipc
apis = ["web3","eth","pubsub","net","parity","parity_pubsub","parity_accounts","private","traces","rpc","shh","shh_pubsub"]

[secretstore]
disable = false
nodes = [""]
port = 8083
interface = local
http_port = 8082
http_interface = local
path = $BASE/secretstore
disable_http = false
disable_auto_migrate = false
acl_contract = registry
service_contract = null
service_contract_srv_gen = null
service_contract_srv_retr = null
service_contract_doc_store = null
service_contract_doc_sretr = null
self_secret = null
admin_public = null
server_set_contract = registry

[ipfs]
enable = false
port = 5001
interface = local
cors = []
hosts = ["none"]

[mining]
author = ""
engine_signer = ""
force_sealing = false
reseal_on_txs = own
reseal_min_period = 2000
work_queue_size = 20
relay_set = cheap
usd_per_tx = 0.0001
usd_per_eth = auto
price_update_period = hourly
gas_floor_target = 4700000
gas_cap = 6283184
tx_gas_limit = 0
tx_time_limit = 0
tx_queue_ban_count = null
tx_queue_ban_time = null
tx_queue_size = 8192
tx_queue_strategy = gas_price
extra_data = ""
remove_solved = false
notify_work = [""]
refuse_service_transactions = false
reseal_on_uncle = false
reseal_max_period = 120000
min_gas_price = null
gas_price_percentile = 50
tx_queue_per_sender = null
tx_queue_mem_limit = 4
tx_queue_no_unfamiliar_locals = false
tx_queue_no_early_reject = false
infinite_pending_block = false
max_round_blocks_to_import = 12

[stratum]
port = 8008
interface = local
secret = null

[footprint]
tracing = auto
db_compaction = auto
pruning = auto
pruning_history = 64
pruning_memory = 32
fat_db = auto
scale_verifiers = false
num_verifiers = 8
cache_size_db = 128
cache_size_blocks = 8
cache_size_queue = 40
cache_size_state = 25
cache_size = 0
fast_and_loose = false

[snapshots]
disable_periodic = false
processing_threads = null

[misc]
logging = ""
log_file = ""
color = true
ports_shift = 0
unsafe_expose = false

[private_tx]
enabled = false
signer = null
validators = []
account = null
passwords = null
sstore_url = null
sstore_threshold = null

[whisper]
enabled = false
pool_size = 10

[light]
on_demand_response_time_window = null
on_demand_request_backoff_start = null
on_demand_request_backoff_max = null
on_demand_request_backoff_rounds_max = null
on_demand_request_consecutive_failures = null


```
## Presets 
Parity can also be launched with a [preset configuration file](https://github.com/paritytech/parity-ethereum/tree/master/parity/cli/presets) using the `--config` flag with one of the following values:
- `dev`: uses [dev chain specifications](Private-development-chain) with [Instant-seal](Pluggable-Consensus#instant-seal) consensus engine. The gas price is set to 0.
- `dev-insecure`: uses the same configuration as `dev`, plus sets the flag `no_consensus`, allows all RPC APIs and accepts all RPC interfaces and hosts, as well as all IPFS hosts. 
- `insecure`: uses the Mainnet default configuration, plus sets the flag `no_consensus`, allows all RPC APIs and accepts all RPC interfaces and hosts, as well as all IPFS hosts. 
- `mining`: uses the Mainnet default configuration, plus increases the number of peers to min 50 and max 100, it disables the Dapps and IPC interface. It forces the sealing of blocks with a minimum of 4 seconds interval, forces the reseal for any new transaction (external or local), reduces the transaction queue size to 2048 while increasing the cache size to 256 MB and setting the `trace` logging level for the `miner` and `own_tx` modules.
- `non-standard-ports`: sets the client to listen to the port 30305 and 8645 for RPC connections.

## Configuration options 

# parity

## no-download
Normally new releases will be downloaded ready for updating. This disables it. Not recommended.
#### Command line option 
 `--no-download`
#### Config file option 
```toml
[parity]
no_download = false
```
#### Default Value 
`false`

## no-consensus
Force the binary to run even if there are known issues regarding consensus. Not recommended.
#### Command line option 
 `--no-consensus`
#### Config file option 
```toml
[parity]
no_consensus = false
```
#### Default Value 
`false`

## light
Experimental: run in light client mode. Light clients synchronize a bare minimum of data and fetch necessary data on-demand from the network. Much lower in storage, potentially higher in bandwidth. Has no effect with subcommands.
#### Command line option 
 `--light`
#### Config file option 
```toml
[parity]
light = false
```
#### Default Value 
`false`

## no-hardcoded-sync
By default, if there is no existing database the light client will automatically jump to a block hardcoded in the chain's specifications. This disables this feature.
#### Command line option 
 `--no-hardcoded-sync`
#### Config file option 
```toml
[parity]
no_hardcoded_sync = false
```
#### Default Value 
`false`

## mode
Set the operating mode. MODE can be one of: last - Uses the last-used mode, active if none; active - Parity continuously syncs the chain; passive - Parity syncs initially, then sleeps and wakes regularly to resync; dark - Parity syncs only when the JSON-RPC is active; offline - Parity doesn't sync.
#### Command line option 
 `--mode`
#### Config file option 
```toml
[parity]
mode = last
```
#### Default Value 
`last`

## mode-timeout
Specify the number of seconds before inactivity timeout occurs when mode is dark or passive
#### Command line option 
 `--mode-timeout`
#### Config file option 
```toml
[parity]
mode_timeout = 300
```
#### Default Value 
`300`

## mode-alarm
Specify the number of seconds before auto sleep reawake timeout occurs when mode is passive
#### Command line option 
 `--mode-alarm`
#### Config file option 
```toml
[parity]
mode_alarm = 3600
```
#### Default Value 
`3600`

## auto-update
Set a releases set to automatically update and install. SET can be one of: all - All updates in the our release track; critical - Only consensus/security updates; none - No updates will be auto-installed.
#### Command line option 
 `--auto-update`
#### Config file option 
```toml
[parity]
auto_update = critical
```
#### Default Value 
`critical`

## auto-update-delay
Specify the maximum number of blocks used for randomly delaying updates.
#### Command line option 
 `--auto-update-delay`
#### Config file option 
```toml
[parity]
auto_update_delay = 100
```
#### Default Value 
`100`

## auto-update-check-frequency
Specify the number of blocks between each auto-update check.
#### Command line option 
 `--auto-update-check-frequency`
#### Config file option 
```toml
[parity]
auto_update_check_frequency = 20
```
#### Default Value 
`20`

## release-track
Set which release track we should use for updates. TRACK can be one of: stable - Stable releases; beta - Beta releases; nightly - Nightly releases (unstable); testing - Testing releases (do not use); current - Whatever track this executable was released on.
#### Command line option 
 `--release-track`
#### Config file option 
```toml
[parity]
release_track = current
```
#### Default Value 
`current`

## chain
Specify the blockchain type. CHAIN may be either a JSON chain specification file or ethereum, classic, poacore, tobalaba, expanse, musicoin, ellaism, easthub, social, mix, callisto, morden, ropsten, kovan, poasokol, testnet, or dev.
#### Command line option 
 `--chain`
#### Config file option 
```toml
[parity]
chain = foundation
```
#### Default Value 
`foundation`

## keys-path
Specify the path for JSON key files to be found
#### Command line option 
 `--keys-path`
#### Config file option 
```toml
[parity]
keys_path = $BASE/keys
```
#### Default Value 
`$BASE/keys`

## identity
Specify your node's name.
#### Command line option 
 `--identity`
#### Config file option 
```toml
[parity]
identity = ""
```
#### Default Value 
`""`

## base-path
Specify the base data storage path.
#### Command line option 
 `--base-path`
#### Config file option 
```toml
[parity]
base_path = null
```
#### Default Value 
`null`

## db-path
Specify the database directory path
#### Command line option 
 `--db-path`
#### Config file option 
```toml
[parity]
db_path = null
```
#### Default Value 
`null`

## no-persistent-txqueue
Don't save pending local transactions to disk to be restored whenever the node restarts.
#### Command line option 
 `--no-persistent-txqueue`
#### Config file option 
```toml
[parity]
no_persistent_txqueue = false
```
#### Default Value 
`false`

# CLI Only

## force-direct
Run the originally installed version of Parity, ignoring any updates that have since been installed.
#### Command line option 
 `--force-direct`
#### Default Value 
`false`

## config
Specify a configuration. CONFIG may be either a configuration file or a preset: dev, insecure, dev-insecure, mining, or non-standard-ports.
#### Command line option 
 `--config`
#### Default Value 
`$BASE/config.toml`

## no-ancient-blocks
Disable downloading old blocks after snapshot restoration or warp sync. Not recommended.
#### Command line option 
 `--no-ancient-blocks`
#### Default Value 
`false`

## stratum
Run Stratum server for miner push notification.
#### Command line option 
 `--stratum`
#### Default Value 
`false`

## can-restart
Executable will auto-restart if exiting with 69
#### Command line option 
 `--can-restart`
#### Default Value 
`false`

## version
Show information about version.
#### Command line option 
 `--version`
#### Default Value 
`false`

## no-config
Don't load a configuration file.
#### Command line option 
 `--no-config`
#### Default Value 
`false`

## no-seal-check
Skip block seal check.
#### Command line option 
 `--no-seal-check`
#### Default Value 
`false`

## geth
Run in Geth-compatibility mode. Sets the IPC path to be the same as Geth's. Overrides the --ipc-path and --ipcpath options. Alters RPCs to reflect Geth bugs. Includes the personal_ RPC by default.
#### Command line option 
 `--geth`
#### Default Value 
`false`

## import-geth-keys
Attempt to import keys from Geth client.
#### Command line option 
 `--import-geth-keys`
#### Default Value 
`false`

## warp
Does nothing; warp sync is enabled by default. Use --no-warp to disable.
#### Command line option 
 `--warp`
#### Default Value 
`false`

## jsonrpc
Does nothing; HTTP JSON-RPC is on by default now.
#### Command line option 
 `--jsonrpc`
#### Default Value 
`false`

## rpc
Does nothing; HTTP JSON-RPC is on by default now.
#### Command line option 
 `--rpc`
#### Default Value 
`false`

## jsonrpc-off
Equivalent to --no-jsonrpc.
#### Command line option 
 `--jsonrpc-off`
#### Default Value 
`false`

## webapp
Does nothing; dapps server has been removed.
#### Command line option 
 `--webapp`
#### Default Value 
`false`

## dapps-off
Equivalent to --no-dapps.
#### Command line option 
 `--dapps-off`
#### Default Value 
`false`

## ipcdisable
Equivalent to --no-ipc.
#### Command line option 
 `--ipcdisable`
#### Default Value 
`false`

## ipc-off
Equivalent to --no-ipc.
#### Command line option 
 `--ipc-off`
#### Default Value 
`false`

## testnet
Testnet mode. Equivalent to --chain testnet. Overrides the --keys-path option.
#### Command line option 
 `--testnet`
#### Default Value 
`false`

## nodiscover
Equivalent to --no-discovery.
#### Command line option 
 `--nodiscover`
#### Default Value 
`false`

## dapps-apis-all
Dapps server is merged with HTTP JSON-RPC server. Use --jsonrpc-apis.
#### Command line option 
 `--dapps-apis-all`
#### Default Value 
`false`

## public-node
Does nothing; Public node is removed from Parity.
#### Command line option 
 `--public-node`
#### Default Value 
`false`

## force-ui
Does nothing; UI is now a separate project.
#### Command line option 
 `--force-ui`
#### Default Value 
`false`

## no-ui
Does nothing; UI is now a separate project.
#### Command line option 
 `--no-ui`
#### Default Value 
`false`

## ui-no-validation
Does nothing; UI is now a separate project.
#### Command line option 
 `--ui-no-validation`
#### Default Value 
`false`

## fast-and-loose
Does nothing; DB WAL is always activated.
#### Command line option 
 `--fast-and-loose`
#### Default Value 
`false`

## etherbase
Equivalent to --author ADDRESS.
#### Command line option 
 `--etherbase`
#### Default Value 
`null`

## extradata
Equivalent to --extra-data STRING.
#### Command line option 
 `--extradata`
#### Default Value 
`null`

## datadir
Equivalent to --base-path PATH.
#### Command line option 
 `--datadir`
#### Default Value 
`null`

## networkid
Equivalent to --network-id INDEX.
#### Command line option 
 `--networkid`
#### Default Value 
`null`

## peers
Equivalent to --min-peers NUM.
#### Command line option 
 `--peers`
#### Default Value 
`null`

## nodekey
Equivalent to --node-key KEY.
#### Command line option 
 `--nodekey`
#### Default Value 
`null`

## rpcaddr
Equivalent to --jsonrpc-interface IP.
#### Command line option 
 `--rpcaddr`
#### Default Value 
`null`

## rpcport
Equivalent to --jsonrpc-port PORT.
#### Command line option 
 `--rpcport`
#### Default Value 
`null`

## rpcapi
Equivalent to --jsonrpc-apis APIS.
#### Command line option 
 `--rpcapi`
#### Default Value 
`null`

## rpccorsdomain
Equivalent to --jsonrpc-cors URL.
#### Command line option 
 `--rpccorsdomain`
#### Default Value 
`null`

## ipcapi
Equivalent to --ipc-apis APIS.
#### Command line option 
 `--ipcapi`
#### Default Value 
`null`

## ipcpath
Equivalent to --ipc-path PATH.
#### Command line option 
 `--ipcpath`
#### Default Value 
`null`

## gasprice
Equivalent to --min-gas-price WEI.
#### Command line option 
 `--gasprice`
#### Default Value 
`null`

## cache
Equivalent to --cache-size MB.
#### Command line option 
 `--cache`
#### Default Value 
`null`

## ui-interface
Does nothing; UI is now a separate project.
#### Command line option 
 `--ui-interface`
#### Default Value 
`null`

## ui-hosts
Does nothing; UI is now a separate project.
#### Command line option 
 `--ui-hosts`
#### Default Value 
`null`

## ui-port
Does nothing; UI is now a separate project.
#### Command line option 
 `--ui-port`
#### Default Value 
`null`

## ntp-servers
Does nothing; checking if clock is sync with NTP servers is now done on the UI.
#### Command line option 
 `--ntp-servers`
#### Default Value 
`null`

# misc

## unsafe-expose
All servers will listen on external interfaces and will be remotely accessible. It's equivalent with setting the following: --[ws,jsonrpc,ui,ipfs-api,secretstore,stratum,dapps,secretstore-http]-interface=all --*-hosts=all    This option is UNSAFE and should be used with great care!
#### Command line option 
 `--unsafe-expose`
#### Config file option 
```toml
[misc]
unsafe_expose = false
```
#### Default Value 
`false`

## ports-shift
Add SHIFT to all port numbers Parity is listening on. Includes network port and all servers (HTTP JSON-RPC, WebSockets JSON-RPC, IPFS, SecretStore).
#### Command line option 
 `--ports-shift`
#### Config file option 
```toml
[misc]
ports_shift = 0
```
#### Default Value 
`0`

## no-color
Don't use terminal color codes in output.
#### Command line option 
 `--no-color`
#### Config file option 
```toml
[misc]
color = false
```
#### Default Value 
`false`

## logging
Specify the general logging level (error, warn, info, debug or trace). It can also be set for a specific module, example: '-l sync=debug,rpc=trace'
#### Command line option 
 `--logging`
#### Config file option 
```toml
[misc]
logging = null
```
#### Default Value 
`null`

## log-file
Specify a filename into which logging should be appended.
#### Command line option 
 `--log-file`
#### Config file option 
```toml
[misc]
log_file = null
```
#### Default Value 
`null`

# account

## no-hardware-wallets
Disables hardware wallet support.
#### Command line option 
 `--no-hardware-wallets`
#### Config file option 
```toml
[account]
disable_hardware = false
```
#### Default Value 
`false`

## fast-unlock
Use drastically faster unlocking mode. This setting causes raw secrets to be stored unprotected in memory, so use with care.
#### Command line option 
 `--fast-unlock`
#### Config file option 
```toml
[account]
fast_unlock = false
```
#### Default Value 
`false`

## keys-iterations
Specify the number of iterations to use when deriving key from the password (bigger is more secure)
#### Command line option 
 `--keys-iterations`
#### Config file option 
```toml
[account]
keys_iterations = 10240
```
#### Default Value 
`10240`

## accounts-refresh
Specify the cache time of accounts read from disk. If you manage thousands of accounts set this to 0 to disable refresh.
#### Command line option 
 `--accounts-refresh`
#### Config file option 
```toml
[account]
refresh_time = 5
```
#### Default Value 
`5`

## unlock
Unlock ACCOUNTS for the duration of the execution. ACCOUNTS is a comma-delimited list of addresses.
#### Command line option 
 `--unlock`
#### Config file option 
```toml
[account]
unlock = null
```
#### Default Value 
`null`

## password
Provide a file containing a password for unlocking an account. Leading and trailing whitespace is trimmed.
#### Command line option 
 `--password`
#### Config file option 
```toml
[account]
password = []
```
#### Default Value 
`[]`

# private_tx

## private-enabled
Enable private transactions.
#### Command line option 
 `--private-enabled`
#### Config file option 
```toml
[private_tx]
enabled = false
```
#### Default Value 
`false`

## private-signer
Specify the account for signing public transaction created upon verified private transaction.
#### Command line option 
 `--private-signer`
#### Config file option 
```toml
[private_tx]
signer = null
```
#### Default Value 
`null`

## private-validators
Specify the accounts for validating private transactions. ACCOUNTS is a comma-delimited list of addresses.
#### Command line option 
 `--private-validators`
#### Config file option 
```toml
[private_tx]
validators = null
```
#### Default Value 
`null`

## private-account
Specify the account for signing requests to secret store.
#### Command line option 
 `--private-account`
#### Config file option 
```toml
[private_tx]
account = null
```
#### Default Value 
`null`

## private-sstore-url
Specify secret store URL used for encrypting private transactions.
#### Command line option 
 `--private-sstore-url`
#### Config file option 
```toml
[private_tx]
sstore_url = null
```
#### Default Value 
`null`

## private-sstore-threshold
Specify secret store threshold used for encrypting private transactions.
#### Command line option 
 `--private-sstore-threshold`
#### Config file option 
```toml
[private_tx]
sstore_threshold = null
```
#### Default Value 
`null`

## private-passwords
Provide a file containing passwords for unlocking accounts (signer, private account, validators).
#### Command line option 
 `--private-passwords`
#### Config file option 
```toml
[private_tx]
passwords = null
```
#### Default Value 
`null`

# ui

## ui-path
Specify directory where Trusted UIs tokens should be stored.
#### Command line option 
 `--ui-path`
#### Config file option 
```toml
[ui]
path = $BASE/signer
```
#### Default Value 
`$BASE/signer`

# network

## no-warp
Disable syncing from the snapshot over the network.
#### Command line option 
 `--no-warp`
#### Config file option 
```toml
[network]
warp = false
```
#### Default Value 
`false`

## no-discovery
Disable new peer discovery.
#### Command line option 
 `--no-discovery`
#### Config file option 
```toml
[network]
discovery = false
```
#### Default Value 
`false`

## reserved-only
Connect only to reserved nodes.
#### Command line option 
 `--reserved-only`
#### Config file option 
```toml
[network]
reserved_only = false
```
#### Default Value 
`false`

## no-serve-light
Disable serving of light peers.
#### Command line option 
 `--no-serve-light`
#### Config file option 
```toml
[network]
no_serve_light = false
```
#### Default Value 
`false`

## warp-barrier
When warp enabled never attempt regular sync before warping to block NUM.
#### Command line option 
 `--warp-barrier`
#### Config file option 
```toml
[network]
warp_barrier = null
```
#### Default Value 
`null`

## port
Override the port on which the node should listen.
#### Command line option 
 `--port`
#### Config file option 
```toml
[network]
port = 30303
```
#### Default Value 
`30303`

## interface
Network interfaces. Valid values are 'all', 'local' or the ip of the interface you want parity to listen to.
#### Command line option 
 `--interface`
#### Config file option 
```toml
[network]
interface = all
```
#### Default Value 
`all`

## min-peers
Try to maintain at least NUM peers.
#### Command line option 
 `--min-peers`
#### Config file option 
```toml
[network]
min_peers = null
```
#### Default Value 
`null`

## max-peers
Allow up to NUM peers.
#### Command line option 
 `--max-peers`
#### Config file option 
```toml
[network]
max_peers = null
```
#### Default Value 
`null`

## snapshot-peers
Allow additional NUM peers for a snapshot sync.
#### Command line option 
 `--snapshot-peers`
#### Config file option 
```toml
[network]
snapshot_peers = 0
```
#### Default Value 
`0`

## nat
Specify method to use for determining public address. Must be one of: any, none, upnp, extip:<IP>.
#### Command line option 
 `--nat`
#### Config file option 
```toml
[network]
nat = any
```
#### Default Value 
`any`

## allow-ips
Filter outbound connections. Must be one of: private - connect to private network IP addresses only; public - connect to public network IP addresses only; all - connect to any IP address.
#### Command line option 
 `--allow-ips`
#### Config file option 
```toml
[network]
allow_ips = all
```
#### Default Value 
`all`

## max-pending-peers
Allow up to NUM pending connections.
#### Command line option 
 `--max-pending-peers`
#### Config file option 
```toml
[network]
max_pending_peers = 64
```
#### Default Value 
`64`

## network-id
Override the network identifier from the chain we are on.
#### Command line option 
 `--network-id`
#### Config file option 
```toml
[network]
id = null
```
#### Default Value 
`null`

## bootnodes
Override the bootnodes from our chain. NODES should be comma-delimited enodes.
#### Command line option 
 `--bootnodes`
#### Config file option 
```toml
[network]
bootnodes = null
```
#### Default Value 
`null`

## node-key
Specify node secret key, either as 64-character hex string or input to SHA3 operation.
#### Command line option 
 `--node-key`
#### Config file option 
```toml
[network]
node_key = null
```
#### Default Value 
`null`

## reserved-peers
Provide a file containing enodes, one per line. These nodes will always have a reserved slot on top of the normal maximum peers.
#### Command line option 
 `--reserved-peers`
#### Config file option 
```toml
[network]
reserved_peers = null
```
#### Default Value 
`null`

# rpc

## jsonrpc-allow-missing-blocks
RPC calls will return 'null' instead of an error if ancient block sync is still in progress and the block information requested could not be found
#### Command line option 
 `--jsonrpc-allow-missing-blocks`
#### Config file option 
```toml
[rpc]
allow_missing_blocks = false
```
#### Default Value 
`false`

## no-jsonrpc
Disable the HTTP JSON-RPC API server.
#### Command line option 
 `--no-jsonrpc`
#### Config file option 
```toml
[rpc]
disable = false
```
#### Default Value 
`false`

## jsonrpc-no-keep-alive
Disable HTTP/1.1 keep alive header. Disabling keep alive will prevent re-using the same TCP connection to fire multiple requests, recommended when using one request per connection.
#### Command line option 
 `--jsonrpc-no-keep-alive`
#### Config file option 
```toml
[rpc]
keep_alive = false
```
#### Default Value 
`false`

## jsonrpc-experimental
Enable experimental RPCs. Enable to have access to methods from unfinalised EIPs in all namespaces
#### Command line option 
 `--jsonrpc-experimental`
#### Config file option 
```toml
[rpc]
experimental_rpcs = false
```
#### Default Value 
`false`

## jsonrpc-port
Specify the port portion of the HTTP JSON-RPC API server.
#### Command line option 
 `--jsonrpc-port`
#### Config file option 
```toml
[rpc]
port = 8545
```
#### Default Value 
`8545`

## jsonrpc-interface
Specify the hostname portion of the HTTP JSON-RPC API server, IP should be an interface's IP address, or all (all interfaces) or local.
#### Command line option 
 `--jsonrpc-interface`
#### Config file option 
```toml
[rpc]
interface = local
```
#### Default Value 
`local`

## jsonrpc-apis
Specify the APIs available through the HTTP JSON-RPC interface using a comma-delimited list of API names. Possible names are: all, safe, debug, web3, net, eth, pubsub, personal, signer, parity, parity_pubsub, parity_accounts, parity_set, traces, rpc, secretstore, shh, shh_pubsub. You can also disable a specific API by putting '-' in the front, example: all,-personal. 'safe' enables the following APIs: web3, net, eth, pubsub, parity, parity_pubsub, traces, rpc, shh, shh_pubsub
#### Command line option 
 `--jsonrpc-apis`
#### Config file option 
```toml
[rpc]
apis = web3,eth,pubsub,net,parity,private,parity_pubsub,traces,rpc,shh,shh_pubsub
```
#### Default Value 
`web3,eth,pubsub,net,parity,private,parity_pubsub,traces,rpc,shh,shh_pubsub`

## jsonrpc-hosts
List of allowed Host header values. This option will validate the Host header sent by the browser, it is additional security against some attack vectors. Special options: "all", "none",.
#### Command line option 
 `--jsonrpc-hosts`
#### Config file option 
```toml
[rpc]
hosts = none
```
#### Default Value 
`none`

## jsonrpc-threads
Turn on additional processing threads for JSON-RPC servers (all transports). Setting this to a non-zero value allows parallel execution of cpu-heavy queries.
#### Command line option 
 `--jsonrpc-threads`
#### Config file option 
```toml
[rpc]
processing_threads = 4
```
#### Default Value 
`4`

## jsonrpc-cors
Specify CORS header for HTTP JSON-RPC API responses. Special options: "all", "none".
#### Command line option 
 `--jsonrpc-cors`
#### Config file option 
```toml
[rpc]
cors = none
```
#### Default Value 
`none`

## jsonrpc-server-threads
Enables multiple threads handling incoming connections for HTTP JSON-RPC server.
#### Command line option 
 `--jsonrpc-server-threads`
#### Config file option 
```toml
[rpc]
server_threads = null
```
#### Default Value 
`null`

## jsonrpc-max-payload
Specify maximum size for HTTP JSON-RPC requests in megabytes.
#### Command line option 
 `--jsonrpc-max-payload`
#### Config file option 
```toml
[rpc]
max_payload = null
```
#### Default Value 
`null`

## poll-lifetime
Set the RPC filter lifetime to S seconds. The filter has to be polled at least every S seconds , otherwise it is removed.
#### Command line option 
 `--poll-lifetime`
#### Config file option 
```toml
[rpc]
poll_lifetime = 60
```
#### Default Value 
`60`

# websockets

## no-ws
Disable the WebSockets JSON-RPC server.
#### Command line option 
 `--no-ws`
#### Config file option 
```toml
[websockets]
disable = false
```
#### Default Value 
`false`

## ws-port
Specify the port portion of the WebSockets JSON-RPC server.
#### Command line option 
 `--ws-port`
#### Config file option 
```toml
[websockets]
port = 8546
```
#### Default Value 
`8546`

## ws-interface
Specify the hostname portion of the WebSockets JSON-RPC server, IP should be an interface's IP address, or all (all interfaces) or local.
#### Command line option 
 `--ws-interface`
#### Config file option 
```toml
[websockets]
interface = local
```
#### Default Value 
`local`

## ws-apis
Specify the JSON-RPC APIs available through the WebSockets interface using a comma-delimited list of API names. Possible names are: all, safe, web3, net, eth, pubsub, personal, signer, parity, parity_pubsub, parity_accounts, parity_set, traces, rpc, secretstore, shh, shh_pubsub. You can also disable a specific API by putting '-' in the front, example: all,-personal. 'safe' enables the following APIs: web3, net, eth, pubsub, parity, parity_pubsub, traces, rpc, shh, shh_pubsub
#### Command line option 
 `--ws-apis`
#### Config file option 
```toml
[websockets]
apis = web3,eth,pubsub,net,parity,parity_pubsub,private,traces,rpc,shh,shh_pubsub
```
#### Default Value 
`web3,eth,pubsub,net,parity,parity_pubsub,private,traces,rpc,shh,shh_pubsub`

## ws-origins
Specify Origin header values allowed to connect. Special options: "all", "none".
#### Command line option 
 `--ws-origins`
#### Config file option 
```toml
[websockets]
origins = parity://*,chrome-extension://*,moz-extension://*
```
#### Default Value 
`parity://*,chrome-extension://*,moz-extension://*`

## ws-hosts
List of allowed Host header values. This option will validate the Host header sent by the browser, it is additional security against some attack vectors. Special options: "all", "none".
#### Command line option 
 `--ws-hosts`
#### Config file option 
```toml
[websockets]
hosts = none
```
#### Default Value 
`none`

## ws-max-connections
Maximum number of allowed concurrent WebSockets JSON-RPC connections.
#### Command line option 
 `--ws-max-connections`
#### Config file option 
```toml
[websockets]
max_connections = 100
```
#### Default Value 
`100`

# ipc

## no-ipc
Disable JSON-RPC over IPC service.
#### Command line option 
 `--no-ipc`
#### Config file option 
```toml
[ipc]
disable = false
```
#### Default Value 
`false`

## ipc-path
Specify custom path for JSON-RPC over IPC service.
#### Command line option 
 `--ipc-path`
#### Config file option 
```toml
[ipc]
path = undefined
```
#### Default Value 
`undefined`

## ipc-apis
Specify custom API set available via JSON-RPC over IPC using a comma-delimited list of API names. Possible names are: all, safe, web3, net, eth, pubsub, personal, signer, parity, parity_pubsub, parity_accounts, parity_set, traces, rpc, secretstore, shh, shh_pubsub. You can also disable a specific API by putting '-' in the front, example: all,-personal. 'safe' enables the following APIs: web3, net, eth, pubsub, parity, parity_pubsub, traces, rpc, shh, shh_pubsub
#### Command line option 
 `--ipc-apis`
#### Config file option 
```toml
[ipc]
apis = web3,eth,pubsub,net,parity,parity_pubsub,parity_accounts,private,traces,rpc,shh,shh_pubsub
```
#### Default Value 
`web3,eth,pubsub,net,parity,parity_pubsub,parity_accounts,private,traces,rpc,shh,shh_pubsub`

# ipfs

## ipfs-api
Enable IPFS-compatible HTTP API.
#### Command line option 
 `--ipfs-api`
#### Config file option 
```toml
[ipfs]
enable = false
```
#### Default Value 
`false`

## ipfs-api-port
Configure on which port the IPFS HTTP API should listen.
#### Command line option 
 `--ipfs-api-port`
#### Config file option 
```toml
[ipfs]
port = 5001
```
#### Default Value 
`5001`

## ipfs-api-interface
Specify the hostname portion of the IPFS API server, IP should be an interface's IP address or local.
#### Command line option 
 `--ipfs-api-interface`
#### Config file option 
```toml
[ipfs]
interface = local
```
#### Default Value 
`local`

## ipfs-api-hosts
List of allowed Host header values. This option will validate the Host header sent by the browser, it is additional security against some attack vectors. Special options: "all", "none".
#### Command line option 
 `--ipfs-api-hosts`
#### Config file option 
```toml
[ipfs]
hosts = none
```
#### Default Value 
`none`

## ipfs-api-cors
Specify CORS header for IPFS API responses. Special options: "all", "none".
#### Command line option 
 `--ipfs-api-cors`
#### Config file option 
```toml
[ipfs]
cors = none
```
#### Default Value 
`none`

# light

## on-demand-response-time-window
Specify the maximum time to wait for a successful response
#### Command line option 
 `--on-demand-response-time-window`
#### Config file option 
```toml
[light]
on_demand_response_time_window = null
```
#### Default Value 
`null`

## on-demand-request-backoff-start
Specify light client initial backoff time for a request
#### Command line option 
 `--on-demand-request-backoff-start`
#### Config file option 
```toml
[light]
on_demand_request_backoff_start = null
```
#### Default Value 
`null`

## on-demand-request-backoff-max
Specify light client maximum backoff time for a request
#### Command line option 
 `--on-demand-request-backoff-max`
#### Config file option 
```toml
[light]
on_demand_request_backoff_max = null
```
#### Default Value 
`null`

## on-demand-request-backoff-rounds-max
Specify light client maximum number of backoff iterations for a request
#### Command line option 
 `--on-demand-request-backoff-rounds-max`
#### Config file option 
```toml
[light]
on_demand_request_backoff_rounds_max = null
```
#### Default Value 
`null`

## on-demand-request-consecutive-failures
Specify light client the number of failures for a request until it gets exponentially backed off
#### Command line option 
 `--on-demand-request-consecutive-failures`
#### Config file option 
```toml
[light]
on_demand_request_consecutive_failures = null
```
#### Default Value 
`null`

# secretstore

## no-secretstore
Disable Secret Store functionality.
#### Command line option 
 `--no-secretstore`
#### Config file option 
```toml
[secretstore]
disable = false
```
#### Default Value 
`false`

## no-secretstore-http
Disable Secret Store HTTP API.
#### Command line option 
 `--no-secretstore-http`
#### Config file option 
```toml
[secretstore]
disable_http = false
```
#### Default Value 
`false`

## no-secretstore-auto-migrate
Do not run servers set change session automatically when servers set changes. This option has no effect when servers set is read from configuration file.
#### Command line option 
 `--no-secretstore-auto-migrate`
#### Config file option 
```toml
[secretstore]
disable_auto_migrate = false
```
#### Default Value 
`false`

## secretstore-acl-contract
Secret Store permissioning contract address source: none, registry (contract address is read from 'secretstore_acl_checker' entry in registry) or address.
#### Command line option 
 `--secretstore-acl-contract`
#### Config file option 
```toml
[secretstore]
acl_contract = registry
```
#### Default Value 
`registry`

## secretstore-contract
Secret Store Service contract address source: none, registry (contract address is read from 'secretstore_service' entry in registry) or address.
#### Command line option 
 `--secretstore-contract`
#### Config file option 
```toml
[secretstore]
service_contract = null
```
#### Default Value 
`null`

## secretstore-srv-gen-contract
Secret Store Service server key generation contract address source: none, registry (contract address is read from 'secretstore_service_srv_gen' entry in registry) or address.
#### Command line option 
 `--secretstore-srv-gen-contract`
#### Config file option 
```toml
[secretstore]
service_contract_srv_gen = null
```
#### Default Value 
`null`

## secretstore-srv-retr-contract
Secret Store Service server key retrieval contract address source: none, registry (contract address is read from 'secretstore_service_srv_retr' entry in registry) or address.
#### Command line option 
 `--secretstore-srv-retr-contract`
#### Config file option 
```toml
[secretstore]
service_contract_srv_retr = null
```
#### Default Value 
`null`

## secretstore-doc-store-contract
Secret Store Service document key store contract address source: none, registry (contract address is read from 'secretstore_service_doc_store' entry in registry) or address.
#### Command line option 
 `--secretstore-doc-store-contract`
#### Config file option 
```toml
[secretstore]
service_contract_doc_store = null
```
#### Default Value 
`null`

## secretstore-doc-sretr-contract
Secret Store Service document key shadow retrieval contract address source: none, registry (contract address is read from 'secretstore_service_doc_sretr' entry in registry) or address.
#### Command line option 
 `--secretstore-doc-sretr-contract`
#### Config file option 
```toml
[secretstore]
service_contract_doc_sretr = null
```
#### Default Value 
`null`

## secretstore-nodes
Comma-separated list of other secret store cluster nodes in form NODE_PUBLIC_KEY_IN_HEX@NODE_IP_ADDR:NODE_PORT.
#### Command line option 
 `--secretstore-nodes`
#### Config file option 
```toml
[secretstore]
nodes = ""
```
#### Default Value 
`""`

## secretstore-server-set-contract
Secret Store server set contract address source: none, registry (contract address is read from 'secretstore_server_set' entry in registry) or address.
#### Command line option 
 `--secretstore-server-set-contract`
#### Config file option 
```toml
[secretstore]
server_set_contract = registry
```
#### Default Value 
`registry`

## secretstore-interface
Specify the hostname portion for listening to Secret Store Key Server internal requests, IP should be an interface's IP address, or local.
#### Command line option 
 `--secretstore-interface`
#### Config file option 
```toml
[secretstore]
interface = local
```
#### Default Value 
`local`

## secretstore-port
Specify the port portion for listening to Secret Store Key Server internal requests.
#### Command line option 
 `--secretstore-port`
#### Config file option 
```toml
[secretstore]
port = 8083
```
#### Default Value 
`8083`

## secretstore-http-interface
Specify the hostname portion for listening to Secret Store Key Server HTTP requests, IP should be an interface's IP address, or local.
#### Command line option 
 `--secretstore-http-interface`
#### Config file option 
```toml
[secretstore]
http_interface = local
```
#### Default Value 
`local`

## secretstore-http-port
Specify the port portion for listening to Secret Store Key Server HTTP requests.
#### Command line option 
 `--secretstore-http-port`
#### Config file option 
```toml
[secretstore]
http_port = 8082
```
#### Default Value 
`8082`

## secretstore-path
Specify directory where Secret Store should save its data.
#### Command line option 
 `--secretstore-path`
#### Config file option 
```toml
[secretstore]
path = $BASE/secretstore
```
#### Default Value 
`$BASE/secretstore`

## secretstore-secret
Hex-encoded secret key of this node.
#### Command line option 
 `--secretstore-secret`
#### Config file option 
```toml
[secretstore]
self_secret = null
```
#### Default Value 
`null`

## secretstore-admin-public
Hex-encoded public key of secret store administrator.
#### Command line option 
 `--secretstore-admin-public`
#### Config file option 
```toml
[secretstore]
admin_public = null
```
#### Default Value 
`null`

# mining

## force-sealing
Force the node to author new blocks as if it were always sealing/mining.
#### Command line option 
 `--force-sealing`
#### Config file option 
```toml
[mining]
force_sealing = false
```
#### Default Value 
`false`

## reseal-on-uncle
Force the node to author new blocks when a new uncle block is imported.
#### Command line option 
 `--reseal-on-uncle`
#### Config file option 
```toml
[mining]
reseal_on_uncle = false
```
#### Default Value 
`false`

## remove-solved
Move solved blocks from the work package queue instead of cloning them. This gives a slightly faster import speed, but means that extra solutions submitted for the same work package will go unused.
#### Command line option 
 `--remove-solved`
#### Config file option 
```toml
[mining]
remove_solved = false
```
#### Default Value 
`false`

## tx-queue-no-unfamiliar-locals
Local transactions sent through JSON-RPC (HTTP, WebSockets, etc) will be treated as 'external' if the sending account is unknown.
#### Command line option 
 `--tx-queue-no-unfamiliar-locals`
#### Config file option 
```toml
[mining]
tx_queue_no_unfamiliar_locals = false
```
#### Default Value 
`false`

## tx-queue-no-early-reject
Disables transaction queue optimization to early reject transactions below minimal effective gas price. This allows local transactions to always enter the pool, despite it being full, but requires additional ecrecover on every transaction.
#### Command line option 
 `--tx-queue-no-early-reject`
#### Config file option 
```toml
[mining]
tx_queue_no_early_reject = false
```
#### Default Value 
`false`

## refuse-service-transactions
Always refuse service transactions.
#### Command line option 
 `--refuse-service-transactions`
#### Config file option 
```toml
[mining]
refuse_service_transactions = false
```
#### Default Value 
`false`

## infinite-pending-block
Pending block will be created with maximal possible gas limit and will execute all transactions in the queue. Note that such block is invalid and should never be attempted to be mined.
#### Command line option 
 `--infinite-pending-block`
#### Config file option 
```toml
[mining]
infinite_pending_block = false
```
#### Default Value 
`false`

## reseal-on-txs
Specify which transactions should force the node to reseal a block. SET is one of: none - never reseal on new transactions; own - reseal only on a new local transaction; ext - reseal only on a new external transaction; all - reseal on all new transactions.
#### Command line option 
 `--reseal-on-txs`
#### Config file option 
```toml
[mining]
reseal_on_txs = own
```
#### Default Value 
`own`

## reseal-min-period
Specify the minimum time between reseals from incoming transactions. MS is time measured in milliseconds.
#### Command line option 
 `--reseal-min-period`
#### Config file option 
```toml
[mining]
reseal_min_period = 2000
```
#### Default Value 
`2000`

## reseal-max-period
Specify the maximum time since last block to enable force-sealing. MS is time measured in milliseconds.
#### Command line option 
 `--reseal-max-period`
#### Config file option 
```toml
[mining]
reseal_max_period = 120000
```
#### Default Value 
`120000`

## work-queue-size
Specify the number of historical work packages which are kept cached lest a solution is found for them later. High values take more memory but result in fewer unusable solutions.
#### Command line option 
 `--work-queue-size`
#### Config file option 
```toml
[mining]
work_queue_size = 20
```
#### Default Value 
`20`

## relay-set
Set of transactions to relay. SET may be: cheap - Relay any transaction in the queue (this may include invalid transactions); strict - Relay only executed transactions (this guarantees we don't relay invalid transactions, but means we relay nothing if not mining); lenient - Same as strict when mining, and cheap when not.
#### Command line option 
 `--relay-set`
#### Config file option 
```toml
[mining]
relay_set = cheap
```
#### Default Value 
`cheap`

## usd-per-tx
Amount of USD to be paid for a basic transaction. The minimum gas price is set accordingly.
#### Command line option 
 `--usd-per-tx`
#### Config file option 
```toml
[mining]
usd_per_tx = 0.0001
```
#### Default Value 
`0.0001`

## usd-per-eth
USD value of a single ETH. SOURCE may be either an amount in USD, a web service or 'auto' to use each web service in turn and fallback on the last known good value.
#### Command line option 
 `--usd-per-eth`
#### Config file option 
```toml
[mining]
usd_per_eth = auto
```
#### Default Value 
`auto`

## price-update-period
T will be allowed to pass between each gas price update. T may be daily, hourly, a number of seconds, or a time string of the form "2 days", "30 minutes" etc..
#### Command line option 
 `--price-update-period`
#### Config file option 
```toml
[mining]
price_update_period = hourly
```
#### Default Value 
`hourly`

## gas-floor-target
Amount of gas per block to target when sealing a new block.
#### Command line option 
 `--gas-floor-target`
#### Config file option 
```toml
[mining]
gas_floor_target = 8000000
```
#### Default Value 
`8000000`

## gas-cap
A cap on how large we will raise the gas limit per block due to transaction volume.
#### Command line option 
 `--gas-cap`
#### Config file option 
```toml
[mining]
gas_cap = 10000000
```
#### Default Value 
`10000000`

## tx-queue-mem-limit
Maximum amount of memory that can be used by the transaction queue. Setting this parameter to 0 disables limiting.
#### Command line option 
 `--tx-queue-mem-limit`
#### Config file option 
```toml
[mining]
tx_queue_mem_limit = 4
```
#### Default Value 
`4`

## tx-queue-size
Maximum amount of transactions in the queue (waiting to be included in next block).
#### Command line option 
 `--tx-queue-size`
#### Config file option 
```toml
[mining]
tx_queue_size = 8192
```
#### Default Value 
`8192`

## tx-queue-per-sender
Maximum number of transactions per sender in the queue. By default it's 1% of the entire queue, but not less than 16.
#### Command line option 
 `--tx-queue-per-sender`
#### Config file option 
```toml
[mining]
tx_queue_per_sender = null
```
#### Default Value 
`null`

## tx-queue-strategy
Prioritization strategy used to order transactions in the queue. S may be: gas_price - Prioritize txs with high gas price
#### Command line option 
 `--tx-queue-strategy`
#### Config file option 
```toml
[mining]
tx_queue_strategy = gas_price
```
#### Default Value 
`gas_price`

## min-gas-price
Minimum amount of Wei per GAS to be paid for a transaction to be accepted for mining. Overrides --usd-per-tx.
#### Command line option 
 `--min-gas-price`
#### Config file option 
```toml
[mining]
min_gas_price = null
```
#### Default Value 
`null`

## gas-price-percentile
Set PCT percentile gas price value from last 100 blocks as default gas price when sending transactions.
#### Command line option 
 `--gas-price-percentile`
#### Config file option 
```toml
[mining]
gas_price_percentile = 50
```
#### Default Value 
`50`

## author
Specify the block author (aka "coinbase") address for sending block rewards from sealed blocks. NOTE: MINING WILL NOT WORK WITHOUT THIS OPTION.
#### Command line option 
 `--author`
#### Config file option 
```toml
[mining]
author = null
```
#### Default Value 
`null`

## engine-signer
Specify the address which should be used to sign consensus messages and issue blocks. Relevant only to non-PoW chains.
#### Command line option 
 `--engine-signer`
#### Config file option 
```toml
[mining]
engine_signer = null
```
#### Default Value 
`null`

## tx-gas-limit
Apply a limit of GAS as the maximum amount of gas a single transaction may have for it to be mined.
#### Command line option 
 `--tx-gas-limit`
#### Config file option 
```toml
[mining]
tx_gas_limit = null
```
#### Default Value 
`null`

## tx-time-limit
Maximal time for processing single transaction. If enabled senders of transactions offending the limit will get other transactions penalized.
#### Command line option 
 `--tx-time-limit`
#### Config file option 
```toml
[mining]
tx_time_limit = null
```
#### Default Value 
`null`

## extra-data
Specify a custom extra-data for authored blocks, no more than 32 characters.
#### Command line option 
 `--extra-data`
#### Config file option 
```toml
[mining]
extra_data = null
```
#### Default Value 
`null`

## notify-work
URLs to which work package notifications are pushed. URLS should be a comma-delimited list of HTTP URLs.
#### Command line option 
 `--notify-work`
#### Config file option 
```toml
[mining]
notify_work = null
```
#### Default Value 
`null`

## max-round-blocks-to-import
Maximal number of blocks to import for each import round.
#### Command line option 
 `--max-round-blocks-to-import`
#### Config file option 
```toml
[mining]
max_round_blocks_to_import = 12
```
#### Default Value 
`12`

## tx-queue-ban-count
Not supported.
#### Command line option 
 `--tx-queue-ban-count`
#### Config file option 
```toml
[mining]
tx_queue_ban_count = null
```
#### Default Value 
`null`

## tx-queue-ban-time
Not supported.
#### Command line option 
 `--tx-queue-ban-time`
#### Config file option 
```toml
[mining]
tx_queue_ban_time = null
```
#### Default Value 
`null`

# stratum

## stratum-interface
Interface address for Stratum server.
#### Command line option 
 `--stratum-interface`
#### Config file option 
```toml
[stratum]
interface = local
```
#### Default Value 
`local`

## stratum-port
Port for Stratum server to listen on.
#### Command line option 
 `--stratum-port`
#### Config file option 
```toml
[stratum]
port = 8008
```
#### Default Value 
`8008`

## stratum-secret
Secret for authorizing Stratum server for peers.
#### Command line option 
 `--stratum-secret`
#### Config file option 
```toml
[stratum]
secret = null
```
#### Default Value 
`null`

# footprint

## scale-verifiers
Automatically scale amount of verifier threads based on workload. Not guaranteed to be faster.
#### Command line option 
 `--scale-verifiers`
#### Config file option 
```toml
[footprint]
scale_verifiers = false
```
#### Default Value 
`false`

## tracing
Indicates if full transaction tracing should be enabled. Works only if client had been fully synced with tracing enabled. BOOL may be one of auto, on, off. auto uses last used value of this option (off if it does not exist).
#### Command line option 
 `--tracing`
#### Config file option 
```toml
[footprint]
tracing = auto
```
#### Default Value 
`auto`

## pruning
Configure pruning of the state/storage trie. METHOD may be one of auto, archive, fast: archive - keep all state trie data. No pruning. fast - maintain journal overlay. Fast but 50MB used. auto - use the method most recently synced or default to fast if none synced.
#### Command line option 
 `--pruning`
#### Config file option 
```toml
[footprint]
pruning = auto
```
#### Default Value 
`auto`

## pruning-history
Set a minimum number of recent states to keep in memory when pruning is active.
#### Command line option 
 `--pruning-history`
#### Config file option 
```toml
[footprint]
pruning_history = 64
```
#### Default Value 
`64`

## pruning-memory
The ideal amount of memory in megabytes to use to store recent states. As many states as possible will be kept within this limit, and at least --pruning-history states will always be kept.
#### Command line option 
 `--pruning-memory`
#### Config file option 
```toml
[footprint]
pruning_memory = 32
```
#### Default Value 
`32`

## cache-size-db
Override database cache size.
#### Command line option 
 `--cache-size-db`
#### Config file option 
```toml
[footprint]
cache_size_db = 128
```
#### Default Value 
`128`

## cache-size-blocks
Specify the preferred size of the blockchain cache in megabytes.
#### Command line option 
 `--cache-size-blocks`
#### Config file option 
```toml
[footprint]
cache_size_blocks = 8
```
#### Default Value 
`8`

## cache-size-queue
Specify the maximum size of memory to use for block queue.
#### Command line option 
 `--cache-size-queue`
#### Config file option 
```toml
[footprint]
cache_size_queue = 40
```
#### Default Value 
`40`

## cache-size-state
Specify the maximum size of memory to use for the state cache.
#### Command line option 
 `--cache-size-state`
#### Config file option 
```toml
[footprint]
cache_size_state = 25
```
#### Default Value 
`25`

## db-compaction
Database compaction type. TYPE may be one of: ssd - suitable for SSDs and fast HDDs; hdd - suitable for slow HDDs; auto - determine automatically.
#### Command line option 
 `--db-compaction`
#### Config file option 
```toml
[footprint]
db_compaction = auto
```
#### Default Value 
`auto`

## fat-db
Build appropriate information to allow enumeration of all accounts and storage keys. Doubles the size of the state database. BOOL may be one of on, off or auto.
#### Command line option 
 `--fat-db`
#### Config file option 
```toml
[footprint]
fat_db = auto
```
#### Default Value 
`auto`

## cache-size
Set total amount of discretionary memory to use for the entire system, overrides other cache and queue options.
#### Command line option 
 `--cache-size`
#### Config file option 
```toml
[footprint]
cache_size = null
```
#### Default Value 
`null`

## num-verifiers
Amount of verifier threads to use or to begin with, if verifier auto-scaling is enabled.
#### Command line option 
 `--num-verifiers`
#### Config file option 
```toml
[footprint]
num_verifiers = null
```
#### Default Value 
`null`

# snapshots

## no-periodic-snapshot
Disable automated snapshots which usually occur once every 10000 blocks.
#### Command line option 
 `--no-periodic-snapshot`
#### Config file option 
```toml
[snapshots]
disable_periodic = false
```
#### Default Value 
`false`

## snapshot-threads
Enables multiple threads for snapshots creation.
#### Command line option 
 `--snapshot-threads`
#### Config file option 
```toml
[snapshots]
processing_threads = null
```
#### Default Value 
`null`

# whisper

## whisper
Enable the Whisper network.
#### Command line option 
 `--whisper`
#### Config file option 
```toml
[whisper]
enabled = false
```
#### Default Value 
`false`

## whisper-pool-size
Target size of the whisper message pool in megabytes.
#### Command line option 
 `--whisper-pool-size`
#### Config file option 
```toml
[whisper]
pool_size = 10
```
#### Default Value 
`10`

