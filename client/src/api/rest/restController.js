import { stringify } from 'query-string';
import http from '../interceptor';

export const registerRequest = data => http.post('registration', data);
export const loginRequest = data => http.post('login', data);

export const getUser = () => http.post('getUser');
export const updateUser = data => http.post('updateUser', data);

export const updateContest = data =>
  http.patch(`contests/${data.get('contestId')}`, data);
export const getCustomersContests = data =>
  http.get(`contests/byCustomer?${stringify(data)}`);
export const getActiveContests = data =>
  http.get(`contests?${stringify(data)}`);
export const getContestById = ({ contestId }) =>
  http.get(`contests/${contestId}`);
export const payMent = data => http.post('contests', data.formData);
export const dataForContest = data => http.post('dataForContest', data);

export const addChatToCatalog = data => http.post('catalogs/chats', data);
export const removeChatFromCatalog = ({ catalogId, chatId }) =>
  http.delete(`catalogs/chats/${catalogId}/${chatId}`);
export const getCatalogList = data => http.get('catalogs', data);
export const createCatalog = data => http.post('catalogs', data);
export const deleteCatalog = ({ catalogId }) =>
  http.delete(`catalogs/${catalogId}`);
export const changeCatalogName = ({ catalogId, catalogName }) =>
  http.patch(`catalogs/${catalogId}`, { catalogName });

export const setNewOffer = data => http.post('offers/setNewOffer', data);
export const setOfferStatus = data => http.post('offers/setOfferStatus', data);
export const getOffersForModerator = data =>
  http.get(`offers?${stringify(data)}`);
export const setOfferModeratorStatus = ({ offerId, moderatorStatus }) =>
  http.patch(`offers/${offerId}`, { moderatorStatus });

export const downloadContestFile = data =>
  http.get(`downloadFile/${data.fileName}`);

export const changeMark = data => http.post('changeMark', data);

export const cashOut = data => http.post('cashout', data);

export const getDialog = data => http.get(`chats/${data}`);
export const newMessage = data => http.post('chats/newMessage', data);
export const getPreviewChat = () => http.get('chats/getPreview');
export const changeChatBlock = data => http.patch('chats/blackList', data);
export const changeChatFavorite = data =>
  http.patch('chats/favoriteList', data);
// export const changeChatBlock = data => http.post('blackList', data);
// export const getPreviewChat = () => http.post('getPreview');
// export const newMessage = data => http.post('newMessage', data);
// export const getDialog = data => http.post('getChat', data);
//export const changeChatFavorite = data => http.post('favorite', data);
