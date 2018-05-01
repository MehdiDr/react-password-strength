// @flow

import * as React from 'react';

type State = {
  value: string,
  dirty: boolean,
  errors: Array<string>
};

export type Props = {
  type: "text" | "password",
  label: string,
  fieldId: string,
  placeholder: string,
  children?: React.Node,
  required: boolean,
  validator: Function,
  onStateChanged: Function,
  minStrength?: number,
  thresholdLength?: number,
};

export default class FormField extends React.Component {
  state: State = {
    value: '',
    dirty: false,
    errors: [],
  }

  props: Props;
  hasChanged = (e) => {
    e.preventDefault();

    const {
      label,
      required = false,
      validator = (f: Function) => f,
      onStateChanged = (f: Object) => f,
    } = this.props;
    const value = e.target.value;
    const isEmpty = value.length === 0;
    const requiredMissing = this.state.dirty && required && isEmpty;
    let errors = [];

    if (requiredMissing) {
      errors = [...errors, `${label} is required`];
    } else if (typeof validator === 'function') {
      try {
        validator(value);
      } catch (e) {
        errors = [...errors, e.message];
      }
    }

    this.setState(
      ({ dirty = false }) => ({
        value,
        errors,
        dirty: !dirty || dirty,
      }),
      () => onStateChanged(this.state),
    );
  }
  render() {
    const { value, dirty, errors } = this.state;
    const {
      type,
      label,
      fieldId,
      placeholder,
      children,
    } = this.props;

    const hasErrors = errors.length > 0;
    const controlClass = ['form-control', dirty ?
      hasErrors ? 'is-invalid' : 'is-valid'
      : ''].join(' ').trim();

    return (
      <React.Fragment>
        <div className="form-group px-3 pb-2">
          <div className="d-flex flex-row justify-content-between align-items-center">
            <label htmlFor={fieldId} className="control-label">{label}</label>
            {
              hasErrors &&
              <div className="error form-hint font-weight-bold text-right m-0 mb-2">
                { errors[0] }
              </div>
            }
            { children }
            <input
              type={type}
              className={controlClass}
              id={fieldId}
              placeholder={placeholder}
              value={value}
              onChange={this.hasChanged}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

