import React, { Component } from 'react';
import classNames from 'classnames';
import { TimerContext } from './TimerProvider';
import styles from './EventsList.module.sass';

class EventsList extends Component {
  static contextType = TimerContext;

  render () {
    const { events, timers, deleteEvent, clearNotification } = this.context;

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
                      onClick={() => clearNotification(index)}
                    >
                      <span className={styles.marker}></span>
                    </span>
                  )}
                </h3>
                <div className={styles.eventItem}>
                  <span className={styles.timers}>{timers[index]}</span>
                  <button
                    title='Delete event'
                    className={classNames(styles.trash, 'far fa-trash-alt')}
                    onClick={() => deleteEvent(index)}
                  ></button>
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
