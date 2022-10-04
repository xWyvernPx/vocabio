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
const ExploreScreen = React.lazy(
  () => import('./screens/explore/ExploreScreen')
);
const SentenceWithWordForm = React.lazy(
  () => import('./_components/form/SentenceWithWordForm')
);
const HomeScreen = React.lazy(() => import('./screens/home/HomeScreen'));
const GET_LOCATION = gql`
  query getLocation {
    locations {
      id
      name
      description

      photo
    }
  }
`;
export default function App() {
  const modalOpenState = useSelector(modalStateSelector);
  const modalComponentName = useSelector(modalComponentNameSelector);
  const { loading, error, data } = useQuery(GET_LOCATION);
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/explore" element={<ExploreScreen />} />
          <Route path="/account" element={<HomeScreen />} />
        </Routes>
        {modalOpenState && (
          <Modal>
            {modalComponentName === 'SENTENCE_WITH_WORD' ? (
              <SentenceWithWordForm />
            ) : null}
          </Modal>
        )}
        <NavigationBar />
      </Router>
    </>
  );
}
