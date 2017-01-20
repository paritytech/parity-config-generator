/* global it */

import React from 'react';
import ReactDOM from 'react-dom';
import Preview from './Preview';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const defaults = {
    __internal: {
      platform: 'Linux'
    }
  };
  ReactDOM.render(<Preview settings={{}} defaults={defaults} />, div);
});
