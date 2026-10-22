# Contexto de producto

## Visión

Consulir es un MVP web de gestión financiera personal. Su objetivo actual es permitir que una persona cree una cuenta, inicie sesión y lleve un registro mensual simple de ingresos y egresos con una lectura inmediata del resultado.

Esta descripción se basa en las rutas de `src/App.jsx`, el comportamiento de `src/pages/Dashboard.jsx` y el esquema de `supabase/migrations/20261021181248_create_finance_transactions.sql`.

## Personas y necesidad principal

La interfaz está orientada a una persona usuaria individual autenticada. Cada cuenta debe consultar y modificar únicamente sus propios movimientos. El aislamiento no es una convención visual: se implementa en PostgreSQL mediante RLS y `user_id = auth.uid()`.

## Funcionalidad real

### Landing

`src/components/landing/LandingPage.jsx` compone:

- navegación y llamada a login;
- presentación del producto;
- accesos a login y registro;
- tarjetas informativas y de seguridad;
- estadísticas institucionales provenientes del mock `src/services/statsService.js`.

Las estadísticas de landing no son datos financieros reales ni provienen del backend.

### Registro

`src/components/auth/RegisterForm.jsx` solicita nombre, email y contraseña. Valida en cliente y delega en `src/services/authService.js`, que llama al backend.

El backend valida nuevamente y crea el usuario mediante Supabase Admin. El contrato está documentado en `docs/api/auth-register.md` y su implementación vive en `backend/`.

### Inicio y cierre de sesión

`src/pages/LoginPage.jsx` y `src/components/auth/LoginForm.jsx` realizan el login. `src/providers/AuthProvider.jsx` restaura y observa la sesión. `src/routes/ProtectedRoute.jsx` redirige a `/login` si no existe una sesión válida.

### Dashboard financiero

`src/pages/Dashboard.jsx` permite:

- elegir un mes hasta el mes actual;
- crear ingresos y egresos;
- seleccionar categorías según el tipo;
- registrar fecha y descripción opcional;
- listar los movimientos del mes;
- editar un movimiento;
- eliminar un movimiento con confirmación;
- ver ingresos, egresos y resultado mensual;
- obtener un mensaje interpretativo del balance;
- cerrar sesión.

Los cálculos se realizan con funciones puras de `src/utils/finance.js`.

## Alcance que no existe actualmente

- cuentas compartidas o equipos;
- presupuestos, metas o alertas;
- conciliación bancaria;
- importación de extractos;
- reportes descargables;
- múltiples monedas;
- recuperación o cambio de contraseña desde la UI;
- verificación de email gestionada por la aplicación;
- endpoint real de estadísticas;
- panel administrativo.

No asumir que estas funciones existen ni incorporarlas sin una solicitud y diseño explícitos.

## Criterio de éxito del MVP

Una persona puede registrarse, iniciar sesión, acceder al dashboard protegido y administrar movimientos que permanecen aislados de otras cuentas. El resumen mensual debe recalcularse con los datos persistidos.

## Principios de experiencia

- Textos visibles en español argentino.
- Formularios con validación previa y mensajes comprensibles.
- Errores internos y credenciales nunca se exponen en la interfaz.
- El dashboard debe seguir siendo utilizable en escritorio y móvil.
