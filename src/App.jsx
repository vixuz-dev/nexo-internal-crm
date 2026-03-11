import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ClientsList from "./pages/ClientsList";
import ClientDetails from "./pages/ClientDetails";
import Affiliates from "./pages/Affiliates";
import AffiliateDetails from "./pages/AffiliateDetails";
import OrdersList from "./pages/OrdersList";
import OrderDetails from "./pages/OrderDetails";
import InvoicesList from "./pages/InvoicesList";
import InvoicePayments from "./pages/InvoicePayments";
import CobranzaSummary from "./pages/CobranzaSummary";
import Logout from "./pages/Logout";
import { ROUTES } from "./utils/routes";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route
          path={ROUTES.HOMEADMINPANEL}
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.CLIENTS_LIST}
          element={
            <PrivateRoute>
              <ClientsList />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.CLIENTS_DETAILS}
          element={
            <PrivateRoute>
              <ClientDetails />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.AFFILIATES}
          element={
            <PrivateRoute>
              <Affiliates />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.AFFILIATES_DETAILS}
          element={
            <PrivateRoute>
              <AffiliateDetails />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.ORDERS_LIST}
          element={
            <PrivateRoute>
              <OrdersList />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.ORDERS_DETAILS}
          element={
            <PrivateRoute>
              <OrderDetails />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.CONSULTAS_FACTURAS}
          element={
            <PrivateRoute>
              <InvoicesList />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.CONSULTAS_FACTURAS_PAGOS}
          element={
            <PrivateRoute>
              <InvoicePayments />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.CONSULTAS_COBRANZA}
          element={
            <PrivateRoute>
              <CobranzaSummary />
            </PrivateRoute>
          }
        />
        <Route path={ROUTES.LOGOUT} element={<Logout />} />
        <Route path="*" element={<Navigate to={ROUTES.HOMEADMINPANEL} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
