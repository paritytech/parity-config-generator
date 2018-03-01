import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import dialogPolyfill from 'dialog-polyfill/dialog-polyfill.js';
import 'dialog-polyfill/dialog-polyfill.css';
import './Modal.css';

class Modal extends Component {

  static propTypes = {
    title: PropTypes.string,
    reset: PropTypes.func.isRequired,
    children: PropTypes.object
  };

  close () {
    ReactDOM.findDOMNode(this).close();
  }

  show () {
    ReactDOM.findDOMNode(this).showModal();
  }

  componentDidMount () {
    const dialog = ReactDOM.findDOMNode(this);
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

    if (this.props.title) {
      setTimeout(this.show.bind(this), 100);
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.title && !this.props.title) {
      this.close();
    } else if (!prevProps.title && this.props.title) {
      this.show();
    }
  }

  render () {
    return (
      <dialog className='mdl-dialog'>
        <h4 className='mdl-dialog__title'>{this.props.title}</h4>
        <div className='mdl-dialog__content'>
          {this.props.children}
        </div>
        <div className='mdl-dialog__actions'>
          <button type='button' className='mdl-button close' onClick={this.props.reset}>OK</button>
        </div>
      </dialog>
    );
  }
}

export default Modal;
