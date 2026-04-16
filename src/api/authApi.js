import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_NEXO_API_URL;

export async function login({ username, password }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/web/auth/login_web`, {
      username,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Error al iniciar sesión';
    throw new Error(errMsg);
  }
}

export async function updateAdminPassword({
  phoneNumber,
  password,
  tokenResetPassword,
}) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/affiliates/auth/update_affiliate_password`,
      {
        phoneNumber: String(phoneNumber),
        password,
        tokenResetPassword,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const raw = response.data;
    const data =
      raw && typeof raw === 'object' ? raw : {};
    return { status: response.status, data };
  } catch (error) {
    const resData = error.response?.data;
    let errMsg =
      resData?.statusMessage ||
      resData?.message ||
      'Error al actualizar la contraseña';
    if (Array.isArray(resData?.error) && resData.error.length) {
      errMsg = resData.error.join('. ');
    }
    throw new Error(errMsg);
  }
}

