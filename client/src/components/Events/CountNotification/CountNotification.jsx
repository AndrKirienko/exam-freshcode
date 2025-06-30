import React, { Component } from 'react';
import styles from './CountNotification.module.sass';

class CountNotification extends Component {
  constructor (props) {
    super(props);
    this.state = {
      notificationCount: 0,
    };
  }

  componentDidMount () {
    this.timerInterval = setInterval(this.countNotification, 1000);
  }

  componentWillUnmount () {
    clearInterval(this.timerInterval);
  }

  countNotification = () => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    const count = storedEvents.filter(event => event.notificationAlerts).length;
    this.setState({ notificationCount: count > 0 ? count : 0 });
    this.setState({ notificationCount: count >= 9999 ? 9999 : count });
  };

  render () {
    const { notificationCount } = this.state;

    return notificationCount !== 0 ? (
      <span className={styles.countMarkerContainer}>
        <span className={styles.countMarker}>
          <span>{notificationCount}</span>
        </span>
      </span>
    ) : null;
  }
}

export default CountNotification;
