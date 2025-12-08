import React from 'react';
import { FiDollarSign, FiPackage } from 'react-icons/fi';

const CobranzaTodayCards = ({ todayTotal = 0, todayProducts = 0, loading = false }) => {
  const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    return num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatNumber = (val) => {
    const n = Number(val || 0);
    return n.toLocaleString('es-MX');
  };

  return (
    <div className="rounded-xl bg-white border border-neutral-200 p-4 mb-6">
      <h3 className="text-lg font-poppinsBold text-neutral-900 mb-4">
        Cobranza del día de hoy
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total de dinero */}
        <div className="rounded-xl bg-primary-50 ring-1 ring-primary-200 p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm text-neutral-700 font-poppinsMedium">Total de dinero</p>
            <div className="shrink-0 rounded-lg bg-white/70 p-2 ring-1 ring-white/60">
              <FiDollarSign className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-poppinsBold text-primary-900">
            {loading ? '—' : `$${formatCurrency(todayTotal)}`}
          </p>
        </div>

        {/* Cantidad de productos */}
        <div className="rounded-xl bg-secondary-50 ring-1 ring-secondary-200 p-5">
          <div className="flex items-start justify-between">
            <p className="text-sm text-neutral-700 font-poppinsMedium">Cantidad de productos</p>
            <div className="shrink-0 rounded-lg bg-white/70 p-2 ring-1 ring-white/60">
              <FiPackage className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-poppinsBold text-secondary-900">
            {loading ? '—' : formatNumber(todayProducts)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CobranzaTodayCards;


