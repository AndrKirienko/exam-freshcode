import React, { Component } from 'react';
import { Form, Formik } from 'formik';
import Schems from './../../../utils/validators/validationSchems';
import styles from './EventsForm.module.sass';
import FormInput from '../../FormInput/FormInput';

class EventsForm extends Component {
  clicked = (values, { resetForm }) => {
    console.log(values);
    resetForm();
    window.location.reload();
  };

  render () {
    const initialValues = {
      eventName: '',
      date: '',
      time: '',
      notificationTime: '',
    };

    const formInputClasses = {
      warning: styles.fieldWarning,
      input: styles.input,
      notValid: styles.notValid,
    };

    return (
      <div className={styles.formContainer}>
        <h2 className={styles.titleForm}>Create an event</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={Schems.EventSchema}
          onSubmit={this.clicked}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className={styles.inputGroup}>
                <div className={styles.inputContainer}>
                  <label className={styles.titleInput} htmlFor='eventName'>
                    Title of event
                  </label>
                  <FormInput
                    name='eventName'
                    type='text'
                    classes={formInputClasses}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <label className={styles.titleInput} htmlFor='date'>
                    Date
                  </label>
                  <FormInput
                    name='date'
                    type='date'
                    classes={formInputClasses}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <label className={styles.titleInput} htmlFor='time'>
                    Time
                  </label>
                  <FormInput
                    name='time'
                    type='time'
                    classes={formInputClasses}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <label
                    className={styles.titleInput}
                    htmlFor='notificationTime'
                  >
                    How much time to notify (minutes)
                  </label>
                  <FormInput
                    name='notificationTime'
                    type='number'
                    classes={formInputClasses}
                  />
                </div>
              </div>
              <button
                type='submit'
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                Create
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
export default EventsForm;
