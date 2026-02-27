import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { useClientsList } from "../../store/useClientsList";
import { TableSkeleton } from "../sharedComponents/Skeletons";
import { ROUTES } from "../../utils/routes";

export default function ClientsTable() {
  const { clients, loading, searchTerm } = useClientsList();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState("client_id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Función para navegar a la página de detalles del cliente
  // El cliente se obtiene del store usando el ID de la URL
  const handleClientClick = (client) => {
    navigate(ROUTES.CLIENTS_DETAILS.replace(":client_id", client.client_id));
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
    return <TableSkeleton rows={5} columns={5} />;
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
                          client.user_status === true
                            ? "text-emerald-700"
                            : "text-neutral-600"
                        }`}
                      >
                        {client.user_status === true ? "Sí" : "No"}
                      </span>
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
    </div>
  );
}
