# Changelog - Modal de Cliente (ClientDetailsModal)

## Fecha: [Fecha Actual]
## Componente: `src/components/clients/ClientDetailsModal.jsx`

---

## Versión Anterior vs Versión Actual

### Campos Eliminados

Se han removido los siguientes campos del formulario de edición del cliente:

#### 1. Información General - Campos Eliminados:
- **Teléfono casa** (`home_phonenumber`)
  - **Antes**: Campo editable para número de teléfono de casa
  - **Ahora**: Campo eliminado completamente
  - **Impacto DB**: Este campo ya no se actualizará desde el modal, pero seguirá existiendo en la base de datos

- **Frecuencia de Pago** (`payment_frequency_id`)
  - **Antes**: Dropdown editable con opciones (Semanal, Quincenal, Mensual)
  - **Ahora**: Campo eliminado completamente
  - **Impacto DB**: Este campo ya no se actualizará desde el modal, pero seguirá existiendo en la base de datos

- **Día de Pago** (`preference_day`)
  - **Antes**: Dropdown editable con opciones (Lunes a Domingo)
  - **Ahora**: Campo eliminado completamente
  - **Impacto DB**: Este campo ya no se actualizará desde el modal, pero seguirá existiendo en la base de datos

- **Tipo / Lista de Precios** (`id_price_list`, `price_list`)
  - **Antes**: Campo de solo lectura deshabilitado
  - **Ahora**: Campo eliminado completamente
  - **Impacto DB**: Campo de solo lectura, sin impacto en actualizaciones

- **Ruta ID** (`id_route`)
  - **Antes**: Campo editable para asignar/actualizar la ruta del cliente
  - **Ahora**: Campo eliminado completamente
  - **Impacto DB**: Este campo ya no se actualizará desde el modal, pero seguirá existiendo en la base de datos

#### 2. Dirección - Secciones Eliminadas:
- **Coordenadas** (Latitud y Longitud)
  - **Antes**: Sección completa con dos campos editables para `latitude` y `longitude`
  - **Ahora**: Sección eliminada completamente
  - **Impacto DB**: Estos campos ya no se actualizarán desde el modal, pero seguirán existiendo en la base de datos

#### 3. Información Adicional - Sección Eliminada:
- **Descripción** (`description`)
  - **Antes**: Textarea editable para descripción del cliente
  - **Ahora**: Campo eliminado completamente
  - **Impacto DB**: Este campo ya no se actualizará desde el modal, pero seguirá existiendo en la base de datos

- **Comentarios** (`comments`)
  - **Antes**: Textarea editable para comentarios sobre el cliente
  - **Ahora**: Campo eliminado completamente
  - **Impacto DB**: Este campo ya no se actualizará desde el modal, pero seguirá existiendo en la base de datos

---

## Campos Conservados

### Información General:
1. **Nombre** (`name`) - ✅ Editable
2. **ID Cliente** (`id_client`) - ✅ Solo lectura (deshabilitado)
3. **Teléfono celular** (`personal_phonenumber`) - ✅ Editable
4. **Correo electrónico** (`email`) - ✅ Editable
5. **Estado** (`status`) - ✅ Editable (Dropdown: Activo/Inactivo)
6. **Fecha de Creación** (`created_at`) - ✅ Solo lectura (deshabilitado)

### Dirección:
1. **Calle** (`street`) - ✅ Editable
2. **No. Exterior** (`external_number`) - ✅ Editable
3. **No. Interior** (`internal_number`) - ✅ Editable
4. **Colonia** (`neighborhood`) - ✅ Editable
5. **Municipio** (`city`) - ✅ Editable
6. **Estado** (`state`) - ✅ Editable
7. **Código Postal** (`zip_code`) - ✅ Editable

---

## Cambios Técnicos Implementados

### 1. Estado del Formulario (`formData`)
**Antes:**
```javascript
formData = {
  name, home_phonenumber, personal_phonenumber, email,
  payment_frequency_id, preference_day, status, id_price_list, id_route,
  street, external_number, internal_number, neighborhood, city, state, zip_code,
  latitude, longitude, description, comments
}
```

**Ahora:**
```javascript
formData = {
  name, personal_phonenumber, email, status,
  street, external_number, internal_number, neighborhood, city, state, zip_code
}
```

### 2. Imports Eliminados
- Removido: `FiDollarSign` (ya no se usa para Frecuencia de Pago)

### 3. Constantes Eliminadas
- Removido: `paymentFrequencyOptions` object
- Removido: `daysOfWeek` object

### 4. Funciones de Manejo
- `handleCancel()`: Actualizado para solo resetear los campos conservados
- `handleInputChange()`: Sin cambios, pero ahora solo maneja los campos restantes

---

## Impacto en Base de Datos

### ⚠️ IMPORTANTE - Campos que NO se actualizarán desde el Modal:

Los siguientes campos **NO** serán actualizados cuando se guarde desde el modal, aunque siguen existiendo en la base de datos:

1. `home_phonenumber` - Teléfono de casa
2. `payment_frequency_id` - ID de frecuencia de pago
3. `preference_day` - Día de preferencia de pago
4. `id_route` - ID de ruta
5. `latitude` - Latitud
6. `longitude` - Longitud
7. `description` - Descripción
8. `comments` - Comentarios

**Nota**: Si estos campos necesitan actualizarse en el futuro, deberán hacerse:
- Directamente en la base de datos
- Desde otro módulo/interfaz del sistema
- O agregándose nuevamente al modal si es requerido

---

## Estructura del Formulario Actual

```
Modal de Cliente
├── Información General
│   ├── Nombre [Editable]
│   ├── ID Cliente [Solo lectura]
│   ├── Teléfono celular [Editable]
│   ├── Correo electrónico [Editable]
│   ├── Estado [Editable - Dropdown]
│   └── Fecha de Creación [Solo lectura]
└── Dirección
    ├── Calle [Editable]
    ├── No. Exterior [Editable]
    ├── No. Interior [Editable]
    ├── Colonia [Editable]
    ├── Municipio [Editable]
    ├── Estado [Editable]
    └── Código Postal [Editable]
```

---

## Próximos Pasos Recomendados

1. **Verificar API Backend**: Asegurarse de que el endpoint de actualización (`PUT /clients/:id`) acepta solo los campos conservados o maneja correctamente los campos faltantes.

2. **Actualizar Documentación de API**: Si existe documentación de la API, actualizarla para reflejar los campos que se envían en el request.

3. **Validación**: Verificar que las validaciones del backend no requieran los campos eliminados como obligatorios.

4. **Testing**: Probar el flujo completo de edición para asegurar que solo se actualicen los campos permitidos.

---

## Archivos Modificados

- `src/components/clients/ClientDetailsModal.jsx` - Componente principal modificado
- `CHANGELOG_CLIENT_MODAL.md` - Este archivo de documentación

---

**Última actualización**: [Fecha de implementación]

