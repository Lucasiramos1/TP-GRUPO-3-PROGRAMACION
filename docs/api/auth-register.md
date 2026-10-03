# Documentación Técnica: POST /auth/register

**Última actualización:** Octubre 2026  
**Versión:** 1.0  
**Estado:** Disponible para consumo

---

## 📌 Resumen Ejecutivo

El endpoint `POST /auth/register` es el contrato formal para la creación de nuevas cuentas de usuario en Consulir. Esta documentación define la estructura de datos, códigos de estado HTTP, esquemas de respuesta y catálogo de errores que garantizan consistencia entre los equipos de backend y frontend.

---

## 🔐 Autenticación

**Tipo:** Sin autenticación requerida  
**Método:** HTTP POST  
**URL Base:** `{VITE_API_BASE_URL}/auth/register`  
**Content-Type:** `application/json`

---

## 📤 Especificación de Petición (Request)

### Body (Payload)

```json
{
  "nombre": "Juan Pérez García",
  "email": "juan@consulir.com",
  "password": "MiContraseña123"
}
```

### Campos Requeridos

| Campo | Tipo | Requerido | Restricciones | Descripción |
|-------|------|-----------|---|---|
| `nombre` | string | ✅ Sí | Mín. 3 caracteres, máx. 100 caracteres | Nombre completo del usuario. Espacios en blanco al inicio/fin se eliminan. |
| `email` | string | ✅ Sí | Formato válido de email, máx. 255 caracteres | Dirección de correo electrónico. Debe ser única en el sistema. Validación de formato en request-time (400), verificación de unicidad en persistence-time (409). |
| `password` | string | ✅ Sí | Mín. 8 caracteres, máx. 128 caracteres, debe incluir mayúscula, minúscula y número | Contraseña del usuario. El servidor NO debe almacenarla en texto plano; debe usar hashing seguro (ej. bcrypt). |

### Validaciones de Request

- **Campos obligatorios:** El servidor rechaza con `400 Bad Request` si falta algún campo.
- **Formato de email:** Se valida contra el patrón `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` en ambos lados (frontend y backend).
- **Complejidad de contraseña:** Se valida longitud mínima (8 caracteres) y presencia de mayúscula, minúscula y número.
- **Campos adicionales:** El servidor rechaza con `400 Bad Request` si hay campos no reconocidos en el payload (strict mode).
- **Encoding:** Se espera UTF-8.

---

## 📥 Especificación de Respuestas

### ✅ Respuesta Exitosa: 201 Created

**Código HTTP:** `201 Created`

```json
{
  "status": "success",
  "message": "Cuenta creada correctamente.",
  "data": {
    "id": "user-uuid-abc123def456",
    "nombre": "Juan Pérez García",
    "email": "juan@consulir.com",
    "createdAt": "2026-10-03T14:32:15Z"
  },
  "errors": []
}
```

#### Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|---|
| `status` | string | Valor fijo: `"success"` |
| `message` | string | Mensaje legible en español indicando éxito. |
| `data` | object | Objeto con datos públicos del usuario creado. |
| `data.id` | string | UUID único del usuario creado. |
| `data.nombre` | string | Nombre completo del usuario registrado. |
| `data.email` | string | Correo electrónico registrado. |
| `data.createdAt` | string | Timestamp ISO 8601 de la creación en UTC. |
| `errors` | array | Array vacío en caso de éxito. |

---

### ❌ Errores

#### 1. Error 400: Bad Request (Validación)

**Código HTTP:** `400 Bad Request`

Se retorna en los siguientes casos:
- Campos obligatorios faltantes
- Formato de email inválido
- Contraseña no cumple con complejidad
- Campos adicionales no reconocidos
- Formato JSON inválido

##### Ejemplo: Email Inválido

```json
{
  "status": "error",
  "message": "Los datos enviados no son válidos.",
  "data": null,
  "errors": [
    {
      "field": "email",
      "code": "INVALID_FORMAT",
      "message": "Ingresá un correo electrónico válido."
    }
  ]
}
```

##### Ejemplo: Contraseña Débil

```json
{
  "status": "error",
  "message": "Los datos enviados no son válidos.",
  "data": null,
  "errors": [
    {
      "field": "password",
      "code": "INSUFFICIENT_COMPLEXITY",
      "message": "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número."
    }
  ]
}
```

##### Ejemplo: Campo Obligatorio Faltante

```json
{
  "status": "error",
  "message": "Los datos enviados no son válidos.",
  "data": null,
  "errors": [
    {
      "field": "nombre",
      "code": "REQUIRED_FIELD",
      "message": "El nombre es obligatorio."
    }
  ]
}
```

---

#### 2. Error 409: Conflict (Email Duplicado)

**Código HTTP:** `409 Conflict`

Se retorna cuando el email ya existe en el sistema. Esta validación ocurre en **persistence-time** (durante el intento de guardar en la base de datos), no durante la validación inicial del request.

```json
{
  "status": "error",
  "message": "El email ya está registrado en el sistema.",
  "data": null,
  "errors": [
    {
      "field": "email",
      "code": "DUPLICATE_EMAIL",
      "message": "Este correo electrónico ya está asociado a una cuenta."
    }
  ]
}
```

---

#### 3. Error 500: Internal Server Error

**Código HTTP:** `500 Internal Server Error`

Se retorna para errores internos del servidor no controlados (fallos de base de datos, timeouts, etc.). **NO debe revelar detalles técnicos** en la respuesta.

```json
{
  "status": "error",
  "message": "Error interno del servidor. Intentá nuevamente más tarde.",
  "data": null,
  "errors": null
}
```

---

## 🔄 Estructura de Objetos de Error

### Error Detail Object

Todos los errores (excepto 500) incluyen un array `errors` con objetos de error detallado:

```json
{
  "field": "email",
  "code": "VALIDATION_CODE",
  "message": "Descripción legible para el usuario."
}
```

| Campo | Tipo | Descripción |
|-------|------|---|
| `field` | string | Nombre del campo que genera el error. Ej: `"email"`, `"password"`. |
| `code` | string | Código de error interno para procesamiento programático. Ej: `"INVALID_FORMAT"`, `"DUPLICATE_EMAIL"`. |
| `message` | string | Mensaje legible en español para mostrar al usuario. |

### Códigos de Error Definidos

| Código | Significado | HTTP | Descripción |
|--------|---|---|---|
| `REQUIRED_FIELD` | Campo obligatorio faltante | 400 | Un campo requerido está vacío o no fue enviado. |
| `INVALID_FORMAT` | Formato inválido | 400 | El campo no cumple con el formato esperado (ej: email). |
| `INSUFFICIENT_COMPLEXITY` | Complejidad insuficiente | 400 | La contraseña no cumple requisitos mínimos. |
| `DUPLICATE_EMAIL` | Email duplicado | 409 | El email ya existe en el sistema. |
| `INTERNAL_ERROR` | Error interno | 500 | Error no esperado en el servidor. |

---

## 🧪 Ejemplos de Consumo

### Con JavaScript/Fetch

```javascript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

async function registerUser({ nombre, email, password }) {
  try {
    const response = await fetch(`${apiBaseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await response.json();

    // ✅ Registro exitoso (201)
    if (response.ok && response.status === 201) {
      console.log("Usuario creado:", data.data);
      return { success: true, user: data.data };
    }

    // ❌ Errores con detalles
    if (response.status === 400) {
      const fieldErrors = data.errors.reduce((acc, error) => {
        acc[error.field] = error.message;
        return acc;
      }, {});
      console.error("Errores de validación:", fieldErrors);
      return { success: false, errors: fieldErrors };
    }

    // ❌ Email duplicado (409)
    if (response.status === 409) {
      console.error("Email ya registrado:", data.message);
      return { success: false, error: "duplicate_email" };
    }

    // ❌ Error interno (500)
    if (response.status === 500) {
      console.error("Error interno del servidor");
      return { success: false, error: "server_error" };
    }
  } catch (error) {
    console.error("Error en la petición:", error);
    return { success: false, error: "network_error" };
  }
}
```

### Con cURL

```bash
# Registro exitoso
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@consulir.com",
    "password": "MiContraseña123"
  }'

# Respuesta esperada (201)
{
  "status": "success",
  "message": "Cuenta creada correctamente.",
  "data": {
    "id": "user-uuid",
    "nombre": "Juan Pérez",
    "email": "juan@consulir.com",
    "createdAt": "2026-10-03T14:32:15Z"
  },
  "errors": []
}

# Validación fallida (400)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Jo",
    "email": "invalid-email",
    "password": "pass"
  }'

# Respuesta esperada (400)
{
  "status": "error",
  "message": "Los datos enviados no son válidos.",
  "data": null,
  "errors": [
    { "field": "nombre", "code": "INVALID_LENGTH", "message": "El nombre debe tener al menos 3 caracteres." },
    { "field": "email", "code": "INVALID_FORMAT", "message": "Ingresá un correo electrónico válido." },
    { "field": "password", "code": "INSUFFICIENT_COMPLEXITY", "message": "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número." }
  ]
}

# Email duplicado (409)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "usuario-existente@consulir.com",
    "password": "MiContraseña123"
  }'

# Respuesta esperada (409)
{
  "status": "error",
  "message": "El email ya está registrado en el sistema.",
  "data": null,
  "errors": [
    { "field": "email", "code": "DUPLICATE_EMAIL", "message": "Este correo electrónico ya está asociado a una cuenta." }
  ]
}
```

---

## 🔄 Integración con Frontend

El frontend (`RegisterForm.jsx`) ya contiene lógica que se alinea con esta especificación:

1. **Validaciones en cliente** (`src/utils/authValidations.js`):
   - `nombre`: mínimo 3 caracteres
   - `email`: formato válido
   - `password`: mínimo 8 caracteres, mayúscula, minúscula, número

2. **Manejo de respuestas** (`src/components/auth/RegisterForm.jsx`):
   - Estados de carga (`isLoading`)
   - Mensajes de éxito
   - Alertas de error
   - Deshabilitación de controles durante envío

3. **Tests funcionales** (PR #122):
   - ✅ Validaciones de campos
   - ✅ Estados de la interfaz (carga, deshabilitación)
   - ✅ Manejo de respuestas exitosas
   - ✅ Manejo de errores (400, 409, 500)

---

## 📋 Checklist de Implementación Backend

- [ ] Implementar endpoint `POST /auth/register`
- [ ] Validar campos requeridos (400 Bad Request)
- [ ] Validar formato de email (400 Bad Request)
- [ ] Validar complejidad de contraseña (400 Bad Request)
- [ ] Rechazar campos adicionales (400 Bad Request)
- [ ] Verificar unicidad de email (409 Conflict)
- [ ] Hash seguro de contraseña (bcrypt)
- [ ] Retornar 201 Created con estructura especificada
- [ ] Manejo de errores no controlados (500 Internal Server Error)
- [ ] Logs de errores para debugging
- [ ] Tests unitarios por código de error
- [ ] Tests de integración con base de datos

---

## 📝 Notas Adicionales

- **Timezone:** Todas las timestamps se envían en formato ISO 8601 UTC.
- **Rate Limiting:** Se recomienda implementar rate limiting para prevenir abuso.
- **CORS:** Configurar CORS según necesidades del frontend (ej: `http://localhost:5173`).
- **Logs:** Registrar intentos de registro fallidos para auditoría de seguridad.
- **Contraseñas:** Nunca registrar contraseñas en logs. Usar hashing con salt aleatorio.

---

## 🔗 Referencias Relacionadas

- [Validaciones en Frontend](../../src/utils/authValidations.js)
- [Formulario de Registro](../../src/components/auth/RegisterForm.jsx)
- [Tests Funcionales](../../src/components/auth/__tests__/RegisterForm.test.jsx)
- [Ticket T-9](https://github.com/Lucasiramos1/TP-GRUPO-3-PROGRAMACION/issues/36)

---

**Última revisión:** 3 de octubre de 2026  
**Autor:** Equipo TP-GRUPO-3-PROGRAMACION  
**Estado:** Listo para implementación backend
