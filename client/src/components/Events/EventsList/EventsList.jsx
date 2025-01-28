import React, { Component } from 'react';
import { calculateTimers } from '../../../utils/calculateTimers';

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

    const sortedEvents = storedEvents.sort((current, next) => {
      const dateCurrent = new Date(current.datetime);
      const dateNext = new Date(next.datetime);
      return dateCurrent - dateNext;
    });

    this.setState({ events: sortedEvents });
    this.timerInterval = setInterval(this.updateTimers, 1000);
  }

  componentWillUnmount () {
    clearInterval(this.timerInterval);
  }

  updateTimers = () => {
    const { events } = this.state;
    const currentTimers = calculateTimers(events);
    this.setState({ timers: currentTimers });
  };

  render () {
    const { events, timers } = this.state;

    return (
      <div>
        <h2>Events List</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                <strong>{event.eventName}</strong> - {event.datetime}
                <span>{timers[index]}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events created yet.</p>
        )}
      </div>
    );
  }
}

export default EventsList;
