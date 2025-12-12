import React, { useState, useEffect } from "react";
import Modal from "../sharedComponents/Modal";
import Select from "../sharedComponents/Select";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiTag,
  FiEdit2,
  FiSave,
  FiX,
} from "react-icons/fi";
import { updateClient } from "../../api/clientsApi";
import { useClientsList } from "../../store/useClientsList";

const ClientDetailsModal = ({ isOpen, onClose, client }) => {
  const isCreateMode = !client;

  const [isEditing, setIsEditing] = useState(isCreateMode);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const { updateClientInList } = useClientsList();

  // Estados de la República Mexicana
  const estadosMexico = [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Ciudad de México",
    "Coahuila",
    "Colima",
    "Durango",
    "Estado de México",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas",
  ];

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        // Asegurar que personal_phonenumber sea string
        personal_phonenumber: client.personal_phonenumber ? String(client.personal_phonenumber) : "",
        email: client.email || "",
        status: client.status !== undefined ? client.status : 1,
        street: client.street || "",
        external_number: client.external_number || "",
        internal_number: client.internal_number || "",
        neighborhood: client.neighborhood || "",
        city: client.city || "",
        state: client.state || "",
        // Asegurar que zip_code sea string (puede venir como número desde la API)
        zip_code: client.zip_code ? String(client.zip_code) : "",
      });
      setErrors({});
      setIsEditing(false);
    } else {
      onClose();
    }
  }, [client, isOpen]);

  // En modo create, no necesitamos retornar null

  // Funciones de validación
  const validatePhone = (phone) => {
    if (!phone) return null;
    // Asegurar que phone sea string
    const phoneStr = String(phone);
    const phoneDigits = phoneStr.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      return "El teléfono debe tener exactamente 10 dígitos";
    }
    return null;
  };

  const validateEmail = (email) => {
    if (!email) return null;
    // Asegurar que email sea string
    const emailStr = String(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      return "Correo electrónico inválido";
    }
    return null;
  };

  const validateZipCode = (zipCode) => {
    if (!zipCode) return null;
    // Asegurar que zipCode sea string
    const zipCodeStr = String(zipCode);
    const zipDigits = zipCodeStr.replace(/\D/g, "");
    if (zipDigits.length !== 5) {
      return "El código postal debe tener exactamente 5 dígitos";
    }
    return null;
  };

  const validateField = (field, value) => {
    let error = null;
    switch (field) {
      case "personal_phonenumber":
        error = validatePhone(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "zip_code":
        error = validateZipCode(value);
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    // Convertir a string para asegurar que podemos usar .trim()
    const phoneValue = formData.personal_phonenumber ? String(formData.personal_phonenumber) : "";
    const emailValue = formData.email ? String(formData.email) : "";
    const zipCodeValue = formData.zip_code ? String(formData.zip_code) : "";
    const stateValue = formData.state ? String(formData.state) : "";

    // Validar teléfono (requerido y debe tener 10 dígitos)
    if (!phoneValue || phoneValue.trim() === "") {
      newErrors.personal_phonenumber = "El teléfono es requerido";
    } else {
      const phoneError = validatePhone(phoneValue);
      if (phoneError) newErrors.personal_phonenumber = phoneError;
    }

    // Validar email (opcional, pero si tiene valor debe ser válido)
    if (emailValue && emailValue.trim() !== "") {
      const emailError = validateEmail(emailValue);
      if (emailError) newErrors.email = emailError;
    }

    // Validar código postal (requerido y debe tener 5 dígitos)
    if (!zipCodeValue || zipCodeValue.trim() === "") {
      newErrors.zip_code = "El código postal es requerido";
    } else {
      const zipError = validateZipCode(zipCodeValue);
      if (zipError) newErrors.zip_code = zipError;
    }

    // Validar estado (requerido)
    if (!stateValue || stateValue.trim() === "") {
      newErrors.state = "El estado es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Aplicar filtros según el tipo de campo
    let processedValue = value;
    if (field === "personal_phonenumber") {
      // Solo permitir números, máximo 10 dígitos
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (field === "zip_code") {
      // Solo permitir números, máximo 5 dígitos
      processedValue = value.replace(/\D/g, "").slice(0, 5);
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));
  };

  const handleBlur = (field, value) => {
    const error = validateField(field, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleCancel = () => {
    if (client) {
      setFormData({
        name: client.name || "",
        // Asegurar que personal_phonenumber sea string
        personal_phonenumber: client.personal_phonenumber ? String(client.personal_phonenumber) : "",
        email: client.email || "",
        status: client.status !== undefined ? client.status : 1,
        street: client.street || "",
        external_number: client.external_number || "",
        internal_number: client.internal_number || "",
        neighborhood: client.neighborhood || "",
        city: client.city || "",
        state: client.state || "",
        // Asegurar que zip_code sea string (puede venir como número desde la API)
        zip_code: client.zip_code ? String(client.zip_code) : "",
      });
      setIsEditing(false);
    } else {
      onClose();
    }
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Actualizar cliente existente
      if (!client?.id_client) {
        setErrors({ submit: "Error: No se pudo identificar el cliente" });
        return;
      }
      const response = await updateClient(client.id_client, formData);
      const updatedClient = response?.body || response?.data;
      if (updatedClient) {
        updateClientInList(updatedClient);
        setIsEditing(false);
      }

      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message || "Error al guardar el cliente" });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    // Mantener el formato original del API (YYYY-MM-DD HH:mm:ss)
    if (dateString.includes("T") || dateString.includes("-")) {
      // Si viene en formato ISO o del API, convertirlo
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Si no es una fecha válida, devolver el string original
        return dateString;
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    // Si ya viene en formato del API (YYYY-MM-DD HH:mm:ss), devolverlo tal cual
    return dateString;
  };

  // NOTA: Título "Nuevo Cliente" será removido cuando se elimine la funcionalidad de creación
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        handleCancel();
        onClose();
      }}
      title={
        isCreateMode
          ? "Nuevo Cliente"
          : isEditing
          ? "Editar Cliente"
          : "Información del Cliente"
      }
      size="lg"
    >
      <div className="space-y-6">
        {/* Información General */}
        <div>
          <h3 className="text-lg font-poppinsBold text-neutral-900 mb-4 flex items-center gap-2">
            <FiTag className="h-5 w-5 text-primary-600" />
            Información General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nombre */}
            <div className={"md:col-span-2"}>
              <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2">
                Nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name || ""}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onBlur={(e) => {
                    if (errors.name) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.name;
                        return newErrors;
                      });
                    }
                  }}
                  className={`w-full px-4 py-2 border-2 rounded-lg font-poppinsRegular ${
                    errors.name
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : isEditing
                      ? "border-neutral-500 bg-white text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      : "border-neutral-500 bg-neutral-50 text-neutral-900"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* ID Cliente - Solo mostrar en modo edición/vista, no en create */}
            {!isCreateMode && (
              <div className="md:col-span-1">
                <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2">
                  ID Cliente
                </label>
                <input
                  type="text"
                  value={client.id_client || ""}
                  readOnly
                  disabled
                  className="w-full px-4 py-2 border-2 border-neutral-500 rounded-lg bg-neutral-100 text-neutral-700 font-poppinsRegular cursor-not-allowed"
                />
              </div>
            )}

            {/* Teléfono Celular */}
            <div className="md:col-span-1">
              <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2 flex items-center gap-2">
                <FiPhone className="h-4 w-4" />
                Teléfono celular <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.personal_phonenumber || ""}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleInputChange("personal_phonenumber", e.target.value)
                  }
                  onBlur={(e) =>
                    handleBlur("personal_phonenumber", e.target.value)
                  }
                  className={`w-full px-4 py-2 border-2 rounded-lg font-poppinsRegular ${
                    errors.personal_phonenumber
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      : isEditing
                      ? "border-neutral-500 bg-white text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      : "border-neutral-500 bg-neutral-50 text-neutral-900"
                  }`}
                  placeholder="10 dígitos"
                  maxLength={10}
                />
              </div>
              {errors.personal_phonenumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.personal_phonenumber}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2 flex items-center gap-2">
                <FiMail className="h-4 w-4" />
                Correo electrónico
              </label>
              <input
                type="email"
                value={formData.email || ""}
                readOnly={!isEditing}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                className={`w-full px-4 py-2 border-2 rounded-lg font-poppinsRegular ${
                  errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    : isEditing
                    ? "border-neutral-500 bg-white text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    : "border-neutral-500 bg-neutral-50 text-neutral-900"
                }`}
                placeholder="ejemplo@correo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Estado */}
            <div className="md:col-span-1">
              <Select
                label="Estado"
                value={formData.status !== undefined ? formData.status : 1}
                onChange={(value) => handleInputChange("status", Number(value))}
                options={[
                  { value: 1, label: "Activo" },
                  { value: 0, label: "Inactivo" },
                ]}
                readOnly={!isEditing}
                // NOTA: readOnlyClassName condicional para isCreateMode será simplificado
                readOnlyClassName={
                  !isCreateMode && client?.status === 1
                    ? "text-emerald-700"
                    : !isCreateMode && client?.status === 0
                    ? "text-rose-700"
                    : ""
                }
                optionValue="value"
                optionLabel="label"
              />
            </div>

            {/* Fecha de Creación - Solo mostrar en modo edición/vista, no en create */}
            {!isCreateMode && (
              <div className="md:col-span-2">
                <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2 flex items-center gap-2">
                  <FiCalendar className="h-4 w-4" />
                  Fecha de Creación
                </label>
                <input
                  type="text"
                  value={formatDate(client.created_at)}
                  readOnly
                  disabled
                  className="w-full px-4 py-2 border-2 border-neutral-500 rounded-lg bg-neutral-100 text-neutral-700 font-poppinsRegular cursor-not-allowed"
                />
              </div>
            )}
          </div>
        </div>

        {/* Dirección */}
        <div>
          <h3 className="text-lg font-poppinsBold text-neutral-900 mb-4 flex items-center gap-2">
            <FiMapPin className="h-5 w-5 text-primary-600" />
            Dirección
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Calle */}
            <div className="md:col-span-2">
              <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2">
                Calle
              </label>
              <input
                type="text"
                value={formData.street || ""}
                readOnly={!isEditing}
                onChange={(e) => handleInputChange("street", e.target.value)}
                className={`w-full px-4 py-2 border-2 border-neutral-500 rounded-lg font-poppinsRegular ${
                  isEditing
                    ? "bg-white text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    : "bg-neutral-50 text-neutral-900"
                }`}
                placeholder="Sin calle"
              />
            </div>

            {/* No. Exterior */}
            <div className="md:col-span-1">
              <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2">
                No. Exterior
              </label>
              <input
                type="text"
                value={formData.external_number || ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  handleInputChange("external_number", e.target.value)
                }
                className={`w-full px-4 py-2 border-2 border-neutral-500 rounded-lg font-poppinsRegular ${
                  isEditing
                    ? "bg-white text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    : "bg-neutral-50 text-neutral-900"
                }`}
                placeholder="Sin número"
              />
            </div>

            {/* No. Interior */}
            <div className="md:col-span-1">
              <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2">
                No. Interior
              </label>
              <input
                type="text"
                value={formData.internal_number || ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  handleInputChange("internal_number", e.target.value)
                }
                className={`w-full px-4 py-2 border-2 border-neutral-500 rounded-lg font-poppinsRegular ${
                  isEditing
                    ? "bg-white text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    : "bg-neutral-50 text-neutral-900"
                }`}
                placeholder="Sin número"
              />
            </div>

            {/* Colonia */}
            <div className="md:col-span-2">
              <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2">
                Colonia
              </label>
              <input
                type="text"
                value={formData.neighborhood || ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  handleInputChange("neighborhood", e.target.value)
                }
                className={`w-full px-4 py-2 border-2 border-neutral-500 rounded-lg font-poppinsRegular ${
                  isEditing
                    ? "bg-white text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    : "bg-neutral-50 text-neutral-900"
                }`}
                placeholder="Sin colonia"
              />
            </div>

            {/* Municipio */}
            <div className="md:col-span-1">
              <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2">
                Municipio
              </label>
              <input
                type="text"
                value={formData.city || ""}
                readOnly={!isEditing}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`w-full px-4 py-2 border-2 border-neutral-500 rounded-lg font-poppinsRegular ${
                  isEditing
                    ? "bg-white text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    : "bg-neutral-50 text-neutral-900"
                }`}
                placeholder="Sin municipio"
              />
            </div>

            {/* Estado */}
            <div className="md:col-span-2">
              <Select
                label="Estado"
                value={formData.state || ""}
                onChange={(value) => {
                  handleInputChange("state", value);
                  if (value && value.trim() !== "") {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.state;
                      return newErrors;
                    });
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      state: "El estado es requerido",
                    }));
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value || e.target.value.trim() === "") {
                    setErrors((prev) => ({
                      ...prev,
                      state: "El estado es requerido",
                    }));
                  }
                }}
                options={estadosMexico.map((estado) => ({
                  value: estado,
                  label: estado,
                }))}
                placeholder="Seleccione un estado"
                error={errors.state}
                required={true}
                readOnly={!isEditing}
              />
            </div>

            {/* Código Postal */}
            <div className="md:col-span-1">
              <label className="block text-sm font-poppinsMedium text-neutral-700 mb-2">
                Código Postal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.zip_code || ""}
                readOnly={!isEditing}
                onChange={(e) => handleInputChange("zip_code", e.target.value)}
                onBlur={(e) => handleBlur("zip_code", e.target.value)}
                className={`w-full px-4 py-2 border-2 rounded-lg font-poppinsRegular ${
                  errors.zip_code
                    ? "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    : isEditing
                    ? "border-neutral-500 bg-white text-neutral-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    : "border-neutral-500 bg-neutral-50 text-neutral-900"
                }`}
                placeholder="5 dígitos"
                maxLength={5}
              />
              {errors.zip_code && (
                <p className="mt-1 text-sm text-red-600">{errors.zip_code}</p>
              )}
            </div>
          </div>
        </div>

        {/* Mensaje de error general */}
        {errors.submit && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition font-poppinsMedium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiX className="h-4 w-4" />

                {isCreateMode ? "Cancelar" : "Cancelar"}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-poppinsMedium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="h-4 w-4" />

                {isSaving
                  ? "Guardando..."
                  : isCreateMode
                  ? "Crear Cliente"
                  : "Guardar Cambios"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition font-poppinsMedium"
              >
                Cerrar
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-poppinsMedium flex items-center gap-2"
              >
                <FiEdit2 className="h-4 w-4" />
                Editar Cliente
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ClientDetailsModal;
