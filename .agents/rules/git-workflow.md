# Nombre

Flujo Git y promoción de ambientes

## Alcance

Aplica a ramas, commits, pull requests, merges, releases y despliegues del repositorio.

## Justificación

El desarrollo del MVP ocurrió en `develop` mientras `main` permaneció como rama por defecto desactualizada. Además, Render estuvo configurado para desplegar desde una rama de trabajo previa. El proyecto necesita una promoción explícita y verificable.

## Guía específica del proyecto

1. No trabajar directamente sobre `main`.
2. Crear ramas cortas desde la base acordada. Para trabajo cotidiano, usar `develop`; para una corrección de producción, acordar primero la estrategia.
3. Integrar cambios a `develop` mediante pull request.
4. Promover `develop` a `main` mediante un pull request separado, después de validar la versión candidata.
5. Mantener commits pequeños y temáticos. No mezclar documentación, limpieza y funcionalidad sin necesidad.
6. Usar mensajes de commit descriptivos con prefijos como `feat`, `fix`, `docs`, `test` o `chore`.
7. Antes de abrir un PR, verificar que el árbol esté limpio y ejecutar la puerta de calidad definida en `testing-and-quality.md`.
8. El PR debe resumir alcance, riesgos, verificaciones y pasos de reversión.
9. No fusionar si la rama base avanzó sin revisar nuevamente el diff.
10. No incluir `.env`, claves, tokens, artefactos temporales, builds locales ni datos personales.
11. Después de fusionar, comprobar la rama remota y el despliegue asociado. Un merge exitoso no garantiza un deploy funcional.
12. Render debe desplegar desde la rama estable definida para producción. Si esa rama es `main`, cualquier cambio de origen requiere smoke test posterior.
13. Para revertir código publicado, preferir un commit de reversión trazable antes que reescribir historia compartida.
14. Las migraciones aplicadas no se revierten eliminando archivos; requieren una nueva migración inversa revisada por separado.

## Flujo esperado

```text
rama de trabajo → PR a develop → validación → merge
develop → PR de promoción a main → validación → merge → deploy → smoke test
```
