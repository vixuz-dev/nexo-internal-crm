import React, { useState, useMemo } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { TableSkeleton } from '../sharedComponents/Skeletons';

const CobranzaReportTable = ({ data = [], loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Ordenar datos
  const sortedData = useMemo(() => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];
      
      if (sortColumn === 'date') {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      } else if (typeof aVal === 'number') {
        // Mantener como número para ordenar correctamente
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    return sorted;
  }, [data, sortColumn, sortDirection]);

  // Paginar datos
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

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

  const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    return num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return <TableSkeleton rows={10} columns={4} />;
  }

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th 
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('product')}
              >
                <div className="flex items-center gap-2">
                  PRODUCTO
                  <SortIcon column="product" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('client')}
              >
                <div className="flex items-center gap-2">
                  CLIENTE
                  <SortIcon column="client" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center gap-2">
                  CANTIDAD COBRADA
                  <SortIcon column="amount" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-black font-medium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">
                  FECHA
                  <SortIcon column="date" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-black">
                  No hay datos para el rango de fechas seleccionado
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-neutral-50 transition">
                  <td className="px-4 py-3 text-black">{item.product || '-'}</td>
                  <td className="px-4 py-3 text-black">{item.client || '-'}</td>
                  <td className="px-4 py-3 text-black font-medium">
                    ${formatCurrency(item.amount || 0)}
                  </td>
                  <td className="px-4 py-3 text-black">{formatDate(item.date)}</td>
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
    </div>
  );
};

export default CobranzaReportTable;


