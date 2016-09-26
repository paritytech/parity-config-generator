import React, { Component } from 'react';

import TopBar from './components/TopBar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Presets from './components/Presets';

import data from './data.json';


function loadSettings() {
  try {
    const settings = JSON.parse(window.localStorage.getItem('last-config'));
    if (settings && typeof settings === 'object') {
      return settings;
    }
  } catch (e) {
  }

  const settings = generateDefaults(data);
  settings.parity.chain = 'morden';
  return settings;
}

function saveSettings(settings) {
  try {
    window.localStorage.setItem('last-config', JSON.stringify(settings));
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

  render() {
    const {settings, defaults, preset} = this.state;
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <TopBar />
        <main className="mdl-layout__content">
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--8-col mdl-cell--12-col-tablet">
              <Editor settings={settings} onChange={this.handleChange} />
            </div>
            <div className="mdl-cell mdl-cell--4-col mdl-cell--12-col-tablet">
              <Presets preset={preset} defaults={defaults} onChange={this.handlePreset} />
              <Preview settings={settings} defaults={defaults} />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

function generateDefaults(settings) {
  return Object.keys(settings).reduce((data, section) => {
    data[section] = Object.keys(settings[section])
    .filter(key => settings[section][key].default !== undefined)
    .reduce((d, key) => {
      d[key] = settings[section][key].default;
      return d;
    }, {}); 
    return data;
  }, {});
}

export default App;
