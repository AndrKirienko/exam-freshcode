import { createSlice } from '@reduxjs/toolkit';
import * as restController from './../../api/rest/restController';
import CONSTANTS from './../../constants';
import {
  createExtraReducers,
  decorateAsyncThunk,
  pendingReducer,
  rejectedReducer,
} from '../../utils/store';

const {
  PAGINATION_OFFERS: { DEFAULT_PAGE, DEFAULT_RESULTS },
} = CONSTANTS;

const OFFERS_SLICE_NAME = 'offers';

const initialState = {
  offers: [],
  isFetching: false,
  error: null,
  paginate: {
    results: DEFAULT_RESULTS,
    page: DEFAULT_PAGE,
  },
};

export const getOffers = decorateAsyncThunk({
  key: `${OFFERS_SLICE_NAME}/get`,
  thunk: async payload => {
    const {
      data: { data },
    } = await restController.getOffersForModerator(payload);
    return data;
  },
});

const getOffersExtraReducers = createExtraReducers({
  thunk: getOffers,
  pendingReducer,
  fulfilledReducer: (state, { payload }) => {
    state.isFetching = false;
    state.offers = [...payload];
  },
  rejectedReducer,
});

const reducers = {
  setPage: (state, { payload }) => {
    state.paginate.page = payload;
  },
};

const extraReducers = builder => {
  getOffersExtraReducers(builder);
};

const offersSlice = createSlice({
  name: OFFERS_SLICE_NAME,
  initialState,
  reducers,
  extraReducers,
});

const { reducer, actions } = offersSlice;

export const { setPage } = actions;

export default reducer;
