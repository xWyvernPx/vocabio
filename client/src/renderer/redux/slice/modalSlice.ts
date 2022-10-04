import { createSlice } from '@reduxjs/toolkit';
interface ModalState {
  isOpen: boolean;
  componentName: string;
  payload: any;
}

const initialState = {
  isOpen: false,
  componentName: '',
  payload: null,
};
const modalSlice = createSlice({
  initialState,
  name: 'modal',
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.componentName = action.payload?.componentName;
      state.payload = action.payload?.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export default modalSlice.reducer;
export const { closeModal, openModal } = modalSlice.actions;

export const modalStateSelector = (state: any) => state.modal.isOpen;
export const modalComponentNameSelector = (state: any) =>
  state.modal.componentName;
