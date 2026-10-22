# Verificación del handover

Fecha de auditoría: 21 de octubre de 2026.

Este documento describe únicamente comportamientos respaldados por archivos del repositorio. Las credenciales, los valores configurados en Render y el estado de un proyecto remoto de Supabase no se versionan y, por lo tanto, se distinguen de la evidencia local.

## Instrucciones de ejecución

### Requisitos

- Node.js y npm. El repositorio no fija una versión mediante `engines`, `.nvmrc` o `.node-version`.
- Dos instalaciones de dependencias independientes: una en la raíz y otra en `backend/`, porque existen dos archivos `package.json` y dos lockfiles.
- Un proyecto de Supabase con Auth habilitado y la migración de `supabase/migrations/20261021181248_create_finance_transactions.sql` aplicada.

No hay `Dockerfile` ni `docker-compose.yml` en el repositorio.

### Frontend

Desde la raíz:

```bash
npm ci
```

Copiar `.env.example` como `.env.local` y completar únicamente las variables públicas requeridas:

```dotenv
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<clave-publica-anon>
```

Iniciar Vite:

```bash
npm run dev
```

La URL local esperada es `http://localhost:5173`. No hay una configuración de puerto alternativa en `vite.config.js`, por lo que se utiliza el valor predeterminado de Vite.

Rutas de la aplicación definidas en `src/App.jsx`:

- `/`: landing pública.
- `/login`: inicio de sesión.
- `/registro`: alta de usuario.
- `/dashboard`: panel protegido por sesión.

Comandos de verificación disponibles en `package.json`:

```bash
npm run lint
npm test
npm run build
npm run preview
```

### Backend

En otra terminal:

```bash
cd backend
npm ci
```

Copiar `backend/.env.example` como `backend/.env` y completar:

```dotenv
PORT=3001
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<clave-privada-del-backend>
```

La clave `service_role` debe permanecer exclusivamente en el backend. No debe utilizarse en variables `VITE_*`, porque esas variables se incorporan al código público del navegador.

Iniciar el servidor:

```bash
npm run dev
```

Endpoints respaldados por `backend/server.js` y `backend/routes/auth.js`:

- `GET http://localhost:3001/health`: responde `{ "status": "ok" }`.
- `POST http://localhost:3001/auth/register`: valida y crea un usuario mediante Supabase Admin.

### Producción en Render

`render.yaml` declara dos servicios:

- `consulir-api`: servicio Node con raíz `backend/`, `npm ci`, `npm start` y health check `/health`.
- `consulir-web`: sitio estático construido con `npm ci && npm run build`, publicado desde `dist/` y con rewrite SPA hacia `/index.html`.

Los nombres de los servicios están versionados, pero las URLs asignadas y los valores de sus variables son estado externo de Render. Deben verificarse en el dashboard después de cada despliegue.

## Resumen del proyecto

Consulir es un MVP web para registrar ingresos y egresos personales, consultar el resultado por mes y obtener una lectura básica del balance.

El punto de entrada `src/main.jsx` monta `src/App.jsx`. Ese componente configura las rutas y envuelve la aplicación con `src/providers/AuthProvider.jsx`, responsable de restaurar y observar la sesión de Supabase. `src/routes/ProtectedRoute.jsx` impide acceder al dashboard sin una sesión válida.

El registro sigue este flujo:

1. `src/components/auth/RegisterForm.jsx` valida la entrada en el navegador.
2. `src/services/authService.js` envía `POST /auth/register` al backend.
3. `backend/routes/auth.js` delega en `backend/controllers/authController.js`.
4. `backend/utils/validation.js` vuelve a validar los datos del lado servidor.
5. `backend/services/authService.js` utiliza `supabase.auth.admin.createUser` con la clave privada del backend.

El login y logout se realizan directamente contra Supabase Auth desde `src/services/authService.js`, usando el cliente público creado en `src/services/supabaseClient.js`.

El dashboard está implementado en `src/pages/Dashboard.jsx`. Las operaciones de movimientos se aíslan en `src/services/transactionService.js`, mientras que los cálculos puros de ingresos, egresos y balance viven en `src/utils/finance.js`.

La tabla `public.finance_transactions` se define en `supabase/migrations/20261021181248_create_finance_transactions.sql`. Cada fila pertenece a `auth.uid()` y las políticas RLS limitan lectura, alta, edición y eliminación al propietario autenticado. La migración revoca acceso a `anon` y concede las operaciones necesarias a `authenticated`.

El backend no participa en el CRUD financiero: el navegador accede a la Data API de Supabase con la clave pública y RLS aplica la autorización por fila. El backend se utiliza actualmente sólo para el registro administrativo de usuarios y el health check.

## Tabla y rastro de verificación

| Estado | Afirmación | Evidencia o corrección |
| --- | --- | --- |
| ✅ Verificado | El frontend usa React y Vite. | `package.json`, `vite.config.js`, `src/main.jsx`. |
| ✅ Verificado | La aplicación tiene landing, registro, login y dashboard protegido. | `src/App.jsx`, `src/routes/ProtectedRoute.jsx`. |
| ✅ Verificado | La sesión se restaura y escucha mediante Supabase Auth. | `src/providers/AuthProvider.jsx`. |
| ✅ Verificado | El registro pasa por Express y utiliza la API administrativa de Supabase. | `src/services/authService.js`, `backend/controllers/authController.js`, `backend/services/authService.js`. |
| ✅ Verificado | Las transacciones se consultan y modifican directamente desde el frontend. | `src/services/transactionService.js`. |
| ✅ Verificado | La tabla financiera tiene RLS y políticas por `user_id`. | `supabase/migrations/20261021181248_create_finance_transactions.sql`. |
| ✅ Verificado | La política de UPDATE incluye `USING` y `WITH CHECK`. | `supabase/migrations/20261021181248_create_finance_transactions.sql`. |
| ✅ Verificado | Existen pruebas automatizadas para los cálculos financieros. | `src/utils/finance.test.js`. |
| ✅ Verificado | Render tiene una definición declarativa para API y sitio estático. | `render.yaml`. |
| ❌ Corregido | No existe una arquitectura Docker actualmente. | No hay `Dockerfile` ni `docker-compose.yml`; la ejecución local usa npm directamente. |
| ❌ Corregido | El backend no concentra toda la comunicación con Supabase. | El registro usa backend; login, sesión y movimientos usan Supabase desde el navegador. |
| ❌ Corregido | No existe un endpoint real `GET /stats`. | `src/services/statsService.js` devuelve un mock local y `backend/server.js` no registra esa ruta. |
| ❌ Corregido | La URL de clonación del README no coincide con el remoto actual. | `README.md` menciona `ADS-PY`; el remoto configurado corresponde a `Lucasiramos1/TP-GRUPO-3-PROGRAMACION`. |
| ❌ Corregido | No hay cobertura integral del sistema. | Sólo existe `src/utils/finance.test.js`; no hay tests del backend, componentes ni flujo E2E. |
| ❓ Sin verificar | Que una instalación nueva tenga aplicada la migración. | El SQL está versionado, pero no existe `supabase/config.toml` ni vínculo de proyecto reproducible en el repositorio. |
| ❓ Sin verificar | Los valores reales de las variables de Render y Supabase. | Se gestionan fuera de Git y no deben documentarse con secretos. |
| ❓ Sin verificar | Que cada futuro despliegue conserve las URLs y el estado `Live`. | Es estado externo; requiere smoke test posterior al despliegue. |
| ❓ Sin verificar | Compatibilidad con una versión específica de Node.js. | Ningún manifiesto fija `engines` y no hay archivo de versión. |

## Verificación realizada durante esta auditoría

En el estado auditado se ejecutaron satisfactoriamente:

```text
npm run lint
npm test       # 1 archivo, 4 tests aprobados
npm run build  # build de producción generado correctamente
```

No existe un script de tests en `backend/package.json`; por lo tanto, el backend sólo puede verificarse localmente mediante arranque y smoke tests hasta incorporar cobertura automatizada.
