import { removeCookie } from '../utils/sessionCookie';
import { ROUTES } from '../utils/routes';

export function logout() {
  removeCookie('accessToken');
  localStorage.removeItem('afiliate-product');
  localStorage.removeItem('lastLogin');
  localStorage.removeItem('user-information');
  localStorage.clear();
  window.location.href = ROUTES.LOGIN;
} 