import React, { PropTypes } from 'react';

function Item({title, description, children}) {
  return (
    <li className="mdl-list__item mdl-list__item--two-line" style={{overflow: 'visible'}}>
      <span className="mdl-list__item-primary-content">
        <span>{title}</span>
        <span className="mdl-list__item-sub-title">
          {description}
        </span>
      </span>
      <span className="mdl-list__item-secondary-content">
        {children}
      </span>
    </li>
  );
}

Item.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.element.isRequired
};

export default Item;
