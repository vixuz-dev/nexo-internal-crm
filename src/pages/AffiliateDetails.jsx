import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiBriefcase, 
  FiUser, 
  FiCheckCircle, 
  FiXCircle,
  FiHash,
  FiFileText,
  FiTag,
  FiInfo,
  FiPhone,
  FiMail,
  FiImage,
  FiClock
} from "react-icons/fi";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAffiliatesList } from "../store/useAffiliatesList";
import { ROUTES } from "../utils/routes";

const AffiliateDetails = () => {
  const { affiliate_id } = useParams();
  const navigate = useNavigate();
  const { affiliates } = useAffiliatesList();

  // Obtener afiliado del store usando el ID de la URL
  const affiliate = useMemo(() => {
    const affiliateId = Number(affiliate_id);
    const foundAffiliate = affiliates.find(
      (a) => a.affiliate_id === affiliateId
    );
    return foundAffiliate || null;
  }, [affiliate_id, affiliates]);

  // Si no se encuentra el afiliado, mostrar mensaje o redirigir
  if (!affiliate) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-neutral-200 px-4 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8 mt-4">
              <h2 className="text-2xl md:text-3xl font-medium text-black mb-2">
                Afiliado no encontrado
              </h2>
              <p className="text-black text-base md:text-lg mb-4">
                No se pudo encontrar la información del afiliado con ID:{" "}
                {affiliate_id}
              </p>
              <button
                onClick={() => navigate(ROUTES.AFFILIATES)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                Volver al listado
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-neutral-200 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Encabezado con título, razón social, nombre comercial y botón de regresar */}
          <div className="mb-6 mt-4 rounded-xl bg-primary-50 border border-primary-200 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4 flex items-center gap-2">
                  <FiBriefcase className="h-6 w-6 text-primary-600" />
                  Detalle del afiliado
                </h2>
                {/* Información resumida del afiliado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-black">
                    <FiFileText className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-black font-medium">Razón Social</p>
                      <p className="text-sm font-bold text-black">{affiliate.legal_name || "Sin razón social"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-black">
                    <FiTag className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-black font-medium">Nombre Comercial</p>
                      <p className="text-sm font-bold text-black">{affiliate.comercial_name || "Sin nombre comercial"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-black">
                    <FiHash className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-black font-medium">ID</p>
                      <p className="text-sm font-bold text-black">{affiliate.affiliate_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-black">
                    {affiliate.user_status === true ? (
                      <FiCheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                    ) : (
                      <FiXCircle className="h-5 w-5 text-black flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-xs text-black font-medium">Estado</p>
                      <p className={`text-sm font-bold ${affiliate.user_status === true ? "text-primary-700" : "text-black"}`}>
                        {affiliate.user_status === true ? "Activo" : "Inactivo"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Botón de regresar */}
              <button
                onClick={() => navigate(ROUTES.AFFILIATES)}
                className="flex items-center gap-2 px-4 py-2 border border-highlight-500 rounded-lg text-black hover:bg-highlight-100 transition font-medium whitespace-nowrap"
                title="Volver al listado de afiliados"
              >
                <FiArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Regresar</span>
              </button>
            </div>
          </div>

          {/* Contenido principal con secciones */}
          <div className="space-y-6">
            {/* Sección 1: Información Legal/Empresarial */}
            <div className="rounded-xl bg-secondary-50 border border-secondary-200 p-6">
              <h3 className="text-lg md:text-xl font-bold text-black mb-4 flex items-center gap-2">
                <FiFileText className="h-5 w-5 text-secondary-600" />
                Información Legal/Empresarial
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FiFileText className="h-5 w-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium mb-1">RFC</p>
                    <p className="text-black">{affiliate.rfc || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiBriefcase className="h-5 w-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium mb-1">Tipo de empresa</p>
                    <p className="text-black">{affiliate.company_type || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiTag className="h-5 w-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium mb-1">Sector</p>
                    <p className="text-black">{affiliate.sector || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  {affiliate.is_constituded === true ? (
                    <FiCheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <FiXCircle className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium mb-1">Constituida</p>
                    <p className={affiliate.is_constituded === true ? "text-primary-700" : "text-black"}>
                      {affiliate.is_constituded === true ? "Sí" : "No"}
                    </p>
                  </div>
                </div>
                {affiliate.description && (
                  <div className="md:col-span-2 flex items-start gap-3">
                    <FiInfo className="h-5 w-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-black font-medium mb-1">Descripción</p>
                      <p className="text-black">{affiliate.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sección 2: Información de Contacto */}
            <div className="rounded-xl bg-highlight-50 border border-highlight-200 p-6">
              <h3 className="text-lg md:text-xl font-bold text-black mb-4 flex items-center gap-2">
                <FiUser className="h-5 w-5 text-highlight-600" />
                Información de Contacto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FiUser className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium mb-1">Nombre del titular</p>
                    <p className="text-black">{affiliate.titular_name || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMail className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium mb-1">Email</p>
                    <p className="text-black">{affiliate.email || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium mb-1">Teléfono domicilio</p>
                    <p className="text-black">{affiliate.home_phone || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="h-5 w-5 text-highlight-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium mb-1">Teléfono personal</p>
                    <p className="text-black">{affiliate.personal_phone || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 3 y 4: Información Adicional e Información del Sistema (en 2 columnas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sección 3: Información Adicional */}
              <div className="rounded-xl bg-primary-50 border border-primary-200 p-6">
                <h3 className="text-lg md:text-xl font-bold text-black mb-4 flex items-center gap-2">
                  <FiInfo className="h-5 w-5 text-primary-600" />
                  Información Adicional
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {affiliate.affiliate_profile_info && (
                    <div className="flex items-start gap-3">
                      <FiInfo className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-black font-medium mb-1">Perfil del afiliado</p>
                        <p className="text-black">{affiliate.affiliate_profile_info}</p>
                      </div>
                    </div>
                  )}
                  {affiliate.logo_url && (
                    <div className="flex items-start gap-3">
                      <FiImage className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-black font-medium mb-1">Logo</p>
                        <img 
                          src={affiliate.logo_url} 
                          alt={affiliate.comercial_name || "Logo"}
                          className="w-24 h-24 object-contain rounded-lg border border-neutral-200 bg-white p-2"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sección 4: Información del Sistema */}
              <div className="rounded-xl bg-secondary-50 border border-secondary-200 p-6">
                <h3 className="text-lg md:text-xl font-bold text-black mb-4 flex items-center gap-2">
                  <FiClock className="h-5 w-5 text-secondary-600" />
                  Información del Sistema
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-3">
                    <FiHash className="h-5 w-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-black font-medium mb-1">ID del afiliado</p>
                      <p className="text-black">{affiliate.affiliate_id}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiClock className="h-5 w-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-black font-medium mb-1">Fecha de registro</p>
                      <p className="text-black">{formatDate(affiliate.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateDetails;

