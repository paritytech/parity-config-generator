import React, { Component } from 'react';

import TopBar from './components/TopBar';
import Editor from './components/Editor';
import Preview from './components/Preview';

class App extends Component {

  state = {
    settings: {
      parity: {
        mode: 'active',
        mode_timeout: 300,
        mode_alarm: 3600,
        chain: 'homestead',
      },
      signer: {
        disable: false
      }
    }
  };

  handleChange = (settings) => {
    this.setState({settings});
  }

  render() {
    const {settings} = this.state;
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <TopBar />
        <main className="mdl-layout__content">
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet">
              <Editor settings={settings} onChange={this.handleChange} />
            </div>
            <div className="mdl-cell mdl-cell--6-col mdl-cell--12-col-tablet">
              <Preview settings={settings} />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
