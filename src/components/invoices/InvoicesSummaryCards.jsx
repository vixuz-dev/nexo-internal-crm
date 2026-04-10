import React, { useMemo } from 'react';
import { FiFileText, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { useInvoicesList } from '../../store/useInvoicesList';
import { HomeSummaryGridSkeleton } from '../sharedComponents/Skeletons';

export default function InvoicesSummaryCards() {
  const { invoices, loading } = useInvoicesList();

  const { totalInvoices, paidInvoices, pendingInvoices, cancelledInvoices } = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter(invoice => invoice.invoice_status === 'Pagado').length;
    const pending = invoices.filter(invoice => invoice.invoice_status === 'Pendiente').length;
    const cancelled = invoices.filter(invoice => invoice.invoice_status === 'Cancelado' || !invoice.invoice_status).length;
    return { 
      totalInvoices: total, 
      paidInvoices: paid, 
      pendingInvoices: pending, 
      cancelledInvoices: cancelled 
    };
  }, [invoices]);

  const formatNumber = (val) => {
    const n = Number(val || 0);
    return n.toLocaleString('es-MX');
  };

  const items = [
    {
      label: 'Total de Facturas',
      value: formatNumber(totalInvoices),
      bg: 'bg-primary-50',
      text: 'text-primary-900',
      ring: 'ring-primary-200',
      icon: <FiFileText className="h-6 w-6 text-primary-600" />,
    },
    {
      label: 'Pagadas',
      value: formatNumber(paidInvoices),
      bg: 'bg-primary-50',
      text: 'text-primary-900',
      ring: 'ring-primary-200',
      icon: <FiCheckCircle className="h-6 w-6 text-primary-600" />,
    },
    {
      label: 'Sin pagar',
      value: formatNumber(pendingInvoices),
      bg: 'bg-highlight-100',
      text: 'text-highlight-900',
      ring: 'ring-highlight-200',
      icon: <FiClock className="h-6 w-6 text-highlight-700" />,
    },
    {
      label: 'Canceladas',
      value: formatNumber(cancelledInvoices),
      bg: 'bg-neutral-200',
      text: 'text-black',
      ring: 'ring-neutral-300',
      icon: <FiXCircle className="h-6 w-6 text-black" />,
    },
  ];

  if (loading) {
    return <HomeSummaryGridSkeleton />;
  }

  return (
    <div className="rounded-xl bg-white border border-neutral-200 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((c) => (
          <div key={c.label} className={`rounded-xl ${c.bg} ring-1 ${c.ring} p-5`}>
            <div className="flex items-start justify-between">
              <p className="text-sm text-black font-medium">{c.label}</p>
              <div className="shrink-0 rounded-lg bg-white/70 p-2 ring-1 ring-white/60">
                {c.icon}
              </div>
            </div>
            <p className={`mt-2 text-3xl font-bold ${c.text}`}>{loading ? '—' : c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


