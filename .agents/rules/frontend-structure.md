# Nombre

Estructura y responsabilidades del frontend

## Alcance

Aplica a todo archivo dentro de `src/`, incluidas páginas, componentes, hooks, servicios, rutas, contextos, providers, utilidades y estilos.

## Justificación

La aplicación activa se compone desde `src/App.jsx`, usa `src/providers/AuthProvider.jsx` para la sesión y concentra el acceso externo en `src/services/`. El repositorio llegó a contener rutas, clientes y componentes duplicados sin consumidores, lo que dificulta identificar la implementación vigente.

## Guía específica del proyecto

1. Mantener `src/App.jsx` como única definición del árbol principal de rutas.
2. Toda ruta privada debe envolverse con `src/routes/ProtectedRoute.jsx`; no duplicar comprobaciones de sesión dentro de cada página.
3. La sesión se consume mediante `src/hooks/useAuth.js`. Los componentes no deben leer directamente el almacenamiento interno del SDK.
4. Las páginas coordinan estado y casos de uso. Ejemplo vigente: `src/pages/Dashboard.jsx` compone servicios y utilidades.
5. Las llamadas de red o Supabase deben vivir en `src/services/`. Ejemplos:
   - `src/services/authService.js` para registro, login y logout.
   - `src/services/transactionService.js` para movimientos.
6. Los cálculos puros deben vivir en `src/utils/` y acompañarse de tests. Ejemplo: `src/utils/finance.js` y `src/utils/finance.test.js`.
7. Un componente exclusivo de landing permanece en `src/components/landing/`. Sólo moverlo a una carpeta compartida cuando tenga más de un consumidor real.
8. Antes de agregar un componente, router, cliente o helper, buscar nombres y responsabilidades equivalentes con `rg`.
9. Evitar lógica de negocio y acceso a datos en componentes visuales reutilizables.
10. Mantener mensajes visibles en español argentino y textos técnicos claros, sin exponer detalles internos del proveedor.
11. Respetar el estilo del archivo modificado. No mezclar una funcionalidad con un reformateo masivo.
12. Al agregar una ruta, actualizar `verification.md`, `memory-bank/systemPatterns.md` y las pruebas relacionadas.

## Ejemplo correcto

```js
// Página: coordina el caso de uso.
const transactions = await listTransactions(month);

// Servicio: encapsula Supabase.
export async function listTransactions(month) {
  return getSupabaseClient().from("finance_transactions").select("...");
}
```

## Evitar

```js
// No crear otro cliente dentro de una página o componente.
const supabase = createClient(url, key);
```
