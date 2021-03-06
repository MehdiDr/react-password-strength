// @flow

import * as React from 'react';
import zxcvbn from 'zxcvbn';

import FormField, { type Props } from './FormField';

type State = {
  password: string,
  strength: number,
  value: string,
};

export default class PasswordField extends React.Component {
  state: State;
  state = {
    password: '',
    strength: 0,
  };

  componentWillMount() {
    const { minStrength = 3, thresholdLength = 7 } = this.props;
    this.minStrength = typeof minStrength === 'number'
      ? Math.max(Math.min(minStrength, 4), 0) : 3;

    this.thresholdLength = typeof thresholdLength === 'number'
      ? Math.max(thresholdLength, 7) : 7;
  }

  props: Props;
  minStrength: number;
  thresholdLength: number;

  stateChanged = (state: State) => {
    this.setState({
      password: state.value,
      strength: zxcvbn(state.value).score,
    }, () => this.props.onStateChanged(state));
  };

  validatePasswordStrong = (value: string) => {
    if (value.length <= this.thresholdLength) throw new Error('Le mot de passe est trop court !');
    if (zxcvbn(value).score < this.minStrength) throw new Error('Le mot de passe est faible comme toi !');
  };

  render() {
    const {
      type,
      validator,
      onStateChanged,
      children,
      ...restProps
    } = this.props;
    const { password, strength } = this.state;

    const passwordLength = password.length;
    const passwordStrong = strength >= this.minStrength;
    const passwordLong = passwordLength > this.thresholdLength;

    // eslint-disable-next-line no-nested-ternary
    const counterClass = ['badge badge-pill', passwordLong ?
      passwordStrong ? 'badge-success' : 'badge-warning'
      : 'badge-danger'].join(' ').trim();
    const strengthClass = ['strength-meter mt-2', passwordLength > 0 ? 'visible' : 'invisible'].join(' ').trim();

    return (
      <React.Fragment>
        <div className="position-relative">
          <FormField
            type="password"
            validator={this.validatePasswordStrong}
            onStateChanged={this.stateChanged}
            {...restProps}
          >
            <span className="d-block form-hint"> Parce que les hackers c&quotest des connards, il faut un bon mot de passe. Donc 7 caracteres minimum (et evitez les qwertyuiop pls).</span>
            {children}
            <div className={strengthClass}>
              <div className="strength-meter-fill" data-strength={strength} />
            </div>
          </FormField>
          <div className="position-absolute password-count mx-3">
            {/* eslint-disable-next-line no-nested-ternary */}
            <span className={counterClass}> { passwordLength ? passwordLong ? `${this.thresholdLength}+` : passwordLength : '' } </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
