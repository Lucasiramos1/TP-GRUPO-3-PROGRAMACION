# Nombre

Seguridad y cambios de Supabase

## Alcance

Aplica a Supabase Auth, clientes JavaScript, variables relacionadas, migraciones SQL, tablas expuestas y políticas RLS.

## Justificación

El CRUD financiero se ejecuta desde el navegador contra la Data API. La seguridad depende de la sesión y de las políticas de `supabase/migrations/20261021181248_create_finance_transactions.sql`. El registro, en cambio, utiliza una clave privilegiada en `backend/services/authService.js`.

## Guía específica del proyecto

1. Nunca incluir `service_role`, secret keys, JWT privados o credenciales en `src/`, variables `VITE_*`, logs, documentación o commits.
2. El frontend utiliza únicamente la URL del proyecto y una clave pública `anon` o publishable.
3. Toda operación administrativa debe ejecutarse desde backend y sólo cuando el caso de uso realmente requiera privilegios.
4. Toda tabla en un esquema expuesto debe habilitar RLS en la misma migración que la crea.
5. No alcanza con `TO authenticated`: cada política debe aplicar una condición de autorización por fila.
6. Para filas propiedad del usuario, usar el patrón probado:

```sql
to authenticated
using ((select auth.uid()) = user_id)
```

7. Las políticas UPDATE deben incluir `USING` y `WITH CHECK` con la misma restricción de propiedad.
8. Los INSERT deben impedir asignar una fila a otro usuario. Preferir un default basado en `auth.uid()` y un `WITH CHECK` explícito.
9. Revocar acceso a `anon` cuando una tabla sólo corresponde a usuarios autenticados y conceder a `authenticated` únicamente las operaciones necesarias.
10. No usar `user_metadata` para decisiones de autorización. En este proyecto `nombre` es un dato descriptivo, no un rol.
11. No agregar `SECURITY DEFINER` para resolver permisos sin un diseño de seguridad revisado.
12. Crear cambios de esquema mediante migraciones versionadas en `supabase/migrations/`; no editar retrospectivamente una migración ya aplicada.
13. Antes de cerrar un cambio, comprobar acceso propio permitido, acceso ajeno denegado y ejecutar los advisors disponibles.
14. Verificar la documentación y el changelog actual de Supabase antes de cambiar SDK, Auth, Data API o RLS.
15. Mantener lockfiles versionados y revisar conscientemente cualquier actualización de `@supabase/supabase-js`.

## Ejemplo del proyecto

`finance_transactions` define `user_id default auth.uid()`, revoca acceso a `anon` y protege SELECT, INSERT, UPDATE y DELETE mediante políticas por propietario.
