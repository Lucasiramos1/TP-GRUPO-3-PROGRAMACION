# Estado y progreso

## Estado actual comprobable

- El frontend tiene configurados los comandos de desarrollo, build, lint y preview en [package.json](../package.json).
- El backend define el inicio de desarrollo y producción en [backend/package.json](../backend/package.json).
- El frontend incluye una landing, login y registro en las rutas declaradas por [src/App.jsx](../src/App.jsx).
- El backend implementa `GET /health` y `POST /auth/register` en [backend/server.js](../backend/server.js) y [backend/routes/auth.js](../backend/routes/auth.js).
- El registro valida en el servidor y usa Supabase Auth Admin a través de [backend/controllers/authController.js](../backend/controllers/authController.js) y [backend/services/authService.js](../backend/services/authService.js).
- La landing presenta estadísticas mock locales desde [src/services/statsService.js](../src/services/statsService.js).
- [render.yaml](../render.yaml) define un Blueprint para sitio estático Vite y servicio Node/Express, enlaza la URL del backend y configura el health check existente.

## No implementado o no confirmado

- El dashboard permanece como placeholder en [src/pages/Dashboard.jsx](../src/pages/Dashboard.jsx), y su router alternativo no está montado por el punto de entrada activo.
- El repositorio no evidencia gestión funcional de movimientos financieros ni informes.
- No hay endpoint backend `/stats`; las cifras mostradas son estáticas.
- No hay suite de pruebas ejecutable configurada: el manifiesto raíz no declara `test` y no se encontraron archivos de test/spec. La existencia de Vitest y Testing Library en [package.json](../package.json) no cambia ese hecho.
- No se encontraron archivos Docker ni esquema SQL/migraciones en el repositorio. La integración de datos que sí se observa es Supabase Auth.
- La funcionalidad contra un proyecto Supabase real no queda verificada por el código fuente ni por las plantillas de variables; depende de credenciales y configuración externas.
- El Blueprint no ha sido desplegado ni validado por Render; requiere los valores de Supabase y el origen público del sitio estático para CORS.

## Deuda técnica evidenciada

- [src/routes/AppRouter.jsx](../src/routes/AppRouter.jsx) define un árbol de rutas que no usa el arranque actual; el guard correspondiente usa autenticación fija en [src/routes/ProtectedRoute.jsx](../src/routes/ProtectedRoute.jsx).
- Hay dos módulos cliente de Supabase: [src/services/supabaseClient.js](../src/services/supabaseClient.js) y [src/lib/supabaseClient.js](../src/lib/supabaseClient.js).
- [src/services/authService.js](../src/services/authService.js) convierte fallos de fetch y parseo en un mensaje genérico mediante `catch {}`.
- [backend/services/authService.js](../backend/services/authService.js) detecta parte de los conflictos buscando texto en el mensaje de error del proveedor.
- [docs/api/auth-register.md](../docs/api/auth-register.md) difiere de la implementación en nombres de variables, restricciones y forma de respuesta.

## Prioridades inmediatas derivadas de la evidencia

1. Configurar en Render `FRONTEND_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`; tras conocer la URL pública del sitio, asignarla como `FRONTEND_URL`.
2. Ejecutar la validación inicial del Blueprint y desplegar los servicios desde Render; no se ha realizado un despliegue desde este entorno.
3. Mantener README y documentación API alineados con las rutas, respuestas y funcionalidades realmente conectadas.
4. Antes de activar el dashboard, conectarlo al router de arranque e implementar una comprobación real de sesión en lugar del valor fijo del guard.
5. Configurar una suite de pruebas repetible y cubrir validación del registro y respuestas del endpoint.
6. Definir una única implementación frontend del cliente Supabase y mejorar la distinción y el diagnóstico de errores de servicios.
7. Tratar estadísticas y capacidades financieras como mocks o trabajo pendiente hasta que exista su implementación de backend y persistencia.
