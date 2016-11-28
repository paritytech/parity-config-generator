import React, { Component, PropTypes } from 'react';
import './Preview.css';

import data from '../data.json';
// TODO [ToDr] move to some common?
import {fillDescription} from './Editor';

class Preview extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    defaults: PropTypes.object.isRequired
  };

  generateConfig = () => {
    const {settings, defaults} = this.props;
    const data = toToml(settings, defaults);
    const filename = 'config.toml';
    const blob = new Blob([data], {type: 'text/toml'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;        
      document.body.appendChild(elem);
      elem.click();        
      document.body.removeChild(elem);
    }
  }

  render() {
    const {settings, defaults} = this.props;
    return (
      <div className="mdl-card mdl-shadow--2dp preview-card">
        <div className="mdl-card__title">
          <div className="preview-title mdl-card__title-text">
            .parity/config.toml
          </div>
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <textarea className="preview-editor" readOnly value={ toToml(settings, defaults) }></textarea>
        </div>
        <div className="mdl-card__menu">
          <button
            className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-efect"
            onClick={this.generateConfig}>
            <i className="material-icons" id="download">cloud download</i>
            <span className="mdl-tooltip" htmlFor="download">Download Config File</span>
          </button>
        </div>
      </div>
    );
  }
}

function toToml(settings, defaults) {
  const toml = Object.keys(settings).reduce((acc, section) => {
    // for old configs the section might be missing in defaults
    defaults[section] = defaults[section] || {};

    const vals = Object.keys(settings[section])
      .filter(key => !isEqual(settings[section][key], defaults[section][key]))
      .map(key => {

        const val = settings[section][key];
        const comment = toComment(settings, section, key, val);
        const setting = `${key} = ${toVal(val)}`;
        return `# ${comment}\n${setting}`;
      });

    if (vals.length) {
      acc.push(`\n[${section}]`);
    }

    return acc.concat(vals);
  }, []);
  
  if (!toml.length) {
    return '# All values you use are defaults. Config is not needed.';
  }

  return toml.join('\n').substr(1);
}

function isEqual(a, b) {
  // TODO [todr] optimize
  return JSON.stringify(a) === JSON.stringify(b);
}

function toComment(settings, section, key, value) {
  // for old configs the section might be missing in defaults
  data[section] = data[section] || {};
  data[section][key] = data[section][key] || {};

  if (typeof data[section][key].description === 'object') {
    return fillDescription(data[section][key].description[value], value);
  }
  return fillDescription(data[section][key].description, value);
}

function toVal(val) {
  if (typeof val === 'boolean') {
    return `${val}`;
  }

  if (typeof val === 'number') {
    return `${val}`;
  }

  if (Array.isArray(val)) {
    return `[${val.map(v => toVal(v)).join(', ')}]`;
  }

  return `"${val}"`;
}

export default Preview;
