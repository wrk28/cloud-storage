import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  changeDescriptionModal: false,
  copyLinkModal: false,
  deleteFileModal: false,
  deleteUserRecordModal: false,
  uploadFileModal: false
};

const modalsFeature = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action) => {
      const modalName = action.payload;
      state[modalName] = true;
    },
    hideModal: (state, action) => {
      const modalName = action.payload;
      state[modalName] = false;
    },
  },
});

export const { showModal, hideModal } = modalsFeature.actions;
export default modalsFeature.reducer;