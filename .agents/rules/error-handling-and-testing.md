# Nombre

Manejo de errores y pruebas

## Alcance

Aplica al manejo de fallos y a las pruebas de los formularios y servicios React, validaciones compartidas por contrato, endpoints Express e integración con Supabase.

## Justificación

El cliente de registro captura fallos de red y parseo en un `catch {}` genérico; el backend clasifica conflictos de Supabase parcialmente por texto y no configura un middleware final de errores. Además, hay dependencias de Vitest y Testing Library, pero no script de pruebas ni archivos de test detectados.

## Guía específica del proyecto

- En `src/services/authService.js`, distingue fallo de transporte, respuesta HTTP de error y cuerpo que no se puede parsear. Mantén mensajes entendibles para el usuario, pero no descartes silenciosamente la causa técnica ni registres contraseñas, tokens o claves.
- En los controladores Express, devuelve errores con estado HTTP y forma de respuesta coherentes con el contrato existente. `backend/controllers/authController.js` ya responde con `code`, `message`, `errors` y `data`; no devuelvas trazas o mensajes internos del proveedor al cliente.
- Si se agrega manejo global a `backend/server.js`, registra el middleware de errores después de las rutas y cubre errores de `express.json()` además de excepciones de controladores.
- En `backend/services/authService.js`, prefiere códigos de error estructurados de Supabase para clasificar `EMAIL_CONFLICT`; no dependas de frases en `error.message`, que pueden cambiar.
- La validación del servidor en `backend/utils/validation.js` es la autoridad para `POST /auth/register`. Al cambiarla, alinea `src/utils/authValidations.js` y prueba casos de borde equivalentes, incluidos tipo incorrecto, cadena vacía, email inválido y contraseña débil.
- Actualmente `package.json` no define `test` y no se encontraron archivos `*.test.*` ni `*.spec.*`; `backend/package.json` solo declara `dev` y `start`. No describas pruebas como ejecutables hasta que se añadan scripts y configuración.
- Al introducir una suite, empieza por funciones puras de validación; después cubre respuestas `201`, `400`, `409`, fallo de red y error del proveedor. Usa Testing Library para validar que `RegisterForm` muestra los errores de campo recibidos, una vez conectada la infraestructura de tests.

Ejemplo del resultado de validación que consume el controlador:

```js
// backend/controllers/authController.js
const { valid, errors } = validateRegisterBody(req.body);

if (!valid) {
  return res.status(400).json({
    status: 'error',
    code: 'VALIDATION_ERROR',
    errors,
    data: null,
  });
}
```
