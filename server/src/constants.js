const path = require('path');

const STATIC_FOLDER = path.resolve(process.env.STATIC_FOLDER);

module.exports = {
  SALT_ROUNDS: 5,
  SQUADHELP_BANK_NUMBER: '4564654564564564',
  SQUADHELP_BANK_NAME: 'SquadHelp',
  SQUADHELP_BANK_CVC: '453',
  SQUADHELP_BANK_EXPIRY: '11/26',
  ROLE: {
    CUSTOMER: 'customer',
    CREATOR: 'creator',
    MODERATOR: 'moderator',
  },
  CREATOR_ENTRIES: 'creator_entries',
  CONTEST_STATUS_ACTIVE: 'active',
  CONTEST_STATUS_FINISHED: 'finished',
  CONTEST_STATUS_PENDING: 'pending',
  CONTESTS_DEFAULT_DIR: 'public/contestFiles/',
  NAME_CONTEST: 'name',
  LOGO_CONTEST: 'logo',
  TAGLINE_CONTEST: 'tagline',
  OFFER_STATUS_PENDING: 'pending',
  OFFER_STATUS_REJECTED: 'rejected',
  OFFER_STATUS_WON: 'won',
  STATIC_PATH: path.resolve(STATIC_FOLDER),
  SOCKET_CONNECTION: 'connection',
  SOCKET_SUBSCRIBE: 'subscribe',
  SOCKET_UNSUBSCRIBE: 'unsubscribe',
  NOTIFICATION_ENTRY_CREATED: 'onEntryCreated',
  NOTIFICATION_CHANGE_MARK: 'changeMark',
  NOTIFICATION_CHANGE_OFFER_STATUS: 'changeOfferStatus',
  NEW_MESSAGE: 'newMessage',
  CHANGE_BLOCK_STATUS: 'CHANGE_BLOCK_STATUS',
  PAGINATION_OFFERS: {
    DEFAULT_PAGE: 1,
    DEFAULT_RESULTS: 14,
    DEFAULT_MAX_RESULTS: 50,
  },
  OFFER_MODERATOR_STATUS: {
    REJECT: 'reject',
    RESOLVE: 'resolve',
    PENDING: 'pending',
  },
};
