import axios from 'axios';
import { getCookie } from '../utils/sessionCookie';

const API_BASE_URL = import.meta.env.VITE_APP_NEXO_API_URL;

export async function getClients() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/web/clients/get_clients`,
      {
        headers: {
          'Content-Type': 'application/json',
          token: getCookie('accessToken'),
        },
      }
    );
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Error al obtener la lista de clientes';
    throw new Error(errMsg);
  }
}


export async function updateClient(clientId, clientData) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update/${clientId}`,
      clientData,
      {
        headers: {
          'Content-Type': 'application/json',
          token: getCookie('accessToken'),
        },
      }
    );
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Error al actualizar el cliente';
    throw new Error(errMsg);
  }
}

