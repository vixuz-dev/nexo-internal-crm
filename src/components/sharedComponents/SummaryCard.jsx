import React from 'react';

const SummaryCard = ({ value, subtitle, secondaryValue, secondaryLabel, isMoney }) => {
  const formatNumber = (num) => {
    if (isMoney) {
      return Number(num).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
    }
    return Number(num).toLocaleString('es-MX');
  };

  return (
    <div className="bg-white bg-opacity-80 rounded-xl shadow-md px-6 py-4 flex flex-col items-center min-w-[220px]">
      <div className="text-2xl font-medium text-black mb-1">{formatNumber(value)}</div>
      <div className="text-xs text-black mb-1 text-center">{subtitle}</div>
      {secondaryValue !== undefined && (
        <div className="text-sm text-primary-600 mt-1 text-center">
          {formatNumber(secondaryValue)}
          {secondaryLabel && <span className="ml-1 text-black">{secondaryLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default SummaryCard; 