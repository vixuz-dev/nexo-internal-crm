import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
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
import AffiliateFinancialSummary from "./pages/AffiliateFinancialSummary";
import Logout from "./pages/Logout";
import NotFoundPage from "./pages/NotFoundPage";
import { ROUTES } from "./utils/routes";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.LOGIN_ROOT} element={<LoginPage />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path={ROUTES.HOMEADMINPANEL} element={<AdminDashboard />} />
          <Route path={ROUTES.CLIENTS_LIST} element={<ClientsList />} />
          <Route path={ROUTES.CLIENTS_DETAILS} element={<ClientDetails />} />
          <Route path={ROUTES.AFFILIATES} element={<Affiliates />} />
          <Route
            path={ROUTES.AFFILIATES_DETAILS}
            element={<AffiliateDetails />}
          />
          <Route path={ROUTES.ORDERS_LIST} element={<OrdersList />} />
          <Route path={ROUTES.ORDERS_DETAILS} element={<OrderDetails />} />
          <Route path={ROUTES.CONSULTAS_FACTURAS} element={<InvoicesList />} />
          <Route
            path={ROUTES.CONSULTAS_RESUMEN_FINANCIERO}
            element={<AffiliateFinancialSummary />}
          />
          <Route
            path={ROUTES.CONSULTAS_FACTURAS_PAGOS}
            element={<InvoicePayments />}
          />
          <Route
            path={ROUTES.CONSULTAS_COBRANZA}
            element={<CobranzaSummary />}
          />
        </Route>
        <Route path={ROUTES.LOGOUT} element={<Logout />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
