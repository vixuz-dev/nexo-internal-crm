import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useClientsList } from "../store/useClientsList";
import { ROUTES } from "../utils/routes";

const Field = ({ label, children }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-black/55 mb-1">
      {label}
    </p>
    <p className="text-sm md:text-base text-black font-medium leading-snug">
      {children}
    </p>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="rounded-xl bg-white border border-neutral-200 p-6 shadow-sm">
    <h3 className="text-base md:text-lg font-semibold text-black border-b border-neutral-200 pb-3 mb-5">
      {title}
    </h3>
    {children}
  </div>
);

const ClientDetails = () => {
  const { client_id } = useParams();
  const navigate = useNavigate();
  const { clients } = useClientsList();

  const client = useMemo(() => {
    const clientId = Number(client_id);
    const foundClient = clients.find((c) => c.client_id === clientId);
    return foundClient || null;
  }, [client_id, clients]);

  if (!client) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-neutral-200 px-4 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8 mt-4 rounded-xl bg-white border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-semibold text-black mb-2">
                Cliente no encontrado
              </h2>
              <p className="text-black text-base md:text-lg mb-4">
                No se pudo encontrar la información del cliente con ID:{" "}
                {client_id}
              </p>
              <button
                onClick={() => navigate(ROUTES.CLIENTS_LIST)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
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
      client.maternal_lastname,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "Sin nombre";
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-6 mt-4 rounded-xl bg-white border border-neutral-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-semibold text-black mb-2">
                  Detalle del cliente
                </h2>
                <p className="text-black text-base md:text-lg">
                  {getFullName()} — ID: {client.client_id}
                </p>
              </div>
              <button
                onClick={() => navigate(ROUTES.CLIENTS_LIST)}
                className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-black bg-white hover:bg-neutral-50 transition font-medium whitespace-nowrap shadow-sm"
                title="Volver al listado de clientes"
              >
                <FiArrowLeft className="h-5 w-5 shrink-0" />
                <span className="hidden sm:inline">Regresar</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <SectionCard title="Información personal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Nombre completo">{getFullName()}</Field>
                <Field label="Teléfono">{client.phone || "—"}</Field>
                <Field label="Fecha de nacimiento">
                  {formatDate(client.birthdate)}
                </Field>
                <Field label="Estado de la cuenta">
                  {client.user_status ? "Activo" : "Inactivo"}
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="Dirección">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Field label="Calle">{client.street || "—"}</Field>
                </div>
                <Field label="Número exterior">
                  {client.external_number || "—"}
                </Field>
                <Field label="Número interior">
                  {client.internal_number || "—"}
                </Field>
                <Field label="Colonia">{client.neighborhood || "—"}</Field>
                <Field label="Ciudad">{client.city || "—"}</Field>
                <Field label="Estado">{client.state || "—"}</Field>
                <Field label="Código postal">{client.zip_code || "—"}</Field>
                {client.address_references && (
                  <div className="md:col-span-2">
                    <Field label="Referencias">
                      {client.address_references}
                    </Field>
                  </div>
                )}
              </div>
            </SectionCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SectionCard title="Información del sistema">
                <div className="grid grid-cols-1 gap-6">
                  <Field label="ID del cliente">{client.client_id}</Field>
                  <Field label="Fecha de registro">
                    {formatDate(client.created_at)}
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="Información de crédito">
                <div className="grid grid-cols-1 gap-6">
                  <Field label="Crédito aprobado">
                    {client.credit_approved === 1 ? "Sí" : "No"}
                  </Field>
                  <Field label="Límite de crédito">
                    {formatCurrency(client.limit_credit_amount)}
                  </Field>
                  <Field label="Estado del crédito">
                    {client.credit_status ? "Activo" : "Inactivo"}
                  </Field>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetails;
