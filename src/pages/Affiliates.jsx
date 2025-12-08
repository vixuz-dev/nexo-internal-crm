import React, { useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { getCompaniesCatalog } from '../api/AfiliatesApi';
import { useAffiliatesList } from '../store/useAffiliatesList';
import SearchBar from '../components/sharedComponents/SearchBar';
import AffiliatesTable from '../components/affiliates/AffiliatesTable';

const Affiliates = () => {
  const { setAffiliates, setLoading, setError, setSearchTerm, searchTerm, loading, error } = useAffiliatesList();

  // Cargar lista de afiliados al ingresar a la página
  useEffect(() => {
    const fetchAffiliates = async () => {
      setLoading(true);
      try {
        const data = await getCompaniesCatalog();
        const affiliatesList = data?.body || data?.data || [];
        setAffiliates(Array.isArray(affiliatesList) ? affiliatesList : []);
      } catch (err) {
        setError(err?.message || 'Error al cargar la lista de afiliados');
      }
    };
    fetchAffiliates();
  }, [setAffiliates, setLoading, setError]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título y descripción */}
          <div className="mb-8 mt-4">
            <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
              Afiliados
            </h2>
            <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg">
              Gestiona y visualiza todos los afiliados registrados en el sistema.
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-6">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por ID, razón social o nombre comercial..."
            />
          </div>
          
          {/* Tabla de afiliados */}
          {error ? (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : (
            <AffiliatesTable />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Affiliates;

