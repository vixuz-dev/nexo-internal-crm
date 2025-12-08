import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeCookie } from '../utils/sessionCookie';
import { ROUTES } from '../utils/routes';

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    removeCookie('accessToken');
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate]);
  return null;
};

export default Logout; 