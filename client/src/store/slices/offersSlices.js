import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as restController from './../../api/rest/restController';
import CONSTANTS from './../../constants';

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

export const getOffersThunk = createAsyncThunk(
  `${OFFERS_SLICE_NAME}/get`,
  async (payload, { rejectWithValue }) => {
    try {
      const {
        data: { data },
      } = await restController.getOffersForModerator(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const offersSlice = createSlice({
  name: OFFERS_SLICE_NAME,
  initialState,
  reducers: {
    setPage: (state, { payload }) => {
      state.paginate.page = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getOffersThunk.pending, state => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(getOffersThunk.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.offers = [...payload];
    });
    builder.addCase(getOffersThunk.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.error = payload;
    });
  },
});

const { reducer, actions } = offersSlice;

export const { setPage } = actions;

export default reducer;
