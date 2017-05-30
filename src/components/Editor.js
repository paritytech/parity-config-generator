import React, { Component, PropTypes } from 'react';

import Section from './Section';
import Item from './Item';
import Select from './controls/Select';

import { localPath, basePath, joinPath } from '../system';
import data from '../data.json';

class Editor extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  change = (data, name) => {
    return value => {
      data[name] = value;
      this.props.onChange({...this.props.settings});
    };
  };

  render () {
    const {settings} = this.props;
    const {configMode, platform} = settings.__internal;
    const base = settings.parity.base_path !== '$BASE' ? settings.parity.base_path : basePath(platform);

    const isOffline = settings.parity.mode === 'off';
    const config = () => {
      if (configMode === 'simple') {
        return this.renderSimple(settings, platform, base, isOffline);
      }
      return this.renderConfig(settings, platform, base, isOffline);
    };

    return (
      <div>
        { this.select('__internal', 'platform') }
        { this.select('__internal', 'configMode') }
        { config() }
      </div>
    );
  }

  renderSimple (settings, platform, base, isOffline) {
    return (
      <div>
        <h5>{data.parity.section}</h5>
        <p>{data.parity.description}</p>
        { this.select('parity', 'chain') }
        { this.select('parity', 'mode') }
        { this.select('parity', 'auto_update') }
        { this.select('parity', 'release_track', settings.parity.auto_update !== 'none') }
        { this.path('parity', 'base_path', base, platform) }
        <h5>{data.footprint.section}</h5>
        <p>{data.footprint.description}</p>
        { this.select('footprint', 'db_compaction') }
        { this.select('footprint', 'pruning') }
        { this.number('footprint', 'pruning_memory', settings.footprint.pruning !== 'archive') }
        { this.select('footprint', 'fat_db') }
        { this.select('footprint', 'tracing') }
        { this.number('footprint', 'cache_size') }
        <Section title={'Servers'} description={'Parity RPC servers configuration'}>
          { this.number('ui', 'port', !settings.ui.disable) }
          { this.text('ui', 'interface', !settings.ui.disable) }
          { this.number('rpc', 'port', !settings.rpc.disable) }
          { this.text('rpc', 'interface', !settings.rpc.disable) }
          { this.text('rpc', 'cors', !settings.rpc.disable) }
          { this.number('ws', 'port', !settings.ws.disable) }
          { this.text('ws', 'interface', !settings.ws.disable) }
          { this.text('ws', 'origins', !settings.ws.disable) }
        </Section>
        <Section title={data.network.section} description={data.network.description}>
          { this.number('network', 'min_peers', !isOffline) }
          { this.number('network', 'max_peers', !isOffline) }
          { this.select('network', 'nat', !isOffline) }
        </Section>
        <Section title={data.mining.section} description={data.mining.description}>
          { this.text('mining', 'author') }
          { this.number('mining', 'usd_per_tx') }
          { this.flag('mining', 'no_persistent_txqueue') }
        </Section>
        <Section title={data.misc.section} description={data.misc.description}>
          { this.text('misc', 'logging') }
          { this.text('misc', 'log_file') }
        </Section>
      </div>
    );
  }

  renderConfig (settings, platform, base, isOffline) {
    return (
      <div>
        <Section title={data.parity.section} description={data.parity.description}>
          { this.select('parity', 'chain') }
          { this.select('parity', 'mode') }
          { this.number('parity', 'mode_timeout', settings.parity.mode !== 'active' && !isOffline) }
          { this.number('parity', 'mode_alarm', settings.parity.mode === 'passive') }
          { this.select('parity', 'auto_update') }
          { this.select('parity', 'release_track', settings.parity.auto_update !== 'none') }
          { this.flag('parity', 'no_download') }
          { this.flag('parity', 'no_consensus') }
          { this.path('parity', 'base_path', base, platform) }
          { this.path('parity', 'db_path', base, platform) }
          { this.path('parity', 'keys_path', base, platform) }
          { this.text('parity', 'identity') }
        </Section>
        <Section title={data.account.section} description={data.account.description}>
          { this.list('account', 'unlock') }
          { this.text('account', 'password') }
          { this.number('account', 'keys_iterations') }
        </Section>
        <Section title={data.ui.section} description={data.ui.description}>
          { this.flag('ui', 'disable') }
          { this.flag('ui', 'force', !settings.ui.disable) }
          { this.number('ui', 'port', !settings.ui.disable) }
          { this.text('ui', 'interface', !settings.ui.disable) }
          { this.path('ui', 'path', base, platform, !settings.ui.disable) }
        </Section>
        <Section title={data.network.section} description={data.network.description}>
          { this.flag('network', 'warp', !isOffline) }
          { this.flag('network', 'no_warp', !isOffline) }
          { this.number('network', 'port', !isOffline) }
          { this.number('network', 'min_peers', !isOffline) }
          { this.number('network', 'max_peers', !isOffline) }
          { this.number('network', 'snapshot_peers', !isOffline) }
          { this.number('network', 'max_pending_peers', !isOffline) }
          { this.select('network', 'nat', !isOffline) }
          { this.number('network', 'id', !isOffline) }
          { this.list('network', 'bootnodes', !isOffline) }
          { this.flag('network', 'discovery', !isOffline) }
          { this.list('network', 'reserved_peers', !isOffline) }
          { this.flag('network', 'reserved_only', !isOffline) }
          { this.select('network', 'allow_ips', !isOffline) }
          { this.flag('network', 'no_ancient_blocks', !isOffline) }
          { this.flag('network', 'no_serve_light', !isOffline) }
        </Section>
        <Section title={data.rpc.section} description={data.rpc.description}>
          { this.flag('rpc', 'disable') }
          { this.number('rpc', 'port', !settings.rpc.disable) }
          { this.text('rpc', 'interface', !settings.rpc.disable) }
          { this.text('rpc', 'cors', !settings.rpc.disable) }
          { this.list('rpc', 'hosts', !settings.rpc.disable) }
          { this.multiselect('rpc', 'apis', !settings.rpc.disable) }
        </Section>
        <Section title={data.ws.section} description={data.ws.description}>
          { this.flag('ws', 'disable') }
          { this.number('ws', 'port', !settings.ws.disable) }
          { this.text('ws', 'interface', !settings.ws.disable) }
          { this.text('ws', 'origins', !settings.ws.disable) }
          { this.list('ws', 'hosts', !settings.ws.disable) }
          { this.multiselect('ws', 'apis', !settings.ws.disable) }
        </Section>
        <Section title={data.ipc.section} description={data.ipc.description}>
          { this.flag('ipc', 'disable') }
          { this.path('ipc', 'path', base, platform, !settings.ipc.disable) }
          { this.multiselect('ipc', 'apis', !settings.ipc.disable) }
        </Section>
        <Section title={data.dapps.section} description={data.dapps.description}>
          { this.flag('dapps', 'disable') }
          { this.number('dapps', 'port', !settings.dapps.disable) }
          { this.text('dapps', 'interface', !settings.dapps.disable) }
          { this.list('dapps', 'hosts', !settings.dapps.disable) }
          { this.path('dapps', 'path', base, platform, !settings.dapps.disable) }
          { this.text('dapps', 'user', !settings.dapps.disable) }
          { this.text('dapps', 'password', settings.dapps.user && !settings.dapps.disable) }
        </Section>
        <Section title={data.secretstore.section} description={data.secretstore.description}>
          { this.flag('secretstore', 'disable') }
          { this.text('secretstore', 'secret', !settings.secretstore.disable) }
          { this.list('secretstore', 'nodes', !settings.dapps.disable) }
          { this.number('secretstore', 'port', !settings.secretstore.disable) }
          { this.text('secretstore', 'interface', !settings.secretstore.disable) }
          { this.number('secretstore', 'http_port', !settings.secretstore.disable) }
          { this.text('secretstore', 'http_interface', !settings.secretstore.disable) }
          { this.path('secretstore', 'path', base, platform, !settings.secretstore.disable) }
        </Section>
        <Section title={data.ipfs.section} description={data.ipfs.description}>
          { this.flag('ipfs', 'disable') }
          { this.number('ipfs', 'port', !settings.ipfs.disable) }
          { this.text('ipfs', 'interface', !settings.ipfs.disable) }
          { this.text('ipfs', 'cors', !settings.ipfs.disable) }
          { this.list('ipfs', 'hosts', !settings.ipfs.disable) }
        </Section>
        <Section title={data.mining.section} description={data.mining.description}>
          { this.text('mining', 'author') }
          { this.text('mining', 'engine_signer') }
          { this.text('mining', 'extra_data') }
          { this.flag('mining', 'force_sealing') }
          { this.select('mining', 'reseal_on_txs') }
          { this.number('mining', 'reseal_min_period') }
          { this.number('mining', 'work_queue_size') }
          { this.flag('mining', 'remove_solved') }
          { this.select('mining', 'relay_set') }
          { this.number('mining', 'usd_per_tx') }
          { this.text('mining', 'usd_per_eth') }
          { this.text('mining', 'price_update_period') }
          { this.number('mining', 'gas_floor_target') }
          { this.number('mining', 'gas_cap') }
          { this.number('mining', 'tx_gas_limit') }
          { this.number('mining', 'tx_time_limit') }
          { this.number('mining', 'tx_queue_size') }
          { this.select('mining', 'tx_queue_strategy') }
          { this.number('mining', 'tx_queue_ban_count') }
          { this.number('mining', 'tx_queue_ban_time') }
          { this.flag('mining', 'no_persistent_txqueue') }
          { this.list('mining', 'notify_work') }
          { this.flag('mining', 'refuse_service_transactions') }
        </Section>
        <Section title={data.stratum.section} description={data.stratum.description}>
          { this.flag('stratum', 'enable') }
          { this.number('stratum', 'port', settings.stratum.enable) }
          { this.text('stratum', 'interface', settings.stratum.enable) }
          { this.text('stratum', 'secret', settings.stratum.enable) }
        </Section>
        <Section title={data.footprint.section} description={data.footprint.description}>
          { this.select('footprint', 'tracing') }
          { this.select('footprint', 'pruning') }
          { this.number('footprint', 'pruning_memory', settings.footprint.pruning !== 'archive') }
          { this.number('footprint', 'pruning_history', settings.footprint.pruning !== 'archive') }
          { this.select('footprint', 'fat_db') }
          { this.flag('footprint', 'scale_verifiers') }
          { this.number('footprint', 'num_verifiers', settings.footprint.scale_verifiers) }
          { this.select('footprint', 'db_compaction') }
          { this.number('footprint', 'cache_size') }
          { this.number('footprint', 'cache_size_db', !settings.footprint.cache_size) }
          { this.number('footprint', 'cache_size_blocks', !settings.footprint.cache_size) }
          { this.number('footprint', 'cache_size_queue', !settings.footprint.cache_size) }
          { this.number('footprint', 'cache_size_state', !settings.footprint.cache_size) }
          { this.flag('footprint', 'fast_and_loose') }
        </Section>
        <Section title={data.snapshots.section} description={data.snapshots.description}>
          { this.flag('snapshots', 'disable_periodic') }
        </Section>
        <Section title={data.vm.section} description={data.vm.description}>
          { this.flag('vm', 'jit') }
        </Section>
        <Section title={data.misc.section} description={data.misc.description}>
          { this.text('misc', 'logging') }
          { this.text('misc', 'log_file') }
          { this.flag('misc', 'color') }
        </Section>
      </div>
    );
  }

  select (section, prop, isEnabled = true) {
    check(section, prop);
    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description[value], value, `${section}.${prop}`);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <Select
          onChange={this.change(settings[section], prop)}
          value={value}
          values={data[section][prop].values.map(val)}
          id={prop}
          disabled={!isEnabled}
        />
      </Item>
    );
  }

  multiselect (section, prop, isEnabled = true) {
    check(section, prop);
    const {settings} = this.props;
    const current = settings[section][prop] || [];
    const description = fillDescription(data[section][prop].description, current);

    const change = (val) => (ev) => {
      const {checked} = ev.target;
      const newValue = [...current];
      const idx = newValue.indexOf(val);

      if (checked) {
        newValue.push(val);
      } else if (idx !== -1) {
        newValue.splice(idx, 1);
      }

      this.change(settings[section], prop)(newValue);
    };

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        large
        >
        {data[section][prop].values.map(val).map(value => (
          <label className='mdl-switch mdl-js-switch' htmlFor={`${section}.${prop}.${value.value}`} key={value.name}>
            <input
              type='checkbox'
              id={`${section}.${prop}.${value.value}`}
              className='mdl-switch__input'
              checked={current.indexOf(value.value) !== -1}
              disabled={!isEnabled}
              onChange={change(value.value)}
              />
            <span className='mdl-switch__label'>{value.name}</span>
          </label>
        ))}
      </Item>
    );
  }

  number (section, prop, isEnabled = true) {
    check(section, prop);
    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
          <input
            className='mdl-textfield__input'
            type='number'
            value={value || 0}
            onChange={(ev) => this.change(settings[section], prop)(Number(ev.target.value))}
            min={data[section][prop].min}
            max={data[section][prop].max}
            disabled={!isEnabled}
            />
          <span className='mdl-textfield__error'>Please provide a valid number (min: {data[section][prop].min}, max: {data[section][prop].max})</span>
        </div>
      </Item>
    );
  }

  path (section, prop, base, platform, isEnabled = true) {
    return this.text(section, prop, isEnabled, value => {
      if (!value) {
        return value;
      }
      value = value.replace('$LOCAL', localPath(platform));
      value = value.replace('$BASE', base);
      // normalize separators
      value = joinPath(value.split('\\'), platform);
      value = joinPath(value.split('/'), platform);
      return value;
    });
  }

  text (section, prop, isEnabled = true, processValue = x => x) {
    check(section, prop);
    const {settings} = this.props;
    const value = processValue(or(settings[section][prop], data[section][prop].default));
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
          <input
            className='mdl-textfield__input'
            type='text'
            value={value || ''}
            onChange={(ev) => this.change(settings[section], prop)(ev.target.value)}
            disabled={!isEnabled}
            />
        </div>
      </Item>
    );
  }

  flag (section, prop, isEnabled = true) {
    check(section, prop);
    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <label className='mdl-switch mdl-js-switch' htmlFor={`${section}.${prop}`}>
          <input
            type='checkbox'
            id={`${section}.${prop}`}
            className='mdl-switch__input'
            checked={value}
            disabled={!isEnabled}
            onChange={(ev) => this.change(settings[section], prop)(ev.target.checked)}
            />
          <span className='mdl-switch__label' />
        </label>
      </Item>
    );
  }

  list (section, prop, isEnabled = true) {
    check(section, prop);
    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description, value.toString());

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
          {value.map((v, idx) => (
            <input
              disabled={!isEnabled}
              key={idx}
              className='mdl-textfield__input'
              type='text'
              value={v || ''}
              onChange={(ev) => {
                const newValue = [...value];
                if (ev.target.value !== '') {
                  newValue[idx] = ev.target.value;
                } else {
                  delete newValue[idx];
                }
                this.change(settings[section], prop)(newValue);
              }}
              />
          ))}
          <br />
          <button
            style={{bottom: 0, right: 0, zIndex: 10, transform: 'scale(0.5)'}}
            className='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect'
            onClick={() => this.change(settings[section], prop)(value.concat(['']))}
            disabled={!isEnabled}
            >
            <i className='material-icons'>add</i>
          </button>
        </div>
      </Item>
    );
  }
}

export function fillDescription (description, value, key) {
  if (!description) {
    console.warn(`Cant find description for: value:${value} at ${key}`);
    return 'unknown entry';
  }
  return description.replace(/{}/g, value || '');
}

function or (value, def) {
  if (value === undefined) {
    return def;
  }
  return value;
}

function check (section, prop) {
  if (!data[section][prop]) {
    throw new Error(`Can't find data for ${section}.${prop}`);
  }
}

function val (data) {
  const match = data.match(/(.+)\s+\[(.+)]/);
  if (!match) {
    return { name: data, value: data };
  }

  return {
    name: match[1],
    value: match[2]
  };
}

export default Editor;
