import React from 'react';
import { FiCalendar } from 'react-icons/fi';

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  // Obtener fecha de hoy como valor por defecto para endDate
  const today = new Date().toISOString().split('T')[0];
  // Obtener fecha de hace 7 días como valor por defecto para startDate
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 7);
  const defaultStart = defaultStartDate.toISOString().split('T')[0];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="flex-1">
        <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2 flex items-center gap-2">
          <FiCalendar className="h-4 w-4" />
          Fecha Inicio
        </label>
        <input
          type="date"
          value={startDate || defaultStart}
          onChange={(e) => onStartDateChange(e.target.value)}
          max={endDate || today}
          className="w-full px-4 py-2 border-2 border-neutral-500 rounded-lg bg-white text-neutral-900 font-poppinsRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2 flex items-center gap-2">
          <FiCalendar className="h-4 w-4" />
          Fecha Fin
        </label>
        <input
          type="date"
          value={endDate || today}
          onChange={(e) => onEndDateChange(e.target.value)}
          min={startDate || defaultStart}
          max={today}
          className="w-full px-4 py-2 border-2 border-neutral-500 rounded-lg bg-white text-neutral-900 font-poppinsRegular focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;


