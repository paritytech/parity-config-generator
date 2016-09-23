import React, { Component } from 'react';

import TopBar from './components/TopBar';
import Editor from './components/Editor';
import Preview from './components/Preview';

import data from './data.json';

let settings = generateDefaults(data);
settings.parity.chain = 'morden';

class App extends Component {

  state = {
    settings: settings,
    defaults: generateDefaults(data)
  };

  handleChange = (settings) => {
    this.setState({settings});
  }

  render() {
    const {settings, defaults} = this.state;
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <TopBar />
        <main className="mdl-layout__content">
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet">
              <Editor settings={settings} onChange={this.handleChange} />
            </div>
            <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet">
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
