# Documentación de Endpoints API

Este documento lista todos los endpoints definidos en el proyecto, indicando cuáles están en uso y cuáles no.

---

## Endpoints en Uso

### 1. Autenticación

#### `/login`
- **Método:** POST
- **Archivo API:** `src/api/authApi.js`
- **Función:** `login({ username, password })`
- **Dónde se usa:**
  - `src/pages/LoginPage.jsx` (línea 37)
- **Para qué se usa:**
  - Autenticación de usuarios en el sistema. Recibe username y password, retorna un token de acceso que se guarda en cookies.

---

### 2. Clientes

#### `/clients`
- **Método:** GET
- **Archivo API:** `src/api/clientsApi.js`
- **Función:** `getClients()`
- **Dónde se usa:**
  - `src/pages/ClientsList.jsx` (línea 19)
- **Para qué se usa:**
  - Obtener la lista completa de clientes registrados en el sistema. Se usa para mostrar el listado de clientes en la página principal de clientes.

#### `/update/${clientId}`
- **Método:** PUT
- **Archivo API:** `src/api/clientsApi.js`
- **Función:** `updateClient(clientId, clientData)`
- **Dónde se usa:**
  - `src/components/clients/ClientDetailsModal.jsx` (línea 246)
- **Para qué se usa:**
  - Actualizar la información de un cliente existente. Se usa cuando el usuario edita los datos de un cliente desde el modal de detalles.

---

### 3. Pedidos (Orders)

#### `/orders/get_orders`
- **Método:** POST
- **Archivo API:** `src/api/ordersApi.js`
- **Función:** `getOrders({ page, limit, status, text })`
- **Dónde se usa:**
  - `src/pages/OrdersList.jsx` (línea 29)
- **Para qué se usa:**
  - Obtener la lista paginada de pedidos con filtros opcionales (página, límite de resultados, estado, texto de búsqueda). Se usa para mostrar el listado de pedidos con paginación y filtros.

---

### 4. Facturas (Invoices)

#### `/invoices`
- **Método:** GET
- **Archivo API:** `src/api/invoicesApi.js`
- **Función:** `getInvoices()`
- **Dónde se usa:**
  - `src/pages/InvoicesList.jsx` (línea 17)
- **Para qué se usa:**
  - Obtener la lista completa de facturas registradas en el sistema. Se usa para mostrar el listado de facturas con sus filtros y búsqueda.

---

### 5. Afiliados (Affiliates/Companies)

#### `/companies/get_companies_catalog`
- **Método:** GET
- **Archivo API:** `src/api/AfiliatesApi.js`
- **Función:** `getCompaniesCatalog()`
- **Dónde se usa:**
  - `src/pages/Affiliates.jsx` (línea 16)
- **Para qué se usa:**
  - Obtener el catálogo completo de empresas/afiliados registrados en el sistema. Se usa para mostrar el listado de afiliados en la página principal de afiliados.

---

### 6. Dashboard/Home

#### `/home/get_information_home`
- **Método:** GET
- **Archivo API:** `src/api/summaryApi.js`
- **Función:** `getInfoHome()`
- **Dónde se usa:**
  - `src/pages/AdminDashboard.jsx` (línea 21)
- **Para qué se usa:**
  - Obtener información resumida para el dashboard principal (clientes, colección semanal, facturas, ventas mensuales, últimas facturas). Se usa para mostrar las tarjetas de resumen y datos del dashboard de administración.

---

## Endpoints NO Utilizados

### 1. Pedidos Pendientes

#### `/orders/get_all_pending_orders/${typeUser}`
- **Método:** GET
- **Archivo API:** `src/api/ordersApi.js`
- **Función:** `getAllPendingOrders(typeUser)`
- **Estado:** ❌ NO SE USA
- **Notas:**
  - Esta función está definida pero no se importa ni se llama en ningún componente del proyecto.
  - Podría ser útil para futuras funcionalidades relacionadas con órdenes pendientes filtradas por tipo de usuario.

---

### 2. Información de Empresas

#### `/companies/get_companies_information`
- **Método:** GET
- **Archivo API:** `src/api/AfiliatesApi.js`
- **Función:** `getInfoCompanies()`
- **Estado:** ❌ NO SE USA
- **Notas:**
  - Esta función está definida pero no se importa ni se llama en ningún componente del proyecto.
  - Diferente a `getCompaniesCatalog()`, esta función parece obtener información detallada de empresas, pero actualmente no se utiliza.

---

## Resumen

- **Total de endpoints definidos:** 9
- **Endpoints en uso:** 7
- **Endpoints no utilizados:** 2

---

## Notas Adicionales

- Todos los endpoints (excepto `/login`) requieren autenticación mediante el token almacenado en cookies (`accessToken`).
- El token se obtiene del login y se guarda usando `setCookie('accessToken', token)`.
- La URL base de la API se obtiene de la variable de entorno `VITE_APP_NEXO_API_URL`.
- Los endpoints no utilizados pueden ser removidos en el futuro si no se planea implementar su funcionalidad, o pueden mantenerse para uso futuro.

---

**Última actualización:** Generado automáticamente basado en el análisis del código fuente.

