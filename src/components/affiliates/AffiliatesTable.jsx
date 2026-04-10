import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useAffiliatesList } from '../../store/useAffiliatesList';
import { TableSkeleton } from '../sharedComponents/Skeletons';
import { ROUTES } from '../../utils/routes';
import Modal from '../sharedComponents/Modal';
import { changeAffiliateStatus } from '../../api/AfiliatesApi';

export default function AffiliatesTable() {
  const { affiliates, loading, searchTerm, setAffiliates } = useAffiliatesList();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('affiliate_id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);

  const handleAffiliateClick = (affiliate) => {
    navigate(
      ROUTES.AFFILIATES_DETAILS.replace(':affiliate_id', affiliate.affiliate_id)
    );
  };

  const openStatusModal = (affiliate, nextStatus) => {
    setSelectedAffiliate(affiliate);
    setPendingStatus(nextStatus);
    setStatusError(null);
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedAffiliate || typeof pendingStatus !== 'boolean') return;
    setStatusLoading(true);
    setStatusError(null);
    try {
      await changeAffiliateStatus(selectedAffiliate.user_id, pendingStatus);
      setAffiliates(
        affiliates.map((a) =>
          a.affiliate_id === selectedAffiliate.affiliate_id
            ? { ...a, user_status: pendingStatus }
            : a
        )
      );
      setIsStatusModalOpen(false);
      setSelectedAffiliate(null);
      setPendingStatus(null);
    } catch (err) {
      setStatusError(
        err?.message || 'Error al cambiar el estatus del afiliado'
      );
    } finally {
      setStatusLoading(false);
    }
  };

  // Filtrar afiliados por búsqueda
  const filteredAffiliates = useMemo(() => {
    if (!searchTerm) return affiliates;
    const term = searchTerm.toLowerCase();
    return affiliates.filter(affiliate => 
      affiliate.legal_name?.toLowerCase().includes(term) ||
      affiliate.comercial_name?.toLowerCase().includes(term) ||
      affiliate.affiliate_id?.toString().includes(term)
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
    return <TableSkeleton rows={10} columns={5} />;
  }

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th 
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('affiliate_id')}
              >
                <div className="flex items-center gap-2">
                  ID EMPRESA
                  <SortIcon column="affiliate_id" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('legal_name')}
              >
                <div className="flex items-center gap-2">
                  RAZÓN SOCIAL
                  <SortIcon column="legal_name" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('comercial_name')}
              >
                <div className="flex items-center gap-2">
                  NOMBRE COMERCIAL
                  <SortIcon column="comercial_name" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-black font-medium">
                ESTATUS
              </th>
              <th className="px-4 py-3 text-left text-black font-medium">
                ACCIONES
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginatedAffiliates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-black">
                  {searchTerm ? 'No se encontraron afiliados' : 'No hay afiliados registrados'}
                </td>
              </tr>
            ) : (
              paginatedAffiliates.map((affiliate) => (
                <tr 
                  key={affiliate.affiliate_id} 
                  onClick={() => handleAffiliateClick(affiliate)}
                  className="hover:bg-highlight-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3 text-black">{affiliate.affiliate_id || '-'}</td>
                  <td className="px-4 py-3 text-black">{affiliate.legal_name || '-'}</td>
                  <td className="px-4 py-3 text-black">{affiliate.comercial_name || '-'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        affiliate.user_status
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {affiliate.user_status ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-black">
                    <div
                      className="flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          openStatusModal(affiliate, !affiliate.user_status)
                        }
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                          affiliate.user_status
                            ? 'border-primary-200 bg-primary-50 text-primary-800 hover:bg-primary-100'
                            : 'border-primary-600 bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        {affiliate.user_status ? 'Desactivar' : 'Activar'}
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
              <span className="text-sm text-black">Filas por página:</span>
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
                {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded border border-neutral-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <span className="text-black">‹</span>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
        isOpen={isStatusModalOpen}
        onClose={() => {
          if (statusLoading) return;
          setIsStatusModalOpen(false);
          setSelectedAffiliate(null);
          setPendingStatus(null);
          setStatusError(null);
        }}
        title={pendingStatus ? 'Activar afiliado' : 'Desactivar afiliado'}
        size="sm"
      >
        {selectedAffiliate && (
          <div className="space-y-4">
            <p className="text-sm text-black">
              ¿Estás seguro de {pendingStatus ? 'activar' : 'desactivar'} al afiliado{' '}
              <span className="font-bold text-black">
                {selectedAffiliate.comercial_name ||
                  selectedAffiliate.legal_name ||
                  `#${selectedAffiliate.affiliate_id}`}
              </span>
              ?
            </p>
            {statusError && (
              <div className="rounded-lg bg-neutral-100 border border-neutral-300 px-3 py-2 text-xs text-black">
                {statusError}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                disabled={statusLoading}
                onClick={() => {
                  if (statusLoading) return;
                  setIsStatusModalOpen(false);
                  setSelectedAffiliate(null);
                  setPendingStatus(null);
                  setStatusError(null);
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 text-black bg-white hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                disabled={statusLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {statusLoading ? 'Guardando...' : 'Continuar'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

