import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrdersList } from '../../store/useOrdersList';
import { TableSkeleton } from '../sharedComponents/Skeletons';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ROUTES } from '../../utils/routes';

export default function OrdersTable() {
  const { 
    orders, 
    loading, 
    totalItems, 
    totalPages, 
    currentPage, 
    limit,
    setCurrentPage,
    setLimit 
  } = useOrdersList();
  const navigate = useNavigate();

  const handleOrderClick = (order) => {
    navigate(
      ROUTES.ORDERS_DETAILS.replace(':id_order', order.order_id)
    );
  };

  if (loading) {
    return <TableSkeleton rows={10} columns={6} />;
  }

  const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    return num.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'pendiente de pago') {
      return <span className="px-2 py-1 rounded text-xs font-medium bg-secondary-50 text-secondary-900">Pendiente de pago</span>;
    }
    if (statusLower === 'pendiente') {
      return <span className="px-2 py-1 rounded text-xs font-medium bg-highlight-100 text-highlight-900">Pendiente</span>;
    }
    if (statusLower === 'entregado') {
      return <span className="px-2 py-1 rounded text-xs font-medium bg-primary-50 text-primary-800">Entregado</span>;
    }
    if (statusLower === 'completado') {
      return <span className="px-2 py-1 rounded text-xs font-medium bg-primary-50 text-primary-800">Completado</span>;
    }
    if (statusLower === 'cancelado') {
      return <span className="px-2 py-1 rounded text-xs font-medium bg-neutral-200 text-black">Cancelado</span>;
    }
    if (statusLower === 'en tránsito' || statusLower === 'en transito') {
      return <span className="px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-900">En tránsito</span>;
    }
    if (statusLower === 'eliminado') {
      return <span className="px-2 py-1 rounded text-xs font-medium bg-neutral-700 text-neutral-50">Eliminado</span>;
    }
    return <span className="px-2 py-1 rounded text-xs font-medium bg-neutral-50 text-black">{status || '-'}</span>;
  };

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-4 py-3 text-left text-black font-bold">
                Folio
              </th>
              <th className="px-4 py-3 text-left text-black font-bold">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-black font-bold">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-black font-bold">
                Cantidad
              </th>
              <th className="px-4 py-3 text-left text-black font-bold">
                Total
              </th>
              <th className="px-4 py-3 text-left text-black font-bold">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-black">
                  No se encontraron pedidos
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.order_id}
                  onClick={() => handleOrderClick(order)}
                  className="hover:bg-highlight-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3 text-black font-medium">
                    {order.folio || '-'}
                  </td>
                  <td className="px-4 py-3 text-black">
                    {order.client_name || '-'}
                  </td>
                  <td className="px-4 py-3 text-black">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-3 text-black">
                    {order.product_quantity ?? 0}
                  </td>
                  <td className="px-4 py-3 text-black font-medium">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(order.order_status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación del servidor */}
      {totalItems > 0 && (
        <div className="bg-neutral-50 border-t border-neutral-200 px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-black">Filas por página:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
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
                Página {currentPage} de {totalPages} ({totalItems} total)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded border border-neutral-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FiChevronLeft className="h-4 w-4 text-black" />
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded border border-neutral-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FiChevronRight className="h-4 w-4 text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

