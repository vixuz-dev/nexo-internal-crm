import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../utils/sessionCookie";
import { ROUTES } from "../utils/routes";

export default function PublicRoute({ children }) {
  const token = getCookie("accessToken");

  if (token) {
    return <Navigate to={ROUTES.HOMEADMINPANEL} replace />;
  }

  return children ? children : <Outlet />;
}
