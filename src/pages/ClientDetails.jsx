import React, { useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useClientsList } from "../store/useClientsList";
import { ROUTES } from "../utils/routes";

const ClientDetails = () => {
  const { client_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { clients } = useClientsList();

  // Estrategia híbrida: obtener cliente del state (navegación desde tabla) o del store (recarga/acceso directo)
  const client = useMemo(() => {
    // 1. Intentar obtener del state (cuando navegas desde ClientsTable)
    if (location.state?.client) {
      return location.state.client;
    }

    // 2. Si no está en state, buscar en el store usando el ID de la URL
    const clientId = Number(client_id);
    const foundClient = clients.find((c) => c.client_id === clientId);

    return foundClient || null;
  }, [location.state, client_id, clients]);

  // Si no se encuentra el cliente, mostrar mensaje o redirigir
  if (!client) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-neutral-200 px-4 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8 mt-4">
              <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
                Cliente no encontrado
              </h2>
              <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg mb-4">
                No se pudo encontrar la información del cliente con ID:{" "}
                {client_id}
              </p>
              <button
                onClick={() => navigate(ROUTES.CLIENTS_LIST)}
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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título, nombre, ID y botón de regresar */}
          <div className="mb-6 mt-4 rounded-xl bg-white border border-neutral-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
                  Detalle del cliente
                </h2>
                {/* Nombre e ID del cliente */}
                <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg">
                  {client.name || "Sin nombre"} - ID: {client.client_id}
                </p>
              </div>
              {/* Botón de regresar */}
              <button
                onClick={() => navigate(ROUTES.CLIENTS_LIST)}
                className="flex items-center gap-2 px-4 py-2 border border-highlight-500 rounded-lg text-neutral-700 hover:bg-highlight-100 transition font-poppinsMedium whitespace-nowrap"
                title="Volver al listado de clientes"
              >
                <FiArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Regresar</span>
              </button>
            </div>
          </div>

          {/* Contenido - Se agregará el template más adelante */}
          <div className="rounded-xl bg-white border border-neutral-200 p-6">
            <p className="text-neutral-600 font-poppinsRegular">
              La información del cliente se mostrará aquí.
            </p>
            {/* Debug: mostrar que tenemos los datos del cliente */}
            <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-500 font-poppinsRegular">
                Debug: Cliente obtenido{" "}
                {location.state?.client ? "desde state" : "desde store"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetails;
