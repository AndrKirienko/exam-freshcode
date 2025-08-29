import { configureStore } from '@reduxjs/toolkit';
import { initSocket } from '../api/ws/socketController';
import rootReducer from './reducer';

const store = configureStore({
  reducer: rootReducer,
});

initSocket(store);

export default store;
