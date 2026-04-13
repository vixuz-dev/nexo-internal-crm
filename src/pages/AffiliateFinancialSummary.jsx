import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getAffiliateFinancialSummary } from "../api/AfiliatesApi";
import AffiliateFinancialSummaryKPIs from "../components/affiliates/AffiliateFinancialSummaryKPIs";
import AffiliateFinancialSummaryCharts from "../components/affiliates/AffiliateFinancialSummaryCharts";
import AffiliateFinancialAffiliatesCollapsible from "../components/affiliates/AffiliateFinancialAffiliatesCollapsible";

const AffiliateFinancialSummary = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [body, setBody] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatusMessage(null);
    try {
      const res = await getAffiliateFinancialSummary();
      setBody(res?.body ?? null);
      setStatusMessage(res?.statusMessage ?? null);
    } catch (err) {
      setError(err?.message || "No se pudo cargar el resumen financiero");
      setBody(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8 mt-2 sm:mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-poppinsBold text-neutral-900 mb-2">
                Resumen financiero de Afiliados
              </h2>
              <p className="text-neutral-600 font-poppinsRegular text-sm sm:text-base max-w-2xl">
                Indicadores consolidados de facturación por afiliado, estados de
                factura y montos del mes en curso.
              </p>
              {statusMessage && !error && (
                <p className="mt-2 text-sm text-primary-700 font-poppinsMedium">
                  {statusMessage}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="self-start sm:self-auto px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-800 text-sm font-poppinsMedium hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Actualizando…" : "Actualizar"}
            </button>
          </div>

          {error && (
            <div
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 font-poppinsRegular"
              role="alert"
            >
              {error}
            </div>
          )}

          {loading && !body ? (
            <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center text-neutral-600 font-poppinsRegular">
              Cargando información…
            </div>
          ) : body ? (
            <div className="space-y-6 sm:space-y-8">
              <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm">
                <AffiliateFinancialSummaryKPIs data={body} />
              </div>
              <AffiliateFinancialSummaryCharts
                data={body}
                affiliates={body.affiliates}
              />
              <AffiliateFinancialAffiliatesCollapsible
                affiliates={body.affiliates}
              />
            </div>
          ) : !error ? (
            <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center text-neutral-600 font-poppinsRegular">
              No hay datos para mostrar.
            </div>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateFinancialSummary;
