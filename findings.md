# Hallazgos de arquitectura y convenciones

Análisis del frontend React/Vite y del backend Express/Supabase basado en el código y la configuración actuales. Cada hallazgo incluye evidencia concreta y una regla accionable. Las reglas son recomendaciones para los cambios futuros; no implican que las capacidades descritas ya estén implementadas.

## Arquitectura

### A1. Hay dos definiciones de enrutamiento y una no está conectada al arranque

- **Evidencia:** `src/App.jsx` monta las rutas `/`, `/login` y `/registro`. `src/routes/AppRouter.jsx` define otro `BrowserRouter` con `/` y `/dashboard`, pero `src/main.jsx` monta `App`, no `AppRouter`.
- **Riesgo:** Los cambios hechos en el router alternativo pueden parecer funcionales, aunque no formen parte de la aplicación ejecutada; rutas como `/dashboard` no están activas en el flujo actual.
- **Regla accionable:** Mantener una única fuente de verdad para el enrutamiento. Registrar cada ruta nueva en el router que monta `src/main.jsx` y retirar o integrar routers alternativos para que no queden definiciones huérfanas.

### A2. La protección de rutas es temporal y actualmente no está activa

- **Evidencia:** `src/routes/ProtectedRoute.jsx` define `isAuthenticated = true`; `src/routes/AppRouter.jsx` lo usa para `/dashboard`, pero ese router no está conectado al arranque. `src/pages/Dashboard.jsx` indica que es un placeholder.
- **Riesgo:** Si se conecta esa ruta sin sustituir el valor fijo, la pantalla parecería protegida sin comprobar una sesión real. La implementación actual tampoco ofrece una sesión compartida validada por el backend.
- **Regla accionable:** No activar ni presentar rutas como protegidas hasta que el guard consulte el estado real de autenticación y maneje los estados de carga y sesión inválida. Agregar pruebas de acceso autenticado y no autenticado al integrarlo.

### A3. Los flujos de login y registro usan fronteras de servicio distintas

- **Evidencia:** `src/services/authService.js` envía el registro a `POST ${VITE_API_URL}/auth/register`, pero `loginUser` llama a `supabase.auth.signInWithPassword` directamente desde el navegador.
- **Riesgo:** El comportamiento de autenticación y el manejo de errores están repartidos entre el backend y el cliente Supabase; no debe asumirse que ambos flujos usan una sesión o política común en Express.
- **Regla accionable:** Mantener explícito en el diseño y la documentación qué operaciones pasan por Express y cuáles por Supabase del cliente. Si se unifican, actualizar ambos flujos, el estado de sesión, las reglas de acceso y sus pruebas en el mismo cambio.

### A4. Las estadísticas de la landing son un mock local, no una API

- **Evidencia:** `src/services/statsService.js` devuelve un arreglo local desde `getStats()`. `backend/server.js` registra `/auth` y `/health`, pero no `/stats`.
- **Riesgo:** Consumidores o documentación pueden tratar datos estáticos como datos reales del backend y dar una impresión incorrecta de disponibilidad o actualización.
- **Regla accionable:** Marcar claramente los mocks y no describirlos como endpoints operativos. Al implementar estadísticas reales, agregar la ruta del backend, reemplazar el mock en el servicio y documentar y probar el contrato antes de anunciarlas como dinámicas.

### A5. Hay dos implementaciones de cliente Supabase en el frontend

- **Evidencia:** `src/services/supabaseClient.js` exporta `getSupabaseClient()` con inicialización diferida y validación de entorno; `src/lib/supabaseClient.js` crea y exporta otra instancia al importar el módulo. La búsqueda de referencias muestra que `src/services/authService.js` utiliza el cliente de `services/`.
- **Riesgo:** Dos módulos con la misma responsabilidad permiten inicialización y validación divergentes, además de generar dudas sobre cuál es la interfaz soportada.
- **Regla accionable:** Mantener un solo módulo canónico para crear y obtener el cliente Supabase. Antes de agregar una integración, reutilizar ese módulo; eliminar o migrar el alternativo cuando no tenga consumidores.

## Naming

### N1. La convención de nombres mezcla español e inglés en conceptos equivalentes

- **Evidencia:** Los campos del dominio y endpoint usan `nombre`, mientras funciones de validación se llaman `validateName`, `validateEmail`, `validatePassword`; la UI combina `RegisterForm` con `registro` como ruta.
- **Riesgo:** La mezcla dificulta búsquedas, lectura y consistencia entre UI, servicios y backend, especialmente al agregar campos o contratos.
- **Regla accionable:** Conservar los nombres establecidos en cada contrato público y, para símbolos internos nuevos, seguir una convención coherente con el módulo que se modifica. No renombrar campos HTTP de forma aislada: coordinar el cambio entre validación, API, cliente y documentación.

### N2. El mismo nombre de componente identifica dos tarjetas de acceso distintas

- **Evidencia:** Existen `src/components/auth/AuthCard.jsx` y `src/components/landing/AuthCard.jsx`, con interfaces y estilos distintos. La landing importa el segundo.
- **Riesgo:** Imports o cambios futuros pueden confundirse entre componentes homónimos, y no queda claro si son variantes intencionales o implementaciones redundantes.
- **Regla accionable:** Si dos componentes tienen responsabilidades diferentes, darles nombres que expresen su contexto o propósito; si son variantes de una misma pieza, compartir un componente y documentar sus props o variantes. Verificar los imports de la landing y las páginas de autenticación al modificarlos.

## Error Handling

### E1. El cliente de registro convierte fallos distintos en un mensaje genérico y oculta la excepción

- **Evidencia:** `src/services/authService.js` captura cualquier excepción de `fetch` o `response.json()` con `catch {}` y devuelve el mismo mensaje de conectividad. También asume que todas las respuestas tienen JSON parseable.
- **Riesgo:** Un problema de red, una respuesta no JSON o un error de parseo son indistinguibles para diagnóstico; la excepción se pierde y la interfaz puede mostrar una causa incorrecta.
- **Regla accionable:** Manejar explícitamente errores de transporte y de respuesta, registrar el contexto técnico sin incluir datos sensibles, y mantener un mensaje de usuario apropiado. Parsear la respuesta de forma compatible con los tipos de contenido esperados y comprobar el comportamiento para respuestas vacías o no JSON.

### E2. Los errores del backend no tienen un formato común para todas las rutas

- **Evidencia:** `backend/controllers/authController.js` construye respuestas JSON propias para validación, conflicto y error interno. `backend/server.js` no configura un middleware final común para errores de Express o fallos de parseo de JSON.
- **Riesgo:** Errores lanzados fuera del controlador —por ejemplo, un cuerpo JSON malformado— pueden seguir un formato distinto al contrato que consume el frontend.
- **Regla accionable:** Centralizar el mapeo de excepciones HTTP en un middleware de errores al final de la cadena Express; asignar estado y estructura de respuesta de forma consistente y no exponer mensajes internos al cliente. Probar errores de validación, JSON inválido y fallos inesperados.

### E3. La clasificación de email duplicado depende de texto del proveedor

- **Evidencia:** `backend/services/authService.js` detecta `EMAIL_CONFLICT` buscando fragmentos literales en `error.message` además de revisar `error.code`.
- **Riesgo:** Cambios de idioma o redacción del proveedor pueden alterar la clasificación y devolver un error 500 para un conflicto, o clasificar erróneamente otro error.
- **Regla accionable:** Preferir códigos estructurados documentados por Supabase para clasificar errores; mantener el mensaje solo para diagnóstico controlado y cubrir los códigos relevantes con pruebas.

## Testing

### T1. No hay suite ejecutable configurada para los flujos principales

- **Evidencia:** `package.json` no declara script `test`; la búsqueda de archivos `*.test.*` y `*.spec.*` no encontró pruebas. El manifiesto incluye Vitest y Testing Library, pero no una suite conectada a un comando.
- **Riesgo:** Cambios en validación, respuestas de registro, navegación y formularios carecen de una verificación automatizada repetible.
- **Regla accionable:** Al comenzar a cubrir comportamiento, configurar un comando de tests explícito y agregar casos unitarios para `src/utils/authValidations.js` y `backend/utils/validation.js`, más pruebas de integración para `/auth/register` y pruebas de renderizado/interacción para los formularios. No considerar dependencias instaladas como evidencia de tests ejecutados.

### T2. Las restricciones de validación de cliente y servidor pueden divergir

- **Evidencia:** `src/utils/authValidations.js` y `backend/utils/validation.js` implementan validaciones por separado. El patrón de email del backend restringe longitudes y dominios de manera diferente al patrón del cliente.
- **Riesgo:** Un formulario puede aceptar datos que el servidor rechace, o rechazar entradas que el backend acepte, lo que produce una experiencia inconsistente.
- **Regla accionable:** Tratar la validación del backend como autoridad y mantener el comportamiento de cliente alineado con ella. Para cada regla del contrato, agregar casos equivalentes a ambas suites y comprobar que los errores devueltos se muestran en los campos correctos.

## DX

### D1. La documentación del endpoint de registro no coincide con la implementación

- **Evidencia:** `docs/api/auth-register.md` usa `VITE_API_BASE_URL`, restricciones de campos adicionales y una respuesta con `createdAt` y `errors` como array. El cliente lee `VITE_API_URL`; `backend/utils/validation.js` no rechaza campos extra y `backend/controllers/authController.js` devuelve `created_at` y errores como objeto.
- **Riesgo:** Quien integra el endpoint puede configurar la variable equivocada o programar contra respuestas y validaciones que el servidor no ofrece.
- **Regla accionable:** Cambiar el endpoint o su documentación en el mismo PR. Antes de publicar contratos, contrastar variables, estados, campos, restricciones y errores con ruta, controlador, validador y cliente reales.

### D2. La configuración de calidad no ofrece verificación uniforme entre frontend y backend

- **Evidencia:** `package.json` ofrece `lint` y `build` para el proyecto raíz. `backend/package.json` solo declara `dev` y `start`; no tiene scripts propios de lint, build o test.
- **Riesgo:** Las comprobaciones disponibles cubren de manera desigual los cambios de servidor y pueden omitirse en revisiones o automatización.
- **Regla accionable:** Documentar los comandos reales por paquete y ejecutar las verificaciones correspondientes al código modificado. Al incorporar checks para backend, exponer scripts con nombres claros y conectarlos a la automatización del repositorio, sin asumir que los scripts del frontend lo incluyen.

### D3. Hay discrepancia entre el propósito descrito y las funcionalidades implementadas

- **Evidencia:** `README.md` describe la aplicación como una solución de finanzas y menciona estadísticas, mientras `src/pages/Dashboard.jsx` es un placeholder y `src/services/statsService.js` entrega datos fijos. La verificación del repositorio no encontró gestión funcional de movimientos o informes.
- **Riesgo:** Usuarios y contribuidores pueden esperar pantallas o capacidades que todavía no existen.
- **Regla accionable:** Redactar README y material de producto separando objetivos del MVP, mocks y capacidades disponibles. Actualizar esas afirmaciones cuando una funcionalidad pase a estar implementada y accesible desde las rutas activas.
