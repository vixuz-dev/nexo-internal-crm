import React from 'react';
import { FiUsers, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useClientsList } from '../../store/useClientsList';

export default function ClientsSummaryCards() {
  const { clients, loading } = useClientsList();

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 1).length;
  const inactiveClients = clients.filter(c => c.status === 0 || !c.status).length;

  const formatNumber = (val) => {
    return Number(val || 0).toLocaleString('es-MX');
  };

  const items = [
    {
      label: 'Total de clientes',
      value: formatNumber(totalClients),
      bg: 'bg-primary-50',
      text: 'text-primary-900',
      ring: 'ring-primary-200',
      icon: <FiUsers className="h-6 w-6 text-primary-600" />,
    },
    {
      label: 'Clientes activos',
      value: formatNumber(activeClients),
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      ring: 'ring-emerald-200',
      icon: <FiCheckCircle className="h-6 w-6 text-emerald-600" />,
    },
    {
      label: 'Clientes inactivos',
      value: formatNumber(inactiveClients),
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      ring: 'ring-rose-200',
      icon: <FiXCircle className="h-6 w-6 text-rose-600" />,
    },
  ];

  return (
    <div className="rounded-xl bg-white border border-neutral-200 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((c) => (
          <div key={c.label} className={`rounded-xl ${c.bg} ring-1 ${c.ring} p-5`}>
            <div className="flex items-start justify-between">
              <p className="text-sm text-neutral-700 font-poppinsMedium">{c.label}</p>
              <div className="shrink-0 rounded-lg bg-white/70 p-2 ring-1 ring-white/60">
                {c.icon}
              </div>
            </div>
            <p className={`mt-2 text-3xl font-poppinsBold ${c.text}`}>
              {loading ? '—' : c.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

