import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronUp, FiChevronDown, FiEye, FiDollarSign } from "react-icons/fi";
import { useInvoicesList } from "../../store/useInvoicesList";
import { TableSkeleton } from "../sharedComponents/Skeletons";
import Modal from "../sharedComponents/Modal";
import { ROUTES } from "../../utils/routes";

export default function InvoicesTable() {
  const { invoices, loading, searchTerm, statusFilter } = useInvoicesList();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState("invoice_id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar facturas por búsqueda y estado
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    // Filtrar por estado
    if (statusFilter !== null) {
      filtered = filtered.filter(
        (invoice) => invoice.invoice_status === statusFilter,
      );
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoice_id?.toString().includes(term) ||
          invoice.name?.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [invoices, searchTerm, statusFilter]);

  // Ordenar facturas
  const sortedInvoices = useMemo(() => {
    const sorted = [...filteredInvoices];
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
  }, [filteredInvoices, sortColumn, sortDirection]);

  // Paginar facturas
  const totalItems = sortedInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = sortedInvoices.slice(startIndex, endIndex);

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

  const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getStatusBadge = (invoice_status) => {
    if (invoice_status === "Pagada") {
      return (
        <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-emerald-50 text-emerald-800">
          Pagada
        </span>
      );
    }
    if (invoice_status === "Pendiente de pago") {
      return (
        <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-sky-50 text-sky-800">
          Pendiente de pago
        </span>
      );
    }
    if (invoice_status === "Pendiente") {
      return (
        <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-amber-50 text-amber-800">
          Pendiente
        </span>
      );
    }
    if (invoice_status === "Cancelada") {
      return (
        <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-rose-50 text-rose-800">
          Cancelada
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-neutral-50 text-neutral-800">
        -
      </span>
    );
  };

  const handleOpenDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={9} />;
  }

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("invoice_id")}
              >
                <div className="flex items-center gap-2">
                  ID
                  <SortIcon column="invoice_id" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  CLIENTE
                  <SortIcon column="name" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center gap-2">
                  FECHA DE EMISIÓN
                  <SortIcon column="created_at" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("initial_payment")}
              >
                <div className="flex items-center gap-2">
                  PAGO INICIAL
                  <SortIcon column="initial_payment" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("number_payments")}
              >
                <div className="flex items-center gap-2">
                  NUM. PAGOS
                  <SortIcon column="number_payments" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("total")}
              >
                <div className="flex items-center gap-2">
                  CANTIDAD
                  <SortIcon column="total" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium">
                ESTADO
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium">
                SALDO PENDIENTE
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium">
                ACCIÓN
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-neutral-600"
                >
                  {searchTerm
                    ? "No se encontraron facturas"
                    : "No hay facturas registradas"}
                </td>
              </tr>
            ) : (
              paginatedInvoices.map((invoice) => (
                <tr
                  key={invoice.invoice_id}
                  className="hover:bg-neutral-50 transition"
                >
                  <td className="px-4 py-3 text-neutral-900">
                    {invoice.invoice_id || "-"}
                  </td>
                  <td className="px-4 py-3 text-neutral-900">
                    {invoice.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatDate(invoice.created_at)}
                  </td>
                  <td className="px-4 py-3 text-neutral-900 font-poppinsMedium">
                    {formatCurrency(invoice.initial_payment || 0)}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {invoice.number_payments ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-neutral-900 font-poppinsMedium">
                    {formatCurrency(invoice.total || 0)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(invoice.invoice_status)}
                  </td>
                  <td className="px-4 py-3 text-neutral-900 font-poppinsMedium">
                    {formatCurrency(invoice.remaining_payment || 0)}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(invoice)}
                        className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-poppinsMedium text-neutral-700 hover:bg-neutral-50 transition"
                        title="Ver detalle de la factura"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            ROUTES.CONSULTAS_FACTURAS_PAGOS.replace(
                              ":invoiceId",
                              String(invoice.invoice_id),
                            ),
                          )
                        }
                        className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-poppinsMedium text-neutral-700 hover:bg-neutral-50 transition"
                        title="Ver abonos y cortes"
                      >
                        <FiDollarSign className="h-4 w-4" />
                      </button>
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
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
        title={
          selectedInvoice
            ? `Detalle de factura #${selectedInvoice.invoice_id}`
            : 'Detalle de factura'
        }
        size="xl"
      >
        {selectedInvoice && (
          <div className="space-y-8">
            {/* Información general */}
            <section>
              <h3 className="text-sm font-poppinsBold text-neutral-900 mb-3">
                Información general
              </h3>
              <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Cliente
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {selectedInvoice.name || '-'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      ID factura
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {selectedInvoice.invoice_id}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Fecha de emisión
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsRegular">
                      {formatDate(selectedInvoice.created_at)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Fecha de finalización
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsRegular">
                      {selectedInvoice.finished_at
                        ? formatDate(selectedInvoice.finished_at)
                        : '-'}
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Estado
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 inline-flex items-center gap-2">
                      {getStatusBadge(selectedInvoice.invoice_status)}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Pagos */}
            <section>
              <h3 className="text-sm font-poppinsBold text-neutral-900 mb-3">
                Pagos
              </h3>
              <div className="rounded-xl border border-highlight-200 bg-highlight-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      % pago inicial
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsRegular">
                      {selectedInvoice.initial_payment_percentage ?? 0}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Pago inicial
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {formatCurrency(selectedInvoice.initial_payment || 0)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Número de pagos
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsRegular">
                      {selectedInvoice.number_payments ?? '-'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Pagos pendientes
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsRegular">
                      {selectedInvoice.missing_payments ?? '-'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Total factura
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {formatCurrency(selectedInvoice.total || 0)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Saldo pendiente
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {formatCurrency(selectedInvoice.remaining_payment || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Afiliado y comisiones */}
            <section>
              <h3 className="text-sm font-poppinsBold text-neutral-900 mb-3">
                Afiliado y comisiones
              </h3>
              <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      % comisión afiliado
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsRegular">
                      {selectedInvoice.affiliate_fee_percentage ?? 0}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      % margen de ganancia
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsRegular">
                      {selectedInvoice.profit_margin_percentage ?? 0}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      % recargo por atraso
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsRegular">
                      {selectedInvoice.late_fee_percentage ?? 0}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Pago al afiliado
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {formatCurrency(selectedInvoice.affiliate_payment || 0)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Pagado al afiliado
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {formatCurrency(selectedInvoice.amount_paid_affiliate || 0)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Margen de ganancia total
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {formatCurrency(selectedInvoice.total_profit_margin || 0)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Margen de ganancia pagado
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {formatCurrency(selectedInvoice.paid_profit_margin || 0)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Comisión afiliado total
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {formatCurrency(selectedInvoice.total_affiliate_fee || 0)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Comisión afiliado pagada
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {formatCurrency(selectedInvoice.paid_affiliate_fee || 0)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Recargos por atraso totales
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {formatCurrency(selectedInvoice.total_late_fees || 0)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-600 font-poppinsMedium">
                      Recargos por atraso pagados
                    </p>
                    <div className="rounded-lg bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-900 font-poppinsMedium">
                      {formatCurrency(selectedInvoice.paid_late_fees || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </Modal>
    </div>
  );
}
