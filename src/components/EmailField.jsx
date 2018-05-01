import React from 'react';
import { validate } from 'isemail';

import FormField, { type Props } from './FormField';

const EmailField = (props: Props) => {
  const { type, validator, ...restProps } = props;
  const validateEmail = (value) => {
    if (!validate(value)) throw new Error('Email is invalid');
  };

  return <FormField type="text" validator={validateEmail} {...restProps} />;
};

export default EmailField;
