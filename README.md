# MedTech Precisión

Plataforma de operaciones para la gestión de clientes, solicitudes de instalación,
cumplimiento y auditorías de MedTech Precisión — tecnología médica de precisión
fabricada en Costa Rica desde 2011.

## Estructura

- `zonaFranca/` — aplicación principal (Vite + JavaScript ES6)
  - `index.html` — sitio corporativo + dashboard de operaciones
  - `operaciones.html` — dashboard operativo
  - `login.html` / `recuperar.html` — acceso y recuperación de cuenta
  - `src/main.js` — lógica base del dashboard (router, datos, gráficos)
  - `src/formularios.js` — solicitudes de instalación y reportes de cumplimiento (con IA simulada en `src/ia.js`)
  - `src/medtech.js` — secciones corporativas dinámicas

## Scripts (dentro de `zonaFranca/`)

```bash
npm install     # dependencias
npm run dev     # servidor de desarrollo (Vite)
npm run api     # API REST fake (json-server, puerto 3000)
npm run build   # build de producción
```
