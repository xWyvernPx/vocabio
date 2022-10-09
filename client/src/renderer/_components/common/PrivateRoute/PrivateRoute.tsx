import React from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { openModal } from 'renderer/redux/slice/modalSlice';
import LoginScreen from 'renderer/screens/LoginScreen';
import useAuth from 'renderer/_hooks/useAuth';

type Props = {};

const PrivateRoute = (props: Props) => {
  const { user } = useAuth();
  if (user) return <Outlet />;
  else {
    return <LoginScreen />;
  }
  //   if (!isLoaded) return <Loading />;
  //   else if (user) return <Outlet />;
  //   else {
  //     setModalState({ isOpen: true, componentName: 'LOGIN', payload: null });
  //     return <Navigate to={'/'} />;
  //   }
};

export default PrivateRoute;
