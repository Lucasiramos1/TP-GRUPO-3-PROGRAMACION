# Contexto tecnológico

## Stack y herramientas

- **Frontend:** React y React DOM, con Vite como servidor de desarrollo y herramienta de build. Las dependencias están declaradas en [package.json](../package.json); el punto de entrada React está en [src/main.jsx](../src/main.jsx).
- **Rutas:** React Router DOM, utilizado por [src/App.jsx](../src/App.jsx).
- **Backend:** Node.js con módulos ES y Express 4, con CORS y `dotenv`, según [backend/package.json](../backend/package.json) y [backend/server.js](../backend/server.js).
- **Servicios de autenticación:** `@supabase/supabase-js` está declarado tanto en el manifiesto raíz como en [backend/package.json](../backend/package.json).
- **Estilos y calidad:** Tailwind CSS y PostCSS; ESLint tiene configuraciones para `src/` y `backend/` en [eslint.config.js](../eslint.config.js).
- **Scripts raíz:** `npm run dev`, `npm run build`, `npm run lint` y `npm run preview`, definidos en [package.json](../package.json).
- **Scripts de backend:** `npm run dev` inicia `node --watch server.js`; `npm start` inicia `node server.js`, definidos en [backend/package.json](../backend/package.json).

## Dependencias relevantes

El manifiesto raíz también declara Vitest y Testing Library como dependencias de desarrollo. Sin embargo, [package.json](../package.json) no define un script `test` y la búsqueda en el repositorio no encontró archivos `*.test.*` o `*.spec.*`; su presencia no demuestra que exista una suite configurada.

## Datos y persistencia

El código visible integra Supabase Auth: el frontend inicia sesión con `signInWithPassword` y el backend registra usuarios con `supabase.auth.admin.createUser` en [backend/services/authService.js](../backend/services/authService.js). El backend obtiene `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` del entorno; la plantilla [backend/.env.example](../backend/.env.example) identifica la clave como secreta.

No se encontró esquema SQL, migración ni configuración de base de datos propia en el repositorio. Por ello, esta documentación solo puede afirmar la integración con Supabase Auth; no describe tablas de negocio ni persistencia de movimientos financieros.

## Variables de entorno documentadas en el código

- Frontend: `VITE_API_URL`, `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, mostradas en [.env.example](../.env.example).
- Backend: `PORT`, `FRONTEND_URL`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`, mostradas en [backend/.env.example](../backend/.env.example).
- [backend/server.js](../backend/server.js) utiliza `3001` como puerto fallback y `http://localhost:5173` como origen CORS fallback.

## Docker

No se encontraron `Dockerfile`, archivos Compose (`docker-compose.yml`/`yaml` o `compose.yml`/`yaml`) ni archivos SQL dentro del repositorio. No hay evidencia de un flujo Docker o de una base relacional autoalojada que se pueda documentar.

## Despliegue en Render

[render.yaml](../render.yaml) define dos servicios respaldados por la arquitectura del repositorio:

- `consulir-api`: servicio Node con `rootDir: backend`, `npm ci` para build, `npm start` para ejecución y `/health` como health check.
- `consulir-web`: sitio estático que ejecuta `npm ci && npm run build` en la raíz y publica `dist/`. Su rewrite de rutas dirige las rutas SPA a `/index.html`.

El frontend recibe `VITE_API_URL` de `RENDER_EXTERNAL_URL` del servicio backend. Las variables Supabase y `FRONTEND_URL` se solicitan manualmente en Render; son valores específicos del proyecto y no se incluyen en el repositorio. `FRONTEND_URL` debe ser el origen público HTTPS del sitio estático para que el CORS configurado en [backend/server.js](../backend/server.js) permita al navegador acceder al backend.

Vite incorpora las variables `VITE_*` durante el build del sitio estático. Si se actualizan, es necesario volver a construir y desplegar el frontend. El Blueprint no crea una base de datos: la autenticación depende de un proyecto Supabase externo ya configurado.
