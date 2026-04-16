import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ROUTES } from "../utils/routes";
import { login } from "../api/authApi";
import { setCookie, getCookie } from "../utils/sessionCookie";
import { useAfiliateInformation } from "../store/useAfiliateInformation";
import nexoMainLogo from "../assets/images/logos/nexo-main-logo.png";
import { hashPassword } from "../utils/encryp";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const setUser = useAfiliateInformation((state) => state.setUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "El usuario es requerido";
    if (!formData.password) newErrors.password = "La contraseña es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      const response = await login({
        username: formData.username,
        password: hashPassword(formData.password),
      });
      if (
        response &&
        response.statusCode === 200 &&
        response.statusMessage === "El usuario o la contraseña son incorrectos"
      ) {
        setErrors({ general: "El usuario o la contraseña son incorrectos" });
        setLoading(false);
        return;
      }
      if (response && response.body && response.body.token) {
        setCookie("accessToken", response.body.token);
        setUser(response.body);
        localStorage.setItem("lastLogin", Date.now());
        setRedirecting(true);
        setTimeout(() => {
          window.location.href = ROUTES.HOMEADMINPANEL;
        }, 300);
        return;
      }
    } catch (err) {
      if (
        err.message.toLowerCase().includes("usuario") ||
        err.message.toLowerCase().includes("user")
      ) {
        setErrors({ username: "Usuario incorrecto" });
      } else if (
        err.message.toLowerCase().includes("contraseña") ||
        err.message.toLowerCase().includes("password")
      ) {
        setErrors({ password: "Contraseña incorrecta" });
      } else {
        setErrors({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const token = getCookie("accessToken");
  if (token) {
    return <Navigate to={ROUTES.AFFILIATES_DASHBOARD} replace />;
  }

  const inputUnderline =
    "block w-full border-0 border-b-2 border-black/15 bg-transparent py-3 px-0 text-base text-black placeholder:text-black/40 placeholder:font-normal focus:border-primary-500 focus:ring-0 focus:outline-none transition-colors rounded-none";

  return (
    <div className="min-h-screen w-full relative flex flex-col lg:flex-row">
      {redirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg px-8 py-6 flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-primary-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <span className="text-primary-700 font-bold text-lg">
              Cargando tu panel...
            </span>
          </div>
        </div>
      )}

      {/* Fondo gradiente (primary) en toda la pantalla */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-600 to-primary-400"
        aria-hidden="true"
      />
      {/* Textura muy sutil */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Formulario ~60% desktop: blanco; móvil: toda la pantalla blanca + bloque ¡Hola! solo aquí */}
      <div className="relative z-10 w-full lg:w-3/5 min-h-screen bg-white flex flex-col justify-center lg:rounded-tr-[6.5rem] lg:rounded-br-[6.5rem] shadow-[8px_0_48px_-12px_rgba(8,30,34,0.12)]">
        <div className="w-full max-w-md mx-auto px-8 py-12 lg:px-14 lg:py-16">
          <img
            src={nexoMainLogo}
            alt="NexoPay"
            className="h-10 md:h-12 mb-8 lg:mb-10"
          />

          {/* Saludo motivacional: solo móvil (sobre fondo blanco) */}
          <p className="lg:hidden text-2xl font-bold leading-tight text-primary-700 mb-8">
            ¡Hola! 👋
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
            Bienvenido de nuevo
          </h1>
          <p className="mt-3 text-sm text-black/55 leading-relaxed">
            Ingresa tus credenciales para acceder al CRM interno de NexoPay.
          </p>

          <form
            className="mt-10 space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-black/45 uppercase tracking-wider mb-1"
              >
                Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="off"
                placeholder="5512345678"
                className={inputUnderline}
              />
              {errors.username && (
                <div className="text-red-600 text-xs mt-2">{errors.username}</div>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-black/45 uppercase tracking-wider mb-1"
              >
                Contraseña
              </label>
              <div className="relative flex items-end">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="off"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                  className={`${inputUnderline} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 bottom-3 p-1 text-black/45 hover:text-black transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-600 text-xs mt-2">{errors.password}</div>
              )}
              <div className="text-right mt-2">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-sm font-medium text-primary-600 hover:text-primary-800 hover:underline transition-colors inline-block"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {errors.general && (
              <div className="text-red-600 text-sm text-center -mt-2">
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-primary-700 text-white text-base font-semibold hover:bg-primary-800 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Iniciando...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Desktop / tablet (lg+): texto completo sobre el gradiente */}
      <aside className="hidden lg:flex relative z-10 w-2/5 shrink-0 min-h-screen flex-col justify-center px-8 lg:pl-6 lg:pr-12 lg:py-16 text-white">
        <p className="text-3xl md:text-4xl font-bold leading-tight max-w-md">
          ¡Hola! 👋
        </p>
        <p className="mt-6 text-base sm:text-lg font-medium leading-relaxed text-white/95 max-w-md">
          Cada gestión cuenta. Aquí transformas datos en decisiones que impulsan
          a NexoPay.
        </p>
        <p className="mt-6 text-sm sm:text-base leading-relaxed text-white/80 max-w-sm">
          Bienvenido al <span className="font-semibold text-white">CRM interno</span>{" "}
          de NexoPay. Tu espacio para operar con orden y visión clara.
        </p>
      </aside>
    </div>
  );
};

export default LoginPage;
