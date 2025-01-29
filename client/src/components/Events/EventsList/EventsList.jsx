import React, { Component } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { calculateTimers } from '../../../utils/calculateTimers';
import { updateNotification } from '../../../utils/updateNotification';
import styles from './EventsList.module.sass';

class EventsList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      events: [],
      timers: {},
    };
  }

  componentDidMount () {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    storedEvents.sort(
      (current, next) => new Date(current.datetime) - new Date(next.datetime)
    );
    this.setState({ events: storedEvents });
    this.timerInterval = setInterval(this.updateTimers, 1000);
  }

  componentWillUnmount () {
    clearInterval(this.timerInterval);
  }

  updateTimers = () => {
    const { events } = this.state;
    const currentTimers = calculateTimers(events);
    const updatedEvents = updateNotification(events);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    this.setState({ events: updatedEvents, timers: currentTimers });
  };

  handleDeleteEvent = index => {
    const { events } = this.state;
    const updatedEvents = events.filter((_, i) => i !== index);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    this.setState({ events: updatedEvents });
  };

  handleClearNotification = index => {
    const { events } = this.state;
    const updatedEvents = events.map((event, i) =>
      i === index ? { ...event, notificationAlerts: false } : event
    );
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    this.setState({ events: updatedEvents });
  };

  render () {
    const { events, timers } = this.state;

    return (
      <div className={styles.eventsContainer}>
        <h2 className={styles.listTitle}>Events List</h2>
        {events.length > 0 ? (
          <ul className={styles.listContainer}>
            {events.map((event, index) => (
              <li key={index} className={styles.listItem}>
                <h3 className={styles.listItemTitle}>
                  {event.eventName}
                  {event.notificationAlerts && (
                    <span
                      className={styles.markerContainer}
                      title='Clear notification'
                      onClick={() => this.handleClearNotification(index)}
                    >
                      <span className={styles.marker}></span>
                    </span>
                  )}
                </h3>
                <div className={styles.eventItem}>
                  <span className={styles.timers}>{timers[index]}</span>
                  <IoTrashOutline
                    title='Delete event'
                    className={styles.trash}
                    onClick={() => this.handleDeleteEvent(index)}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.notEvents}>No events created yet.</p>
        )}
      </div>
    );
  }
}

export default EventsList;
