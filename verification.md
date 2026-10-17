# Verificación del repositorio

Inspección de configuración, documentación y código fuente. Las referencias describen lo que hay en el repositorio; las URLs de servicios externos dependen de credenciales propias y no se presumen disponibles.

## Instrucciones de Ejecución

### Frontend

Desde la raíz del proyecto, instala dependencias y prepara las variables del frontend:

```bash
npm install
cp .env.example .env.local
# Completar VITE_API_URL, VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev
```

La URL local esperada es `http://localhost:5173/`. El puerto `5173` es el default de Vite y también figura en el [README](README.md); [vite.config.js](vite.config.js) no lo sobrescribe. Si ese puerto está ocupado, Vite puede elegir otro: usar la URL que imprima el proceso. La plantilla [`.env.example`](.env.example) configura la API en `http://localhost:3001` y contiene placeholders para Supabase.

### Backend

En otra terminal:

```bash
cd backend
npm install
cp .env.example .env
# Completar SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en backend/.env
npm run dev
```

[backend/server.js](backend/server.js) escucha en `process.env.PORT` o, si no está definido, en el puerto `3001`. La plantilla [`backend/.env.example`](backend/.env.example) fija `PORT=3001` y `FRONTEND_URL=http://localhost:5173`; el servidor usa esos mismos defaults para el puerto y CORS. El script `npm start` también está disponible en [backend/package.json](backend/package.json).

Comprobaciones HTTP respaldadas por las rutas montadas en código:

```bash
curl -i http://localhost:3001/health
curl -i -X POST http://localhost:3001/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Usuario Ejemplo","email":"usuario@example.com","password":"ClaveSegura123"}'
```

El health check responde en `GET http://localhost:3001/health`. El registro usa `POST http://localhost:3001/auth/register`; para una creación exitosa necesita credenciales válidas de Supabase configuradas en el backend. El registro se procesa con la Service Role Key del servidor, no con la clave pública del frontend ([backend/routes/auth.js](backend/routes/auth.js), [backend/services/authService.js](backend/services/authService.js)).

### Build y lint

Desde la raíz: `npm run build` genera `dist/`; `npm run lint` ejecuta ESLint; `npm run preview` sirve la build con el default de Vite (normalmente `http://localhost:4173/`). En esta inspección, build y lint finalizaron correctamente. [package.json](package.json) no define script `test`; no se encontraron archivos de test/spec en el inventario inspeccionado.

No hay `docker-compose.yml` ni `Dockerfile` en el repositorio inspeccionado, así que no hay comandos ni puertos Docker que documentar.

## Resumen del Proyecto

Consulir es un frontend React servido en desarrollo por Vite, con un backend Express separado y una integración de autenticación con Supabase:

- [index.html](index.html) contiene el elemento raíz; [src/main.jsx](src/main.jsx) monta React y [src/App.jsx](src/App.jsx) registra las rutas activas: `/`, `/login` y `/registro`.
- La ruta `/` muestra [src/components/landing/LandingPage.jsx](src/components/landing/LandingPage.jsx), que ensambla header, hero, tarjetas, estadísticas y footer. Las estadísticas vienen de [src/services/statsService.js](src/services/statsService.js), donde son datos hardcodeados; no hay endpoint backend `/stats` implementado.
- `/registro` presenta [src/pages/RegisterPage.jsx](src/pages/RegisterPage.jsx) y [src/components/auth/RegisterForm.jsx](src/components/auth/RegisterForm.jsx). Las validaciones del cliente están en [src/utils/authValidations.js](src/utils/authValidations.js); [src/services/authService.js](src/services/authService.js) envía el alta a `VITE_API_URL/auth/register`.
- Express arranca en [backend/server.js](backend/server.js), monta [backend/routes/auth.js](backend/routes/auth.js) bajo `/auth` y ofrece `/health`. La ruta de registro pasa por [backend/controllers/authController.js](backend/controllers/authController.js), valida con [backend/utils/validation.js](backend/utils/validation.js) y crea el usuario en Supabase Auth mediante [backend/services/authService.js](backend/services/authService.js).
- `/login` utiliza [src/pages/LoginPage.jsx](src/pages/LoginPage.jsx), que llama `loginUser` en [src/services/authService.js](src/services/authService.js). Ese inicio de sesión se hace directamente desde el navegador con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, obtenidos mediante [src/services/supabaseClient.js](src/services/supabaseClient.js); no pasa por el backend Express.
- [src/routes/AppRouter.jsx](src/routes/AppRouter.jsx) define una ruta alternativa `/dashboard`, pero no está montada por [src/main.jsx](src/main.jsx) ni importada por [src/App.jsx](src/App.jsx). [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx) es un placeholder y [src/routes/ProtectedRoute.jsx](src/routes/ProtectedRoute.jsx) contiene autenticación temporal fija en `true`.
- La configuración de calidad y estilos incluye [eslint.config.js](eslint.config.js), [tailwind.config.js](tailwind.config.js) y [postcss.config.js](postcss.config.js). Los manifiestos raíz y [backend/package.json](backend/package.json) separan dependencias y comandos de frontend y servidor.

## Tabla/Rastro de Verificación (✅ / ❌ / ❓)

| Estado | Afirmación | Evidencia / corrección |
| --- | --- | --- |
| ✅ Verificado | El frontend es React con Vite y tiene rutas de inicio, login y registro. | [package.json](package.json), [src/main.jsx](src/main.jsx), [src/App.jsx](src/App.jsx). Build comprobada con `npm run build`. |
| ✅ Verificado | Existe un servidor Express independiente, por defecto en puerto `3001`, con health check y registro. | [backend/package.json](backend/package.json), [backend/server.js](backend/server.js), [backend/routes/auth.js](backend/routes/auth.js). |
| ✅ Verificado | Hay plantillas para entorno frontend y backend; el backend requiere URL y Service Role Key de Supabase. | [`.env.example`](.env.example), [`backend/.env.example`](backend/.env.example), [backend/services/authService.js](backend/services/authService.js). Los valores reales no se verificaron. |
| ✅ Verificado | `npm run build` y `npm run lint` pasan en el entorno inspeccionado. | Comandos ejecutados durante esta verificación. |
| ✅ Verificado | No se encontró configuración Docker ni script `test`; tampoco archivos test/spec en la búsqueda del inventario. | No hay Docker Compose/Dockerfile listados; [package.json](package.json) no declara `test`. Vitest aparece como dependencia, pero eso no equivale a una suite ejecutable configurada. |
| ❌ Incorrecto / Corregido | La app ya ofrece gestión funcional de ingresos, egresos, activos e informes. | El README y la landing describen ese propósito, pero las pantallas implementadas son landing y formularios de autenticación; `Dashboard` es placeholder. No se encontró implementación de movimientos financieros o informes: [README.md](README.md), [src/components/landing/AuthCard.jsx](src/components/landing/AuthCard.jsx), [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx). |
| ❌ Incorrecto / Corregido | El endpoint `GET /stats` está implementado o es servido por el backend. | [src/services/statsService.js](src/services/statsService.js) devuelve datos hardcodeados. [backend/server.js](backend/server.js) no registra `/stats`; solo registra `/auth` y `/health`. |
| ❌ Incorrecto / Corregido | Login, registro y dashboard comparten una sesión validada y protegida por el backend. | El login llama directamente a Supabase desde el frontend; el registro va a Express. La ruta alternativa del dashboard no está activa y su guard siempre devuelve `true`: [src/services/authService.js](src/services/authService.js), [src/routes/AppRouter.jsx](src/routes/AppRouter.jsx), [src/routes/ProtectedRoute.jsx](src/routes/ProtectedRoute.jsx). |
| ❌ Incorrecto / Corregido | [docs/api/auth-register.md](docs/api/auth-register.md) describe exactamente el contrato ejecutado. | El documento usa `VITE_API_BASE_URL`, pero el cliente lee `VITE_API_URL`; documenta límites de longitud y rechazo de campos extra que [backend/utils/validation.js](backend/utils/validation.js) no implementa. También difieren las formas de `errors` y los nombres/campos de la respuesta: el controlador entrega `code`, errores como objeto, y `created_at`, no el esquema descrito en el documento. |
| ❌ Incorrecto / Corregido | La ruta `/dashboard` está disponible y protegida en la app que arranca. | La app arrancada monta [src/App.jsx](src/App.jsx), que no incluye `/dashboard`; esa ruta solo aparece en [src/routes/AppRouter.jsx](src/routes/AppRouter.jsx), no utilizado por el punto de entrada. |
| ❓ Sin verificar | El registro, login y persistencia funcionan contra el proyecto real de Supabase. | El código muestra los clientes y llamadas, pero no se probaron credenciales, conectividad ni configuración de políticas de un proyecto real. |
| ❓ Sin verificar | `tuoch.env` forma parte del proceso de configuración. | El archivo existe, pero los manifiestos, READMEs y configuración inspeccionados no lo referencian; su propósito no está establecido por el código. |
| ❓ Sin verificar | Vite estará siempre disponible en `localhost:5173`. | Es el puerto default y coincide con README/CORS, pero no está fijado en `vite.config.js`; si está ocupado, la URL efectiva puede cambiar. |