import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const formatInt = (n) => Number(n ?? 0).toLocaleString("es-MX");

const formatMoney = (n) =>
  Number(n ?? 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });

export default function AffiliateFinancialAffiliatesCollapsible({ affiliates }) {
  const [open, setOpen] = useState(true);
  const list = Array.isArray(affiliates) ? affiliates : [];

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-6 text-left bg-neutral-50 hover:bg-neutral-100 transition border-b border-neutral-200"
        aria-expanded={open}
      >
        <div>
          <h3 className="text-lg font-poppinsBold text-neutral-900">
            Detalle por afiliado
          </h3>
          <p className="text-sm text-neutral-600 font-poppinsRegular mt-0.5">
            {list.length} registro{list.length === 1 ? "" : "s"} — facturas y
            montos del mes por ID de afiliado.
          </p>
        </div>
        <span className="shrink-0 rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700">
          {open ? (
            <FiChevronUp className="h-5 w-5" />
          ) : (
            <FiChevronDown className="h-5 w-5" />
          )}
        </span>
      </button>

      {open && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left font-poppinsMedium text-neutral-700 whitespace-nowrap">
                  ID
                </th>
                <th className="px-3 sm:px-4 py-3 text-right font-poppinsMedium text-neutral-700 whitespace-nowrap">
                  Total fact.
                </th>
                <th className="px-3 sm:px-4 py-3 text-right font-poppinsMedium text-neutral-700 whitespace-nowrap">
                  Pend.
                </th>
                <th className="px-3 sm:px-4 py-3 text-right font-poppinsMedium text-neutral-700 whitespace-nowrap">
                  Pagadas
                </th>
                <th className="px-3 sm:px-4 py-3 text-right font-poppinsMedium text-neutral-700 whitespace-nowrap">
                  Cancel.
                </th>
                <th className="px-3 sm:px-4 py-3 text-right font-poppinsMedium text-neutral-700 whitespace-nowrap">
                  Elim.
                </th>
                <th className="px-3 sm:px-4 py-3 text-right font-poppinsMedium text-neutral-700 whitespace-nowrap">
                  Pend. pago
                </th>
                <th className="px-3 sm:px-4 py-3 text-right font-poppinsMedium text-neutral-700 whitespace-nowrap">
                  Fact. pago mes
                </th>
                <th className="px-3 sm:px-4 py-3 text-right font-poppinsMedium text-neutral-700 whitespace-nowrap">
                  A pagar (mes)
                </th>
                <th className="px-3 sm:px-4 py-3 text-right font-poppinsMedium text-neutral-700 whitespace-nowrap">
                  Pago mín.
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {list.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-8 text-center text-neutral-600 font-poppinsRegular"
                  >
                    Sin registros de afiliados.
                  </td>
                </tr>
              ) : (
                list.map((row) => (
                  <tr
                    key={row.affiliate_id}
                    className="hover:bg-highlight-50/50 transition"
                  >
                    <td className="px-3 sm:px-4 py-3 text-neutral-900 font-poppinsMedium whitespace-nowrap">
                      {row.affiliate_id}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right text-neutral-700 tabular-nums">
                      {formatInt(row.total_invoices)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right text-neutral-700 tabular-nums">
                      {formatInt(row.pending)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right text-neutral-700 tabular-nums">
                      {formatInt(row.paid)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right text-neutral-700 tabular-nums">
                      {formatInt(row.cancelled)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right text-neutral-700 tabular-nums">
                      {formatInt(row.deleted)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right text-neutral-700 tabular-nums">
                      {formatInt(row.pending_payment)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right text-neutral-700 tabular-nums">
                      {formatInt(row.total_invoices_pay_this_month)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right text-neutral-800 font-poppinsMedium tabular-nums whitespace-nowrap">
                      {formatMoney(row.total_to_pay_this_month)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-right text-neutral-700 tabular-nums whitespace-nowrap">
                      {formatMoney(row.minimum_payment)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
