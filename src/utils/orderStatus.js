export const ORDER_STATUS = {
  PENDING: 'Pendiente',
  IN_TRANSIT: 'En tránsito',
  DELIVERED: 'Entregado',
  ALL: ''
};

export const ORDER_STATUS_FLOW = {
  [ORDER_STATUS.PENDING]: ORDER_STATUS.IN_TRANSIT,
  [ORDER_STATUS.IN_TRANSIT]: ORDER_STATUS.DELIVERED,
  [ORDER_STATUS.DELIVERED]: null, // No hay siguiente paso después de Entregado
  [ORDER_STATUS.ALL]: null // No hay siguiente paso para "todos"
};

/**
 * Determina el siguiente estado válido para una orden
 * @param {string} currentStatus - Estado actual de la orden
 * @returns {string|null} - Siguiente estado válido o null si no hay siguiente paso
 */
export const getNextOrderStatus = (currentStatus) => {
  return ORDER_STATUS_FLOW[currentStatus] || null;
};

/**
 * Verifica si un estado es válido para avanzar
 * @param {string} currentStatus - Estado actual de la orden
 * @returns {boolean} - true si el estado puede avanzar, false si no
 */
export const canAdvanceStatus = (currentStatus) => {
  return !!ORDER_STATUS_FLOW[currentStatus];
};

/**
 * Obtiene el texto de acción para el siguiente paso
 * @param {string} currentStatus - Estado actual de la orden
 * @returns {string} - Texto de la acción a realizar
 */
export const getNextActionText = (currentStatus) => {
  const nextStatus = getNextOrderStatus(currentStatus);
  if (!nextStatus) return '';

  switch (nextStatus) {
    case ORDER_STATUS.IN_TRANSIT:
      return 'Marcar en tránsito';
    case ORDER_STATUS.DELIVERED:
      return 'Marcar como entregado';
    default:
      return '';
  }
}; 