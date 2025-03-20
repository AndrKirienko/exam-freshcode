import { createSlice } from '@reduxjs/toolkit';

const OFFERS_SLICE_NAME = 'offers';

const initialState = {
  offers: [],
  isFetching: false,
  error: null,
};

const offersSlice = createSlice({
  name: OFFERS_SLICE_NAME,
  initialState,
  reducers: {},
});

const { reducer, actions } = offersSlice;

//export const {} = action;

export default reducer;
