# Patrones del sistema

## Vista general

```text
Navegador React
├── Landing y formularios
├── AuthProvider / ProtectedRoute
├── POST /auth/register ──────────────► Express ─► Supabase Auth Admin
└── Login, sesión y transacciones ────► Supabase Auth + Data API
                                                   │
                                                   └── PostgreSQL + RLS
```

## Composición del frontend

`src/main.jsx` monta `src/App.jsx`.

`src/App.jsx` es la composición raíz:

1. `AuthProvider` mantiene el contexto de sesión.
2. `BrowserRouter` resuelve navegación.
3. Las rutas públicas renderizan landing, login y registro.
4. `/dashboard` se envuelve con `ProtectedRoute`.
5. Una ruta desconocida vuelve a `/`.

No debe crearse un segundo router paralelo.

## Patrón de sesión

`src/providers/AuthProvider.jsx`:

- obtiene la sesión inicial con `supabase.auth.getSession()`;
- escucha cambios con `onAuthStateChange`;
- expone `session`, `user` e `isLoading` mediante `AuthContext`;
- cancela la suscripción al desmontarse.

`src/hooks/useAuth.js` es la única interfaz de consumo del contexto.

`src/routes/ProtectedRoute.jsx` espera que termine la carga antes de decidir si renderiza o redirige. Esto evita enviar al login a una persona cuya sesión todavía se está restaurando.

## Patrón de registro

```text
RegisterForm
  → services/authService.registerUser
    → POST /auth/register
      → route
        → controller
          → validation
          → backend auth service
            → supabase.auth.admin.createUser
```

La validación del navegador mejora UX; la validación del backend es obligatoria para seguridad y contrato.

El backend devuelve códigos de dominio estables y no expone el mensaje crudo de errores inesperados.

## Patrón de login

`LoginPage` entrega credenciales a `services/authService.loginUser`, que invoca `signInWithPassword` mediante el cliente público. Un login correcto actualiza la sesión observada por `AuthProvider` y navega al origen solicitado o al dashboard.

## Patrón de movimientos

`src/pages/Dashboard.jsx` administra estado visual, selección de mes y coordinación de operaciones.

`src/services/transactionService.js` contiene cuatro operaciones:

- `listTransactions(month)`;
- `createTransaction(transaction)`;
- `updateTransaction(id, transaction)`;
- `deleteTransaction(id)`.

El servicio no agrega `user_id`. La base asigna `auth.uid()` al insertar y RLS restringe todas las operaciones al propietario.

Las consultas mensuales usan un intervalo semiabierto:

```text
occurred_on >= primer día del mes
occurred_on < primer día del mes siguiente
```

Este patrón evita cálculos dependientes de la cantidad de días del mes.

## Patrón de cálculos

`src/utils/finance.js` contiene funciones puras:

- suma ingresos y egresos;
- calcula balance;
- genera un mensaje según el resultado;
- formatea moneda ARS.

Las funciones puras no conocen React, Supabase ni el DOM y se prueban en `src/utils/finance.test.js`.

## Patrón SQL y RLS

Cada tabla expuesta debe declarar en una misma migración:

1. tabla y restricciones;
2. índices necesarios;
3. `enable row level security`;
4. revocaciones y grants mínimos;
5. políticas por operación y propietario.

Para UPDATE se requieren `USING` y `WITH CHECK`. Para INSERT se requiere `WITH CHECK`. No usar metadatos editables del usuario para autorización.

## Patrón de errores

- UI: mensaje simple, accionable y sin información sensible.
- Servicio frontend: normaliza transporte o propaga el error para que la página decida.
- Controlador backend: traduce errores conocidos a HTTP.
- Servicio backend: encapsula detalles del proveedor.
- Logs: pueden contener contexto técnico controlado, nunca claves, tokens o contraseñas.

## Patrón de despliegue

Render construye el backend desde `backend/` y el frontend desde la raíz. El frontend recibe automáticamente la URL externa de la API mediante `fromService`; las variables de Supabase se configuran fuera del repositorio.

Después de cada promoción estable se debe comprobar:

1. estado Live de ambos servicios;
2. `/health` de la API;
3. carga de landing;
4. registro o login con una cuenta técnica;
5. acceso protegido y persistencia de un movimiento;
6. ausencia de errores relevantes en logs.
