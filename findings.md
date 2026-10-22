# Hallazgos de ingeniería

Fecha de análisis: 21 de octubre de 2026.

Los hallazgos siguientes se basan en archivos presentes en el repositorio. Cada punto incluye una regla accionable que puede transformarse en una pauta permanente del proyecto.

## Arquitectura

### A1. El sistema tiene dos caminos de acceso a Supabase

**Evidencia:** `backend/services/authService.js` usa `supabase.auth.admin.createUser` para el registro, mientras que `src/services/authService.js`, `src/providers/AuthProvider.jsx` y `src/services/transactionService.js` usan el cliente público desde el navegador.

**Riesgo:** una persona nueva puede asumir que todo pasa por Express o, en el extremo opuesto, intentar mover una operación administrativa al frontend y exponer la clave privada.

**Regla accionable:** documentar cada nueva operación como una de estas dos categorías: operación pública protegida por Auth/RLS o operación privilegiada exclusiva del backend. Nunca importar ni exponer `service_role` en código `src/` o variables `VITE_*`.

### A2. El límite de autorización real del CRUD es RLS

**Evidencia:** `src/services/transactionService.js` no envía `user_id`; la migración `supabase/migrations/20261021181248_create_finance_transactions.sql` lo completa con `auth.uid()` y aplica políticas de propiedad para SELECT, INSERT, UPDATE y DELETE.

**Riesgo:** agregar una tabla al esquema expuesto sin RLS o con políticas basadas sólo en `TO authenticated` produciría acceso horizontal entre usuarios.

**Regla accionable:** toda tabla expuesta debe habilitar RLS en la misma migración y combinar el rol permitido con una condición de propiedad. Las políticas UPDATE deben declarar tanto `USING` como `WITH CHECK`.

### A3. El backend está acotado, pero se despliega como servicio independiente

**Evidencia:** `backend/server.js` sólo expone `/health` y monta `/auth`; `backend/routes/auth.js` sólo define `POST /register`. `render.yaml` crea un servicio Node separado.

**Riesgo:** incorporar lógica de negocio sin una convención puede convertir el backend en una mezcla de controladores, acceso a datos y validaciones.

**Regla accionable:** conservar el flujo `route → controller → service`, dejando la validación reutilizable en `backend/utils/`. Las rutas no deben acceder directamente a Supabase.

### A4. Existían dos árboles de rutas y dos clientes de Supabase

**Evidencia:** la aplicación activa usa `src/App.jsx` y `src/services/supabaseClient.js`; `src/routes/AppRouter.jsx` y `src/lib/supabaseClient.js` no son importados por el grafo activo.

**Riesgo:** una corrección aplicada al archivo inactivo puede parecer válida en revisión pero no modificar el producto.

**Regla accionable:** mantener una única fuente para el router y una única fábrica de cliente Supabase. Antes de crear un módulo equivalente, buscar implementaciones existentes y sus importaciones.

## Naming y organización

### N1. Hay familias duplicadas de componentes

**Evidencia:** existen componentes `InfoCard`, `StatsBar`, `Footer` y `AuthCard` en carpetas alternativas, pero `src/components/landing/LandingPage.jsx` importa exclusivamente los ubicados en `components/landing/`.

**Riesgo:** nombres idénticos en distintas carpetas dificultan saber cuál es la implementación vigente.

**Regla accionable:** ubicar componentes exclusivos de una pantalla dentro de la carpeta de esa pantalla; mover a una carpeta compartida sólo cuando existan al menos dos consumidores reales.

### N2. El archivo `tuoch.env` no comunica propósito y evade el ignore actual

**Evidencia:** `tuoch.env` está versionado; `.gitignore` ignora `.env` y variantes locales, pero no cualquier archivo que termine en `.env`.

**Riesgo:** nombres ambiguos facilitan subir configuraciones locales o claves por error.

**Regla accionable:** versionar únicamente archivos `.env.example` con valores ficticios. Ignorar cualquier `*.env` real y usar nombres de variables documentados en los ejemplos oficiales.

### N3. Las convenciones de formato no son uniformes

**Evidencia:** los archivos más nuevos del dashboard usan comillas dobles y punto y coma, mientras que varios componentes de landing usan comillas simples y un estilo distinto. ESLint valida errores, pero no existe Prettier ni una regla de formato única.

**Riesgo:** diffs ruidosos y revisiones centradas en formato en vez de comportamiento.

**Regla accionable:** respetar el estilo del módulo modificado y evitar reformateos masivos no relacionados. Si se incorpora un formateador, hacerlo en un cambio dedicado y acordado.

## Manejo de errores

### E1. El frontend transforma varios errores en mensajes genéricos

**Evidencia:** `src/pages/Dashboard.jsx` usa mensajes generales en carga, guardado, eliminación y logout; `src/services/authService.js` también colapsa errores de red a una única respuesta.

**Riesgo:** la experiencia es clara para el usuario, pero el diagnóstico técnico carece de códigos y contexto estructurado.

**Regla accionable:** mostrar mensajes seguros y simples en UI, pero conservar códigos de error estables en la capa de servicios. Nunca mostrar tokens, claves ni respuestas completas del proveedor.

### E2. El backend sólo distingue duplicado y error interno

**Evidencia:** `backend/controllers/authController.js` responde `VALIDATION_ERROR`, `EMAIL_CONFLICT` o `INTERNAL_ERROR`; `backend/services/authService.js` infiere duplicados mediante texto y código.

**Riesgo:** cambios en los mensajes del proveedor pueden degradar un conflicto conocido a error 500.

**Regla accionable:** priorizar códigos documentados del SDK y encapsular su traducción en el servicio. El controlador sólo debe mapear errores de dominio a HTTP.

### E3. La configuración se valida de forma desigual

**Evidencia:** `src/services/supabaseClient.js` valida presencia y forma básica de la URL; `backend/services/authService.js` instancia el cliente con variables de entorno sin una validación explícita; `VITE_API_URL` tampoco se valida antes de usar `fetch`.

**Riesgo:** una variable faltante se descubre al ejecutar el primer flujo afectado, no al iniciar o construir el servicio.

**Regla accionable:** validar las variables obligatorias al inicio de cada proceso, fallar con un mensaje que nombre la variable y nunca imprimir su valor.

### E4. El registro no tiene mitigación de abuso visible

**Evidencia:** `backend/server.js` aplica CORS y JSON, pero no rate limiting; `backend/routes/auth.js` publica el alta directamente.

**Riesgo:** automatización de registros y consumo del cupo de Auth.

**Regla accionable:** antes de considerar el MVP listo para exposición masiva, incorporar límites de frecuencia y una estrategia antiabuso acorde al producto. No agregarla sin diseñar primero el comportamiento esperado y sus pruebas.

## Testing

### T1. La cobertura automatizada sólo alcanza cálculos puros

**Evidencia:** el único archivo de pruebas es `src/utils/finance.test.js`, con cuatro casos; `backend/package.json` no define script `test`.

**Riesgo:** registro, login, protección de rutas y CRUD dependen de pruebas manuales.

**Regla accionable:** todo cambio de lógica pura debe incluir tests unitarios; cambios en servicios deben probar éxito y error con dependencias simuladas; los flujos críticos requieren al menos un smoke test reproducible.

### T2. No hay pipeline de integración continua

**Evidencia:** no existe `.github/workflows/` en el inventario del repositorio.

**Riesgo:** un PR puede fusionarse sin ejecutar lint, tests o build de forma automática.

**Regla accionable:** hasta incorporar CI, ejecutar y registrar `npm run lint`, `npm test` y `npm run build` antes de cada merge. Al añadir tests backend, incluirlos en la misma puerta de calidad.

### T3. Las políticas RLS no tienen tests versionados

**Evidencia:** la migración contiene cuatro políticas, pero no existe una suite SQL o de integración que pruebe aislamiento entre dos usuarios.

**Riesgo:** una futura modificación puede conservar sintaxis válida pero romper la separación de datos.

**Regla accionable:** cualquier cambio de RLS debe probar al menos acceso propio permitido y acceso ajeno denegado para SELECT, UPDATE y DELETE.

## Experiencia de desarrollo (DX)

### D1. La instalación requiere dos pasos no integrados

**Evidencia:** raíz y `backend/` tienen manifiestos y lockfiles separados; no existe workspace ni script raíz que inicie ambos procesos.

**Riesgo:** una persona puede instalar sólo una mitad o asumir que `npm run dev` levanta todo.

**Regla accionable:** documentar siempre comandos con su directorio de trabajo. No introducir workspaces o un orquestador sin una decisión arquitectónica explícita.

### D2. README contiene contexto histórico que ya no representa el MVP

**Evidencia:** `README.md` presenta `/stats` como API temporal, no explica el dashboard financiero completo y usa una URL de clonación distinta del remoto actual.

**Riesgo:** onboarding incorrecto y validaciones contra funcionalidades que no existen.

**Regla accionable:** tratar `verification.md` y `memory-bank/` como fuente técnica comprobada; actualizar README cuando cambien rutas, servicios o comandos públicos.

### D3. No se fija la versión de Node

**Evidencia:** ninguno de los dos `package.json` declara `engines` y no existe un archivo de versión.

**Riesgo:** diferencias entre desarrollo y Render o cambios inesperados cuando la plataforma actualice su versión predeterminada.

**Regla accionable:** definir una versión soportada después de comprobar compatibilidad de frontend y backend; reflejarla en ambos manifiestos y en la plataforma de despliegue.

### D4. Los artefactos de presentación y archivos temporales están mezclados con el producto

**Evidencia:** `.tmp/presentacion_consulir/` y `Presentacion_Consulir_MVP.pptx.inspect.ndjson` están rastreados por Git junto al código de ejecución.

**Riesgo:** crecimiento innecesario del repositorio y ruido en búsquedas y revisiones.

**Regla accionable:** conservar entregables finales y referencias útiles, pero excluir temporales, inspecciones y archivos regenerables mediante `.gitignore`.

## Prioridad sugerida

1. Eliminar duplicados y temporales comprobados sin alterar el grafo activo.
2. Establecer reglas de arquitectura, Supabase, testing y Git basadas en estos hallazgos.
3. Añadir tests para backend, servicios y RLS.
4. Corregir y simplificar el README.
5. Definir versión de Node y CI en cambios futuros separados.
6. Diseñar mitigación antiabuso antes de una exposición pública de mayor escala.
