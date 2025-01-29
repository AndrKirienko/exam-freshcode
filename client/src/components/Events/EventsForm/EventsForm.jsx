import React, { Component } from 'react';
import { Form, Formik } from 'formik';
import Schems from './../../../utils/validators/validationSchems';
import styles from './EventsForm.module.sass';
import FormInput from '../../FormInput/FormInput';

class EventsForm extends Component {
  clicked = (values, { resetForm }) => {
    const existingEvents = JSON.parse(localStorage.getItem('events')) || [];
    const updatedEvents = [...existingEvents, values];
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    console.log(values);
    resetForm();
    window.location.reload();
  };

  render () {
    const initialValues = {
      eventName: '',
      datetime: '',
      notificationDatatime: '',
      notificationAlerts: false,
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
                  <div className={styles.inputErrorContainer}>
                    <FormInput
                      name='eventName'
                      type='text'
                      classes={formInputClasses}
                    />
                  </div>
                </div>
                <div className={styles.inputContainer}>
                  <label className={styles.titleInput} htmlFor='date'>
                    Date & Time
                  </label>
                  <div className={styles.inputErrorContainer}>
                    <FormInput
                      name='datetime'
                      type='datetime-local'
                      classes={formInputClasses}
                    />
                  </div>
                </div>
                <div className={styles.inputContainer}>
                  <label
                    className={styles.titleInput}
                    htmlFor='notificationTime'
                  >
                    When to give notice of the end of the event
                  </label>
                  <div className={styles.inputErrorContainer}>
                    <FormInput
                      name='notificationDatatime'
                      type='datetime-local'
                      classes={formInputClasses}
                    />
                  </div>
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
