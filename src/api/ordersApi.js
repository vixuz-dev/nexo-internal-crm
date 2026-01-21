import axios from 'axios';
import { getCookie } from '../utils/sessionCookie';

const API_BASE_URL = import.meta.env.VITE_APP_NEXO_API_URL;

export async function getAllPendingOrders(typeUser) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/orders/get_all_pending_orders/${typeUser}`,
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
    const errMsg = error.response?.data?.message || 'Error al obtener órdenes pendientes';
    throw new Error(errMsg);
  }
}

export async function getOrders({ page, limit, status, text }) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/web/orders/get_orders`,
      {
        page,
        limit,
        status,
        text,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          token: getCookie('accessToken'),
        },
      }
    );
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Error al obtener órdenes';
    throw new Error(errMsg);
  }
}

