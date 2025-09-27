import { createSlice } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';
import CONSTANTS from '../../constants';
import {
  decorateAsyncThunk,
  fulfilledReducer,
  pendingReducer,
  rejectedReducer,
} from '../../utils/store';

const {
  AUTH_MODE: { REGISTER, LOGIN, LOGOUT },
} = CONSTANTS;

const AUTH_SLICE_NAME = 'auth';

const initialState = {
  isFetching: false,
  error: null,
};

export const checkAuth = decorateAsyncThunk({
  key: `${AUTH_SLICE_NAME}/checkAuth`,
  thunk: async ({ data: authInfo, navigate, authMode }) => {
    switch (authMode) {
      case REGISTER:
        await restController.registerRequest(authInfo);
        navigate('/', { replace: true });
        break;
      case LOGIN:
        await restController.loginRequest(authInfo);
        navigate('/', { replace: true });
        break;
      case LOGOUT:
        await restController.logoutRequest(authInfo);
        navigate('/login', { replace: true });
        break;
      default:
        throw new Error(`Unknown authMode: ${authMode} `);
    }
  },
});

const reducers = {
  clearAuthError: state => {
    state.error = null;
  },
  clearAuth: () => initialState,
};

const extraReducers = builder => {
  builder.addCase(checkAuth.pending, pendingReducer);
  builder.addCase(checkAuth.fulfilled, fulfilledReducer);
  builder.addCase(checkAuth.rejected, rejectedReducer);
};

const authSlice = createSlice({
  name: `${AUTH_SLICE_NAME}`,
  initialState,
  reducers,
  extraReducers,
});

const { actions, reducer } = authSlice;

export const { clearAuthError, clearAuth } = actions;

export default reducer;
