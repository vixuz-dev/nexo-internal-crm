import React from 'react';
import { FiUsers, FiTrendingUp, FiFileText } from 'react-icons/fi';
import { HomeSummaryGridSkeleton } from '../sharedComponents/Skeletons';
import { useHomePageInformacion } from '../../store/useHomePageInformacion';

export default function HomeSummaryCards() {
  const { clients, weeklyCollection, invoices, loading } = useHomePageInformacion();

  const formatNumber = (val) => {
    const n = Number(val || 0);
    return n.toLocaleString('es-MX');
  };

  const items = [
    {
      label: 'Clientes totales',
      value: formatNumber(clients?.totalClients),
      sub: `Nuevos (semana): ${clients?.newWeeklyClients ?? 0}`,
      bg: 'bg-primary-50',
      text: 'text-primary-900',
      ring: 'ring-primary-200',
      span: 'lg:col-span-5',
      icon: <FiUsers className="h-6 w-6 text-primary-600" />,
    },
    {
      label: 'Cobranza semanal',
      value: formatNumber(weeklyCollection?.totalWeekly),
      sub: `Nuevas (semana): ${weeklyCollection?.newWeeklyCollection ?? 0}`,
      bg: 'bg-secondary-50',
      text: 'text-secondary-900',
      ring: 'ring-secondary-200',
      span: 'lg:col-span-4',
      icon: <FiTrendingUp className="h-6 w-6 text-secondary-600" />,
    },
    {
      label: 'Facturas totales',
      value: formatNumber(invoices?.totalInvoices),
      sub: `Nuevas (semana): ${invoices?.newWeeklyInvoices ?? 0}`,
      bg: 'bg-highlight-50',
      text: 'text-highlight-900',
      ring: 'ring-highlight-200',
      span: 'lg:col-span-3',
      icon: <FiFileText className="h-6 w-6 text-highlight-600" />,
    },
  ];

  if (loading) {
    return <HomeSummaryGridSkeleton />;
  }

  return (
    <div className="rounded-xl bg-white border border-neutral-200 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        {items.map((c) => (
          <div key={c.label} className={`rounded-xl ${c.bg} ring-1 ${c.ring} p-5 ${c.span || ''}`}>
            <div className="flex items-start justify-between">
              <p className="text-sm text-neutral-700 font-poppinsMedium">{c.label}</p>
              <div className="shrink-0 rounded-lg bg-white/70 p-2 ring-1 ring-white/60">
                {c.icon}
              </div>
            </div>
            <p className={`mt-2 text-3xl font-poppinsBold ${c.text}`}>{loading ? '—' : c.value}</p>
            <p className="mt-1 text-xs text-neutral-700">{loading ? 'Cargando…' : c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


