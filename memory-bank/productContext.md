# Contexto de producto

## Visión declarada

El [README.md](../README.md) describe Consulir como una aplicación web de finanzas personales y un MVP. Presenta como objetivo registrar ingresos y egresos, visualizar resultados mensuales y apoyar decisiones financieras. Esta es la visión descrita en la documentación, no una afirmación de que esas funciones estén implementadas.

## Funcionalidad comprobada

- La aplicación activa muestra una landing en `/`, una pantalla de login en `/login` y una pantalla de registro en `/registro`, según las rutas de [src/App.jsx](../src/App.jsx).
- La landing ensambla encabezado, hero, tarjeta de acceso, contenido informativo, estadísticas y pie de página en [src/components/landing/LandingPage.jsx](../src/components/landing/LandingPage.jsx).
- Las estadísticas consumidas por la landing proceden de un arreglo local en [src/services/statsService.js](../src/services/statsService.js); no son datos obtenidos de un endpoint.
- El registro dispone de un formulario cliente y llama al backend mediante `registerUser` en [src/services/authService.js](../src/services/authService.js).
- El login utiliza `supabase.auth.signInWithPassword` desde el cliente del frontend, también en [src/services/authService.js](../src/services/authService.js).

## Dashboard

[src/pages/Dashboard.jsx](../src/pages/Dashboard.jsx) solo muestra un título y un mensaje que lo identifica como placeholder. No implementa gestión de movimientos, balances ni informes. La ruta `/dashboard` está declarada en [src/routes/AppRouter.jsx](../src/routes/AppRouter.jsx), pero [src/main.jsx](../src/main.jsx) monta [src/App.jsx](../src/App.jsx), que no importa ese router. Por lo tanto, el dashboard no forma parte de las rutas activas del punto de entrada actual.

## Límites de la evidencia

El README expresa objetivos del producto; los componentes y servicios descritos arriba evidencian lo que el código ofrece actualmente. No se debe presentar el registro financiero ni el dashboard como funcionalidades disponibles hasta que exista una implementación conectada y accesible desde las rutas activas.
