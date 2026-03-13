import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiUser, 
  FiPhone, 
  FiCalendar, 
  FiMapPin, 
  FiHome, 
  FiHash,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiClock
} from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useClientsList } from "../store/useClientsList";
import { ROUTES } from "../utils/routes";

const ClientDetails = () => {
  const { client_id } = useParams();
  const navigate = useNavigate();
  const { clients } = useClientsList();

  // Obtener cliente del store usando el ID de la URL
  const client = useMemo(() => {
    const clientId = Number(client_id);
    const foundClient = clients.find((c) => c.client_id === clientId);
    return foundClient || null;
  }, [client_id, clients]);

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

  const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  };

  const getFullName = () => {
    const parts = [
      client.name,
      client.paternal_lastname,
      client.maternal_lastname
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "Sin nombre";
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título, nombre, ID y botón de regresar */}
          <div className="mb-6 mt-4 rounded-xl bg-white border border-neutral-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-poppinsBold font-semibold text-neutral-900 mb-2">
                  Detalle del cliente
                </h2>
                {/* Nombre completo e ID del cliente */}
                <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg">
                  {getFullName()} - ID: {client.client_id}
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

          {/* Contenido principal con secciones */}
          <div className="space-y-6">
            {/* Sección 1: Información Personal */}
            <div className="rounded-xl bg-primary-50 border border-primary-200 p-6">
              <h3 className="text-lg md:text-xl font-poppinsBold font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <FiUser className="h-5 w-5 text-primary-600" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FiUser className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Nombre completo</p>
                    <p className="text-neutral-900 font-poppinsRegular">{getFullName()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Teléfono</p>
                    <p className="text-neutral-900 font-poppinsRegular">{client.phone || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiCalendar className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Fecha de nacimiento</p>
                    <p className="text-neutral-900 font-poppinsRegular">{formatDate(client.birthdate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  {client.user_status ? (
                    <FiCheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <FiXCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Estado</p>
                    <p className={`font-poppinsRegular ${client.user_status ? "text-emerald-700" : "text-rose-700"}`}>
                      {client.user_status ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Dirección */}
            <div className="rounded-xl bg-highlight-50 border border-highlight-200 p-6">
              <h3 className="text-lg md:text-xl font-poppinsBold font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <FiMapPin className="h-5 w-5 text-highlight-600" />
                Dirección
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex items-start gap-3">
                  <FiHome className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Calle</p>
                    <p className="text-neutral-900 font-poppinsRegular">{client.street || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiHash className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Número exterior</p>
                    <p className="text-neutral-900 font-poppinsRegular">{client.external_number || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiHash className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Número interior</p>
                    <p className="text-neutral-900 font-poppinsRegular">{client.internal_number || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Colonia</p>
                    <p className="text-neutral-900 font-poppinsRegular">{client.neighborhood || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Ciudad</p>
                    <p className="text-neutral-900 font-poppinsRegular">{client.city || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Estado</p>
                    <p className="text-neutral-900 font-poppinsRegular">{client.state || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiHash className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Código postal</p>
                    <p className="text-neutral-900 font-poppinsRegular">{client.zip_code || "-"}</p>
                  </div>
                </div>
                {client.address_references && (
                  <div className="md:col-span-2 flex items-start gap-3">
                    <FiInfo className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Referencias</p>
                      <p className="text-neutral-900 font-poppinsRegular">{client.address_references}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sección 3 y 4: Información de Crédito e Información del Sistema (en 2 columnas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sección 4: Información del Sistema */}
              <div className="rounded-xl bg-secondary-50 border border-secondary-200 p-6">
                <h3 className="text-lg md:text-xl font-poppinsBold font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <FiInfo className="h-5 w-5 text-secondary-600" />
                  Información del Sistema
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-3">
                    <FiHash className="h-5 w-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">ID del cliente</p>
                      <p className="text-neutral-900 font-poppinsRegular">{client.client_id}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiClock className="h-5 w-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Fecha de registro</p>
                      <p className="text-neutral-900 font-poppinsRegular">{formatDate(client.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 3: Información de Crédito */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6">
                <h3 className="text-lg md:text-xl font-poppinsBold font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <FiCreditCard className="h-5 w-5 text-emerald-600" />
                  Información de Crédito
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-3">
                    {client.credit_approved === 1 ? (
                      <FiCheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <FiXCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Crédito aprobado</p>
                      <p className={`font-poppinsRegular ${client.credit_approved === 1 ? "text-emerald-700" : "text-rose-700"}`}>
                        {client.credit_approved === 1 ? "Sí" : "No"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCreditCard className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Límite de crédito</p>
                      <p className="text-neutral-900 font-poppinsRegular">{formatCurrency(client.limit_credit_amount)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiInfo className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-600 font-poppinsMedium mb-1">Estado del crédito</p>
                      <p className="text-neutral-900 font-poppinsRegular">
                        {client.credit_status ? "Activo" : "Inactivo"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetails;
