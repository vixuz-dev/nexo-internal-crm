import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useHomePageInformacion } from '../../store/useHomePageInformacion';
import { HomePieSkeleton } from '../sharedComponents/Skeletons';

// Gradients are defined in <defs>; keep solid fallbacks for safety
const SOLID_COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export default function HomeInvoicesPie() {
  const { totalInvoices, loading } = useHomePageInformacion();

  const data = [
    { name: 'Pagadas', value: Number(totalInvoices?.paid || 0) },
    { name: 'Pendientes', value: Number(totalInvoices?.pending || 0) },
    { name: 'Canceladas', value: Number(totalInvoices?.canceled || 0) },
  ];

  // Verificar si todos los valores son 0
  const total = Number(totalInvoices?.paid || 0) + 
                Number(totalInvoices?.pending || 0) + 
                Number(totalInvoices?.canceled || 0);
  const allZero = total === 0;

  if (loading) {
    return <HomePieSkeleton />;
  }

  return (
    <div className="h-full w-full bg-transparent flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200">
        <h3 className="text-base md:text-lg font-poppinsMedium text-neutral-900">Distribución de facturas</h3>
      </div>
      <div className="flex-1 p-2">
        {allZero ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-neutral-700 text-center font-poppinsRegular">
              No hay facturas registradas
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="grad-paid" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="grad-pending" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
                <linearGradient id="grad-canceled" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FCA5A5" />
                  <stop offset="100%" stopColor="#BE123C" />
                </linearGradient>
              </defs>
              <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={110} paddingAngle={5} cornerRadius={10} dataKey="value" stroke="#ffffff" strokeWidth={3}>
                <Cell key="paid" fill="url(#grad-paid)" stroke="#ffffff" />
                <Cell key="pending" fill="url(#grad-pending)" stroke="#ffffff" />
                <Cell key="canceled" fill="url(#grad-canceled)" stroke="#ffffff" />
              </Pie>
              <Tooltip formatter={(v) => Number(v).toLocaleString('es-MX')} />
              <Legend verticalAlign="bottom" height={24} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}


