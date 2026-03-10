import React, { useState, useEffect } from 'react';
import Modal from '../sharedComponents/Modal';
import { getInvoicesPayments } from '../../api/invoicesApi';

const formatCurrency = (amount) => {
  const num = Number(amount || 0);
  return num.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getMonthlyStatusBadge = (status) => {
  const value = status || '';
  if (value === 'PENDING') {
    return {
      label: 'Pendiente',
      classes: 'bg-amber-50 text-amber-800',
    };
  }
  if (value === 'OVERDUE') {
    return {
      label: 'Vencido',
      classes: 'bg-rose-50 text-rose-800',
    };
  }
  if (value === 'PAID') {
    return {
      label: 'Pagado',
      classes: 'bg-emerald-50 text-emerald-800',
    };
  }
  return {
    label: value || '-',
    classes: 'bg-neutral-100 text-neutral-700',
  };
};

export default function InvoicePaymentsModal({ isOpen, onClose, invoiceId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!isOpen || !invoiceId) {
      setData(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getInvoicesPayments(invoiceId)
      .then((res) => {
        setData(res?.body ?? null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message ?? 'Error al cargar los pagos');
        setLoading(false);
      });
  }, [isOpen, invoiceId]);

  const payments = data?.payments ?? [];
  const monthlyPayments = data?.monthly_payments ?? [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={invoiceId ? `Abonos y cortes - Factura #${invoiceId}` : 'Abonos y cortes'}
      size="xl"
    >
      {loading && (
        <div className="py-12 text-center text-neutral-600 font-poppinsRegular">
          Cargando información de pagos...
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm font-poppinsRegular">
          {error}
        </div>
      )}
      {!loading && !error && data && (
        <div className="space-y-6">
          {/* Sección: Abonos (payments) */}
          <section>
            <h3 className="text-sm font-poppinsBold text-neutral-900 mb-3">
              Abonos
            </h3>
            <div className="rounded-xl border border-primary-100 bg-primary-25/40 p-4">
              {payments.length === 0 ? (
                <p className="text-sm text-neutral-600 font-poppinsRegular py-4 text-center">
                  No hay abonos registrados
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-white/80 border-b border-neutral-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">
                          ID pago
                        </th>
                        <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">
                          Id factura
                        </th>
                        <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">
                          Fecha
                        </th>
                        <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">
                          Id aplicación
                        </th>
                        <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">
                          Pago afiliado
                        </th>
                        <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">
                          Margen
                        </th>
                        <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">
                          Comisión
                        </th>
                        <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">
                          Recargo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {payments.map((p) => (
                        <tr key={p.payment_id} className="bg-white border-b border-neutral-100 last:border-0">
                          <td className="px-3 py-2 text-neutral-900 font-poppinsMedium">
                            {p.payment_id}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">
                            {p.invoice_id}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">
                            {formatDateTime(p.created_at)}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">
                            {p.payment_application_id}
                          </td>
                          <td className="px-3 py-2 text-neutral-900 font-poppinsMedium text-right">
                            {formatCurrency(p.applied_affiliate_payment)}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 text-right">
                            {formatCurrency(p.applied_profit_margin)}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 text-right">
                            {formatCurrency(p.applied_affiliate_fee)}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 text-right">
                            {formatCurrency(p.applied_late_fee)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Sección: Cortes mensuales (monthly_payments) */}
          <section>
            <h3 className="text-sm font-poppinsBold text-neutral-900 mb-3">
              Cortes mensuales
            </h3>
            <div className="rounded-xl border border-highlight-200 bg-highlight-25/40 p-4">
              {monthlyPayments.length === 0 ? (
                <p className="text-sm text-neutral-600 font-poppinsRegular py-4 text-center">
                  No hay cortes mensuales
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-white/80 border-b border-neutral-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">
                          Período
                        </th>
                        <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">
                          Id factura
                        </th>
                        <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">
                          Corte
                        </th>
                        <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">
                          Fecha límite
                        </th>
                        <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">
                          Estado
                        </th>
                        <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">
                          Pago mensual
                        </th>
                        <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">
                          Pago afiliado
                        </th>
                        <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">
                          Margen
                        </th>
                        <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">
                          Comisión afiliado
                        </th>
                        <th className="px-3 py-2 text-right text-neutral-700 font-poppinsBold">
                          Recargo
                        </th>
                        <th className="px-3 py-2 text-left text-neutral-700 font-poppinsBold">
                          Creado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {monthlyPayments.map((m) => (
                        <tr key={m.invoice_monthly_payment_id} className="bg-white border-b border-neutral-100 last:border-0">
                          <td className="px-3 py-2 text-neutral-900 font-poppinsMedium">
                            {m.period_label}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">
                            {m.invoice_id}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">
                            {formatDate(m.cut_date)}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">
                            {formatDate(m.grace_end_date)}
                          </td>
                          <td className="px-3 py-2">
                            {(() => {
                              const { label, classes } = getMonthlyStatusBadge(
                                m.status,
                              );
                              return (
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-poppinsMedium ${classes}`}
                                >
                                  {label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-3 py-2 text-neutral-900 font-poppinsMedium text-right">
                            {formatCurrency(m.mensual_payment)}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 text-right">
                            {formatCurrency(m.monthly_affiliate_payment)}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 text-right">
                            {formatCurrency(m.monthly_profit_margin)}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 text-right">
                            {formatCurrency(m.monthly_affiliate_fee)}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 text-right">
                            {formatCurrency(m.late_fee_amount)}
                          </td>
                          <td className="px-3 py-2 text-neutral-600 font-poppinsRegular">
                            {formatDateTime(m.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </Modal>
  );
}
