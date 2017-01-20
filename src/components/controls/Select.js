import React, { PropTypes } from 'react';

function Select ({value, onChange, values, id, disabled}) {
  const selected = values.find(val => val.value === value) || {};

  const list = disabled ? [] : (
    <ul className='mdl-menu mdl-menu--bottom-left mdl-js-menu' htmlFor={id}>
      {
        values.map(({name, value}) => (
          <li className='mdl-menu__item' data-val={value} key={value} onClick={() => onChange(value)}>{name}</li>
        ))
      }
    </ul>
  );

  return (
    <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select'>
      <input className='mdl-textfield__input'
        disabled={disabled}
        value={selected.name} type='text' id={id}
        readOnly tabIndex='-1' data-val={selected.value}
        />
      {list}
    </div>
  );
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
  disabled: PropTypes.bool
};

Select.defaultPropTypes = {
  disabled: false
};

export default Select;
