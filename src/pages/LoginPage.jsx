import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { ROUTES } from '../utils/routes';
import { login } from '../api/authApi';
import { setCookie, getCookie } from '../utils/sessionCookie';
import { useAfiliateInformation } from '../store/useAfiliateInformation';
import nexoWhiteLogo from '../assets/images/logos/nexo-white-logo.webp';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const setUser = useAfiliateInformation((state) => state.setUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'El usuario es requerido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      const response = await login({ username: formData.username, password: formData.password });
      if (
        response &&
        response.statusCode === 200 &&
        response.statusMessage === 'El usuario o la contraseña son incorrectos'
      ) {
        setErrors({ general: 'El usuario o la contraseña son incorrectos' });
        setLoading(false);
        return;
      }
      if (response && response.body && response.body.token) {
        setCookie('accessToken', response.body.token);
        setUser(response.body);
        localStorage.setItem('lastLogin', Date.now());
        setRedirecting(true);
        setTimeout(() => {
          window.location.href = ROUTES.HOMEADMINPANEL;
        }, 300);
        return;
      }
    } catch (err) {
      if (err.message.toLowerCase().includes('usuario') || err.message.toLowerCase().includes('user')) {
        setErrors({ username: 'Usuario incorrecto' });
      } else if (err.message.toLowerCase().includes('contraseña') || err.message.toLowerCase().includes('password')) {
        setErrors({ password: 'Contraseña incorrecta' });
      } else {
        setErrors({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const token = getCookie('accessToken');
  if (token) {
    return <Navigate to={ROUTES.AFFILIATES_DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary-700 via-primary-500 to-secondary-500 flex items-center justify-center p-6">
      {redirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg px-8 py-6 flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-primary-700 font-poppinsBold text-lg">Cargando tu panel...</span>
          </div>
        </div>
      )}
      {/* Formulario centrado */}
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo blanco sobre el gradiente para máximo contraste */}
        <img src={nexoWhiteLogo} alt="Nexo" className="h-20 md:h-24 lg:h-28 mb-6 drop-shadow-lg" />
        <form className="w-full rounded-2xl p-8 bg-white/95 backdrop-blur shadow-xl" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          {/* Mensaje de bienvenida */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-poppinsBold text-neutral-900 mb-2">¡Bienvenido de vuelta!</h1>
            <p className="text-neutral-700 font-poppinsRegular">Ingresa tu información</p>
          </div>
          {/* Logotipo removido de la izquierda; usando logo blanco arriba */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-poppinsMedium text-gray-700">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete='off'
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none font-poppinsRegular"
            />
            {errors.username && <div className="text-red-600 text-xs mt-1 font-poppinsRegular">{errors.username}</div>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-poppinsMedium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                autoComplete='off'
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none font-poppinsRegular"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && <div className="text-red-600 text-xs mt-1 font-poppinsRegular">{errors.password}</div>}
            {errors.general && <div className="text-red-600 text-xs mt-3 font-poppinsRegular text-center">{errors.general}</div>}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-primary-600 text-white font-poppinsMedium hover:bg-primary-700 focus:ring-2 focus:ring-primary-200 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Iniciando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 