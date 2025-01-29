import React, { createContext, Component } from 'react';
import { calculateTimers } from '../../../utils/calculateTimers';
import { updateNotification } from '../../../utils/updateNotification';

export const TimerContext = createContext();

export class TimerProvider extends Component {
  constructor (props) {
    super(props);
    this.state = {
      timers: {},
      events: [],
    };
  }

  componentDidMount () {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    storedEvents.sort(
      (current, next) => new Date(current.datetime) - new Date(next.datetime)
    );
    this.setState({ events: storedEvents });

    this.timerInterval = setInterval(() => {
      this.updateTimers();
    }, 1000);
  }

  componentWillUnmount () {
    clearInterval(this.timerInterval);
    this.clearAllData();
  }
  clearAllData = () => {
    localStorage.clear();
    this.setState({ events: [], timers: {} });
  };

  updateTimers = () => {
    const { events } = this.state;
    const currentTimers = calculateTimers(events);
    const updatedEvents = updateNotification(events);

    localStorage.setItem('events', JSON.stringify(updatedEvents));
    this.setState({ events: updatedEvents, timers: currentTimers });
  };

  deleteEvent = index => {
    const { events } = this.state;
    const updatedEvents = events.filter((_, i) => i !== index);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    this.setState({ events: updatedEvents });
  };

  clearNotification = index => {
    const { events } = this.state;
    const updatedEvents = events.map((event, i) =>
      i === index ? { ...event, notificationAlerts: false } : event
    );
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    this.setState({ events: updatedEvents });
  };

  render () {
    return (
      <TimerContext.Provider
        value={{
          timers: this.state.timers,
          events: this.state.events,
          deleteEvent: this.deleteEvent,
          clearNotification: this.clearNotification,
          clearAllData: this.clearAllData,
        }}
      >
        {this.props.children}
      </TimerContext.Provider>
    );
  }
}
