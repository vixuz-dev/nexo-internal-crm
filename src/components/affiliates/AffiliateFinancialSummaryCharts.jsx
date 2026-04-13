import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getCancelledInvoicesCount } from "./AffiliateFinancialSummaryKPIs";

const PIE_COLORS = ["#208eaa", "#5ec4e3", "#c1d224", "#919190", "#e11d48"];

const formatInt = (n) => Number(n ?? 0).toLocaleString("es-MX");

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-lg text-sm">
        <p className="font-poppinsBold text-neutral-900">{item.name}</p>
        <p className="text-neutral-600 font-poppinsRegular">
          Facturas: {formatInt(item.value)}
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const row = payload[0].payload;
    return (
      <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-lg text-sm">
        <p className="font-poppinsBold text-neutral-900">
          Afiliado #{row.affiliate_id}
        </p>
        <p className="text-neutral-600 font-poppinsRegular">
          A pagar (mes):{" "}
          {Number(row.total_to_pay_this_month ?? 0).toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
            maximumFractionDigits: 0,
          })}
        </p>
        <p className="text-neutral-600 font-poppinsRegular">
          Pago mínimo:{" "}
          {Number(row.minimum_payment ?? 0).toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
            maximumFractionDigits: 0,
          })}
        </p>
      </div>
    );
  }
  return null;
};

export default function AffiliateFinancialSummaryCharts({ data, affiliates }) {
  const pieData = useMemo(() => {
    if (!data) return [];
    const cancelled = getCancelledInvoicesCount(data);
    const rows = [
      { name: "Pendientes", value: Number(data.totalPendingInvoices) || 0 },
      { name: "Pagadas", value: Number(data.totalPaidInvoices) || 0 },
      { name: "Canceladas", value: cancelled },
      { name: "Eliminadas", value: Number(data.totalDeletedInvoices) || 0 },
      {
        name: "Pendiente de pago",
        value: Number(data.totalPendingPaymentInvoices) || 0,
      },
    ];
    return rows.filter((r) => r.value > 0);
  }, [data]);

  const barData = useMemo(() => {
    if (!Array.isArray(affiliates)) return [];
    return [...affiliates].sort(
      (a, b) =>
        Number(b.total_to_pay_this_month || 0) -
        Number(a.total_to_pay_this_month || 0)
    );
  }, [affiliates]);

  const pieSum = pieData.reduce((s, r) => s + r.value, 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
        <h3 className="text-lg font-poppinsBold text-neutral-900 mb-1">
          Distribución de facturas (global)
        </h3>
        <p className="text-sm text-neutral-600 font-poppinsRegular mb-4">
          Proporción por estado; solo se muestran categorías con al menos una
          factura.
        </p>
        {pieSum === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-neutral-500 text-sm font-poppinsRegular">
            No hay facturas agrupadas por estado para graficar.
          </div>
        ) : (
          <div className="h-[300px] sm:h-[340px] w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="48%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={32}
                  formatter={(value) => (
                    <span className="text-xs sm:text-sm text-neutral-800 font-poppinsRegular">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
        <h3 className="text-lg font-poppinsBold text-neutral-900 mb-1">
          Afiliados: a pagar este mes
        </h3>
        <p className="text-sm text-neutral-600 font-poppinsRegular mb-4">
          Comparativa del monto total a pagar en el mes por afiliado (orden
          descendente).
        </p>
        {barData.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-neutral-500 text-sm font-poppinsRegular">
            No hay datos de afiliados.
          </div>
        ) : (
          <div className="h-[300px] sm:h-[340px] w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f0" />
                <XAxis
                  type="number"
                  tickFormatter={(v) =>
                    Number(v).toLocaleString("es-MX", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    })
                  }
                  className="text-xs"
                  stroke="#919190"
                />
                <YAxis
                  type="category"
                  dataKey="affiliate_id"
                  width={44}
                  tickFormatter={(id) => `#${id}`}
                  className="text-xs font-poppinsMedium"
                  stroke="#919190"
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(32,142,170,0.06)" }} />
                <Bar
                  dataKey="total_to_pay_this_month"
                  name="Total a pagar (mes)"
                  fill="#208eaa"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
