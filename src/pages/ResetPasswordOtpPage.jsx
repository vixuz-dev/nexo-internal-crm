import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/routes";
import { sendOtp, validateOtp } from "../api/otpApi";
import nexoMainLogo from "../assets/images/logos/nexo-main-logo.png";

const TYPE_VERIFICATION = "reset_password";
const OTP_LEN = 6;
const RESEND_SECONDS = 60;

function maskPhoneLast4(phone) {
  const d = String(phone).replace(/\D/g, "");
  if (d.length < 4) return "******";
  return `******${d.slice(-4)}`;
}

function formatCountdown(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}s`;
}

function getSendOtpErrorMessage(data) {
  if (!data) return "No se pudo reenviar el código.";
  if (Array.isArray(data.error) && data.error.length) {
    return data.error.join(". ");
  }
  return data.statusMessage || data.message || "No se pudo reenviar el código.";
}

const ResetPasswordOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  const [digits, setDigits] = useState(() => Array(OTP_LEN).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!phone) {
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
    }
  }, [phone, navigate]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const otpComplete = digits.every((d) => d.length === 1);

  const setDigitAt = (index, char) => {
    const c = char.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = c;
      return next;
    });
    setError("");
  };

  const handleChange = (index, e) => {
    const v = e.target.value;
    if (!v) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }
    setDigitAt(index, v);
    if (v.replace(/\D/g, "") && index < OTP_LEN - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LEN);
    if (!pasted) return;
    const next = Array(OTP_LEN).fill("");
    for (let i = 0; i < pasted.length; i += 1) next[i] = pasted[i];
    setDigits(next);
    setError("");
    const focusIdx = Math.min(pasted.length, OTP_LEN - 1);
    inputRefs.current[focusIdx]?.focus();
  }, []);

  const handleResend = async () => {
    if (!phone || secondsLeft > 0 || resendLoading) return;
    setResendLoading(true);
    setError("");
    try {
      const data = await sendOtp(phone, TYPE_VERIFICATION);
      if (data?.statusCode === 201) {
        setSecondsLeft(RESEND_SECONDS);
        return;
      }
      if (data?.success === false || data?.statusCode === 200) {
        setError(getSendOtpErrorMessage(data));
        return;
      }
      setError(getSendOtpErrorMessage(data));
    } catch (err) {
      setError(err.message || "No se pudo reenviar el código.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!phone || !otpComplete) return;
    const otp = digits.join("");
    setLoading(true);
    setError("");
    try {
      const data = await validateOtp(phone, otp, TYPE_VERIFICATION);
      if (
        data?.statusCode === 200 &&
        data?.success === true &&
        data?.tokenResetPassword
      ) {
        navigate(ROUTES.NEW_PASSWORD_AFTER_RESET, {
          state: {
            phone,
            tokenResetPassword: data.tokenResetPassword,
          },
          replace: true,
        });
        return;
      }
      const msg =
        data?.statusMessage ||
        data?.message ||
        "Código no válido. Verifica e intenta de nuevo.";
      setError(msg);
    } catch (err) {
      setError(err.message || "Error al validar el código.");
    } finally {
      setLoading(false);
    }
  };

  if (!phone) return null;

  return (
    <div className="min-h-screen w-full bg-neutral-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md flex flex-col items-center">
        <img src={nexoMainLogo} alt="NexoPay" className="h-10 md:h-12 mb-8" />
        <div className="w-full bg-white rounded-2xl shadow-lg border border-neutral-200/80 p-6 md:p-8">
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 text-center">
            Verifica tu código
          </h1>
          <p className="mt-3 text-sm text-neutral-600 text-center leading-relaxed">
            Ingresa el código de 6 dígitos enviado a tu número{" "}
            <span className="font-medium text-neutral-800">
              {maskPhoneLast4(phone)}
            </span>{" "}
            para continuar con la recuperación de tu contraseña.
          </p>

          <form onSubmit={handleContinue} className="mt-8">
            <div
              className="flex justify-center gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  autoComplete="one-time-code"
                  className="w-14 h-14 text-center text-xl font-poppinsBold border-2 border-highlight-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                  aria-label={`Dígito ${i + 1} del código`}
                />
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-neutral-700">
              {secondsLeft > 0 ? (
                <span>Reenviar código en {formatCountdown(secondsLeft)}</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="font-medium text-primary-600 hover:text-primary-800 hover:underline disabled:opacity-50"
                >
                  {resendLoading ? "Reenviando…" : "Reenviar código"}
                </button>
              )}
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600 text-center" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!otpComplete || loading}
              className="mt-6 w-full py-3.5 px-4 rounded-xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Validando…" : "Continuar"}
            </button>
          </form>
        </div>

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

export default ResetPasswordOtpPage;
