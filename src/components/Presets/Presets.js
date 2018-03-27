import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './Presets.css';

import Select from '../controls/Select';
import Item from '../Item';

import mining from './mining.json';
import ports from './ports.json';

import {mix, clone} from '../../util';

function toVal (val) {
  return { name: val, value: val };
}

const presets = {
  'None': null,
  'Defaults': null,
  'Mining': mining,
  'Non-standard Ports': ports
};

class Presets extends PureComponent {

  static propTypes = {
    preset: PropTypes.string,
    defaults: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    preset: 'None'
  };

  change = (preset) => {
    if (preset === 'None') {
      return;
    }

    if (this.props.preset === 'None') {
      if (!window.confirm('Do you want to overwrite current config?')) {
        this.forceUpdate();
        return;
      }
    }

    const data = mix(clone(this.props.defaults), clone(presets[preset] || {}));
    this.props.onChange(preset, data);
  };

  render () {
    const {preset} = this.props;

    return (
      <div className='presets'>
        <Item title={''} description={'Load predefined config.'}>
          <Select
            onChange={this.change}
            value={preset}
            values={Object.keys(presets).map(toVal)}
            id={'presets'}
            disabled={false}
            />
        </Item>
      </div>
    );
  }
}

export default Presets;
