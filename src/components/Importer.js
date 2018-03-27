import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import toml from 'toml';

import './Importer.css';

import {mix, clone} from '../util';

class Importer extends PureComponent {

  static propTypes = {
    defaults: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleFileChange (ev) {
    const file = ev.target.files[0];
    const domTarget = ev.target;
    domTarget.value = '';

    if (!window.confirm('Do you want to overwrite current config?')) {
      return;
    }

    if (file.name.match(/.*\.toml$/)) {
      var reader = new window.FileReader();

      reader.onload = _ => {
        let importedData;

        try {
          importedData = toml.parse(reader.result);
        } catch (err) {
          this.props.onError(`Couldn't parse configuration file. ${err.toString()}`);
          return;
        }

        const data = mix(clone(this.props.defaults), importedData);
        domTarget.blur();
        this.props.onChange(data);
      };

      reader.readAsText(file);
    } else {
      this.props.onError('Please import a .toml configuration file.');
    }
  }

  handleClick () {
    this.refs.fileInput.click();
  }

  render () {
    return (
      <button
        className='mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-efect import'
        onClick={this.handleClick}>

        <input
          type='file'
          ref='fileInput'
          onChange={this.handleFileChange} />

        <i className='material-icons' id='upload'>file_upload</i>
        <span className='mdl-tooltip' htmlFor='upload'>Load Config File</span>
      </button>
    );
  }
}

export default Importer;
