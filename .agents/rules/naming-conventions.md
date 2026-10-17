# Nombre

Convenciones de nombres y consistencia del dominio

## Alcance

Aplica a nombres de componentes, funciones, archivos, rutas y campos de dominio en `src/`, `backend/` y los contratos entre ambos.

## Justificación

El repositorio mezcla identificadores de dominio en español e inglés y contiene componentes homónimos en rutas distintas. Los nombres públicos también forman parte del contrato HTTP, por lo que renombrarlos sin coordinación puede romper el registro.

## Guía específica del proyecto

- Conserva los nombres de los campos del contrato existente: el registro usa `nombre`, `email` y `password` en `src/services/authService.js`, `backend/utils/validation.js` y `backend/controllers/authController.js`. No traduzcas ni cambies un campo público en una sola capa.
- En código interno nuevo, sigue la convención del módulo cercano. Por ejemplo, los validadores de frontend existentes usan `validateName` y `validateEmail`, mientras el backend expone `validateRegisterBody`; evita introducir nombres distintos para una operación equivalente dentro del mismo módulo.
- Asegura que los nombres de páginas y rutas representen la navegación existente: `src/App.jsx` registra `/login` y `/registro`, mientras los componentes usan `LoginPage` y `RegisterPage`. No infieras la ruta a partir del nombre del componente; registra y documenta cada ruta explícitamente.
- Si dos componentes homónimos tienen responsabilidades diferentes, nómbralos por contexto o aclara su propósito en la estructura. Actualmente coexisten `src/components/auth/AuthCard.jsx` y `src/components/landing/AuthCard.jsx`; la landing importa explícitamente `./AuthCard` desde su propia carpeta.
- Al renombrar un símbolo o archivo, actualiza todos sus imports y, si afecta un endpoint o payload, coordina el cambio con validaciones, cliente y documentación API.

Ejemplo del contrato que debe conservar nombres coherentes:

```js
// src/services/authService.js
body: JSON.stringify({ nombre, email, password })

// backend/controllers/authController.js
const { nombre, email, password } = req.body;
```
