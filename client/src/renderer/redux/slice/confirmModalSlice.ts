import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  content: '',
  confirmButtonHandler: null,
};

const confirmModalScice = createSlice({
  initialState,
  name: 'confirmModal',
  reducers: {
    openConfirmModal: (state, action) => {
      state.isOpen = true;
      state.content = action?.payload?.content;
      state.confirmButtonHandler = action?.payload?.confirmAction;
    },
    closeConfirmModal: (state) => {
      state.isOpen = false;
      state.content = '';
      state.confirmButtonHandler = null;
    },
  },
});

export default confirmModalScice.reducer;
export const selectConfirmModalState = (state: any) =>
  state.confirmModal.isOpen;
export const { closeConfirmModal, openConfirmModal } =
  confirmModalScice.actions;
