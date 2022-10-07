import { applyMiddleware, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import SagaMiddleware from 'redux-saga';
import RootSaga from '../saga/RootSaga';
import modalReducer from '../slice/modalSlice';
import authReducer from '../slice/authSlice';
import confirmModal from '../slice/confirmModalSlice';

const rootReducer = combineReducers({
  modal: modalReducer,
  auth: authReducer,
  confirmModal: confirmModal,
});

const sagaMiddleware = SagaMiddleware();
const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware],
});
sagaMiddleware.run(RootSaga);
export default store;
