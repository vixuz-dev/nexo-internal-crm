import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { useClientsList } from "../../store/useClientsList";
import { TableSkeleton } from "../sharedComponents/Skeletons";
import { ROUTES } from "../../utils/routes";
import Modal from "../sharedComponents/Modal";
import { changeCreditLineStatus } from "../../api/clientsApi";

export default function ClientsTable() {
  const { clients, loading, searchTerm, setClients } = useClientsList();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState("client_id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedClient, setSelectedClient] = useState(null);
  const [pendingCreditStatus, setPendingCreditStatus] = useState(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditLoading, setCreditLoading] = useState(false);
  const [creditError, setCreditError] = useState(null);

  // Función para navegar a la página de detalles del cliente
  // El cliente se obtiene del store usando el ID de la URL
  const handleClientClick = (client) => {
    navigate(ROUTES.CLIENTS_DETAILS.replace(":client_id", client.client_id));
  };

  const openCreditModal = (client, nextStatus) => {
    setSelectedClient(client);
    setPendingCreditStatus(nextStatus);
    setCreditError(null);
    setIsCreditModalOpen(true);
  };

  const handleConfirmCreditChange = async () => {
    if (!selectedClient || typeof pendingCreditStatus !== "boolean") return;
    setCreditLoading(true);
    setCreditError(null);
    try {
      await changeCreditLineStatus(selectedClient.client_id, pendingCreditStatus);
      setClients(
        clients.map((c) =>
          c.client_id === selectedClient.client_id
            ? { ...c, credit_status: pendingCreditStatus }
            : c
        )
      );
      setIsCreditModalOpen(false);
      setSelectedClient(null);
      setPendingCreditStatus(null);
    } catch (err) {
      setCreditError(
        err?.message || "Error al cambiar la línea de crédito del cliente"
      );
    } finally {
      setCreditLoading(false);
    }
  };

  // Filtrar clientes por búsqueda
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(term) ||
        client.client_id?.toString().includes(term) ||
        client.city?.toLowerCase().includes(term) ||
        client.zip_code?.toString().includes(term)
    );
  }, [clients, searchTerm]);

  // Ordenar clientes
  const sortedClients = useMemo(() => {
    const sorted = [...filteredClients];
    sorted.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal || "").toLowerCase();
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    return sorted;
  }, [filteredClients, sortColumn, sortDirection]);

  // Paginar clientes
  const totalItems = sortedClients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = sortedClients.slice(startIndex, endIndex);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <FiChevronUp className="h-4 w-4 inline-block" />
    ) : (
      <FiChevronDown className="h-4 w-4 inline-block" />
    );
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={6} />;
  }

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("client_id")}
              >
                <div className="flex items-center gap-2">
                  ID CLIENTE
                  <SortIcon column="client_id" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  NOMBRE
                  <SortIcon column="name" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium">
                MUNICIPIO
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium">
                CP
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium">
                ACTIVO
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium">
                CREDITO
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginatedClients.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-neutral-600"
                >
                  No se encontraron clientes
                </td>
              </tr>
            ) : (
              paginatedClients.map((client) => (
                <tr
                  key={client.client_id}
                  onClick={() => handleClientClick(client)}
                  className="hover:bg-highlight-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3 text-neutral-900">
                    {client.client_id}
                  </td>
                  <td className="px-4 py-3 text-neutral-900">
                    {client.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {client.city || "-"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {client.zip_code || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          client.user_status
                            ? "text-emerald-700"
                            : "text-neutral-600"
                        }`}
                      >
                        {client.user_status ? "Sí" : "No"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {client.credit_approved ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              openCreditModal(client, !Boolean(client.credit_status))
                            }
                            className={`relative inline-flex h-5 w-10 items-center rounded-full border transition-colors ${
                              client.credit_status
                                ? "bg-highlight-500 border-highlight-500"
                                : "bg-rose-100 border-rose-200"
                            }`}
                          >
                            <span
                              className={`h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
                                client.credit_status ? "translate-x-5" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span
                            className={`text-sm font-poppinsMedium ${
                              client.credit_status ? "text-emerald-700" : "text-rose-700"
                            }`}
                          >
                            {client.credit_status ? "Activo" : "Inactivo"}
                          </span>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled
                            aria-label="Crédito no aprobado"
                            className="relative inline-flex h-5 w-10 items-center rounded-full border border-neutral-200 bg-neutral-100 cursor-not-allowed opacity-70"
                          >
                            <span className="h-4 w-4 rounded-full bg-white shadow-sm transform translate-x-1 border border-neutral-200" />
                          </button>
                          <span className="text-sm font-poppinsMedium text-neutral-700">
                            No aprobado
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalItems > 0 && (
        <div className="bg-neutral-50 border-t border-neutral-200 px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600 font-poppinsRegular">
                Filas por página:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-neutral-300 rounded px-2 py-1 text-sm font-poppinsRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600 font-poppinsRegular">
                {startIndex + 1}-{Math.min(endIndex, totalItems)} de{" "}
                {totalItems}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded border border-neutral-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <span className="text-neutral-700">‹</span>
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded border border-neutral-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <span className="text-neutral-700">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isCreditModalOpen}
        onClose={() => {
          if (creditLoading) return;
          setIsCreditModalOpen(false);
          setSelectedClient(null);
          setPendingCreditStatus(null);
          setCreditError(null);
        }}
        title={pendingCreditStatus ? "Activar línea de crédito" : "Desactivar línea de crédito"}
        size="sm"
      >
        {selectedClient && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-700 font-poppinsRegular">
              ¿Estás seguro de{" "}
              {pendingCreditStatus ? "activar" : "desactivar"} la línea de crédito
              del cliente{" "}
              <span className="font-poppinsBold text-neutral-900">
                {selectedClient.name || `#${selectedClient.client_id}`}
              </span>
              ?
            </p>
            {creditError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800 font-poppinsRegular">
                {creditError}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={creditLoading}
                onClick={() => {
                  if (creditLoading) return;
                  setIsCreditModalOpen(false);
                  setSelectedClient(null);
                  setPendingCreditStatus(null);
                  setCreditError(null);
                }}
                className="px-4 py-2 text-sm font-poppinsMedium rounded-lg border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCreditChange}
                disabled={creditLoading}
                className="px-4 py-2 text-sm font-poppinsMedium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creditLoading ? "Guardando..." : "Continuar"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
