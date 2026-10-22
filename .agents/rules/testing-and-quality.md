# Nombre

Pruebas y puerta de calidad

## Alcance

Aplica a cualquier cambio en frontend, backend, migraciones, configuración o despliegue.

## Justificación

El repositorio sólo contiene pruebas automáticas para `src/utils/finance.js`. Registro, sesión, rutas y CRUD fueron validados mediante smoke tests, pero todavía no tienen cobertura versionada. Tampoco existe CI en `.github/workflows/`.

## Guía específica del proyecto

1. Ejecutar desde la raíz antes de integrar cualquier cambio:

```bash
npm run lint
npm test
npm run build
```

2. No afirmar que algo funciona sin registrar la comprobación realizada.
3. Toda nueva lógica pura debe incluir tests unitarios junto al módulo.
4. Los servicios deben probar al menos respuesta correcta, error del proveedor y datos inválidos.
5. Los endpoints backend deben probar validación, éxito, conflicto conocido y error interno sin filtrar datos sensibles.
6. Los cambios de Auth deben verificar restauración de sesión, login, logout y redirección de rutas protegidas.
7. Los cambios del dashboard deben verificar alta, lectura, edición, eliminación y recálculo mensual.
8. Los cambios RLS deben probar aislamiento con dos usuarios distintos, además de permisos propios.
9. Un build correcto no reemplaza pruebas de comportamiento; un smoke test manual no reemplaza una prueba automatizada repetible.
10. Si una prueba no puede ejecutarse localmente por depender de un servicio externo, registrarla como pendiente en `verification.md` o `memory-bank/progress.md`.
11. No usar datos personales reales en fixtures ni pruebas manuales.
12. Hasta incorporar CI, incluir el resultado de lint, tests y build en cada PR.

## Estado base verificado

- `npm run lint`: aprobado.
- `npm test`: 1 archivo y 4 tests aprobados.
- `npm run build`: aprobado.
- Tests backend: no implementados.
- Tests E2E: no implementados.
