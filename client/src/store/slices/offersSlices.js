import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as restController from './../../api/rest/restController';

const OFFERS_SLICE_NAME = 'offers';

const initialState = {
  offers: [],
  isFetching: false,
  error: null,
};

export const getOffersThunk = createAsyncThunk(
  `${OFFERS_SLICE_NAME}/get`,
  async (payload, { rejectWithValue }) => {
    try {
      const {
        data: { data },
      } = await restController.getOffersForModerator();
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const offersSlice = createSlice({
  name: OFFERS_SLICE_NAME,
  initialState,
  reducers: {},
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

//export const {} = action;

export default reducer;
