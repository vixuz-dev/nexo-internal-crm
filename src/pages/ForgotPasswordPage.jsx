import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPhone } from "react-icons/fi";
import { ROUTES } from "../utils/routes";
import { sendOtp } from "../api/otpApi";
import nexoMainLogo from "../assets/images/logos/nexo-main-logo.png";

const TYPE_VERIFICATION = "reset_password";

function digitsOnly(value) {
  return value.replace(/\D/g, "");
}

function isValidResetPhone(digits) {
  return /^\d{10}$/.test(digits) && digits !== "0000000000";
}

function getSendOtpErrorMessage(data) {
  if (!data) return "No se pudo enviar el código. Intenta de nuevo.";
  if (Array.isArray(data.error) && data.error.length) {
    return data.error.join(". ");
  }
  return data.statusMessage || data.message || "No se pudo enviar el código.";
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [phoneDigits, setPhoneDigits] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = useMemo(() => isValidResetPhone(phoneDigits), [phoneDigits]);

  const handlePhoneChange = (e) => {
    const next = digitsOnly(e.target.value).slice(0, 10);
    setPhoneDigits(next);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) {
      setError("Ingresa un número de 10 dígitos válido.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await sendOtp(phoneDigits, TYPE_VERIFICATION);
      if (data?.statusCode === 201) {
        navigate(ROUTES.RESET_PASSWORD_OTP, {
          state: { phone: phoneDigits },
          replace: true,
        });
        return;
      }
      if (data?.success === false || data?.statusCode === 200) {
        setError(getSendOtpErrorMessage(data));
        return;
      }
      setError(getSendOtpErrorMessage(data));
    } catch (err) {
      setError(err.message || "Error al enviar el código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col items-center">
        <img src={nexoMainLogo} alt="NexoPay" className="h-10 md:h-12 mb-8" />
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="mt-3 text-sm text-neutral-700 text-center leading-relaxed max-w-md">
          No te preocupes, te ayudamos a recuperarla. Ingresa tu número de
          teléfono y te enviaremos un código para restablecer tu contraseña.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 w-full bg-white rounded-2xl shadow-lg border border-neutral-200/80 p-6 md:p-8"
        >
          <label
            htmlFor="reset-phone"
            className="block text-sm font-bold text-primary-600 mb-2"
          >
            Número de teléfono*
          </label>
          <div className="relative">
            <FiPhone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
              size={18}
              aria-hidden
            />
            <input
              id="reset-phone"
              type="text"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="Ingresa tu número de teléfono"
              value={phoneDigits}
              onChange={handlePhoneChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-neutral-400 rounded-lg focus:border-primary-400 focus:ring-2 focus:ring-primary-400 focus:outline-none font-poppinsRegular text-neutral-700 placeholder:text-neutral-600 placeholder:font-semibold"
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!valid || loading}
            className="mt-6 w-full py-3.5 px-4 rounded-xl bg-primary-600 text-white text-sm font-bold uppercase tracking-wide hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando…" : "Enviar código"}
          </button>
        </form>

        <p className="mt-6 text-sm text-neutral-700 text-center">
          ¿Recordaste tu contraseña?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-primary-600 hover:text-primary-800 hover:underline transition-colors"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
