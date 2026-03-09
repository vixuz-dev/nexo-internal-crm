import axios from 'axios';
import { getCookie } from '../utils/sessionCookie';

const API_BASE_URL = import.meta.env.VITE_APP_NEXO_API_URL;

export async function getInvoices() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/web/invoices/get_invoices`,
      {
        headers: {
          'Content-Type': 'application/json',
          token: getCookie('accessToken'),
        },
      }
    );
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Error al obtener las facturas';
    throw new Error(errMsg);
  }
}

export async function getInvoicesPayments(invoiceId) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/web/invoices/get_invoice_payments`,
      { invoiceId: Number(invoiceId) },
      {
        headers: {
          'Content-Type': 'application/json',
          token: getCookie('accessToken'),
        },
      }
    );
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.message || 'Error al obtener los pagos de la factura';
    throw new Error(errMsg);
  }
}

