import { parseISO, isValid, isSameSecond } from 'date-fns';

/**
 * Updates events to set notificationAlerts to true when the notificationDatatime matches the current time.
 * @param {Array} events - Array of events with notificationDatatime and notificationAlerts fields
 * @returns {Array} - Updated array of events
 */

export const updateNotification = events => {
  const updatedEvents = events.map(event => {
    const now = new Date();
    const notificationDatatime = event.notificationDatatime;

    if (notificationDatatime) {
      const notificationDate = parseISO(notificationDatatime);

      if (isValid(notificationDate)) {
        if (isSameSecond(notificationDate, now)) {
          return { ...event, notificationAlerts: true };
        }
      } else {
        console.error('Invalid date format:', notificationDatatime);
      }
    }

    return event;
  });

  return updatedEvents;
};
