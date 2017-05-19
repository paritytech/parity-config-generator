import React, { Component } from 'react';
import isEqual from 'lodash.isequal';

import TopBar from './components/TopBar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Presets from './components/Presets';

import { detectPlatform } from './system';
import data from './data.json';

function loadFromURL () {
  const hash = window.location.hash;
  if (!hash.startsWith('#config=')) {
    return null;
  }

  try {
    const config = hash.split('=')[1];
    return JSON.parse(window.atob(config));
  } catch (e) {
    console.warn('Error parsing config from URL: ', e);
    return null;
  }
}

function loadFromLocalStorage () {
  try {
    return JSON.parse(window.localStorage.getItem('last-config'));
  } catch (e) {
    window.localStorage.setItem('last-config', null);
    return null;
  }
}

function loadSettings () {
  const defaultSettings = generateDefaults(data);
  try {
    let settings = loadFromLocalStorage();
    const url = loadFromURL();
    if (settings && url) {
      const diff = JSON.stringify(settings) !== JSON.stringify(url);
      if (diff && window.confirm('Detected config in URL. Do you want to override your current config?')) {
        settings = null;
      }
    }
    if (!settings && url) {
      settings = url;
    }
    if (settings && typeof settings === 'object') {
      // make sure the sections are always created
      Object.keys(defaultSettings).forEach(key => {
        settings[key] = settings[key] || {};
        Object.keys(defaultSettings[key]).forEach(prop => {
          if (settings[key][prop] === undefined) {
            settings[key][prop] = defaultSettings[key][prop];
          }
        });
      });
      return settings;
    }
  } catch (e) {
    console.warn(e);
  }

  defaultSettings.parity.chain = 'kovan';
  return defaultSettings;
}

function saveSettings (settings) {
  const defaultSettings = generateDefaults(data);
  const cloned = JSON.parse(JSON.stringify(settings));

  Object.keys(defaultSettings).forEach(section => {
    Object.keys(defaultSettings[section]).forEach(prop => {
      if (isEqual(cloned[section][prop], defaultSettings[section][prop])) {
        delete cloned[section][prop];
      }
    });

    if (Object.keys(cloned[section]).length === 0) {
      delete cloned[section];
    }
  });

  const json = JSON.stringify(cloned);
  try {
    window.localStorage.setItem('last-config', json);
    window.location.hash = 'config=' + window.btoa(json);
  } catch (e) {
  }
}

class App extends Component {

  state = {
    preset: undefined,
    settings: loadSettings(),
    defaults: generateDefaults(data)
  };

  handleChange = (settings) => {
    saveSettings(settings);
    this.setState({
      preset: undefined,
      settings
    });
  };

  handlePreset = (preset, settings) => {
    saveSettings(settings);
    this.setState({
      preset,
      settings
    });
  };

  render () {
    const {settings, defaults, preset} = this.state;
    return (
      <div className='mdl-layout mdl-js-layout mdl-layout--fixed-header'>
        <TopBar />
        <main className='mdl-layout__content'>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--8-col mdl-cell--12-col-tablet'>
              <Editor settings={settings} onChange={this.handleChange} />
            </div>
            <div className='mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet'>
              <Presets preset={preset} defaults={defaults} onChange={this.handlePreset} />
              <Preview settings={settings} defaults={defaults} />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

function generateDefaults (settings) {
  const defaults = Object.keys(settings).reduce((data, section) => {
    data[section] = Object.keys(settings[section])
    .filter(key => settings[section][key].default !== undefined)
    .reduce((d, key) => {
      d[key] = settings[section][key].default;
      return d;
    }, {});
    return data;
  }, {});

  defaults.__internal.platform = detectPlatform();
  return defaults;
}

export default App;
