export const ROUTES = {
  LOGIN: '/iniciar-sesion',
  LOGIN_ROOT: '/',
  HOMEADMINPANEL: '/administrador/panel',
  LOGOUT: '/logout',
  // Nuevas rutas organizadas
  CLIENTS_LIST: '/administrador/clientes/listado',
  CLIENTS_DETAILS: '/administrador/clientes/:client_id',
  ORDERS_LIST: '/administrador/listado-de-pedidos',
  ORDERS_DETAILS: '/administrador/listado-de-pedidos/detalle/:id_order',
  AFFILIATES: '/administrador/afiliados',
  AFFILIATES_DETAILS: '/administrador/afiliados/:affiliate_id',
  // Consultas (grupo)
  CONSULTAS_FACTURAS: '/administrador/consultas/facturas',
  CONSULTAS_FACTURAS_PAGOS: '/administrador/consultas/facturas/abonos/:invoiceId',
  CONSULTAS_RESUMEN_FINANCIERO: '/administrador/resumen-financiero-de-afiliados',
  CONSULTAS_COBRANZA: '/administrador/resumen-cobranza',
};