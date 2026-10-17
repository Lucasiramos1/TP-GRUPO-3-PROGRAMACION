# Nombre

Convenciones del backend Express

## Alcance

Aplica a `backend/`, especialmente a rutas, controladores, validaciones, servicios, configuración y acceso a Supabase.

## Justificación

El servidor es una aplicación Express independiente: `backend/server.js` monta `backend/routes/auth.js` bajo `/auth`; la ruta delega en un controlador, que valida la entrada y usa un servicio para interactuar con Supabase. Mantener estas responsabilidades separadas facilita verificar el contrato HTTP y evita exponer credenciales privilegiadas.

## Guía específica del proyecto

- Mantén el flujo `ruta → controlador → validación/servicio`: `backend/routes/auth.js` registra `router.post('/register', registerController)` y `backend/controllers/authController.js` llama a `validateRegisterBody` antes de `registerUserInSupabase`.
- Conserva en el controlador la traducción de resultados y errores a respuestas HTTP. El registro existente devuelve `201` con `code: 'USER_CREATED'`, `400` con `code: 'VALIDATION_ERROR'` o `409` con `code: 'EMAIL_CONFLICT'`; cualquier cambio debe actualizar el contrato y su documentación.
- Valida los datos en el backend aunque haya validación de formulario en el frontend. Por ejemplo, `backend/utils/validation.js` comprueba que `nombre`, `email` y `password` sean cadenas y aplica los requisitos de formato y contraseña.
- Mantén las operaciones de Supabase en servicios. `backend/services/authService.js` registra mediante `supabase.auth.admin.createUser`; no muevas esa integración a las rutas ni al controlador.
- Clasifica errores del proveedor usando códigos estructurados cuando estén disponibles. `backend/services/authService.js` actualmente busca textos literales en `error.message` para determinar `EMAIL_CONFLICT`; evita copiar esa heurística a servicios nuevos y cubre los códigos admitidos con pruebas.
- Mantén un formato uniforme para errores HTTP. Si se agrega middleware de errores a `backend/server.js`, colócalo después de las rutas, conserva los estados del contrato y no expongas mensajes internos del proveedor. El servidor actual aún no tiene un manejador final común, así que los nuevos errores no deben asumir que ya existe.
- La `SUPABASE_SERVICE_ROLE_KEY` es secreta y solo debe leerse en el backend desde el entorno. No la incluyas en el cliente React, respuestas HTTP, logs ni archivos versionados.
- Registra las rutas nuevas en `backend/server.js` y documenta su método y prefijo. Actualmente `/auth/register` se obtiene al montar el router en `/auth`; `/health` está definido directamente en el servidor.
- Conserva los valores de configuración existentes: `PORT` usa `3001` como fallback y CORS usa `FRONTEND_URL` con fallback a `http://localhost:5173`.
- Al cambiar una regla de entrada, alinea el contrato con `src/utils/authValidations.js` y prueba casos equivalentes en cliente y servidor. `backend/utils/validation.js` es la autoridad de validación para el endpoint, no la validación del formulario.

No asumas que existe una suite de backend: `backend/package.json` solo declara `dev` y `start`. Si agregas pruebas, configura un script explícito antes de documentar cómo ejecutarlas.

Ejemplo del patrón existente:

```js
// backend/server.js
app.use('/auth', authRouter);

// backend/routes/auth.js
router.post('/register', registerController);
```
