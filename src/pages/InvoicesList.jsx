import React, { useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getInvoices } from "../api/invoicesApi";
import { useInvoicesList } from "../store/useInvoicesList";
import SearchBar from "../components/sharedComponents/SearchBar";
import InvoicesTable from "../components/invoices/InvoicesTable";
import InvoicesSummaryCards from "../components/invoices/InvoicesSummaryCards";

const InvoicesList = () => {
  const {
    setInvoices,
    setLoading,
    setError,
    setSearchTerm,
    setStatusFilter,
    searchTerm,
    statusFilter,
    loading,
    error,
  } = useInvoicesList();

  // Cargar lista de facturas al ingresar a la página
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const data = await getInvoices();
        const invoicesList = data?.body || data?.data || [];
        setInvoices(Array.isArray(invoicesList) ? invoicesList : []);
      } catch (err) {
        setError(err?.message || "Error al cargar la lista de facturas");
      }
    };
    fetchInvoices();
  }, [setInvoices, setLoading, setError]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título y descripción */}
          <div className="mb-8 mt-4">
            <h2 className="text-2xl md:text-3xl font-medium text-black mb-2">
              Facturas
            </h2>
            <p className="text-black text-base md:text-lg">
              Gestiona y visualiza todas las facturas registradas en el sistema.
            </p>
          </div>

          {/* Cards de resumen */}
          <div className="mb-6">
            <InvoicesSummaryCards />
          </div>

          {/* Botones de filtro por estado */}
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter(null)}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                statusFilter === null
                  ? "bg-primary-600 text-white"
                  : "bg-white text-black border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter("Pagado")}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                statusFilter === "Pagado"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-black border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Pagadas
            </button>
            <button
              onClick={() => setStatusFilter("Pendiente")}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                statusFilter === "Pendiente"
                  ? "bg-highlight-600 text-white"
                  : "bg-white text-black border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Sin pagar
            </button>
            <button
              onClick={() => setStatusFilter("Pendiente de pago")}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                statusFilter === "Pendiente de pago"
                  ? "bg-secondary-600 text-white"
                  : "bg-white text-black border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Pendiente de pago
            </button>
            <button
              onClick={() => setStatusFilter("Cancelado")}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                statusFilter === "Cancelado"
                  ? "bg-neutral-700 text-white"
                  : "bg-white text-black border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Canceladas
            </button>
            <button
              onClick={() => setStatusFilter("Eliminado")}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                statusFilter === "Eliminado"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-black border border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Eliminadas
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-6">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por ID, folio o cliente..."
            />
          </div>

          {/* Tabla de facturas */}
          {error ? (
            <div className="rounded-xl bg-neutral-100 border border-neutral-300 p-4">
              <p className="text-black">{error}</p>
            </div>
          ) : (
            <InvoicesTable />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvoicesList;
