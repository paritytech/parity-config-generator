import React, { PropTypes } from 'react';
import './Preview.css';

function Preview({settings}) {
  return (
    <div className="mdl-card mdl-shadow--2dp preview-card">
      <div className="mdl-card__title">
        <div className="preview-title mdl-card__title-text">
          .parity/config.toml
        </div>
      </div>
      <div className="mdl-card__actions mdl-card--border">
        <textarea className="preview-editor" readOnly>{ toToml(settings) }</textarea>
      </div>
      <div className="mdl-card__menu">
        <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-efect">
          <i className="material-icons" id="download">cloud download</i>
          <span className="mdl-tooltip" htmlFor="download">Download Config File</span>
        </button>
      </div>
    </div>
  );
}

Preview.propTypes = {
  settings: PropTypes.object.isRequired
};

function toToml(settings) {
  return Object.keys(settings).reduce((acc, section) => {
    acc.push(`\n[${section}]`);

    return acc.concat(Object.keys(settings[section]).map(key => {
      const val = settings[section][key];

      return `${key} = ${toVal(val)}`;
    }));
  }, []).join('\n').substr(1);
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
