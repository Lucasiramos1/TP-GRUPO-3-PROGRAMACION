# Nombre

Convenciones del backend Express

## Alcance

Aplica a `backend/server.js` y a todos los archivos bajo `backend/routes/`, `backend/controllers/`, `backend/services/` y `backend/utils/`.

## Justificación

El backend actual es pequeño y tiene una separación reconocible: `backend/routes/auth.js` define HTTP, `backend/controllers/authController.js` traduce resultados y `backend/services/authService.js` integra Supabase. Preservar ese límite evita acoplar Express, reglas de negocio y SDKs externos.

## Guía específica del proyecto

1. Mantener el flujo `route → controller → service`.
2. Una ruta declara método, path y controlador; no accede a Supabase ni contiene validación extensa.
3. Un controlador valida la petición, invoca servicios y convierte errores de dominio en respuestas HTTP.
4. Un servicio encapsula SDKs y proveedores externos. Sólo `backend/services/authService.js` debe conocer actualmente `supabase.auth.admin`.
5. Las validaciones reutilizables viven en `backend/utils/`. El backend siempre vuelve a validar aunque el frontend ya lo haya hecho.
6. Las respuestas de error públicas deben usar códigos estables como `VALIDATION_ERROR`, `EMAIL_CONFLICT` o `INTERNAL_ERROR`.
7. No devolver mensajes crudos del proveedor, stack traces, claves, tokens ni variables de entorno.
8. Validar las variables obligatorias al inicio del proceso y nombrar la variable faltante sin imprimir su valor.
9. `SUPABASE_SERVICE_ROLE_KEY` es exclusiva del proceso backend.
10. Mantener `GET /health` sin dependencias innecesarias para que Render pueda comprobar vida del proceso.
11. Al agregar un endpoint, documentar contrato, casos de error y pruebas.
12. Antes de ampliar exposición pública, diseñar rate limiting y mitigación antiabuso para `POST /auth/register`.

## Ejemplo correcto

```js
router.post("/register", registerController);

export async function registerController(req, res) {
  const result = validateRegisterBody(req.body);
  // Traducción HTTP y delegación al servicio.
}
```

## Evitar

```js
router.post("/register", async (req, res) => {
  // No crear clientes privilegiados ni mezclar toda la lógica en la ruta.
});
```
