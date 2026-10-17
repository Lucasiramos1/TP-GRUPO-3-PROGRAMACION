# Nombre

Estructura y límites del frontend

## Alcance

Aplica al código React bajo `src/`, incluyendo páginas, componentes, rutas, servicios y configuración del cliente Supabase.

## Justificación

El frontend está organizado en páginas y componentes reutilizables, y separa las llamadas de red en servicios. Además, algunas rutas y capacidades descritas en documentos o archivos auxiliares no están activas en la aplicación que arranca. Respetar el punto de entrada real evita presentar funcionalidades incompletas como disponibles.

## Guía específica del proyecto

- Usa `src/App.jsx` como fuente de verdad para las rutas activas. Actualmente monta `/`, `/login` y `/registro`; una ruta declarada únicamente en `src/routes/AppRouter.jsx` no queda disponible por ese hecho.
- No agregues rutas a `src/routes/AppRouter.jsx` suponiendo que estarán activas: `src/main.jsx` monta `App` y no importa ese router alternativo. Mantén una única definición de rutas conectada al punto de entrada.
- Mantén las páginas como composición de componentes. Por ejemplo, `src/components/landing/LandingPage.jsx` arma la pantalla con `Header`, `HeroSection`, `AuthCard`, `InfoCard`, `SecurityCard`, `StatsBar` y `Footer`.
- Coloca operaciones de red y acceso a servicios en `src/services/`. El registro usa `registerUser` en `src/services/authService.js`, que envía `POST` a `${import.meta.env.VITE_API_URL}/auth/register`.
- No des por hecho que login, registro y dashboard comparten un flujo de sesión del backend: `loginUser` inicia sesión directamente con Supabase desde el navegador, mientras el registro llama al backend Express.
- Reutiliza un cliente Supabase canónico. El servicio usa `src/services/supabaseClient.js` y su `getSupabaseClient()`; evita introducir otra instancia como la exportada por `src/lib/supabaseClient.js`, cuya inicialización y validación de entorno son distintas.
- Trata `src/services/statsService.js` como un mock: `getStats()` devuelve datos locales y no consume un endpoint. No documentes ni conectes una API `/stats` hasta que exista y esté registrada en el backend.
- `src/pages/Dashboard.jsx` es un placeholder y `src/routes/ProtectedRoute.jsx` actualmente establece `isAuthenticated = true`. No presentes la ruta como protegida en producción ni reutilices ese valor temporal para autorizar datos privados. Antes de activar una ruta protegida, implementa una comprobación real de sesión y conéctala desde `src/App.jsx`.
- Mantén las reglas de validación del cliente alineadas con `backend/utils/validation.js`, que es autoridad para los datos recibidos por el servidor. Al cambiar el registro, cubre ambas implementaciones con casos equivalentes y muestra los errores de campo devueltos por el backend.
- No ocultes excepciones de servicios en bloques vacíos. En `src/services/authService.js`, `registerUser` captura actualmente fallos de red o de parseo como un mensaje genérico; al modificarlo, conserva mensajes comprensibles para el usuario y facilita el diagnóstico sin registrar credenciales o datos sensibles.
- Usa nombres contextualizados cuando existan componentes homónimos: `src/components/auth/AuthCard.jsx` y `src/components/landing/AuthCard.jsx` son módulos diferentes, y la landing importa el de `landing/`. Conserva campos públicos como `nombre` tal cual en el contrato; coordina cualquier cambio de nombre entre frontend, backend y documentación.
- Para cambios visuales, sigue la organización de estilos ya presente junto a las páginas y componentes (`.jsx` y `.css`) y las utilidades Tailwind configuradas en el proyecto.

No hay actualmente script raíz `test` ni archivos `*.test.*` o `*.spec.*`. No afirmes que un cambio quedó probado con Vitest o Testing Library solo porque esas dependencias aparecen en `package.json`.

Ejemplo de composición y navegación activa:

```jsx
// src/App.jsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/registro" element={<RegisterPage />} />
</Routes>
```
