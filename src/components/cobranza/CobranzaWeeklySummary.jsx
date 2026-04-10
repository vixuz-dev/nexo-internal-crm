import React from 'react';
import { FiTrendingUp } from 'react-icons/fi';

const CobranzaWeeklySummary = ({ weeklyTotal = 0, loading = false }) => {
  const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    return num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="rounded-xl bg-white border border-neutral-200 p-4 mb-6">
      <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
        <FiTrendingUp className="h-5 w-5 text-primary-600" />
        Resumen de cobranza semanal
      </h3>
      <div className="rounded-xl bg-highlight-50 ring-1 ring-highlight-200 p-5">
        <div className="flex items-start justify-between">
          <p className="text-sm text-black font-medium">Total semanal</p>
          <div className="shrink-0 rounded-lg bg-white/70 p-2 ring-1 ring-white/60">
            <FiTrendingUp className="h-6 w-6 text-highlight-600" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold text-highlight-900">
          {loading ? '—' : `$${formatCurrency(weeklyTotal)}`}
        </p>
      </div>
    </div>
  );
};

export default CobranzaWeeklySummary;


