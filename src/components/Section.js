import React, { Component, PropTypes } from 'react';

class Section extends Component {

  state = {
    collapsed: true,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      collapsed: this.props.collapsed
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.props.collapsed !== newProps.collapsed) {
      this.setState({
        collapsed: newProps.collapsed
      });
    }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const {title, description, children} = this.props;
    const {collapsed} = this.state;
    return (
      <div>
        <hr />
        <h5 onClick={this.toggleCollapsed} style={{cursor: 'pointer'}}>
          <button className="mdl-button mdl-js-button mdl-button--icon">
          {collapsed ? (
            <i className="material-icons">expand_more</i>
          ) : (
            <i className="material-icons">expand_less</i>
          )}
          </button>
          {title}
        </h5>
        <p>{description}</p>
        {collapsed ? '' : (
          <ul className="mdl-list" style={{marginTop: 0, paddingTop: 0}}>
            {children}
          </ul>
        )}
      </div>
    );
  }

  static propTypes = {
    collapsed: PropTypes.bool,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired
  };

  static defaultProps = {
    collapsed: true,
  };
}

export default Section;
