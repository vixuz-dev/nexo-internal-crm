<!-- DO NOT REMOVE: BUSINESS RULES DOCUMENT -->

## NexoPay – Reglas de negocio (Productos y financiamiento)

Fecha: 2025-10-29

### 1) Precio máximo
- El valor total del producto/servicio no puede exceder $30,000.

### 2) Comisión de plataforma
- Comisión por cobranza: 20% del precio del producto.

### 3) Pago inicial (enganche)
- 30% del precio del producto pagado al confirmar el pedido.

### 4) Monto a financiar
- A financiar = 50% del precio del producto.
  - Nota: El 20% (comisión) y el 30% (enganche) no forman parte del monto financiado.

### 5) Frecuencia y plazo de pagos
- Los abonos son mensuales.
- El cliente final elige el plazo dentro de 10 a 24 semanas equivalentes en meses (12, 16, 20, 24 semanas). La UI muestra meses; podemos mapear a semanas para backend.

### 6) Datos que define el proveedor al crear producto
- Nombre, Categoría, Precio, Stock, Descripción, Imágenes.
- El proveedor no define el abono.

### 7) Datos calculados mostrados al proveedor (no editables)
- Comisión Nexo (20%).
- Enganche (30%).
- Monto a financiar (70%).

### 8) Payload sugerido (cliente → backend)
```
paymentDetails: {
  weeklyPayment: 0,          // compatibilidad
  totalWeeks: 0,             // se calcula cuando el cliente elige plazo
  lastPayment: 0,
  commissionAmount: number,
  downPayment: number,
  financedAmount: number,
  paymentMessage: string
}
```

### 9) Validaciones
- Precio: entero positivo y ≤ $30,000.
- Stock: entero ≥ 1.
- Descripción: obligatoria.

Notas: Este documento sólo lista reglas de negocio. Los cambios de UI se documentan aparte.


