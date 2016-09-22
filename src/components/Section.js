import React, { PropTypes } from 'react';

function Section({title, description, children}) {
  return (
    <div>
      <hr />
      <h5>{title}</h5>
      <p>{description}</p>
      <ul className="mdl-list" style={{marginTop: 0, paddingTop: 0}}>
        {children}
      </ul>
    </div>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired
};

export default Section;
