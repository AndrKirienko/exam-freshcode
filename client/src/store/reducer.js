import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import bundleReducer from './slices/bundleSlice';
import chatReducer from './slices/chatSlice';
import contestByIdReducer from './slices/contestByIdSlice';
import contestCreationReducer from './slices/contestCreationSlice';
import contestsReducer from './slices/contestsSlice';
import contestUpdationReducer from './slices/contestUpdationSlice';
import dataForContestReducer from './slices/dataForContestSlice';
import offersReducer from './slices/offersSlices';
import paymentReducer from './slices/paymentSlice';
import userProfileReducer from './slices/userProfileSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  userStore: userReducer,
  auth: authReducer,
  dataForContest: dataForContestReducer,
  payment: paymentReducer,
  contestByIdStore: contestByIdReducer,
  contestsList: contestsReducer,
  contestCreationStore: contestCreationReducer,
  bundleStore: bundleReducer,
  contestUpdationStore: contestUpdationReducer,
  chatStore: chatReducer,
  userProfile: userProfileReducer,
  offersStore: offersReducer,
});

export default rootReducer;
