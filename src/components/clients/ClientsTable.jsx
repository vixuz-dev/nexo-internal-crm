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
    return <TableSkeleton rows={5} columns={7} />;
  }

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("client_id")}
              >
                <div className="flex items-center gap-2">
                  ID CLIENTE
                  <SortIcon column="client_id" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  NOMBRE
                  <SortIcon column="name" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-black font-medium">
                MUNICIPIO
              </th>
              <th className="px-4 py-3 text-left text-black font-medium">
                CP
              </th>
              <th className="px-4 py-3 text-left text-black font-medium">
                ACTIVO
              </th>
              <th className="px-4 py-3 text-left text-black font-medium">
                CRÉDITO
              </th>
              <th className="px-4 py-3 text-left text-black font-medium">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginatedClients.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-black"
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
                  <td className="px-4 py-3 text-black">
                    {client.client_id}
                  </td>
                  <td className="px-4 py-3 text-black">
                    {client.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-black">
                    {client.city || "-"}
                  </td>
                  <td className="px-4 py-3 text-black">
                    {client.zip_code || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-black">
                        {client.user_status ? "Sí" : "No"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {!client.credit_approved ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border bg-neutral-100 text-neutral-800 border-neutral-200">
                        No aprobado
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                          client.credit_status
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                      >
                        {client.credit_status ? "Activo" : "Inactivo"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-black">
                    <div
                      className="flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {client.credit_approved ? (
                        <button
                          type="button"
                          onClick={() =>
                            openCreditModal(client, !client.credit_status)
                          }
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                            client.credit_status
                              ? "border-primary-200 bg-primary-50 text-primary-800 hover:bg-primary-100"
                              : "border-primary-600 bg-primary-600 text-white hover:bg-primary-700"
                          }`}
                        >
                          {client.credit_status ? "Desactivar" : "Activar"}
                        </button>
                      ) : (
                        <span className="text-sm text-black">—</span>
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
              <span className="text-sm text-black">
                Filas por página:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-neutral-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-black">
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
                  <span className="text-black">‹</span>
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded border border-neutral-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <span className="text-black">›</span>
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
            <p className="text-sm text-black">
              ¿Estás seguro de{" "}
              {pendingCreditStatus ? "activar" : "desactivar"} la línea de crédito
              del cliente{" "}
              <span className="font-bold text-black">
                {selectedClient.name || `#${selectedClient.client_id}`}
              </span>
              ?
            </p>
            {creditError && (
              <div className="rounded-lg bg-neutral-100 border border-neutral-300 px-3 py-2 text-xs text-black">
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
                className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 text-black bg-white hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCreditChange}
                disabled={creditLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
