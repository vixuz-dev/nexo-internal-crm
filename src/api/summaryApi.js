import axios from 'axios';
import { getCookie } from '../utils/sessionCookie';

const API_BASE_URL = import.meta.env.VITE_APP_NEXO_API_URL;

export async function getInfoHome() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/home/get_information_home`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          token: getCookie('accessToken'),
        },
      }
    );
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Error al obtener información de inicio';
    throw new Error(errMsg);
  }
}


