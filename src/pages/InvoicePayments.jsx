import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiChevronDown, FiChevronUp } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { getInvoicesPayments } from "../api/invoicesApi";
import { ROUTES } from "../utils/routes";

const formatCurrency = (amount) => {
  const num = Number(amount || 0);
  return num.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
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
  if (value === "PENDING") return { label: "Pendiente", classes: "bg-amber-50 text-amber-800" };
  if (value === "OVERDUE") return { label: "Vencido", classes: "bg-rose-50 text-rose-800" };
  if (value === "PAID") return { label: "Pagado", classes: "bg-emerald-50 text-emerald-800" };
  return { label: value || "-", classes: "bg-neutral-100 text-neutral-700" };
};

const InvoicePayments = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [openAbonos, setOpenAbonos] = useState(true);
  const [openCortes, setOpenCortes] = useState(true);

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

  // Abonos: usar resumen del backend
  const sumAppliedAffiliatePayment = Number(paymentsSummary.total_affiliate_payment || 0);
  const sumAppliedProfitMargin = Number(paymentsSummary.total_profit_margin || 0);
  const sumAppliedAffiliateFee = Number(paymentsSummary.total_affiliate_fee || 0);
  const sumAppliedLateFee = Number(paymentsSummary.total_late_fee || 0);
  const totalAbonado = Number(paymentsSummary.total_paid_with_fee || 0);
  const totalAbonadoSinMora = Number(paymentsSummary.total_paid || 0);
  const countAbonos = Number(paymentsSummary.total_payments || payments.length || 0);

  // Cortes mensuales: usar resumen del backend
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
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 mt-4 rounded-xl bg-white border border-neutral-200 px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
                Abonos y cortes de factura
              </h2>
              <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg">
                Detalle de abonos y cortes para la factura #{invoiceId}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(ROUTES.CONSULTAS_FACTURAS)}
              className="inline-flex items-center gap-2 justify-center rounded-lg border border-primary-500 bg-primary-50 px-4 py-2 text-sm font-poppinsMedium text-primary-700 hover:bg-primary-100 transition"
            >
              <FiArrowLeft className="h-4 w-4" />
              <span>Regresar</span>
            </button>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-4">
              <p className="text-red-800 text-sm font-poppinsRegular">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                <p className="text-neutral-600 font-poppinsRegular text-sm md:text-base">
                  Cargando información y cortes...
                </p>
              </div>
            </div>
          )}

          {!loading && !error && data && (
            <>
              {/* Cards de resumen: grid 2 columnas (izq: 2 grandes, der: 4x2) */}
              <div className="mb-6 rounded-xl bg-white border border-neutral-200 p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Columna izquierda: Card 1 y Card 2 */}
                  <div className="lg:col-span-1 flex flex-col gap-4">
                    {/* Card 1: Abonos - Total abonado con desglose */}
                    <div className="rounded-xl border border-primary-200 bg-primary-50/60 px-4 py-4 flex-1 flex flex-col">
                      <p className="text-sm font-poppinsBold text-primary-800 mb-3">Abonos · Total abonado</p>
                      <div className="space-y-2 text-sm font-poppinsRegular text-neutral-700 flex-1">
                        <div className="flex justify-between">
                          <span>Pago al afiliado</span>
                          <span className="font-poppinsMedium text-neutral-900">{formatCurrency(sumAppliedAffiliatePayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Margen de ganancia</span>
                          <span className="font-poppinsMedium text-neutral-900">{formatCurrency(sumAppliedProfitMargin)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Comisión afiliado</span>
                          <span className="font-poppinsMedium text-neutral-900">{formatCurrency(sumAppliedAffiliateFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mora (pagos atrasados)</span>
                          <span className="font-poppinsMedium text-neutral-900">{formatCurrency(sumAppliedLateFee)}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-primary-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-poppinsBold text-neutral-900">Total abonado</span>
                          <span className="text-lg font-poppinsBold text-primary-800">{formatCurrency(totalAbonado)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-poppinsRegular text-neutral-600">
                          <span>Total abonado (sin mora)</span>
                          <span className="font-poppinsMedium text-neutral-800">{formatCurrency(totalAbonadoSinMora)}</span>
                        </div>
                      </div>
                    </div>
                    {/* Card 2: Cortes mensuales - Total a pagar + desglose de estados */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-4 flex-1 flex flex-col">
                      <p className="text-sm font-poppinsBold text-amber-800 mb-2">
                        Cortes mensuales · Total a pagar
                      </p>
                      <p className="text-2xl font-poppinsBold text-neutral-900">
                        {formatCurrency(totalMensual)}
                      </p>
                      <p className="text-xs font-poppinsRegular text-neutral-600 mt-1">
                        Suma de pagos mensuales
                      </p>
                      <div className="mt-3 pt-3 border-t border-amber-200 space-y-1.5 text-xs font-poppinsRegular text-neutral-700">
                        <div className="flex justify-between">
                          <span>Pagos mensuales pagados</span>
                          <span className="font-poppinsMedium text-neutral-900">
                            {Number(monthlyPaymentsSummary.monthly_payments_paid || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pagos mensuales pendientes</span>
                          <span className="font-poppinsMedium text-neutral-900">
                            {Number(monthlyPaymentsSummary.monthly_payments_pending || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pagos mensuales vencidos</span>
                          <span className="font-poppinsMedium text-neutral-900">
                            {Number(monthlyPaymentsSummary.monthly_payments_late || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total cortes mensuales</span>
                          <span className="font-poppinsMedium text-neutral-900">
                            {Number(monthlyPaymentsSummary.total_monthly_payments || monthlyPayments.length || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Columna derecha: Cards 3-10 (4 filas x 2 columnas) */}
                  <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    {/* 3: Mora abonos */}
                    <div className="rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-4">
                      <p className="text-xs font-poppinsMedium text-rose-800 mb-1">Abonos</p>
                      <p className="text-sm font-poppinsRegular text-neutral-700">Cantidad pagada por mora (pagos atrasados)</p>
                      <p className="text-xl font-poppinsBold text-neutral-900 mt-2">{formatCurrency(sumAppliedLateFee)}</p>
                    </div>
                    {/* 4: Comisión afiliado abonos */}
                    <div className="rounded-xl border border-highlight-200 bg-highlight-50/60 px-4 py-4">
                      <p className="text-xs font-poppinsMedium text-highlight-800 mb-1">Abonos</p>
                      <p className="text-sm font-poppinsRegular text-neutral-700">Cantidad pagada por comisión del afiliado</p>
                      <p className="text-xl font-poppinsBold text-neutral-900 mt-2">{formatCurrency(sumAppliedAffiliateFee)}</p>
                    </div>
                    {/* 5: Margen abonos */}
                    <div className="rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-4">
                      <p className="text-xs font-poppinsMedium text-sky-800 mb-1">Abonos</p>
                      <p className="text-sm font-poppinsRegular text-neutral-700">Cantidad pagada por margen de ganancia</p>
                      <p className="text-xl font-poppinsBold text-neutral-900 mt-2">{formatCurrency(sumAppliedProfitMargin)}</p>
                    </div>
                    {/* 6: Cantidad abonos */}
                    <div className="rounded-xl border border-primary-200 bg-primary-50/60 px-4 py-4">
                      <p className="text-xs font-poppinsMedium text-primary-800 mb-1">Abonos</p>
                      <p className="text-sm font-poppinsRegular text-neutral-700">Cantidad de abonos</p>
                      <p className="text-2xl font-poppinsBold text-primary-800 mt-2">{countAbonos}</p>
                    </div>
                    {/* 7: Pago afiliado cortes */}
                    <div className="rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-4">
                      <p className="text-xs font-poppinsMedium text-violet-800 mb-1">Cortes mensuales</p>
                      <p className="text-sm font-poppinsRegular text-neutral-700">Cantidad a pagar al afiliado por el abono</p>
                      <p className="text-xl font-poppinsBold text-neutral-900 mt-2">{formatCurrency(sumMonthlyAffiliatePayment)}</p>
                    </div>
                    {/* 8: Margen cortes */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-4">
                      <p className="text-xs font-poppinsMedium text-emerald-800 mb-1">Cortes mensuales</p>
                      <p className="text-sm font-poppinsRegular text-neutral-700">Cantidad a pagar al margen de ganancia por el abono</p>
                      <p className="text-xl font-poppinsBold text-neutral-900 mt-2">{formatCurrency(sumMonthlyProfitMargin)}</p>
                    </div>
                    {/* 9: Comisión afiliado cortes */}
                    <div className="rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-4">
                      <p className="text-xs font-poppinsMedium text-teal-800 mb-1">Cortes mensuales</p>
                      <p className="text-sm font-poppinsRegular text-neutral-700">Cantidad a pagar por comisión del afiliado en el abono</p>
                      <p className="text-xl font-poppinsBold text-neutral-900 mt-2">{formatCurrency(sumMonthlyAffiliateFee)}</p>
                    </div>
                    {/* 10: Mora cortes */}
                    <div className="rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-4">
                      <p className="text-xs font-poppinsMedium text-rose-800 mb-1">Cortes mensuales</p>
                      <p className="text-sm font-poppinsRegular text-neutral-700">Cantidad a pagar por abono atrasado</p>
                      <p className="text-xl font-poppinsBold text-neutral-900 mt-2">{formatCurrency(sumLateFeeAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secciones colapsables */}
              <div className="rounded-xl bg-white border border-neutral-200 overflow-hidden">
                {/* Abonos */}
                <div className="border-b border-neutral-200 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenAbonos((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-4 sm:px-6 text-left bg-highlight-50 hover:bg-highlight-100 transition font-poppinsMedium text-neutral-900"
                  >
                    <span className="text-base md:text-lg">Abonos</span>
                    {openAbonos ? (
                      <FiChevronUp className="h-5 w-5 text-highlight-500 flex-shrink-0" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-highlight-500 flex-shrink-0" />
                    )}
                  </button>
                  {openAbonos && (
                    <div className="border-t border-neutral-100 overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                          <tr>
                            <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">ID pago</th>
                            <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">Id factura</th>
                            <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">Fecha</th>
                            <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">Id aplicación</th>
                            <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">Pago afiliado</th>
                            <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">Margen</th>
                            <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">Comisión</th>
                            <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">Recargo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {payments.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="px-3 py-6 text-center text-neutral-600 font-poppinsRegular">
                                No hay abonos registrados
                              </td>
                            </tr>
                          ) : (
                            payments.map((p) => (
                              <tr key={p.payment_id} className="bg-white hover:bg-neutral-50/50">
                                <td className="px-3 py-2 text-neutral-900 font-poppinsMedium">{p.payment_id}</td>
                                <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">{p.invoice_id}</td>
                                <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">{formatDateTime(p.created_at)}</td>
                                <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">{p.payment_application_id}</td>
                                <td className="px-3 py-2 text-neutral-900 font-poppinsMedium text-right">{formatCurrency(p.applied_affiliate_payment)}</td>
                                <td className="px-3 py-2 text-neutral-600 text-right">{formatCurrency(p.applied_profit_margin)}</td>
                                <td className="px-3 py-2 text-neutral-600 text-right">{formatCurrency(p.applied_affiliate_fee)}</td>
                                <td className="px-3 py-2 text-neutral-600 text-right">{formatCurrency(p.applied_late_fee)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Cortes mensuales */}
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenCortes((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-4 sm:px-6 text-left bg-primary-50 hover:bg-primary-100 transition font-poppinsMedium text-neutral-900"
                  >
                    <span className="text-base md:text-lg">Cortes mensuales</span>
                    {openCortes ? (
                      <FiChevronUp className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    )}
                  </button>
                  {openCortes && (
                    <div className="border-t border-neutral-100 overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                          <tr>
                            <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">Período</th>
                            <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">Id factura</th>
                            <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">Corte</th>
                            <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">Fecha límite</th>
                            <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">Estado</th>
                            <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">Pago mensual</th>
                            <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">Pago afiliado</th>
                            <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">Margen</th>
                            <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">Comisión</th>
                            <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">Recargo</th>
                            <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">Creado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {monthlyPayments.length === 0 ? (
                            <tr>
                              <td colSpan={11} className="px-3 py-6 text-center text-neutral-600 font-poppinsRegular">
                                No hay cortes mensuales
                              </td>
                            </tr>
                          ) : (
                            monthlyPayments.map((m) => {
                              const { label, classes } = getMonthlyStatusBadge(m.status);
                              return (
                                <tr key={m.invoice_monthly_payment_id} className="bg-white hover:bg-neutral-50/50">
                                  <td className="px-3 py-2 text-neutral-900 font-poppinsMedium">{m.period_label}</td>
                                  <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">{m.invoice_id}</td>
                                  <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">{formatDate(m.cut_date)}</td>
                                  <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">{formatDate(m.grace_end_date)}</td>
                                  <td className="px-3 py-2">
                                    <span className={`px-2 py-0.5 rounded text-xs font-poppinsMedium ${classes}`}>{label}</span>
                                  </td>
                                  <td className="px-3 py-2 text-neutral-900 font-poppinsMedium text-right">{formatCurrency(m.mensual_payment)}</td>
                                  <td className="px-3 py-2 text-neutral-600 text-right">{formatCurrency(m.monthly_affiliate_payment)}</td>
                                  <td className="px-3 py-2 text-neutral-600 text-right">{formatCurrency(m.monthly_profit_margin)}</td>
                                  <td className="px-3 py-2 text-neutral-600 text-right">{formatCurrency(m.monthly_affiliate_fee)}</td>
                                  <td className="px-3 py-2 text-neutral-600 text-right">{formatCurrency(m.late_fee_amount)}</td>
                                  <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">{formatDateTime(m.created_at)}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvoicePayments;
