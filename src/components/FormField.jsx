// @flow
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */

import * as React from 'react';

type State = {
  value: string,
  dirty: boolean,
  errors: Array<string>
};

export type Props = {
  type?: "text" | "password",
  label: string,
  fieldId: string,
  placeholder: string,
  value?: string,
  minStrength?: number;
  thresholdLength?: number;
  required: boolean,
  children?: React.Node,
  validator?: Function,
  onStateChanged: Function,
};

export default class FormField extends React.Component {
  state: State = {
    value: '',
    dirty: false,
    errors: [],
  }

  props: Props;
  hasChanged = (e: any) => {
    e.preventDefault();

    const {
      label,
      required = false,
      validator = (f: string) => f,
      onStateChanged = (f: Object) => f,
    } = this.props;

    const value: string = e.target.value;
    const isEmpty = value.length === 0;
    const requiredMissing = this.state.dirty && required && isEmpty;
    let errors = [];

    if (requiredMissing) {
      errors = [...errors, `${label} is required`];
    } else if (typeof validator === 'function') {
      try {
        validator(value);
      } catch (err) {
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
    // eslint-disable-next-line no-nested-ternary
    const controlClass = ['form-control', dirty ?
      hasErrors ? 'is-invalid' : 'is-valid'
      : ''].join(' ').trim();

    return (
      <React.Fragment>
        <div className="form-group px-3 pb-2">
          <div className="d-flex flex-row justify-content-between align-items-center">
            <label htmlFor={fieldId} className="control-label">{label}
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
            </label>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

