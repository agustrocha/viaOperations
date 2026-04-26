# Vía Operations

Prototipo interactivo de operaciones diarias para una empresa de transporte
discrecional ficticia. Exportado desde [claude.ai/design](https://claude.ai/design)
e implementado en este repo como fuente de verdad para una recreación
posterior en producción.

## Qué incluye

Un único lienzo de diseño con **7 artboards** y un panel de tweaks global:

1. **Dashboard — Moderno B2B** (Linear-ish): stats, alerta crítica de cadena
   de retrasos, "Ahora mismo", próximos servicios, feed de actividad y panel
   de recursos.
2. **Dashboard — Centralita densa**: ticker de KPIs, 3 columnas (filtros +
   conductores, tabla densa de servicios, alertas + activity stream).
3. **Listado de servicios**: vistas guardadas, filtros, selección múltiple
   y barra de bulk actions.
4. **Planning**: timeline tipo Gantt con lanes por conductor, lane "Sin
   asignar" en violeta, línea NOW.
5. **Detalle de servicio** (S-2844): cronología auditable, paradas,
   warning de cadena.
6. **Mapa operativo**: schematic con pins por estado y tarjeta flotante.
7. **Crear servicio**: modal con tabs por tipo y asignación rápida sugerida.

**Caso estrella sembrado en los datos:** la cadena de retrasos
**S-2844 → S-2851** (Sergio B., +8m, margen 4 min) aparece coherentemente
en dashboard, listado, detalle y mapa.

El **panel de tweaks** (toolbar superior derecha) cambia tema (claro/oscuro),
densidad (regular/compact/dense), idioma (ES/EN) y color de acento — los
cambios se aplican a todos los artboards a la vez.

## Sistema de diseño

- **Tipografía**: Inter (UI) + JetBrains Mono (datos/horarios).
- **Color base**: neutros fríos en OKLCH (`oklch(0.985 0.003 240)` claro /
  `oklch(0.16 0.005 240)` oscuro).
- **Estado**: verde (on time) · ámbar (warning/late) · rojo (critical) ·
  azul (info) · violeta (sin asignar).
- **Densidad**: media. Filas 36px, padding 12px (default), ajustable a
  compact/dense vía toggle.
- **Bordes**: 1px hairline, radios 6–8px. Sin gradientes ni sombras
  dramáticas.

## Cómo ejecutarlo

El prototipo es HTML/JSX que se compila en el navegador con
Babel-standalone y carga React desde CDN. Necesita un servidor web
estático (los `<script src="...">` no cargan vía `file://`).

```sh
# Python (incluido en macOS/Linux)
python3 -m http.server 8000

# o Node
npx serve .
```

Y abre <http://localhost:8000> en el navegador.

## Estructura

```
Via Operations.html       # entry point — monta <App/> en #root
index.html                # redirige a "Via Operations.html" (para http.server)
styles.css                # tokens de diseño + estilos base (light/dark/density)
data.js                   # mock data: drivers, vehicles, clients, services
components.jsx            # iconos, pills, topbar, hook useTweaks
dashboard.jsx             # VODashboard (moderno B2B)
dashboard-dense.jsx       # VODashboardDense (centralita)
screens.jsx               # listado, calendar, detail, map, new-service
design-canvas.jsx         # DesignCanvas, DCSection, DCArtboard, DCPostIt
tweaks-panel.jsx          # TweaksPanel y controles
```

## Próximos pasos

- Convertir alguna pantalla concreta en un prototipo navegable real
  (clicks que cambian estado, no sólo visuales).
- Recrear en stack de producción (Next.js + Supabase, p. ej.) tomando
  estos archivos como fuente de verdad visual.
- Definir modelo de datos, reglas de negocio y alcance de fase 1.
