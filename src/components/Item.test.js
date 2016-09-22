import React from 'react';
import ReactDOM from 'react-dom';
import Item from './Section';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Item title="Section one" description="Defines some stuff."><h1>Hello!</h1></Section>, div);
});
