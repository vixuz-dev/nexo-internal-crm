import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { ROUTES } from "../utils/routes";
import { updateAdminPassword } from "../api/authApi";
import { hashPassword } from "../utils/encryp";
import nexoMainLogo from "../assets/images/logos/nexo-main-logo.png";

const NewPasswordAfterResetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;
  const tokenResetPassword = location.state?.tokenResetPassword;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!phone || !tokenResetPassword) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
    }
  }, [phone, tokenResetPassword, navigate]);

  const validLength = password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validLength) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!phone || !tokenResetPassword) return;

    setLoading(true);
    setError("");
    try {
      const response = await updateAdminPassword({
        phoneNumber: phone,
        password: hashPassword(password),
        tokenResetPassword,
      });

      const { status, data } = response;

      if (status === 204) {
        if (data?.success === false) {
          setError(
            data?.statusMessage || "No fue posible actualizar la contraseña."
          );
          return;
        }
        toast.success("Contraseña actualizada correctamente");
        navigate(ROUTES.LOGIN, { replace: true });
        return;
      }

      if (status === 200 && data?.success === false) {
        setError(
          data?.statusMessage || "No fue posible actualizar la contraseña."
        );
        return;
      }

      setError("Respuesta inesperada del servidor. Intenta de nuevo.");
    } catch (err) {
      setError(err.message || "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  if (!phone || !tokenResetPassword) return null;

  return (
    <div className="min-h-screen w-full bg-neutral-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col items-center">
        <img
          src={nexoMainLogo}
          alt="NexoPay"
          className="h-10 md:h-12 mb-8"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center">
          Nueva contraseña
        </h1>
        <p className="mt-3 text-sm text-neutral-600 text-center leading-relaxed max-w-md">
          Ingresa tu nueva contraseña para completar la recuperación de tu
          cuenta.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full bg-white rounded-2xl shadow-lg border border-neutral-200/80 p-6 md:p-8"
        >
          <label
            htmlFor="new-password"
            className="block text-sm font-bold text-primary-600 mb-2"
          >
            Nueva contraseña*
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Mínimo 8 caracteres"
              className="block w-full pl-10 pr-10 py-2.5 border border-neutral-400 rounded-lg focus:border-primary-400 focus:ring-2 focus:ring-primary-400 focus:outline-none font-poppinsRegular text-neutral-700 placeholder:text-neutral-600 placeholder:font-semibold"
              />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-600 hover:text-neutral-700 transition-colors"
              tabIndex={-1}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!validLength || loading}
            className="mt-6 w-full py-3.5 px-4 rounded-xl bg-primary-600 text-white text-sm font-bold uppercase tracking-wide hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Actualizando…" : "Actualizar contraseña"}
          </button>
        </form>

        <p className="mt-6 text-sm text-neutral-600 text-center">
          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-primary-600 hover:text-primary-800 hover:underline transition-colors"
          >
            Ir a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NewPasswordAfterResetPage;
