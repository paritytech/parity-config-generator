import React, { Component, PropTypes } from 'react';

import Section from './Section';
import Item from './Item';
import Select from './controls/Select';

import data from '../data.json';

class Editor extends Component {

  change = (data, name) => {
    return value => {
      data[name] = value;
      this.props.onChange({...this.props.settings});
    };
  };

  render() {
    const {settings} = this.props;

    return (
      <div>
        <Section title={data.parity.section} description={data.parity.description} collapsed={false}>
          { this.select('parity', 'chain') }
          { this.select('parity', 'mode') }
          { this.number('parity', 'mode_timeout', settings.parity.mode !== 'active') }
          { this.number('parity', 'mode_alarm', settings.parity.mode === 'passive') }
          { this.text('parity', 'db_path') }
          { this.text('parity', 'keys_path') }
          { this.text('parity', 'identity') }
        </Section>
        <Section title={data.account.section} description={data.account.description}>
          { this.list('account', 'unlock') }
          { this.text('account', 'password') }
          { this.number('account', 'keys_iterations') }
        </Section>
        <Section title={data.signer.section} description={data.signer.description}>
          { this.flag('signer', 'disable') }
          { this.flag('signer', 'force', !settings.signer.disable) }
          { this.number('signer', 'port', !settings.signer.disable) }
          { this.text('signer', 'interface', !settings.signer.disable) }
          { this.text('signer', 'path', !settings.signer.disable) }
        </Section>
        <Section title={data.network.section} description={data.network.description}>
          { this.flag('network', 'disable') }
          { this.number('network', 'port', !settings.network.disable) }
          { this.number('network', 'min_peers', !settings.network.disable) }
          { this.number('network', 'max_peers', !settings.network.disable) }
          { this.select('network', 'nat', !settings.network.disable) }
          { this.text('network', 'id', !settings.network.disable) }
          { this.list('network', 'bootnodes', !settings.network.disable) }
          { this.flag('network', 'discovery', !settings.network.disable) }
          { this.list('network', 'reserved_peers', !settings.network.disable) }
          { this.flag('network', 'reserved_only', !settings.network.disable) }
        </Section>
      </div>
    );
  }

  select(section, prop, isEnabled = true) {
    const {settings} = this.props;
    const value = settings[section][prop];
    const description = fillDescription(data[section][prop].description[value], value);
    
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

  number(section, prop, isEnabled = true) {
    const {settings} = this.props;
    const value = settings[section][prop];
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            className="mdl-textfield__input"
            type="number"
            value={value || 0}
            onChange={(ev) => this.change(settings[section], prop)(Number(ev.target.value))}
            min={data[section][prop].min}
            max={data[section][prop].max}
            disabled={!isEnabled}
            />
          <span className="mdl-textfield__error">Please provide a valid number (min: {data[section][prop].min}, max: {data[section][prop].max})</span>
        </div>
      </Item>
    );
  }

  text(section, prop, isEnabled = true) {
    const {settings} = this.props;
    const value = settings[section][prop];
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input
            className="mdl-textfield__input"
            type="text"
            value={value || ''}
            onChange={(ev) => this.change(settings[section], prop)(ev.target.value)}
            disabled={!isEnabled}
            />
        </div>
      </Item>
    );
  }

  flag(section, prop, isEnabled = true) {
    const {settings} = this.props;
    const value = settings[section][prop];
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <label className="mdl-switch mdl-js-switch" htmlFor={`${section}.${prop}`}>
          <input
            type="checkbox"
            id={`${section}.${prop}`}
            className="mdl-switch__input"
            checked={value}
            disabled={!isEnabled}
            onChange={(ev) => this.change(settings[section], prop)(ev.target.checked)}
            />
          <span className="mdl-switch__label"></span>
        </label>
      </Item>
    );
  }

  list(section, prop, isEnabled = true) {
    const {settings} = this.props;
    const value = settings[section][prop];
    const description = fillDescription(data[section][prop].description, value.toString());

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          {value.map((v, idx) => (
            <input
              disabled={!isEnabled}
              key={idx}
              className="mdl-textfield__input"
              type="text"
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
          <br/>
          <button
            style={{bottom: 0, right: 0, zIndex: 10, transform: 'scale(0.5)'}}
            className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect"
            onClick={() => this.change(settings[section], prop)(value.concat(['']))}
            disabled={!isEnabled}
            >
            <i className="material-icons">add</i>
          </button>
        </div>
      </Item>
    );
  }
}

Editor.propTypes = {
  settings: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

function fillDescription(description, value) {
  return description.replace(/{}/g, value || '');
}

function val(data) {
  const match = data.match(/(.+)\s+\[(.+)\]/);
  if (!match) {
    return { name: data, value: data };
  }

  return {
    name: match[1],
    value: match[2]
  };
}

export default Editor;
