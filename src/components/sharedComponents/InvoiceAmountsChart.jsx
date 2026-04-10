import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Formateador abreviado para el eje Y
const formatAbbreviated = (num) => {
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num;
};

const COLORS = ['#208eaa', '#c1d224', '#919190'];

const InvoiceAmountsChart = ({ data }) => {
  const chartData = [
    {
      name: 'Pagadas',
      Monto: Number(data?.paid?.paidInvoices?.total_amount) || 0,
    },
    {
      name: 'Pendientes',
      Monto: Number(data?.pending?.pendingInvoices?.total_amount) || 0,
    },
    {
      name: 'Canceladas',
      Monto: Number(data?.canceled?.canceledInvoices?.total_amount) || 0,
    },
  ];

  if (!data) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-black">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatAbbreviated} />
          <Tooltip formatter={value => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })} />
          <Bar dataKey="Monto">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvoiceAmountsChart; 