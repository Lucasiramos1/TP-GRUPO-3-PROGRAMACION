# Progreso del proyecto

Fecha de actualización: 21 de octubre de 2026.

## Estado actual respaldado por el repositorio

### Implementado

- Landing pública y navegación.
- Formulario de registro con validación cliente.
- Endpoint backend `POST /auth/register` con validación servidor.
- Creación administrativa de usuarios en Supabase Auth.
- Login y logout con Supabase.
- Restauración y escucha de sesión.
- Ruta `/dashboard` protegida.
- CRUD de movimientos financieros.
- Filtro mensual.
- Resumen de ingresos, egresos y balance.
- Mensaje interpretativo mensual.
- Migración PostgreSQL con restricciones, índice, grants y RLS por usuario.
- Blueprint de Render para API y frontend.
- Health check `/health`.
- Cuatro tests unitarios para cálculos financieros.
- Auditoría de handover en `verification.md`.
- Hallazgos de ingeniería en `findings.md`.
- Reglas permanentes en `.agents/rules/`.

### Calidad verificada en la auditoría

- `npm run lint`: aprobado.
- `npm test`: aprobado, 1 archivo y 4 tests.
- `npm run build`: aprobado.

## Deuda técnica conocida

### Alta prioridad

1. Agregar tests del backend para validación, creación, conflicto y error interno.
2. Agregar tests de servicios frontend y protección de rutas.
3. Versionar pruebas de aislamiento RLS con dos usuarios.
4. Incorporar CI para ejecutar lint, tests y build en pull requests.
5. Diseñar mitigación antiabuso para el endpoint público de registro.

### Prioridad media

1. Validar variables obligatorias al iniciar frontend y backend, sin imprimir valores.
2. Fijar una versión soportada de Node en ambos proyectos y Render.
3. Actualizar README para reflejar repositorio, arquitectura y dashboard actuales.
4. Revisar conscientemente las dependencias y vulnerabilidades antes de un uso comercial.
5. Unificar versiones de `@supabase/supabase-js` cuando exista una tarea de actualización dedicada.

### Prioridad baja

1. Evaluar un script raíz o workspace para facilitar la ejecución conjunta.
2. Reemplazar las estadísticas ficticias de landing o etiquetarlas explícitamente como contenido comercial.
3. Definir una estrategia de observabilidad más allá de logs de plataforma.

## Restricciones vigentes

- No exponer `service_role` en el frontend.
- No trabajar directamente sobre `main`.
- No editar una migración ya aplicada para simular un rollback.
- No afirmar que producción funciona sin smoke test posterior al deploy.
- No agregar funcionalidades fuera del alcance solicitado.

## Próximos pasos recomendados

1. Consolidar esta base documental y eliminar sólo archivos comprobados como temporales o sin consumidores.
2. Promover la base validada de `develop` a `main` mediante PR.
3. Configurar producción para desplegar desde la rama estable acordada.
4. Abrir una tarea separada para tests backend, servicios y RLS.
5. Abrir una tarea separada para CI, versión de Node y auditoría de dependencias.

## Cómo actualizar este archivo

Modificar `progress.md` cuando cambie una funcionalidad real, una verificación, una deuda o una prioridad. Toda afirmación nueva debe citar o poder rastrearse a código, configuración, tests o una verificación explícita registrada.
