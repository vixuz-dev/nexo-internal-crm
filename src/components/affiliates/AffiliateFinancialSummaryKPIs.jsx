import React from "react";
import {
  FiUsers,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiPercent,
} from "react-icons/fi";

const formatInt = (n) => Number(n ?? 0).toLocaleString("es-MX");

const formatMoney = (n) =>
  Number(n ?? 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });

function StatCard({ label, value, icon, tone = "neutral" }) {
  const tones = {
    neutral:
      "bg-white border-neutral-200 text-neutral-900 ring-neutral-100",
    primary:
      "bg-primary-50 border-primary-200 text-primary-900 ring-primary-100",
    highlight:
      "bg-highlight-50 border-highlight-200 text-highlight-900 ring-highlight-100",
    secondary:
      "bg-secondary-50 border-secondary-200 text-secondary-900 ring-secondary-100",
  };
  const iconTones = {
    neutral: "text-neutral-600",
    primary: "text-primary-600",
    highlight: "text-highlight-700",
    secondary: "text-secondary-600",
  };

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 ring-1 ${tones[tone] || tones.neutral}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs sm:text-sm font-poppinsMedium text-neutral-600 leading-snug">
          {label}
        </p>
        <div
          className={`shrink-0 rounded-lg bg-white/80 p-2 ring-1 ring-black/5 ${iconTones[tone]}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-2 text-xl sm:text-2xl font-poppinsBold tabular-nums">
        {value}
      </p>
    </div>
  );
}

/** Normaliza typo del backend `totalCancelledInvoives`. */
export function getCancelledInvoicesCount(data) {
  if (!data) return 0;
  return Number(
    data.totalCancelledInvoives ?? data.totalCancelledInvoices ?? 0
  );
}

export default function AffiliateFinancialSummaryKPIs({ data }) {
  if (!data) return null;

  const cancelled = getCancelledInvoicesCount(data);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-poppinsBold text-neutral-900 mb-3">
          Panorama general
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Total de afiliados"
            value={formatInt(data.totalAffiliates)}
            icon={<FiUsers className="h-5 w-5" />}
            tone="primary"
          />
          <StatCard
            label="Total de facturas"
            value={formatInt(data.totalInvoices)}
            icon={<FiFileText className="h-5 w-5" />}
            tone="neutral"
          />
          <StatCard
            label="Facturas pendientes"
            value={formatInt(data.totalPendingInvoices)}
            icon={<FiClock className="h-5 w-5" />}
            tone="neutral"
          />
          <StatCard
            label="Facturas pagadas"
            value={formatInt(data.totalPaidInvoices)}
            icon={<FiCheckCircle className="h-5 w-5" />}
            tone="secondary"
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-poppinsBold text-neutral-900 mb-3">
          Otros estados de facturas
        </h3>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            label="Facturas canceladas"
            value={formatInt(cancelled)}
            icon={<FiXCircle className="h-5 w-5" />}
            tone="neutral"
          />
          <StatCard
            label="Facturas eliminadas"
            value={formatInt(data.totalDeletedInvoices)}
            icon={<FiTrash2 className="h-5 w-5" />}
            tone="neutral"
          />
          <StatCard
            label="Pendientes de pago"
            value={formatInt(data.totalPendingPaymentInvoices)}
            icon={<FiAlertCircle className="h-5 w-5" />}
            tone="highlight"
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-poppinsBold text-neutral-900 mb-3">
          Mes en curso (consolidado)
        </h3>
        <p className="text-sm text-neutral-600 font-poppinsRegular mb-3">
          Montos y conteos relacionados con pagos del mes actual a nivel global.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <StatCard
            label="Facturas con pago este mes"
            value={formatInt(data.totalInvoicesPayThisMonth)}
            icon={<FiCalendar className="h-5 w-5" />}
            tone="primary"
          />
          <StatCard
            label="Total a pagar este mes"
            value={formatMoney(data.totalPayThisMonth)}
            icon={<FiDollarSign className="h-5 w-5" />}
            tone="highlight"
          />
          <StatCard
            label="Pago mínimo requerido"
            value={formatMoney(data.totalMinimumPayment)}
            icon={<FiPercent className="h-5 w-5" />}
            tone="secondary"
          />
        </div>
      </section>
    </div>
  );
}
