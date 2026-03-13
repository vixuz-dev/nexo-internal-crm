import axios from "axios";
import { getCookie } from "../utils/sessionCookie";

const API_BASE_URL = import.meta.env.VITE_APP_NEXO_API_URL;

export async function getCompaniesCatalog() {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/web/affiliates/get_affiliates`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          token: getCookie("accessToken"),
        },
      }
    );
    return response.data;
  } catch (error) {
    const errMsg =
      error.response?.data?.message || "Error al obtener catálogo de empresas";
    throw new Error(errMsg);
  }
}

export async function changeAffiliateStatus(userId, status) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/web/affiliates/change_affiliate_status`,
      {
        userId: Number(userId),
        status: Boolean(status),
      },
      {
        headers: {
          "Content-Type": "application/json",
          token: getCookie("accessToken"),
        },
      }
    );
    return response.data;
  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      "Error al cambiar el estatus del afiliado";
    throw new Error(errMsg);
  }
}
