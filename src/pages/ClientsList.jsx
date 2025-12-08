import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import { getClients } from '../api/clientsApi';
import { useClientsList } from '../store/useClientsList';
import ClientsSummaryCards from '../components/clients/ClientsSummaryCards';
import SearchBar from '../components/sharedComponents/SearchBar';
import ClientsTable from '../components/clients/ClientsTable';
import ClientDetailsModal from '../components/clients/ClientDetailsModal';

const ClientsList = () => {
  const { setClients, setLoading, setError, setSearchTerm, searchTerm, loading, error } = useClientsList();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Cargar lista de clientes al ingresar a la página
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const data = await getClients();
        const clientsList = data?.body || data?.data || [];
        setClients(Array.isArray(clientsList) ? clientsList : []);
      } catch (err) {
        setError(err?.message || 'Error al cargar la lista de clientes');
      }
    };
    fetchClients();
  }, [setClients, setLoading, setError]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título y descripción */}
          <div className="mb-8 mt-4">
            <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
              Listado de Clientes
            </h2>
            <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg">
              Gestiona y visualiza todos los clientes registrados en el sistema.
            </p>
          </div>

          {/* Cards de resumen */}
          <div className="mb-6">
            <ClientsSummaryCards />
          </div>

          {/* Barra de búsqueda y botón crear */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full sm:w-auto">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar por nombre, ID, municipio o código postal..."
              />
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-poppinsMedium"
            >
              <FiPlus className="h-5 w-5" />
              Nuevo cliente
            </button>
          </div>
          
          {/* Tabla de clientes */}
          {error ? (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : (
            <ClientsTable />
          )}

          {/* Modal para crear nuevo cliente */}
          <ClientDetailsModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            client={null}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientsList;

