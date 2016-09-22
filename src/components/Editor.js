import React, { Component, PropTypes } from 'react';

import Section from './Section';
import Item from './Item';
import Select from './controls/Select';

import data from './data.json';

class Editor extends Component {

  change = (data, name) => {
    return value => {
      data[name] = value;
      this.props.onChange({...this.props.settings});
    };
  };

  render() {
    return (
      <div>
        <Section title={data.parity.section} description={data.parity.description}>
          { this.select('parity', 'mode') }
          { this.number('parity', 'mode_timeout') }
          { this.number('parity', 'mode_alarm') }
          { this.select('parity', 'chain') }
        </Section>
      </div>
    );
  }

  select(section, prop) {
    const {settings} = this.props;
    return (
      <Item title={data[section][prop].name} description={data[section][prop].description[settings[section][prop]]}>
        <Select
          onChange={this.change(settings[section], prop)}
          value={settings[section][prop]}
          values={data[section][prop].values.map(val)}
          id={prop}
        />
      </Item>
    );
  }

  number(section, prop) {
    const {settings} = this.props;
    return (
      <Item title={data[section][prop].name} description={data[section][prop].description}>
        <span>...</span>
      </Item>
    );
  }
}

Editor.propTypes = {
  settings: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

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
