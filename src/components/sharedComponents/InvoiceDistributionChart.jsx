import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const formatNumber = (num) => {
  return Number(num).toLocaleString('es-MX');
};

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const InvoiceDistributionChart = ({ data }) => {
  const chartData = [
    {
      name: 'Pagadas',
      value: Number(data?.paid?.paidInvoices?.total_invoices) || 0,
      amount: Number(data?.paid?.paidInvoices?.total_amount) || 0,
    },
    {
      name: 'Pendientes',
      value: Number(data?.pending?.pendingInvoices?.total_invoices) || 0,
      amount: Number(data?.pending?.pendingInvoices?.total_amount) || 0,
    },
    {
      name: 'Canceladas',
      value: Number(data?.canceled?.canceledInvoices?.total_invoices) || 0,
      amount: Number(data?.canceled?.canceledInvoices?.total_amount) || 0,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-poppinsMedium text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">Cantidad: {formatNumber(data.value)}</p>
          <p className="text-sm text-gray-600">
            Monto: {Number(data.amount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })}
          </p>
        </div>
      );
    }
    return null;
  };

  // Si no hay datos, mostrar un mensaje
  if (!data) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span className="font-poppinsRegular text-sm text-gray-600">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvoiceDistributionChart; 