# Patrones del sistema

## Estructura de alto nivel

El repositorio separa la aplicación React/Vite bajo `src/` y el servidor Express en `backend/`, con manifiestos de dependencias independientes en [package.json](../package.json) y [backend/package.json](../backend/package.json).

## Arranque y navegación del frontend

[src/main.jsx](../src/main.jsx) crea el root de React y monta `App` dentro de `StrictMode`. [src/App.jsx](../src/App.jsx) proporciona `BrowserRouter` y configura las rutas activas `/`, `/login` y `/registro`.

La landing en [src/components/landing/LandingPage.jsx](../src/components/landing/LandingPage.jsx) compone componentes visuales y carga estadísticas con `getStats()`. [src/services/statsService.js](../src/services/statsService.js) devuelve datos locales; no existe una petición HTTP de estadísticas en ese servicio.

## Registro: flujo frontend-backend

1. El formulario de registro usa `registerUser` de [src/services/authService.js](../src/services/authService.js).
2. El servicio envía `POST ${VITE_API_URL}/auth/register` con `nombre`, `email` y `password`.
3. [backend/server.js](../backend/server.js) monta el router de autenticación en `/auth`.
4. [backend/routes/auth.js](../backend/routes/auth.js) dirige `POST /register` a `registerController`.
5. [backend/controllers/authController.js](../backend/controllers/authController.js) valida el cuerpo mediante [backend/utils/validation.js](../backend/utils/validation.js) y, si es válido, llama a [backend/services/authService.js](../backend/services/authService.js).
6. El servicio del backend utiliza Supabase Auth Admin con variables de entorno del servidor.

## Login y cliente Supabase

El login no sigue el endpoint de registro: `loginUser` en [src/services/authService.js](../src/services/authService.js) obtiene el cliente mediante `getSupabaseClient()` y ejecuta `supabase.auth.signInWithPassword` directamente desde el navegador. El cliente de ese flujo está en [src/services/supabaseClient.js](../src/services/supabaseClient.js).

También existe [src/lib/supabaseClient.js](../src/lib/supabaseClient.js), que crea y exporta una instancia distinta. La integración utilizada por `authService.js` referencia el cliente de `services/`; no se debe inferir que las dos implementaciones sean intercambiables.

## Backend y respuestas

[backend/server.js](../backend/server.js) configura CORS y `express.json()`, monta `/auth` y expone `GET /health`. El controlador de registro produce respuestas HTTP para validación (`400`), éxito (`201`), conflicto (`409`) y error interno (`500`). La documentación del endpoint debe contrastarse con la implementación real antes de usarla como contrato.

## Dashboard y protección

[src/routes/AppRouter.jsx](../src/routes/AppRouter.jsx) declara `/dashboard` con [src/routes/ProtectedRoute.jsx](../src/routes/ProtectedRoute.jsx), pero no está conectado desde `src/main.jsx` ni desde `src/App.jsx`. Además, el guard usa el valor temporal fijo `isAuthenticated = true`. Este patrón no implementa autorización real y no debe considerarse una protección de datos.
