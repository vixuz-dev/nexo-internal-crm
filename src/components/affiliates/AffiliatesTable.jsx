import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useAffiliatesList } from '../../store/useAffiliatesList';
import { TableSkeleton } from '../sharedComponents/Skeletons';
import { ROUTES } from '../../utils/routes';

export default function AffiliatesTable() {
  const { affiliates, loading, searchTerm } = useAffiliatesList();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('company_id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Función para navegar a la página de detalles del afiliado
  // Pasamos el objeto afiliado completo por state para evitar llamadas adicionales a la API
  const handleAffiliateClick = (affiliate) => {
    navigate(
      ROUTES.AFFILIATES_DETAILS.replace(':company_id', affiliate.company_id),
      { state: { affiliate } }
    );
  };

  // Filtrar afiliados por búsqueda
  const filteredAffiliates = useMemo(() => {
    if (!searchTerm) return affiliates;
    const term = searchTerm.toLowerCase();
    return affiliates.filter(affiliate => 
      affiliate.legal_name?.toLowerCase().includes(term) ||
      affiliate.comercial_name?.toLowerCase().includes(term) ||
      affiliate.company_id?.toString().includes(term)
    );
  }, [affiliates, searchTerm]);

  // Ordenar afiliados
  const sortedAffiliates = useMemo(() => {
    const sorted = [...filteredAffiliates];
    sorted.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    return sorted;
  }, [filteredAffiliates, sortColumn, sortDirection]);

  // Paginar afiliados
  const totalItems = sortedAffiliates.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAffiliates = sortedAffiliates.slice(startIndex, endIndex);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' 
      ? <FiChevronUp className="h-4 w-4 inline-block" />
      : <FiChevronDown className="h-4 w-4 inline-block" />;
  };

  if (loading) {
    return <TableSkeleton rows={10} columns={3} />;
  }

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th 
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('company_id')}
              >
                <div className="flex items-center gap-2">
                  ID EMPRESA
                  <SortIcon column="company_id" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('legal_name')}
              >
                <div className="flex items-center gap-2">
                  RAZÓN SOCIAL
                  <SortIcon column="legal_name" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('comercial_name')}
              >
                <div className="flex items-center gap-2">
                  NOMBRE COMERCIAL
                  <SortIcon column="comercial_name" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginatedAffiliates.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-neutral-600">
                  {searchTerm ? 'No se encontraron afiliados' : 'No hay afiliados registrados'}
                </td>
              </tr>
            ) : (
              paginatedAffiliates.map((affiliate) => (
                <tr 
                  key={affiliate.company_id} 
                  onClick={() => handleAffiliateClick(affiliate)}
                  className="hover:bg-highlight-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3 text-neutral-900">{affiliate.company_id || '-'}</td>
                  <td className="px-4 py-3 text-neutral-900">{affiliate.legal_name || '-'}</td>
                  <td className="px-4 py-3 text-neutral-600">{affiliate.comercial_name || '-'}</td>
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
              <span className="text-sm text-neutral-600 font-poppinsRegular">Filas por página:</span>
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
                {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded border border-neutral-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <span className="text-neutral-700">‹</span>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

