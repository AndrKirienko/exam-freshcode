import classNames from 'classnames';
import { ErrorMessage, Field } from 'formik';
import React from 'react';

const FormInput = ({ classes, label, name, ...rest }) => (
  <Field name={name}>
    {props => {
      const {
        field,
        meta: { touched, error },
      } = props;

      const inputClassName = classNames(classes.input, {
        [classes.notValid]: touched && error,
        [classes.valid]: touched && !error,
      });
      return (
        <div className={classes.container}>
          <input
            type='text'
            {...field}
            placeholder={label}
            className={inputClassName}
            {...rest}
          />
          <ErrorMessage
            name={name}
            component='span'
            className={classes.warning}
          />
        </div>
      );
    }}
  </Field>
);

export default FormInput;
