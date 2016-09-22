import React, { PropTypes } from 'react';

function Section({title, description, children}) {
  return (
    <div>
      <h5>{title}</h5>
      <p>{description}</p>
      <ul className="mdl-list">
        {children}
      </ul>
    </div>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};

export default Section;
