import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { getInvoicesPayments } from "../api/invoicesApi";
import { ROUTES } from "../utils/routes";

const formatCurrency = (amount) => {
  const num = Number(amount || 0);
  return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getMonthlyStatusBadge = (status) => {
  const value = status || "";
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-white border";
  if (value === "PENDING")
    return { label: "Pendiente", classes: `${base} border-highlight-400 text-highlight-900` };
  if (value === "OVERDUE")
    return { label: "Vencido", classes: `${base} border-neutral-400 text-black` };
  if (value === "PAID")
    return { label: "Pagado", classes: `${base} border-primary-500 text-primary-900` };
  return {
    label: value || "—",
    classes: `${base} border-neutral-300 text-black`,
  };
};

function DetailField({ label, children }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 min-w-0 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-black/55">
        {label}
      </p>
      <div className="text-sm text-black font-medium mt-1 break-words">
        {children}
      </div>
    </div>
  );
}

function DetailGrid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
  );
}

function ExpandableRow({ title, subtitle, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 sm:px-5 text-left hover:bg-neutral-50 transition-colors"
      >
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-black text-sm sm:text-base">{title}</p>
          {subtitle ? (
            <p className="text-xs text-black/60 mt-0.5 truncate">{subtitle}</p>
          ) : null}
        </div>
        <span
          className={`shrink-0 text-black/70 transition-transform duration-300 ease-out motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        >
          <FiChevronDown className="h-5 w-5" aria-hidden />
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`border-t border-neutral-200 px-4 py-4 sm:px-5 bg-neutral-50/60 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!open}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const InvoicePayments = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!invoiceId) return;
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const res = await getInvoicesPayments(invoiceId);
        setData(res?.body ?? null);
      } catch (err) {
        setError(err?.message || "Error al cargar información de abonos");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [invoiceId]);

  const payments = data?.payments ?? [];
  const monthlyPayments = data?.monthly_payments ?? [];
  const paymentsSummary = data?.payments_summary ?? {};
  const monthlyPaymentsSummary = data?.monthly_payments_summary ?? {};

  const sumAppliedAffiliatePayment = Number(
    paymentsSummary.total_affiliate_payment || 0,
  );
  const sumAppliedProfitMargin = Number(
    paymentsSummary.total_profit_margin || 0,
  );
  const sumAppliedAffiliateFee = Number(
    paymentsSummary.total_affiliate_fee || 0,
  );
  const sumAppliedLateFee = Number(paymentsSummary.total_late_fee || 0);
  const totalAbonado = Number(paymentsSummary.total_paid_with_fee || 0);
  const totalAbonadoSinMora = Number(paymentsSummary.total_paid || 0);
  const countAbonos = Number(
    paymentsSummary.total_payments || payments.length || 0,
  );

  const totalMensual = Number(
    monthlyPaymentsSummary.total_amount_monthly_payment || 0,
  );
  const sumMonthlyAffiliatePayment = Number(
    monthlyPaymentsSummary.total_affiliate_payment || 0,
  );
  const sumMonthlyProfitMargin = Number(
    monthlyPaymentsSummary.total_profit_margin || 0,
  );
  const sumMonthlyAffiliateFee = Number(
    monthlyPaymentsSummary.total_affiliate_fee || 0,
  );
  const sumLateFeeAmount = Number(
    monthlyPaymentsSummary.total_late_fee || 0,
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto space-y-4">
          <div className="rounded-xl bg-white border border-neutral-200 px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-black mb-2">
                Abonos y cortes de factura
              </h2>
              <p className="text-black text-base md:text-lg">
                Factura #{invoiceId} — cada bloque se expande para ver el detalle.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(ROUTES.CONSULTAS_FACTURAS)}
              className="inline-flex items-center gap-2 justify-center rounded-lg border border-primary-300 bg-white px-4 py-2 text-sm font-medium text-primary-800 hover:bg-primary-50 transition shrink-0 shadow-sm"
            >
              <FiArrowLeft className="h-4 w-4" />
              <span>Regresar</span>
            </button>
          </div>

          {error && (
            <div className="rounded-xl bg-white border border-neutral-300 p-4 shadow-sm">
              <p className="text-black text-sm">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center min-h-[40vh] rounded-xl bg-white border border-neutral-200 py-12 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                <p className="text-black text-sm md:text-base">
                  Cargando información…
                </p>
              </div>
            </div>
          )}

          {!loading && !error && data && (
            <div className="space-y-3">
              <ExpandableRow
                title="Resumen de abonos aplicados"
                subtitle={`${countAbonos} abono(s) · Total abonado ${formatCurrency(totalAbonado)}`}
              >
                <DetailGrid>
                  <DetailField label="Pago al afiliado (aplicado en abonos)">
                    {formatCurrency(sumAppliedAffiliatePayment)}
                  </DetailField>
                  <DetailField label="Margen de ganancia (aplicado en abonos)">
                    {formatCurrency(sumAppliedProfitMargin)}
                  </DetailField>
                  <DetailField label="Comisión afiliado (aplicada en abonos)">
                    {formatCurrency(sumAppliedAffiliateFee)}
                  </DetailField>
                  <DetailField label="Mora / recargos por pagos atrasados (en abonos)">
                    {formatCurrency(sumAppliedLateFee)}
                  </DetailField>
                  <DetailField label="Total abonado (incluye cargos)">
                    <span className="text-primary-800 font-semibold">
                      {formatCurrency(totalAbonado)}
                    </span>
                  </DetailField>
                  <DetailField label="Total abonado sin mora">
                    {formatCurrency(totalAbonadoSinMora)}
                  </DetailField>
                </DetailGrid>
              </ExpandableRow>

              <ExpandableRow
                title="Resumen de cortes mensuales"
                subtitle={`Total a pagar ${formatCurrency(totalMensual)}`}
              >
                <DetailGrid>
                  <DetailField label="Total a pagar (suma de pagos mensuales)">
                    <span className="font-semibold">{formatCurrency(totalMensual)}</span>
                  </DetailField>
                  <DetailField label="Pagos mensuales pagados (cantidad)">
                    {Number(monthlyPaymentsSummary.monthly_payments_paid || 0)}
                  </DetailField>
                  <DetailField label="Pagos mensuales pendientes (cantidad)">
                    {Number(monthlyPaymentsSummary.monthly_payments_pending || 0)}
                  </DetailField>
                  <DetailField label="Pagos mensuales vencidos (cantidad)">
                    {Number(monthlyPaymentsSummary.monthly_payments_late || 0)}
                  </DetailField>
                  <DetailField label="Total de cortes mensuales registrados">
                    {Number(
                      monthlyPaymentsSummary.total_monthly_payments ||
                        monthlyPayments.length ||
                        0,
                    )}
                  </DetailField>
                  <DetailField label="Importe a pagar al afiliado (cortes)">
                    {formatCurrency(sumMonthlyAffiliatePayment)}
                  </DetailField>
                  <DetailField label="Importe a pagar a margen de ganancia (cortes)">
                    {formatCurrency(sumMonthlyProfitMargin)}
                  </DetailField>
                  <DetailField label="Importe a pagar por comisión de afiliado (cortes)">
                    {formatCurrency(sumMonthlyAffiliateFee)}
                  </DetailField>
                  <DetailField label="Importe por mora / abono atrasado (cortes)">
                    {formatCurrency(sumLateFeeAmount)}
                  </DetailField>
                </DetailGrid>
              </ExpandableRow>

              <p className="text-xs font-semibold uppercase tracking-wide text-black/55 pt-2 px-1">
                Abonos
              </p>
              {payments.length === 0 ? (
                <div className="rounded-xl border border-neutral-200 bg-white px-4 py-6 text-center text-sm text-black shadow-sm">
                  No hay abonos registrados
                </div>
              ) : (
                payments.map((p) => (
                  <ExpandableRow
                    key={p.payment_id}
                    title={`Abono #${p.payment_id}`}
                    subtitle={formatDateTime(p.created_at)}
                  >
                    <DetailGrid>
                      <DetailField label="ID del pago">{p.payment_id}</DetailField>
                      <DetailField label="ID de factura">{p.invoice_id}</DetailField>
                      <DetailField label="Fecha y hora de registro">
                        {formatDateTime(p.created_at)}
                      </DetailField>
                      <DetailField label="ID de aplicación de pago">
                        {p.payment_application_id ?? "—"}
                      </DetailField>
                      <DetailField label="Pago al afiliado aplicado">
                        {formatCurrency(p.applied_affiliate_payment)}
                      </DetailField>
                      <DetailField label="Margen de ganancia aplicado">
                        {formatCurrency(p.applied_profit_margin)}
                      </DetailField>
                      <DetailField label="Comisión de afiliado aplicada">
                        {formatCurrency(p.applied_affiliate_fee)}
                      </DetailField>
                      <DetailField label="Recargo / mora aplicada">
                        {formatCurrency(p.applied_late_fee)}
                      </DetailField>
                    </DetailGrid>
                  </ExpandableRow>
                ))
              )}

              <p className="text-xs font-semibold uppercase tracking-wide text-black/55 pt-2 px-1">
                Cortes mensuales
              </p>
              {monthlyPayments.length === 0 ? (
                <div className="rounded-xl border border-neutral-200 bg-white px-4 py-6 text-center text-sm text-black shadow-sm">
                  No hay cortes mensuales
                </div>
              ) : (
                monthlyPayments.map((m) => {
                  const { label, classes } = getMonthlyStatusBadge(m.status);
                  return (
                    <ExpandableRow
                      key={m.invoice_monthly_payment_id}
                      title={m.period_label || `Corte #${m.invoice_monthly_payment_id}`}
                      subtitle={`Estado: ${label}`}
                    >
                      <DetailGrid>
                        <DetailField label="Estado">
                          <span className={classes}>{label}</span>
                        </DetailField>
                        <DetailField label="Período">
                          {m.period_label ?? "—"}
                        </DetailField>
                        <DetailField label="ID de factura">{m.invoice_id}</DetailField>
                        <DetailField label="ID del corte mensual">
                          {m.invoice_monthly_payment_id}
                        </DetailField>
                        <DetailField label="Fecha de corte">
                          {formatDate(m.cut_date)}
                        </DetailField>
                        <DetailField label="Fecha límite / fin de gracia">
                          {formatDate(m.grace_end_date)}
                        </DetailField>
                        <DetailField label="Pago mensual">
                          {formatCurrency(m.mensual_payment)}
                        </DetailField>
                        <DetailField label="Pago al afiliado (corte)">
                          {formatCurrency(m.monthly_affiliate_payment)}
                        </DetailField>
                        <DetailField label="Margen de ganancia (corte)">
                          {formatCurrency(m.monthly_profit_margin)}
                        </DetailField>
                        <DetailField label="Comisión de afiliado (corte)">
                          {formatCurrency(m.monthly_affiliate_fee)}
                        </DetailField>
                        <DetailField label="Recargo por mora (corte)">
                          {formatCurrency(m.late_fee_amount)}
                        </DetailField>
                        <DetailField label="Fecha de creación del registro">
                          {formatDateTime(m.created_at)}
                        </DetailField>
                      </DetailGrid>
                    </ExpandableRow>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvoicePayments;
