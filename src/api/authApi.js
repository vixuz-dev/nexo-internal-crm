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

