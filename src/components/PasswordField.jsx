// @flow

import * as React from 'react';
import zxcvbn from 'zxcvbn';

import FormField, { type Props } from './FormField';

type State = {
  password: string,
  strength: number,
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

    this.tresholdLength = typeof thresholdLength === 'number'
      ? Math.max(thresholdLength, 7) : 7;
  }
  props: Props;

  stateChanged = (state: State) => {
    this.setState({
      password: state.value,
      strength: zxcvbn(state.value).score,
    }, () => this.props.onStateChanged(state));
  };

  validatePasswordStrong = (value: string) => {
    if (value.length <= this.thresholdLength) throw new Error('Password is short');
    if (zxcvbn(value).score < this.minStrength) throw new Error('Password is weak');
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

    const counterClass = ['badge badge-pill', passwordLong ? 
      passwordStrong ? 'badge-success' : 'badge-warning' 
      : 'badge-danger'].join(' ').trim();
    const strengthClass = ['strength-meter mt-2', passwordLength > 0 ? 'visible' : 'invisible'].join(' ').trim();

    return (
      <React.Fragment>
        <div className="positive-relative">
          <FormField
            type="password"
            validator={this.validatePasswordStrong}
            onStateChanged={this.stateChanged}
            {...restProps} 
          >
            <span className="d-block from-hint"> Parce que les hackers c'est des connards, il faut un bon mot de passe. Donc 7 caracteres minimum (et evitez les qwertyuiop pls).</span>
            {children}
            <div className={strengthClass}>
              <div className="strength-meter-fill" data-strength={strength} />
            </div>
          </FormField>
          <div className="position-absolute password-count mx-3">
            <span className={counterClass}> {passwordLength ? passwordLong ? `${this.thresholdLength}+` : passwordLength : '' } </span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
