# Backend — consulir-app

Servidor Express que expone el endpoint `POST /auth/register` para el registro de usuarios, actuando como intermediario entre el frontend y Supabase Auth.

---

## Setup

```bash
cd backend
npm install
cp .env.example .env   # completar con tus credenciales de Supabase
npm run dev            # servidor en http://localhost:3001
```

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto `3001`) |
| `FRONTEND_URL` | URL del frontend para CORS (por defecto `http://localhost:5173`) |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key de Supabase (secreta, solo backend) |

---

## Endpoint: POST /auth/register

Registra un nuevo usuario en Supabase Auth.

### Request

```http
POST /auth/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "usuario@example.com",
  "password": "MiPass123"
}
```

### Respuestas

#### 201 Created — Registro exitoso

```json
{
  "status": "success",
  "code": "USER_CREATED",
  "message": "Usuario creado exitosamente",
  "data": {
    "id": "user-uuid",
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "created_at": "2026-08-29T10:30:00Z"
  }
}
```

#### 400 Bad Request — Error de validación

```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Faltan campos requeridos o tienen formato inválido",
  "errors": {
    "nombre": "Campo requerido",
    "email": "Formato inválido",
    "password": "Debe tener al menos 8 caracteres"
  },
  "data": null
}
```

#### 409 Conflict — Email duplicado

```json
{
  "status": "error",
  "code": "EMAIL_CONFLICT",
  "message": "El email ya está registrado en el sistema",
  "errors": { "email": "Email duplicado" },
  "data": null
}
```

#### 500 Internal Server Error

```json
{
  "status": "error",
  "code": "INTERNAL_ERROR",
  "message": "Error interno del servidor",
  "errors": null,
  "data": null
}
```
