import React from 'react';
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { HomeInvoicesStatusSkeleton } from '../sharedComponents/Skeletons';
import { useHomePageInformacion } from '../../store/useHomePageInformacion';

export default function HomeInvoicesStatus() {
  const { totalInvoices, loading } = useHomePageInformacion();
  const formatNumber = (val) => Number(val || 0).toLocaleString('es-MX');
  const paid = formatNumber(totalInvoices?.paid);
  const pending = formatNumber(totalInvoices?.pending);
  const canceled = formatNumber(totalInvoices?.canceled);

  const cards = [
    { label: 'Pagadas', value: paid, bg: 'bg-primary-50', text: 'text-primary-900', ring: 'ring-primary-200', icon: <FiCheckCircle className="h-6 w-6 text-primary-600" /> },
    { label: 'Pendientes', value: pending, bg: 'bg-highlight-100', text: 'text-highlight-900', ring: 'ring-highlight-200', icon: <FiClock className="h-6 w-6 text-highlight-700" /> },
    { label: 'Canceladas', value: canceled, bg: 'bg-neutral-200', text: 'text-black', ring: 'ring-neutral-300', icon: <FiXCircle className="h-6 w-6 text-black" /> },
  ];

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg md:text-xl font-bold text-black">Estado de facturas</h3>
        <HomeInvoicesStatusSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg md:text-xl font-bold text-black">Estado de facturas</h3>
      <div className="grid grid-cols-1 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-xl ${c.bg} ring-1 ${c.ring} p-5`}>
            <div className="flex items-start justify-between">
              <p className="text-sm text-black font-medium">{c.label}</p>
              <div className="shrink-0 rounded-lg bg-white/70 p-2 ring-1 ring-white/60">{c.icon}</div>
            </div>
            <p className={`mt-2 text-3xl font-bold ${c.text}`}>{loading ? '—' : c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


