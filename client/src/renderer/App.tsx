import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import LoginScreen from './screens/LoginScreen';
import Loading from './_components/common/loading/Loading';
import Modal from './_components/common/modal/Modal';
import NavigationBar from './_components/common/navbar/NavigationBar';
import { useSelector } from 'react-redux';
import { useQuery, gql } from '@apollo/client';
import {
  modalComponentNameSelector,
  modalStateSelector,
} from './redux/slice/modalSlice';

import React, { useEffect } from 'react';
import PrivateRoute from './_components/common/PrivateRoute/PrivateRoute';
import ConfirmModal from './_components/common/modal/ConfirmModal';
import { selectConfirmModalState } from './redux/slice/confirmModalSlice';
const ExploreScreen = React.lazy(
  () => import('./screens/explore/ExploreScreen')
);
const SentenceWithWordForm = React.lazy(
  () => import('./_components/form/SentenceWithWordForm')
);
const HomeScreen = React.lazy(() => import('./screens/home/HomeScreen'));
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AccountScreen from './screens/account/AccountScreen';
import WordDetailModal from './screens/home/WordDetailModal';
export default function App() {
  const modalOpenState = useSelector(modalStateSelector);
  const modalComponentName = useSelector(modalComponentNameSelector);
  const confirmModalState = useSelector(selectConfirmModalState);
  const confirmModalAction = useSelector(
    (state: any) => state.confirmModal.confirmButtonHandler
  );
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="" element={<HomeScreen />} />
            <Route path="explore" element={<ExploreScreen />} />
            <Route path="account" element={<AccountScreen />} />
          </Route>
        </Routes>

        <NavigationBar />
        {modalOpenState && (
          <Modal>
            {modalComponentName === 'SENTENCE_WITH_WORD' ? (
              <SentenceWithWordForm />
            ) : modalComponentName === 'WORD_DETAIL' ? (
              <WordDetailModal />
            ) : null}
          </Modal>
        )}
        {confirmModalState && (
          <ConfirmModal
            confirmButton={{
              label: 'Confirm',
              action: confirmModalAction
                ? confirmModalAction
                : () => console.log('do nothing hehe'),
            }}
          />
        )}
        <ToastContainer />
      </Router>
    </>
  );
}
