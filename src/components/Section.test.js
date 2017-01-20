/* global it */
import React from 'react';
import ReactDOM from 'react-dom';
import Section from './Section';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Section title='Section one' description='Defines some stuff.'><h1>Hello!</h1></Section>, div);
});
