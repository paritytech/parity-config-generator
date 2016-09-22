import React from 'react';
import ReactDOM from 'react-dom';
import Editor from './Editor';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Editor settings={{}} onChange={() => {}} />, div);
});
