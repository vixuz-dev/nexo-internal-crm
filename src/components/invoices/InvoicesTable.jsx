import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronUp, FiChevronDown, FiEye, FiDollarSign } from "react-icons/fi";
import { useInvoicesList } from "../../store/useInvoicesList";
import { TableSkeleton } from "../sharedComponents/Skeletons";
import Modal from "../sharedComponents/Modal";
import { ROUTES } from "../../utils/routes";

function InvoiceModalField({ label, children, className = "" }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-black/55">
        {label}
      </p>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-black">
        {children}
      </div>
    </div>
  );
}

function InvoiceModalSection({
  title,
  borderAccentClass,
  defaultOpen = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section>
      <div
        className={`rounded-xl bg-white border border-neutral-200 shadow-sm overflow-hidden border-l-4 ${borderAccentClass}`}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 sm:px-5 md:py-4 text-left hover:bg-neutral-50 transition-colors"
        >
          <h3 className="text-sm font-semibold text-black">{title}</h3>
          <span
            className={`shrink-0 text-black/70 transition-transform duration-300 ease-out motion-reduce:transition-none ${
              open ? "rotate-180" : ""
            }`}
          >
            <FiChevronDown className="h-5 w-5" aria-hidden />
          </span>
        </button>
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={`border-t border-neutral-200 px-4 py-4 sm:px-5 md:py-5 bg-neutral-50/60 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
                open ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={!open}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    const base =
      "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-white border";
    if (invoice_status === "Pagado") {
      return (
        <span className={`${base} border-primary-500 text-primary-900`}>
          Pagada
        </span>
      );
    }
    if (invoice_status === "Pendiente de pago") {
      return (
        <span className={`${base} border-primary-400 text-primary-800`}>
          Pendiente de pago
        </span>
      );
    }
    if (invoice_status === "Pendiente") {
      return (
        <span className={`${base} border-highlight-400 text-highlight-900`}>
          Pendiente
        </span>
      );
    }
    if (invoice_status === "Cancelado") {
      return (
        <span className={`${base} border-neutral-400 text-black`}>
          Cancelada
        </span>
      );
    }
    if (invoice_status === "Eliminado") {
      return (
        <span className={`${base} border-neutral-600 bg-neutral-800 text-neutral-50`}>
          Eliminada
        </span>
      );
    }
    return (
      <span className={`${base} border-neutral-300 text-black`}>
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
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("invoice_id")}
              >
                <div className="flex items-center gap-2">
                  ID
                  <SortIcon column="invoice_id" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  CLIENTE
                  <SortIcon column="name" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center gap-2">
                  FECHA DE EMISIÓN
                  <SortIcon column="created_at" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("initial_payment")}
              >
                <div className="flex items-center gap-2">
                  PAGO INICIAL
                  <SortIcon column="initial_payment" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("number_payments")}
              >
                <div className="flex items-center gap-2">
                  NUM. PAGOS
                  <SortIcon column="number_payments" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort("total")}
              >
                <div className="flex items-center gap-2">
                  CANTIDAD
                  <SortIcon column="total" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-black font-medium">
                ESTADO
              </th>
              <th className="px-4 py-3 text-left text-black font-medium">
                SALDO PENDIENTE
              </th>
              <th className="px-4 py-3 text-left text-black font-medium">
                ACCIÓN
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-black"
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
                  <td className="px-4 py-3 text-black">
                    {invoice.invoice_id || "-"}
                  </td>
                  <td className="px-4 py-3 text-black">
                    {invoice.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-black">
                    {formatDate(invoice.created_at)}
                  </td>
                  <td className="px-4 py-3 text-black font-medium">
                    {formatCurrency(invoice.initial_payment || 0)}
                  </td>
                  <td className="px-4 py-3 text-black">
                    {invoice.number_payments ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-black font-medium">
                    {formatCurrency(invoice.total || 0)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(invoice.invoice_status)}
                  </td>
                  <td className="px-4 py-3 text-black font-medium">
                    {formatCurrency(invoice.remaining_payment || 0)}
                  </td>
                  <td className="px-4 py-3 text-black">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(invoice)}
                        className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-black hover:bg-neutral-50 transition"
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
                        className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-black hover:bg-neutral-50 transition"
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
          <div className="space-y-6" key={selectedInvoice.invoice_id}>
            <InvoiceModalSection
              title="Información general"
              borderAccentClass="border-l-primary-500"
              defaultOpen
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InvoiceModalField label="Cliente">
                  <span className="font-medium">
                    {selectedInvoice.name || "—"}
                  </span>
                </InvoiceModalField>
                <InvoiceModalField label="ID factura">
                  <span className="font-medium">
                    {selectedInvoice.invoice_id}
                  </span>
                </InvoiceModalField>
                <InvoiceModalField label="Fecha de emisión">
                  {formatDate(selectedInvoice.created_at)}
                </InvoiceModalField>
                <InvoiceModalField label="Fecha de finalización">
                  {selectedInvoice.finished_at
                    ? formatDate(selectedInvoice.finished_at)
                    : "—"}
                </InvoiceModalField>
                <InvoiceModalField label="Estado" className="md:col-span-2">
                  <div className="inline-flex items-center min-h-[2.25rem]">
                    {getStatusBadge(selectedInvoice.invoice_status)}
                  </div>
                </InvoiceModalField>
              </div>
            </InvoiceModalSection>

            <InvoiceModalSection
              title="Pagos"
              borderAccentClass="border-l-highlight-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InvoiceModalField label="% pago inicial">
                  {selectedInvoice.initial_payment_percentage ?? 0}%
                </InvoiceModalField>
                <InvoiceModalField label="Pago inicial">
                  <span className="font-medium">
                    {formatCurrency(selectedInvoice.initial_payment || 0)}
                  </span>
                </InvoiceModalField>
                <InvoiceModalField label="Número de pagos">
                  {selectedInvoice.number_payments ?? "—"}
                </InvoiceModalField>
                <InvoiceModalField label="Pagos pendientes">
                  {selectedInvoice.missing_payments ?? "—"}
                </InvoiceModalField>
                <InvoiceModalField label="Total factura">
                  <span className="font-medium">
                    {formatCurrency(selectedInvoice.total || 0)}
                  </span>
                </InvoiceModalField>
                <InvoiceModalField label="Saldo pendiente">
                  <span className="font-medium">
                    {formatCurrency(selectedInvoice.remaining_payment || 0)}
                  </span>
                </InvoiceModalField>
              </div>
            </InvoiceModalSection>

            <InvoiceModalSection
              title="Afiliado y comisiones"
              borderAccentClass="border-l-secondary-500"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InvoiceModalField label="% comisión afiliado">
                  {selectedInvoice.affiliate_fee_percentage ?? 0}%
                </InvoiceModalField>
                <InvoiceModalField label="% margen de ganancia">
                  {selectedInvoice.profit_margin_percentage ?? 0}%
                </InvoiceModalField>
                <InvoiceModalField label="% recargo por atraso">
                  {selectedInvoice.late_fee_percentage ?? 0}%
                </InvoiceModalField>
                <InvoiceModalField label="Pago al afiliado">
                  <span className="font-medium">
                    {formatCurrency(selectedInvoice.affiliate_payment || 0)}
                  </span>
                </InvoiceModalField>
                <InvoiceModalField label="Pagado al afiliado">
                  <span className="font-medium">
                    {formatCurrency(selectedInvoice.amount_paid_affiliate || 0)}
                  </span>
                </InvoiceModalField>
                <InvoiceModalField label="Margen de ganancia total">
                  <span className="font-medium">
                    {formatCurrency(selectedInvoice.total_profit_margin || 0)}
                  </span>
                </InvoiceModalField>
                <InvoiceModalField label="Margen de ganancia pagado">
                  <span className="font-medium">
                    {formatCurrency(selectedInvoice.paid_profit_margin || 0)}
                  </span>
                </InvoiceModalField>
                <InvoiceModalField label="Comisión afiliado total">
                  <span className="font-medium">
                    {formatCurrency(selectedInvoice.total_affiliate_fee || 0)}
                  </span>
                </InvoiceModalField>
                <InvoiceModalField label="Comisión afiliado pagada">
                  <span className="font-medium">
                    {formatCurrency(selectedInvoice.paid_affiliate_fee || 0)}
                  </span>
                </InvoiceModalField>
                <InvoiceModalField label="Recargos por atraso totales">
                  <span className="font-medium">
                    {formatCurrency(selectedInvoice.total_late_fees || 0)}
                  </span>
                </InvoiceModalField>
                <InvoiceModalField label="Recargos por atraso pagados">
                  <span className="font-medium">
                    {formatCurrency(selectedInvoice.paid_late_fees || 0)}
                  </span>
                </InvoiceModalField>
              </div>
            </InvoiceModalSection>
          </div>
        )}
      </Modal>
    </div>
  );
}
