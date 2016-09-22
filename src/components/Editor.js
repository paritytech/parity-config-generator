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
        <Section title={data.parity.section} description={data.parity.description}>
          { this.select('parity', 'chain') }
          { this.select('parity', 'mode') }
          { this.number('parity', 'mode_timeout', settings.parity.mode !== 'active') }
          { this.number('parity', 'mode_alarm', settings.parity.mode === 'passive') }
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

  number(section, prop, isEnabled) {
    const {settings} = this.props;
    const value = settings[section][prop];
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <span>{value}</span>
      </Item>
    );
  }
}

Editor.propTypes = {
  settings: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

function fillDescription(description, value) {
  return description.replace(/{}/g, value);
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
