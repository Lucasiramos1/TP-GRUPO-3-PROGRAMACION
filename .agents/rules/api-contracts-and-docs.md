# Nombre

Coherencia de contratos y documentación

## Alcance

Aplica a los endpoints del backend, los clientes de `src/services/`, las variables de entorno documentadas y los documentos bajo `docs/` y en los README.

## Justificación

La verificación del repositorio encontró diferencias entre `docs/api/auth-register.md` y el comportamiento implementado: el documento indica `VITE_API_BASE_URL`, mientras el cliente usa `VITE_API_URL`, y también difieren reglas de validación y campos/formas de respuesta. Asimismo, el texto de producto menciona capacidades que todavía no están implementadas.

## Guía específica del proyecto

- Antes de cambiar un contrato, revisa conjuntamente la ruta, el controlador, la validación, el servicio cliente y su documentación. Para el registro, las referencias son `backend/routes/auth.js`, `backend/controllers/authController.js`, `backend/utils/validation.js` y `src/services/authService.js`.
- Documenta nombres exactos de variables. El cliente de registro lee `import.meta.env.VITE_API_URL`; no lo describas como `VITE_API_BASE_URL` salvo que el código se cambie de forma coordinada.
- Alinea los ejemplos de respuesta con el controlador real. El registro exitoso devuelve `data.id`, `data.email`, `data.nombre` y `data.created_at`; la validación devuelve `errors` como objeto de campo a mensaje, y no acepta automáticamente restricciones que `validateRegisterBody` no implementa.
- Trata el backend como autoridad de validación y refleja en el cliente sus requisitos. `src/utils/authValidations.js` y `backend/utils/validation.js` son implementaciones separadas; prueba las mismas fronteras y formatos en ambas para evitar que el formulario acepte datos que el servidor rechaza.
- Distingue entre mocks, placeholders y funcionalidades implementadas. `src/services/statsService.js` solo devuelve estadísticas hardcodeadas; `backend/server.js` no expone `/stats`. `src/pages/Dashboard.jsx` es un placeholder.
- Describe por separado los flujos de autenticación existentes: el registro pasa por `POST /auth/register`, mientras el login usa `supabase.auth.signInWithPassword` directamente desde el frontend.
- Al implementar o modificar una funcionalidad, actualiza en el mismo cambio el README o el documento API directamente relacionado para que los comandos, rutas, variables y formatos no queden obsoletos.
- No afirmes que una funcionalidad está disponible solo porque existe un componente o router. `src/routes/AppRouter.jsx` no es el router que monta `src/main.jsx`; por eso, documenta únicamente rutas conectadas al punto de entrada.
- Distingue claramente datos simulados de respuestas de API: `getStats()` en `src/services/statsService.js` devuelve un arreglo local, mientras `backend/server.js` no registra `/stats`.

Ejemplo del dato verificable que debe reflejar la documentación:

```js
// src/services/authService.js
const API_URL = import.meta.env.VITE_API_URL;
const response = await fetch(`${API_URL}/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre, email, password }),
});
```
