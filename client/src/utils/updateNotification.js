import { parseISO, isValid, isSameSecond } from 'date-fns';
import Swal from 'sweetalert2';

/**
 * Displays a pop-up notification for an event
 * @param {string} message - Notification text
 * @param {string} url - Link to click on
 */

const showToast = (message, url) => {
  Swal.fire({
    toast: true,
    position: 'bottom-end',
    showCloseButton: true,
    showConfirmButton: false,
    timer: 10000,
    html: `
      <div style="
        font-size: 16px;
        cursor: pointer;
      ">
        ${message}
      </div>
    `,
    didOpen: toast => {
      toast.addEventListener('click', () => {
        window.location.href = url;
      });
    },
  });
};

/**
 * Updates events to set notificationAlerts to true when the notificationDatetime matches the current time.
 * @param {Array} events - Array of events with notificationDatetime and notificationAlerts fields
 * @returns {Array} - Updated array of events
 */

export const updateNotification = events => {
  const now = new Date();

  return events.map(event => {
    const { notificationDatetime, datetime, eventName } = event;

    const showEventToast = msg => {
      showToast(
        `${msg} <span style="font-weight: bold;">"${eventName}"</span>`,
        'http://localhost:5000/events'
      );
    };

    if (notificationDatetime) {
      const notificationDate = parseISO(notificationDatetime);

      if (isValid(notificationDate) && isSameSecond(notificationDate, now)) {
        showEventToast('Reminder about the event:');
        return { ...event, notificationAlerts: true };
      }
    }

    if (datetime) {
      const endDate = parseISO(datetime);

      if (isValid(endDate) && isSameSecond(endDate, now)) {
        showEventToast('The event has finished:');
        return { ...event, notificationAlerts: true };
      }
    }

    return event;
  });
};
