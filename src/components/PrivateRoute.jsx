import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from '../utils/sessionCookie';
import { ROUTES } from '../utils/routes';

const PrivateRoute = ({ children }) => {
  const token = getCookie('accessToken');
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
};

export default PrivateRoute; 