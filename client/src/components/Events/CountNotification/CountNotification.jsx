import React, { Component } from 'react';
import styles from './CountNotification.module.sass';

class CountNotification extends Component {
  countNotification = () => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    const count = storedEvents.filter(event => event.notificationAlerts).length;

    return count > 0 ? count : null;
  };
  render () {
    const notificationCount = this.countNotification();

    return notificationCount !== null ? (
      <span className={styles.countMarkerContainer}>
        <span className={styles.countMarker}>
          <span>{this.countNotification()}</span>
        </span>
      </span>
    ) : null;
  }
}
export default CountNotification;
