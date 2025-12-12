import React, { useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useOrdersList } from "../store/useOrdersList";
import { ROUTES } from "../utils/routes";

const OrderDetails = () => {
  const { id_order } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrdersList();

  // Estrategia híbrida: obtener pedido del state (navegación desde tabla) o del store (recarga/acceso directo)
  const order = useMemo(() => {
    // 1. Intentar obtener del state (cuando navegas desde OrdersTable)
    if (location.state?.order) {
      return location.state.order;
    }

    // 2. Si no está en state, buscar en el store usando el ID de la URL
    const orderId = Number(id_order);
    const foundOrder = orders.find((o) => o.id === orderId);

    return foundOrder || null;
  }, [location.state, id_order, orders]);

  // Si no se encuentra el pedido, mostrar mensaje o redirigir
  if (!order) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-neutral-200 px-4 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8 mt-4">
              <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
                Pedido no encontrado
              </h2>
              <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg mb-4">
                No se pudo encontrar la información del pedido con ID:{" "}
                {id_order}
              </p>
              <button
                onClick={() => navigate(ROUTES.ORDERS_LIST)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-poppinsMedium"
              >
                Volver al listado
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título, folio, cliente y botón de regresar */}
          <div className="mb-6 mt-4 rounded-xl bg-white border border-neutral-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
                  Detalle del pedido
                </h2>
                {/* Folio, Cliente e ID del pedido */}
                <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg">
                  Folio: {order.folio || "Sin folio"} - Cliente:{" "}
                  {order.name || "Sin nombre"} - ID: {order.id}
                </p>
              </div>
              {/* Botón de regresar */}
              <button
                onClick={() => navigate(ROUTES.ORDERS_LIST)}
                className="flex items-center gap-2 px-4 py-2 border border-highlight-500 rounded-lg text-neutral-700 hover:bg-highlight-100 transition font-poppinsMedium whitespace-nowrap"
                title="Volver al listado de pedidos"
              >
                <FiArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Regresar</span>
              </button>
            </div>
          </div>

          {/* Contenido - Se agregará el template más adelante */}
          <div className="rounded-xl bg-white border border-neutral-200 p-6">
            <p className="text-neutral-600 font-poppinsRegular">
              La información del pedido se mostrará aquí.
            </p>
            {/* Debug: mostrar que tenemos los datos del pedido */}
            <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-500 font-poppinsRegular">
                Debug: Pedido obtenido{" "}
                {location.state?.order ? "desde state" : "desde store"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetails;

