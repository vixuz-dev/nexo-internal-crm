import React, { useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { getOrders } from '../api/ordersApi';
import { useOrdersList } from '../store/useOrdersList';
import SearchBar from '../components/sharedComponents/SearchBar';
import OrdersTable from '../components/orders/OrdersTable';
import Select from '../components/sharedComponents/Select';

const OrdersList = () => {
  const { 
    setOrders, 
    setLoading, 
    setError, 
    setSearchText, 
    searchText,
    currentPage,
    limit,
    status,
    setStatus,
    loading,
    error 
  } = useOrdersList();

  // Cargar lista de pedidos al ingresar a la página o cuando cambian los parámetros
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrders({
          page: currentPage,
          limit: limit,
          status: status,
          text: searchText || '',
        });
        const ordersData = data?.body || {};
        setOrders({
          orders: ordersData.orders || [],
          totalItems: ordersData.totalItems || 0,
          totalPages: ordersData.totalPages || 0,
        });
      } catch (err) {
        setError(err?.message || 'Error al cargar la lista de pedidos');
      }
    };
    fetchOrders();
  }, [currentPage, limit, status, searchText, setOrders, setLoading, setError]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título y descripción */}
          <div className="mb-8 mt-4">
            <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
              Listado de Pedidos
            </h2>
            <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg">
              Gestiona y visualiza todos los pedidos registrados en el sistema.
            </p>
          </div>

          {/* Filtros: Búsqueda y Estado */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchText}
                onChange={setSearchText}
                placeholder="Buscar por folio, cliente..."
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={status}
                onChange={(value) => setStatus(value)}
                options={[
                  { value: 'Todos', label: 'Todos' },
                  { value: 'Pendiente', label: 'Pendiente' },
                  { value: 'Completado', label: 'Completado' },
                ]}
                optionValue="value"
                optionLabel="label"
                placeholder="Filtrar por estado"
              />
            </div>
          </div>
          
          {/* Tabla de pedidos */}
          {error ? (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : (
            <OrdersTable />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersList;

