import { IoIosTimer } from 'react-icons/io';
/**
 * Calculates the remaining time for an array of events
 * @param {Array} events - Array of events with date and time fields
 * @returns {Object} - Object with event indexes and time remaining
 */

export const calculateTimers = events => {
  const currentTimers = {};

  events.forEach((event, index) => {
    const eventTime = new Date(`${event.datetime}`).getTime();
    const now = Date.now();
    const timeDiff = eventTime - now;

    if (timeDiff > 0) {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      if (days > 0) {
        currentTimers[index] = (
          <>
            <IoIosTimer /> {days}d
          </>
        );
      } else if (hours > 0) {
        currentTimers[index] = (
          <>
            <IoIosTimer />
            {hours}h
          </>
        );
      } else if (minutes > 0) {
        currentTimers[index] = (
          <>
            <IoIosTimer />
            {minutes}m
          </>
        );
      } else {
        currentTimers[index] = (
          <>
            <IoIosTimer />
            {seconds}s
          </>
        );
      }
    } else {
      currentTimers[index] = 'Event has ended';
    }
  });

  return currentTimers;
};
