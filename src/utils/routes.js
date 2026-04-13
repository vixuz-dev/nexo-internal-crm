export const ROUTES = {
  LOGIN: '/iniciar-sesion',
  HOMEADMINPANEL: '/administrador/panel',
  LOGOUT: '/logout',
  // Nuevas rutas organizadas
  CLIENTS_LIST: '/administrador/clientes/listado',
  CLIENTS_DETAILS: '/administrador/clientes/:client_id',
  REQUESTS: '/administrador/solicitudes',
  AFFILIATES_ORDERS: '/afiliados/pedidos/listado',
  ORDERS_LIST: '/administrador/listado-de-pedidos',
  ORDERS_DETAILS: '/administrador/listado-de-pedidos/detalle/:id_order',
  ROUTES: '/administrador/rutas',
  AFFILIATES: '/administrador/afiliados',
  AFFILIATES_DETAILS: '/administrador/afiliados/:affiliate_id',
  // Consultas (grupo)
  CONSULTAS_AUDIT: '/administrador/consultas/auditoria',
  CONSULTAS_FICHAS: '/administrador/consultas/fichas',
  CONSULTAS_FACTURAS: '/administrador/consultas/facturas',
  CONSULTAS_FACTURAS_PAGOS: '/administrador/consultas/facturas/abonos/:invoiceId',
  CONSULTAS_RESUMEN_FINANCIERO: '/administrador/resumen-financiero-de-afiliados',
  CONSULTAS_COBRANZA: '/administrador/resumen-cobranza',
  CONSULTAS_COBRANZA_DIA: '/administrador/consultas/cobranza-diaria',
  // Dashboards (grupo)
  DASHBOARDS_COBRANZA_ZONA: '/administrador/dashboards/cobranza-zona',
};