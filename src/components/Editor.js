import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Section from './Section';
import Item from './Item';
import Select from './controls/Select';

import { localPath, basePath, joinPath } from '../system';
import data from '../data.compiled.json';

import 'material-design-lite';

class Editor extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  change = (section, prop) => {
    return value => {
      this.props.onChange({
        ...this.props.settings,
        [section]: {
          ...this.props.settings[section],
          [prop]: value
        }
      });
    };
  };

  componentDidUpdate (prevProps) {
    if (prevProps.settings.__internal.configMode !== this.props.settings.__internal.configMode) {
      window.componentHandler.upgradeDom();
    }
  }

  render () {
    const {settings} = this.props;
    const {configMode, platform} = settings.__internal;
    const base = settings.parity.base_path !== '$BASE' ? settings.parity.base_path : basePath(platform);

    const isOffline = settings.parity.mode === 'offline';
    const isSimple = configMode === 'simple';

    return (
      <div>
        { this.select('__internal', 'platform') }
        { this.select('__internal', 'configMode') }
        <div>
          { this.renderConfig(isSimple, settings, platform, base, isOffline) }
        </div>
      </div>
    );
  }

  renderConfig (simple, settings, platform, base, isOffline) {
    this.configMode = simple ? 'simple' : 'advanced';

    const sections = Object.keys(data)
      .filter(sectionName => sectionName !== '__internal')
      .filter(sectionName => !simple ||
          Object.keys(data[sectionName]).some(propName => {
            const prop = data[sectionName][propName];
            return typeof prop === 'object' && prop.simple;
          })
        )
      .map(sectionName => {
        const section = data[sectionName];

        let sectionCondition = true;
        if ('condition' in section) {
            // eslint-disable-next-line no-eval
          sectionCondition = eval(section.condition);
        }

        let items = Object.keys(section)
            .filter(key => key !== 'section' && key !== 'description' && key !== 'condition')
            .filter(propName => !section[propName].deprecated)
            .filter(propName => !simple || section[propName].simple)
            .map(propName => {
              const prop = section[propName];

              let condition = sectionCondition;
              if ('disable' in section && propName !== 'disable') {
                condition = condition && !settings[sectionName].disable;
              } else if ('enable' in section && propName !== 'enable') {
                condition = condition && settings[sectionName].enable;
              } else if ('enabled' in section && propName !== 'enabled') {
                condition = condition && settings[sectionName].enabled;
              }

              if ('condition' in prop) {
                // eslint-disable-next-line no-eval
                condition = condition && eval(prop.condition);
              }

              let item;
              if (prop.type === 'bool') {
                item = this.flag(sectionName, propName, condition);
              } else if ('values' in prop) {
                if (prop.type === 'string[]') {
                  item = this.multiselect(sectionName, propName, condition);
                } else {
                  item = this.select(sectionName, propName, condition);
                }
              } else if ('suggestions' in prop) {
                item = this.datalist(sectionName, propName, condition);
              } else if (prop.type === 'path') {
                item = this.path(sectionName, propName, base, platform, condition);
              } else if (prop.type === 'string[]') {
                item = this.list(sectionName, propName, condition);
              } else if (prop.type === 'string') {
                item = this.text(sectionName, propName, condition);
              } else if (prop.type === 'number') {
                item = this.number(sectionName, propName, condition);
              }

              return (
                <Fragment key={`${simple}.${sectionName}.${propName}`}>
                  {item}
                </Fragment>
              );
            });

        return (
          <Section key={`${simple}.${section.section}`} title={section.section} description={section.description}>
            { items }
          </Section>
        );
      });

    return (<div>{sections}</div>);
  }

  select (section, prop, isEnabled = true) {
    check(section, prop);

    // TODO [ToDr] hacky
    const {configMode} = this;

    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description[value], value, `${section}.${prop}`);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <Select
          onChange={this.change(section, prop)}
          value={value}
          values={data[section][prop].values.map(val)}
          id={`${configMode}_${prop}`}
          disabled={!isEnabled}
          allowInput={false}
        />
      </Item>
    );
  }

  datalist (section, prop, isEnabled = true) {
    check(section, prop);

    // TODO [ToDr] hacky
    const {configMode} = this;

    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const suggestions = data[section][prop].suggestions.map(val);
    const description = suggestions.some(val => val.value === value)
      ? fillDescription(data[section][prop].description[value], value, `${section}.${prop}`)
      : `Custom ${data[section][prop].name.toLowerCase()}`;

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <Select
          onChange={this.change(section, prop)}
          value={value}
          values={suggestions}
          id={`${configMode}_${prop}`}
          disabled={!isEnabled}
          allowInput
        />
      </Item>
    );
  }

  multiselect (section, prop, isEnabled = true) {
    check(section, prop);

    // TODO [ToDr] hacky
    const {configMode} = this;

    const {settings} = this.props;
    const current = settings[section][prop] || [];
    const description = fillDescription(data[section][prop].description, current);

    const change = (val) => (ev) => {
      const {checked} = ev.target;
      const newValue = [...current];
      const idx = newValue.indexOf(val);

      if (checked) {
        newValue.push(val);
      } else if (idx !== -1) {
        newValue.splice(idx, 1);
      }

      this.change(section, prop)(newValue);
    };

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        large
        >
        {data[section][prop].values.map(val).map(value => {
          const id = `${configMode}_${section}_${prop}_${value.value}`;

          return (
            <label className='mdl-switch mdl-js-switch' htmlFor={id} key={value.name}>
              <input
                type='checkbox'
                id={id}
                className='mdl-switch__input'
                checked={current.indexOf(value.value) !== -1}
                disabled={!isEnabled}
                onChange={change(value.value)}
                />
              <span className='mdl-switch__label'>{value.name}</span>
            </label>
          );
        })}
      </Item>
    );
  }

  number (section, prop, isEnabled = true) {
    check(section, prop);
    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
          <input
            className='mdl-textfield__input'
            type='number'
            value={value || 0}
            onChange={(ev) => this.change(section, prop)(Number(ev.target.value))}
            min={data[section][prop].min}
            max={data[section][prop].max}
            disabled={!isEnabled}
            />
          <span className='mdl-textfield__error'>Please provide a valid number (min: {data[section][prop].min}, max: {data[section][prop].max})</span>
        </div>
      </Item>
    );
  }

  path (section, prop, base, platform, isEnabled = true) {
    return this.text(section, prop, isEnabled, value => {
      if (!value) {
        return value;
      }
      value = value.replace('$LOCAL', localPath(platform));
      value = value.replace('$BASE', base);
      // normalize separators
      value = joinPath(value.split('\\'), platform);
      value = joinPath(value.split('/'), platform);
      return value;
    });
  }

  text (section, prop, isEnabled = true, processValue = x => x) {
    check(section, prop);
    const {settings} = this.props;
    const value = processValue(or(settings[section][prop], data[section][prop].default));
    const description = fillDescription(data[section][prop].description, value);

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
          <input
            className='mdl-textfield__input'
            type='text'
            value={value || ''}
            onChange={(ev) => this.change(section, prop)(ev.target.value)}
            disabled={!isEnabled}
            />
        </div>
      </Item>
    );
  }

  flag (section, prop, isEnabled = true) {
    check(section, prop);

    // TODO [ToDr] hacky
    const {configMode} = this;

    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description, value);
    const id = `${configMode}_${section}_${prop}`;

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <label className='mdl-switch mdl-js-switch' htmlFor={id}>
          <input
            type='checkbox'
            id={id}
            className='mdl-switch__input'
            checked={value}
            disabled={!isEnabled}
            onChange={(ev) => this.change(section, prop)(ev.target.checked)}
            />
          <span className='mdl-switch__label' />
        </label>
      </Item>
    );
  }

  list (section, prop, isEnabled = true) {
    check(section, prop);
    const {settings} = this.props;
    const value = or(settings[section][prop], data[section][prop].default);
    const description = fillDescription(data[section][prop].description, value.toString());

    return (
      <Item
        title={data[section][prop].name}
        description={description}
        disabled={!isEnabled}
        >
        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
          {value.map((v, idx) => (
            <input
              disabled={!isEnabled}
              key={idx}
              className='mdl-textfield__input'
              type='text'
              value={v || ''}
              onChange={(ev) => {
                const newValue = [...value];
                if (ev.target.value !== '') {
                  newValue[idx] = ev.target.value;
                } else {
                  delete newValue[idx];
                }
                this.change(section, prop)(newValue);
              }}
              />
          ))}
          <br />
          <button
            style={{bottom: 0, right: 0, zIndex: 10, transform: 'scale(0.5)'}}
            className='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect'
            onClick={() => this.change(section, prop)(value.concat(['']))}
            disabled={!isEnabled}
            >
            <i className='material-icons'>add</i>
          </button>
        </div>
      </Item>
    );
  }
}

export function fillDescription (description, value, key) {
  if (!description) {
    console.warn(`Cant find description for: value:${value} at ${key}`);
    return 'unknown entry';
  }
  return description.replace(/{}/g, value || '');
}

function or (value, def) {
  if (value === undefined) {
    return def;
  }
  return value;
}

function check (section, prop) {
  if (!data[section][prop]) {
    throw new Error(`Can't find data for ${section}.${prop}`);
  }
}

function val (data) {
  const match = data.match(/(.+)\s+\[(.+)]/);
  if (!match) {
    return { name: data, value: data };
  }

  return {
    name: match[1],
    value: match[2]
  };
}

export default Editor;
