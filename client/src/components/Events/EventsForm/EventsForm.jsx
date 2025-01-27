import React, { Component } from 'react';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import Schems from './../../../utils/validators/validationSchems';
import styles from './EventsForm.module.sass';

const initialValues = {
  eventName: '',
  date: '',
  time: '',
  notificationTime: '',
};
class EventsForm extends Component {
  clicked = (values, { resetForm }) => {
    console.log(values);
    resetForm();
    window.location.reload();
  };
  render () {
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
                  <Field
                    name='eventName'
                    type='text'
                    className={styles.input}
                  />
                  <ErrorMessage
                    name='eventName'
                    component='div'
                    className={styles.error}
                  />
                </div>

                <div className={styles.inputContainer}>
                  <label className={styles.titleInput} htmlFor='date'>
                    Date
                  </label>
                  <Field name='date' type='date' className={styles.input} />
                  <ErrorMessage
                    name='date'
                    component='div'
                    className={styles.error}
                  />
                </div>

                <div className={styles.inputContainer}>
                  <label className={styles.titleInput} htmlFor='time'>
                    Time
                  </label>
                  <Field name='time' type='time' className={styles.input} />
                  <ErrorMessage
                    name='time'
                    component='div'
                    className={styles.error}
                  />
                </div>

                <div className={styles.inputContainer}>
                  <label
                    className={styles.titleInput}
                    htmlFor='notificationTime'
                  >
                    How much time to notify (minutes)
                  </label>
                  <Field
                    name='notificationTime'
                    type='number'
                    className={styles.input}
                  />
                  <ErrorMessage
                    name='notificationTime'
                    component='div'
                    className={styles.error}
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
