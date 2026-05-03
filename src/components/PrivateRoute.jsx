import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../utils/sessionCookie";
import { ROUTES } from "../utils/routes";

const PrivateRoute = ({ children }) => {
  const token = getCookie("accessToken");

  console.log("token-private", token);
  
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
