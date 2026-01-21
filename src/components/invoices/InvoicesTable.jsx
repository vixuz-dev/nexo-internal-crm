import React, { useState, useMemo } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useInvoicesList } from '../../store/useInvoicesList';
import { TableSkeleton } from '../sharedComponents/Skeletons';

export default function InvoicesTable() {
  const { invoices, loading, searchTerm, statusFilter, currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } = useInvoicesList();
  const [sortColumn, setSortColumn] = useState('invoice_id');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filtrar facturas por búsqueda y estado
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    // Filtrar por estado
    if (statusFilter !== null) {
      filtered = filtered.filter(invoice => invoice.invoice_status === statusFilter);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.invoice_id?.toString().includes(term) ||
        invoice.name?.toLowerCase().includes(term)
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
  }, [filteredInvoices, sortColumn, sortDirection]);

  // Paginar facturas
  const totalItems = sortedInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = sortedInvoices.slice(startIndex, endIndex);

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
    return num.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
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

  const getStatusBadge = (invoice_status) => {
    
    if (invoice_status === 'Pagada') {
      return <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-emerald-50 text-emerald-800">Pagada</span>;
    } else if (invoice_status === 'Cancelada') {
      return <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-rose-50 text-rose-800">Cancelada</span>;
    } else if (invoice_status === 'Pendiente') {
      return <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-amber-50 text-amber-800">Pendiente</span>;
    }
    return <span className="px-2 py-1 rounded text-xs font-poppinsMedium bg-neutral-50 text-neutral-800">-</span>;
  };

  if (loading) {
    return <TableSkeleton rows={5} columns={8} />;
  }

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th 
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('invoice_id')}
              >
                <div className="flex items-center gap-2">
                  ID
                  <SortIcon column="invoice_id" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  CLIENTE
                  <SortIcon column="name" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-2">
                  FECHA DE EMISIÓN
                  <SortIcon column="created_at" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium">
                FECHA DE FINALIZACIÓN
              </th>
              <th 
                className="px-4 py-3 text-left text-neutral-700 font-poppinsMedium cursor-pointer hover:bg-neutral-100 transition"
                onClick={() => handleSort('total')}
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
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-600">
                  {searchTerm ? 'No se encontraron facturas' : 'No hay facturas registradas'}
                </td>
              </tr>
            ) : (
              paginatedInvoices.map((invoice) => (
                <tr key={invoice.invoice_id} className="hover:bg-neutral-50 transition">
                  <td className="px-4 py-3 text-neutral-900">{invoice.invoice_id || '-'}</td>
                  <td className="px-4 py-3 text-neutral-900">{invoice.name || '-'}</td>
                  <td className="px-4 py-3 text-neutral-600">{formatDate(invoice.created_at)}</td>
                  <td className="px-4 py-3 text-neutral-600">{formatDate(invoice.finished_at)}</td>
                  <td className="px-4 py-3 text-neutral-900 font-poppinsMedium">{formatCurrency(invoice.total || 0)}</td>
                  <td className="px-4 py-3">
                    {getStatusBadge(invoice.invoice_status)}
                  </td>
                  <td className="px-4 py-3 text-neutral-900 font-poppinsMedium">
                    {formatCurrency(invoice.remaining_payment || 0)}
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

