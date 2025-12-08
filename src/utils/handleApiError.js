import { toast } from 'react-hot-toast';
import { logout } from './logout';
import { getCookie } from './sessionCookie';
const token = getCookie('accessToken');
export function handleApiError(err) {
  if (err.response) {
    if (err.response.status === 401) {
      toast.error("Sesión expirada. Por favor inicia sesión de nuevo.");
      logout();
    } else {
      toast.error("Error: " + (err.response.data?.message || "Error desconocido"));
    }
    return err.response.data?.message || "Error desconocido";
  } else if (err.request) {
    toast.error("No se recibió respuesta del servidor.");
    return "No se recibió respuesta del servidor.";
  } else {
    toast.error("Error al obtener datos.");
    return err.message;
  }
} 