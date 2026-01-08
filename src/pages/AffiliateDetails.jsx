import React, { useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAffiliatesList } from "../store/useAffiliatesList";
import { ROUTES } from "../utils/routes";

const AffiliateDetails = () => {
  const { affiliate_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { affiliates } = useAffiliatesList();

  // Estrategia híbrida: obtener afiliado del state (navegación desde tabla) o del store (recarga/acceso directo)
  const affiliate = useMemo(() => {
    // 1. Intentar obtener del state (cuando navegas desde AffiliatesTable)
    if (location.state?.affiliate) {
      return location.state.affiliate;
    }

    // 2. Si no está en state, buscar en el store usando el ID de la URL
    const affiliateId = Number(affiliate_id);
    const foundAffiliate = affiliates.find(
      (a) => a.affiliate_id === affiliateId
    );

    return foundAffiliate || null;
  }, [location.state, affiliate_id, affiliates]);

  // Si no se encuentra el afiliado, mostrar mensaje o redirigir
  if (!affiliate) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-neutral-200 px-4 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8 mt-4">
              <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
                Afiliado no encontrado
              </h2>
              <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg mb-4">
                No se pudo encontrar la información del afiliado con ID:{" "}
                {affiliate_id}
              </p>
              <button
                onClick={() => navigate(ROUTES.AFFILIATES)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-poppinsMedium"
              >
                Volver al listado
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título, razón social, nombre comercial y botón de regresar */}
          <div className="mb-6 mt-4 rounded-xl bg-white border border-neutral-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-poppinsMedium text-neutral-900 mb-2">
                  Detalle del afiliado
                </h2>
                {/* Razón social, nombre comercial e ID */}
                <p className="text-neutral-600 font-poppinsRegular text-base md:text-lg">
                  Razón Social: {affiliate.legal_name || "Sin razón social"} - 
                  Nombre Comercial: {affiliate.comercial_name || "Sin nombre comercial"} - 
                  ID: {affiliate.affiliate_id}
                </p>
              </div>
              {/* Botón de regresar */}
              <button
                onClick={() => navigate(ROUTES.AFFILIATES)}
                className="flex items-center gap-2 px-4 py-2 border border-highlight-500 rounded-lg text-neutral-700 hover:bg-highlight-100 transition font-poppinsMedium whitespace-nowrap"
                title="Volver al listado de afiliados"
              >
                <FiArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Regresar</span>
              </button>
            </div>
          </div>

          {/* Contenido - Se agregará el template más adelante */}
          <div className="rounded-xl bg-white border border-neutral-200 p-6">
            <p className="text-neutral-600 font-poppinsRegular">
              La información del afiliado se mostrará aquí.
            </p>
            {/* Debug: mostrar que tenemos los datos del afiliado */}
            <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-500 font-poppinsRegular">
                Debug: Afiliado obtenido{" "}
                {location.state?.affiliate ? "desde state" : "desde store"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateDetails;

