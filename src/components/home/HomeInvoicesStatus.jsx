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
    { label: 'Pagadas', value: paid, bg: 'bg-emerald-50', text: 'text-emerald-900', ring: 'ring-emerald-200', icon: <FiCheckCircle className="h-6 w-6 text-emerald-600" /> },
    { label: 'Pendientes', value: pending, bg: 'bg-amber-50', text: 'text-amber-900', ring: 'ring-amber-200', icon: <FiClock className="h-6 w-6 text-amber-600" /> },
    { label: 'Canceladas', value: canceled, bg: 'bg-rose-50', text: 'text-rose-900', ring: 'ring-rose-200', icon: <FiXCircle className="h-6 w-6 text-rose-600" /> },
  ];

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg md:text-xl font-poppinsBold text-neutral-900">Estado de facturas</h3>
        <HomeInvoicesStatusSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg md:text-xl font-poppinsBold text-neutral-900">Estado de facturas</h3>
      <div className="grid grid-cols-1 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-xl ${c.bg} ring-1 ${c.ring} p-5`}>
            <div className="flex items-start justify-between">
              <p className="text-sm text-neutral-700 font-poppinsMedium">{c.label}</p>
              <div className="shrink-0 rounded-lg bg-white/70 p-2 ring-1 ring-white/60">{c.icon}</div>
            </div>
            <p className={`mt-2 text-3xl font-poppinsBold ${c.text}`}>{loading ? '—' : c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


