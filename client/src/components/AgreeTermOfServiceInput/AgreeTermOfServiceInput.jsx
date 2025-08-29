import { Field } from 'formik';
import React from 'react';
import styles from './AgreeTermOfServiceInput.module.sass';

const AgreeTermOfServiceInput = ({ id, type, classes, label, ...rest }) => (
  <Field {...rest}>
    {props => {
      const {
        meta: { touched, error },
        field,
      } = props;

      return (
        <div>
          <div className={classes.container}>
            <input {...field} placeholder={label} id={id} type={type} />
            <label htmlFor={id}>
              By clicking this checkbox, you agree to our{' '}
              <a
                className={styles.termsLink}
                href='#'
                target='_blank'
                rel='noreferrer'
              >
                Terms of Service.
              </a>
            </label>
          </div>
          {touched && error && <span className={classes.warning}>{error}</span>}
        </div>
      );
    }}
  </Field>
);

export default AgreeTermOfServiceInput;
