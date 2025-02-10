import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './Events.module.sass';
import EventsForm from './EventsForm/EventsForm';
import EventsList from './EventsList/EventsList';
class Events extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isCreate: false,
    };
  }

  toggleCreate = () => {
    this.setState(prevState => ({
      isCreate: !prevState.isCreate,
    }));
  };
  render () {
    return (
      <div className={styles.eventsContainer}>
        <button
          onClick={this.toggleCreate}
          className={classNames(
            styles.toggleEventBtn,
            this.state.isCreate ? 'fa-solid fa-arrow-left' : 'far fa-edit'
          )}
          title={
            this.state.isCreate ? 'Return to the events' : 'Create an event'
          }
        ></button>
        {this.state.isCreate ? <EventsForm /> : <EventsList />}
      </div>
    );
  }
}

export default Events;
