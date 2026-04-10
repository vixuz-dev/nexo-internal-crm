import React from 'react';
import { useHomePageInformacion } from '../../store/useHomePageInformacion';
import { TableSkeleton } from '../sharedComponents/Skeletons';

const getStatusBadgeClass = (status) => {
  const s = status?.trim() || '';
  if (s === 'Pagado') return 'bg-primary-50 text-primary-800';
  if (s === 'Pendiente') return 'bg-highlight-100 text-highlight-900';
  if (s === 'Pendiente de pago') return 'bg-secondary-50 text-secondary-900';
  if (s === 'Cancelado') return 'bg-neutral-200 text-black';
  if (s === 'Eliminado') return 'bg-neutral-700 text-neutral-50';
  return 'bg-neutral-100 text-black';
};

export default function HomeLastInvoicesTable() {
  const { lastInvoices, loading } = useHomePageInformacion();
  const data = Array.isArray(lastInvoices) ? lastInvoices : [];

  if (loading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
      <div className="bg-neutral-50 px-4 py-4 border-b border-neutral-200">
        <h3 className="text-lg md:text-xl font-bold text-black">Últimas facturas</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            <tr className="text-left text-black">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4" colSpan={5}>Cargando…</td></tr>
            ) : data.length === 0 ? (
              <tr><td className="px-4 py-4" colSpan={5}>Sin registros</td></tr>
            ) : (
              data.slice(0, 10).map((row) => (
                <tr key={row.invoiceId} className="border-t border-neutral-200">
                  <td className="px-4 py-3 text-black">{row.invoiceId}</td>
                  <td className="px-4 py-3 text-black">{new Date(row.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-black">{Number(row.totalAmount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                  <td className="px-4 py-3 text-black">{row.client || '-'}</td> 
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(row.status)}`}>
                      {row.status || '-'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


