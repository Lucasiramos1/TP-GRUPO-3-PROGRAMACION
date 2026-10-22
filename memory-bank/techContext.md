# Contexto técnico

## Repositorio

El producto contiene dos aplicaciones Node independientes dentro del mismo repositorio:

- frontend en la raíz;
- backend Express en `backend/`.

Cada una tiene su propio `package.json` y `package-lock.json`. No están configuradas como npm workspaces.

## Frontend

Fuente: `package.json`, `vite.config.js` y `src/`.

- React 19.
- React DOM 19.
- React Router DOM 7.
- Vite 8.
- Supabase JavaScript 2.
- CSS tradicional y clases utilitarias configuradas mediante Tailwind CSS 3.
- ESLint 10.
- Vitest 4 y Testing Library como herramientas de prueba.

Scripts:

- `npm run dev`: servidor Vite.
- `npm run build`: build de producción en `dist/`.
- `npm run lint`: ESLint.
- `npm test`: Vitest en modo ejecución única.
- `npm run preview`: vista previa del build.

Variables públicas requeridas, documentadas en `.env.example`:

- `VITE_API_URL`.
- `VITE_SUPABASE_URL`.
- `VITE_SUPABASE_ANON_KEY`.

Las variables `VITE_*` son públicas para el navegador. Nunca deben contener `service_role` ni secretos.

## Backend

Fuente: `backend/package.json` y `backend/`.

- Node.js con módulos ES.
- Express 4.
- CORS.
- dotenv.
- Supabase JavaScript 2.

Scripts:

- `npm run dev`: `node --watch server.js`.
- `npm start`: `node server.js`.

Variables requeridas, documentadas en `backend/.env.example`:

- `PORT`, con fallback `3001` en `backend/server.js`.
- `FRONTEND_URL`, con fallback `http://localhost:5173`.
- `SUPABASE_URL`.
- `SUPABASE_SERVICE_ROLE_KEY`.

El backend no tiene framework ni script de tests actualmente.

## Base de datos y autenticación

Supabase proporciona:

- Auth para usuarios y sesiones;
- PostgreSQL para movimientos;
- Data API consumida mediante `@supabase/supabase-js`;
- RLS como límite de autorización por usuario.

La migración versionada es `supabase/migrations/20261021181248_create_finance_transactions.sql`.

Tabla principal: `public.finance_transactions`.

Campos:

- `id uuid`;
- `user_id uuid`, referencia a `auth.users` y borrado en cascada;
- `kind`, restringido a `income` o `expense`;
- `amount numeric(14,2)`, mayor a cero;
- `category`;
- `description` opcional;
- `occurred_on date`;
- `created_at timestamptz`.

La tabla tiene índice por usuario y fecha, RLS habilitado, acceso `anon` revocado y permisos CRUD para `authenticated` condicionados por propietario.

No existe `supabase/config.toml`; el repositorio no contiene un vínculo reproducible a un proyecto remoto.

## Despliegue

`render.yaml` define:

- `consulir-api`, web service Node con health check `/health`;
- `consulir-web`, sitio estático publicado desde `dist/`;
- rewrite `/* → /index.html` para React Router;
- referencia automática del frontend a la URL externa del backend;
- variables de Supabase configuradas manualmente y no versionadas.

## Docker

No hay `Dockerfile` ni `docker-compose.yml`. El desarrollo y el despliegue actuales se basan en npm y la configuración nativa de Render.

## Versiones y reproducibilidad

- Los lockfiles están versionados.
- Los manifiestos usan rangos con `^`.
- No existe `engines`, `.nvmrc` ni `.node-version`.
- No existe pipeline de CI versionado.

## Seguridad operativa

- No leer, mostrar ni versionar `.env`, tokens o claves.
- La clave pública se limita al frontend.
- La clave privilegiada se limita al backend.
- Los cambios de esquema se realizan mediante migraciones nuevas.
- Las políticas RLS se validan con usuarios distintos antes de desplegar.
