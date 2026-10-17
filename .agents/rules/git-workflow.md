# Nombre

Flujo de cambios y verificación

## Alcance

Aplica a la preparación, validación y versionado de cambios en el repositorio, tanto para la aplicación raíz como para `backend/`.

## Justificación

El proyecto separa los manifiestos de frontend y backend, dispone de lint y build para la aplicación raíz, y no declara actualmente un script `test` en el manifiesto raíz. El repositorio también contiene plantillas de entorno y excluye archivos locales, por lo que conviene evitar versionar secretos o asumir comandos no disponibles.

## Guía específica del proyecto

- Antes de editar o preparar cambios, revisa `git status --short` y conserva modificaciones existentes que no pertenezcan a la tarea.
- Desde la raíz, ejecuta `npm run lint` y `npm run build` para validar cambios de frontend. Esos son los scripts definidos en `package.json`.
- No informes `npm test` como verificación disponible por defecto: el manifiesto raíz no declara ese script y la verificación del repositorio no encontró una suite de tests configurada.
- Para el backend, ejecuta los scripts definidos en `backend/package.json` desde `backend/` (`npm run dev` para desarrollo o `npm start` para iniciar); no supongas que tiene scripts de lint o test que no están declarados.
- Cuando agregues pruebas, deja un comando repetible en el manifiesto correspondiente. Aunque `package.json` incluye Vitest y Testing Library, hoy no declara `test` ni hay archivos `*.test.*` o `*.spec.*`; `backend/package.json` tampoco define scripts de pruebas.
- En cambios de registro o autenticación, valida y documenta el flujo completo: `src/utils/authValidations.js`, `backend/utils/validation.js`, `backend/controllers/authController.js` y el cliente de `src/services/authService.js`. Cubre validación, éxito, conflicto, fallo de red y respuestas inesperadas cuando la suite esté configurada.
- Usa `.env.example` y `backend/.env.example` como plantillas; nunca agregues `.env`, `.env.local`, `backend/.env` ni credenciales reales al control de versiones. Respeta las exclusiones existentes en `.gitignore`.
- No asumas una convención de ramas o mensajes de commit que el repositorio no establece. Mantén el cambio acotado, revisa el diff y evita incluir artefactos generados como `dist/`.

Comandos de validación del frontend definidos por el proyecto:

```bash
npm run lint
npm run build
```
