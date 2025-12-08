<!-- DO NOT REMOVE: GENERATED-BY-CURSOR -->

# Brand Guidelines – NexoPay

> Esta guía documenta los tokens existentes del proyecto y cómo aplicarlos de forma consistente en componentes y contenidos. No modifica tu tema: sólo referencia valores ya definidos en `tailwind.config.js` y en estilos globales.

---

## Paleta de colores (tokens reales)

Claves y escalas tomadas de `theme.extend.colors`:

- **primary**: 50 `#f0f9fc`, 100 `#d1f0f7`, 200 `#a3e1ef`, 300 `#75d2e7`, 400 `#47c3df`, 500 `#208eaa`, 600 `#1a7288`, 700 `#145666`, 800 `#0e3a44`, 900 `#081e22`
- **secondary**: 50 `#f0fbfd`, 100 `#d1f2f8`, 200 `#a3e5f1`, 300 `#75d8ea`, 400 `#47cbe3`, 500 `#5ec4e3`, 600 `#4b9db6`, 700 `#387689`, 800 `#254f5c`, 900 `#12282e`
- **highlight**: 50 `#f9faf4`, 100 `#f2f5e8`, 200 `#e5ebd1`, 300 `#d8e1ba`, 400 `#cbd7a3`, 500 `#c1d224`, 600 `#9ba81d`, 700 `#757e16`, 800 `#4f540f`, 900 `#292a08`
- **neutral**: 50 `#fefefe`, 100 `#fdfdfd`, 200 `#fbfbfb`, 300 `#f9f9f9`, 400 `#f5f5f5`, 500 `#f1f1f0`, 600 `#c1c1c0`, 700 `#919190`, 800 `#616160`, 900 `#313130`

Uso recomendado:
- Texto principal: `text-neutral-900` sobre fondos claros, `dark:text-neutral-100` en modo oscuro.
- Acciones primarias: fondos `bg-primary-500` con `hover:bg-primary-600` y texto blanco.
- Acentos/llamados secundarios: `secondary-500` o `highlight-500` según semántica.

---

## Tipografías

Fuentes locales detectadas en `src/assets/fonts/poppins` e integradas en `src/styles/globals.css` con `@font-face`:
- Familia: `Poppins`
- Pesos disponibles: 100, 200, 300, 400, 500, 600, 700, 800, 900 (incluye variantes itálicas en carpeta)
- Configuración `fontFamily` en Tailwind:
  - `font-sans` / `font-poppins` → `['Poppins', 'system-ui', 'sans-serif']`

Aplicación por defecto:
- Base en `@layer base`: `html, body` usan Poppins.
- Utiliza `font-sans`/`font-poppins` en componentes cuando necesites reforzar.

Rutas de fuente (ejemplo):
- `src/assets/fonts/poppins/Poppins-Regular.ttf`

---

## Tokens de diseño adicionales

- Breakpoints extendidos:
  - `xs: '365px'` (además de los defaults de Tailwind)
- Radius: usar utilidades Tailwind (`rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`). En el proyecto se usan `rounded-lg`, `rounded-xl`, `rounded-2xl` ampliamente.
- Sombras: utilidades Tailwind (`shadow`, `shadow-md`, `shadow-lg`) y utilidades personalizadas en `globals.css`:
  - `.shadow-glow`, `.shadow-glow-secondary`, `.shadow-glow-highlight`
- Spacing: usar escala Tailwind estándar (no se detectaron tokens personalizados de spacing en el tema).
- Dark mode: se usan estilos `.dark` en `globals.css`. El `darkMode` no está configurado explícitamente en `tailwind.config.js`; si se usa estrategia por clase, aplicar `class="dark"` en el root del documento.

---

## Componentes base (clases Tailwind con tokens del tema)

- Button (primario):
  - `bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200`
- Button (secundario):
  - `bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200`
- Button (highlight/outline):
  - `border-2 border-highlight-500 text-highlight-500 hover:bg-highlight-500 hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-200`
- Card:
  - `bg-white rounded-2xl shadow-lg border border-neutral-200` y `dark:bg-neutral-800 dark:border-neutral-700`
- Input:
  - `w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white`
- Navbar link (activo/inactivo):
  - Inactivo: `text-white hover:text-highlight-500` (sobre fondos primarios)
  - Activo: `text-highlight-500`

---

## Tono de voz

- Profesional, claro y cercano.
- Enfoque en inclusión financiera responsable, transparencia y simplicidad.
- Ejemplos de microcopy:
  - CTA: “Solicita tu crédito”, “Registra tu negocio”
  - Apoyos: “Sin comisiones ocultas”, “Proceso 100% digital”, “Aprobación en minutos”

---

## Uso de logotipo y variantes

- Logotipo detectado:
  - `src/assets/images/NexoPay-Logo.png` (logo principal)
  - `src/assets/images/nexo-white-logo.webp` (versión para fondos oscuros/primarios)
- Reglas:
  - Mantener espacios seguros alrededor del logo (padding mínimo 8–16px en UI compacta).
  - En fondos oscuros/primarios usa la variante blanca; en fondos claros usa la versión a color.

---

## Accesibilidad (WCAG)

- Contraste mínimo AA para texto normal (4.5:1) y grande (3:1).
- Estados de foco siempre visibles: usar `focus:outline-none focus:ring-2 focus:ring-primary-500` o `focus:ring-offset` cuando aplique.
- Tocar objetivos ≥ 44px de alto para acciones táctiles.

Herramientas sugeridas (sin instalar dependencias):
- WebAIM Contrast Checker
- Chrome DevTools (Rendering → Emulate vision deficiencies)

---

## Patrones con snippets

- Hero:
```html
<section class="bg-primary-500 text-white">
  <div class="container mx-auto px-6 py-20 flex flex-col items-center text-center">
    <h1 class="text-4xl md:text-6xl font-bold leading-tight">Compra hoy. Paga a tu ritmo.</h1>
    <p class="mt-4 text-white/90 max-w-2xl">Crédito digital, transparente y accesible.</p>
    <div class="mt-8 flex gap-4">
      <a class="bg-highlight-500 hover:bg-highlight-600 text-white font-semibold px-6 py-3 rounded-lg shadow-glow-highlight">Solicita tu crédito</a>
      <a class="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg border border-white/30">Soy proveedor</a>
    </div>
  </div>
</section>
```

- Formulario (campo + ayuda + error):
```html
<label class="block text-sm font-medium text-neutral-700">Número de teléfono</label>
<input class="input-field mt-1" placeholder="5512345678" />
<p class="mt-1 text-sm text-neutral-600">Sin buró • 100% digital</p>
<!-- Error -->
<p class="mt-1 text-sm text-red-600">El teléfono debe tener 10 dígitos.</p>
```

- Empty State (tarjeta):
```html
<div class="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8 text-center">
  <h3 class="text-xl font-bold text-primary-600">Aún no hay movimientos</h3>
  <p class="mt-2 text-neutral-600">Empieza registrando tu negocio o solicitando tu crédito.</p>
  <a class="mt-6 inline-block btn-outline">Ver opciones</a>
</div>
```

---

## Sugerencias de ampliación del tema (no aplicado)

No se detectan tokens `accent`, `success`, `warning`, `error` personalizados. Si se necesitan, proponer un PR con un diff como referencia:

```diff
 // tailwind.config.js
 theme: {
   extend: {
     colors: {
+      success: { 500: '#16a34a' },
+      warning: { 500: '#f59e0b' },
+      error: { 500: '#dc2626' }
     }
   }
 }
```

---

## Integración con el tema Tailwind (verificación)

- Paleta y fuentes usadas en ejemplos provienen de `theme.extend.colors` y `theme.extend.fontFamily`.
- Se respetan utilidades existentes (`.input-field`, `.card`, `shadow-glow*`).
- No se sobrescriben estilos globales ni se añaden paquetes.


