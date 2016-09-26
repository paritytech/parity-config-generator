import React from 'react';
import ReactDOM from 'react-dom';
import Preview from './Preview';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Preview settings={{}} defaults={{}} />, div);
});
