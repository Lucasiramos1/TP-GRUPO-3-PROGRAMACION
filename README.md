# consulir-app

Aplicación web de finanzas personales — MVP desarrollado por el equipo **TP-GRUPO-3-PROGRAMACION**.

---

## 🚀 Instalación rápida

Cloná el repositorio e instalá las dependencias:

```bash
git clone https://github.com/ADS-PY/TP-GRUPO-3-PROGRAMACION.git
cd consulir-app
npm install

```

### Configuración de autenticación

Para habilitar el registro e inicio de sesión con Supabase, copiá `.env.example`
como `.env.local` y completá sus valores:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-publica
```

La clave debe ser la clave pública `anon` del proyecto de Supabase. No agregues
claves privadas ni `service_role` al frontend.

---

## 🖥️ Ejecución del servidor de desarrollo

```bash
npm run dev

```

Por defecto, la aplicación queda disponible en:

👉 [http://localhost:5173](http://localhost:5173)

---

## 📦 Otros comandos disponibles

```bash
npm run build    # Genera la build de producción
npm run preview  # Previsualiza la build de producción localmente
npm run lint     # Ejecuta el linter sobre el proyecto

```

---

## 🏗️ Arquitectura de carpetas

El proyecto sigue una estructura modular dentro de `src/`, donde cada directorio tiene una responsabilidad específica:

```text
src/
├── components/   # Componentes de interfaz de usuario (UI)
├── hooks/        # Custom hooks y lógica de estado reutilizable
├── services/     # Peticiones a la API y comunicación con el backend
├── routes/       # Configuración de rutas, navegación y control de accesos
├── pages/        # Vistas / páginas completas de la aplicación
├── App.jsx       # Componente raíz de la aplicación
└── main.jsx      # Punto de entrada de la aplicación

```

### Detalle de responsabilidades

| Carpeta | Propósito |
| --- | --- |
| **`components/`** | Contiene los componentes de UI reutilizables (botones, formularios, tarjetas, etc.). No debe contener lógica de negocio ni llamadas directas a la API. |
| **`hooks/`** | Custom hooks de React (`useX`) que encapsulan lógica de estado, efectos secundarios y comportamiento reutilizable entre componentes. |
| **`services/`** | Funciones encargadas de la comunicación con la API externa (`fetch`, `axios`, manejo de endpoints). Aísla la lógica de red del resto de la aplicación. |
| **`routes/`** | Configuración del enrutamiento con React Router, incluyendo rutas públicas y protegidas, y la lógica de control de acceso. |
| **`pages/`** | Vistas completas que se renderizan a través del router, componiendo distintos `components/` y `hooks/`. |

---

## API interna temporal

Mientras el backend no esté disponible, `GET /stats` se representa mediante el mock `getStats` en `src/services/statsService.js`.

Respuesta esperada:

```json
[
  { "value": "15k+", "label": "CLIENTES ACTIVOS" },
  { "value": "$4.2B", "label": "ACTIVOS GESTIONADOS" },
  { "value": "99.9%", "label": "TIEMPO DE ACTIVIDAD" },
  { "value": "24/7", "label": "SOPORTE PREMIUM" }
]
```

Cada elemento debe incluir `value` y `label` como cadenas. Al implementar el backend, `getStats` debe reemplazarse por la petición al endpoint `GET /stats` sin modificar el contrato que consume `StatsBar`.

---

## 🌐 Idioma del proyecto

Todos los comentarios técnicos del código base se mantienen en **español**, para asegurar coherencia y facilitar la comprensión dentro del equipo.

---

## 👥 Equipo

* **TP-GRUPO-3-PROGRAMACION**
  * Agustin
  * Lucas
  * Marcelo
  * Miguel
