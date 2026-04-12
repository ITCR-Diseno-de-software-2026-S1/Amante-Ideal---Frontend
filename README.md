# Amante Ideal — Frontend

Interfaz web en **React** que consume una API REST de “amantes”. Permite crear registros y listar resultados filtrados por interés (en el código de ejemplo se usa el interés `cine`).

---

## Requisitos previos

- **Node.js** (recomendado: LTS actual) y **npm**
- **Backend** ejecutándose en `http://localhost:3000` con los endpoints descritos más abajo. Sin el servidor, las peticiones fallarán.

---

## Cómo ejecutarlo

En la raíz del proyecto:

```bash
npm install
npm run dev
```

Vite levanta el servidor de desarrollo (por defecto en **http://localhost:5173**). Abre esa URL en el navegador.

Otros comandos útiles:

| Comando | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera la carpeta `dist/` para producción |
| `npm run preview` | Sirve localmente el build de `dist/` |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |

---

## Estructura del proyecto

```
Amante-Ideal---Frontend/
├── index.html              # Punto de entrada HTML (monta #root)
├── vite.config.js          # Configuración de Vite + plugin React
├── package.json
├── public/                 # Estáticos públicos (p. ej. iconos)
└── src/
    ├── main.jsx            # createRoot: monta <App /> en el DOM
    ├── index.css           # Estilos globales
    ├── App.jsx             # Layout principal: título + componentes
    ├── App.css             # Estilos de App (si se usan)
    ├── api/
    │   └── api.js          # Cliente Axios con baseURL del backend
    └── components/
        ├── crearAmante.jsx # Formulario crear amante (POST)
        └── buscarAmantes.jsx # Botón buscar por interés (GET)
```

---

## Referencia de API (consumida por este frontend)

La base URL está definida en `src/api/api.js` como **`http://localhost:3000`**. Los recursos usados en código son:

### `GET /amantes`

Lista amantes; en la UI se llama con query de interés fijo.

| Aspecto | Valor |
|--------|--------|
| **Uso en el proyecto** | `GET /amantes?interes=cine` |
| **Respuesta esperada** | Array de objetos; cada elemento debe incluir al menos `_id` y `nombre` para mostrarse en la lista |

### `POST /amantes`

Crea un amante.

| Aspecto | Valor |
|--------|--------|
| **Cuerpo (JSON)** | `{ "nombre": string, "edad": number, "intereses": string[] }` |
| **Ejemplo en código** | `nombre` desde el input; `edad` fija `25`; `intereses: ["cine"]` |

> Si el backend usa otra forma de filtrado o nombres de campos, habrá que alinear `api.js` o los componentes con ese contrato.

---

## Arquitectura, topología y paradigma

### Arquitectura (aplicación)

- **SPA (Single Page Application)**: una sola página HTML; React actualiza el DOM bajo `#root`.
- **Capas lógicas**:
  - **Presentación**: componentes React (`CrearAmante`, `BuscarAmantes`) con estado local (`useState`).
  - **Acceso a datos**: módulo `api.js` con **Axios** e instancia reutilizable (`baseURL` centralizada).
- **Orquestación**: `App.jsx` compone las vistas sin enrutador (todo en una pantalla).

### Topología (despliegue en desarrollo)

```text
[Navegador]  <--HTTP-->  [Vite dev server :5173]   (sirve JS/CSS del frontend)
[Navegador]  <--HTTP-->  [API REST :3000]          (backend; datos y persistencia)
```

El frontend no implementa la API: solo la consume. En producción, el build estático (`dist/`) suele servirse desde un servidor web o CDN, y la API en otro host/puerto (habitualmente con CORS configurado en el backend).

### Paradigma

- **Programación declarativa (React)**: describes *qué* debe mostrarse según el estado (`resultado`, `nombre`), no el paso a paso imperativo del DOM.
- **Componentes y composición**: piezas reutilizables (`CrearAmante`, `BuscarAmantes`) ensambladas en `App`.
- **Cliente-servidor (REST)**: el estado de negocio y la persistencia viven en el backend; el frontend es una capa de presentación y orquestación de peticiones HTTP.

### Por qué este paradigma

- **React declarativo** reduce errores al manipular el DOM y facilita razonar sobre la UI cuando cambia el estado.
- **Componentes** permiten aislar “crear” y “buscar” y mantener el código ordenado a medida que crece la app.
- **REST con Axios** es un estándar claro para integrar un SPA con un backend sin acoplar implementaciones.

---

## Dónde se usa cada pieza

| Pieza | Rol | Archivos donde interviene |
|-------|-----|---------------------------|
| Instancia Axios (`api`) | URL base y futuras cabeceras comunes | Importada en `crearAmante.jsx` y `buscarAmantes.jsx` |
| `CrearAmante` | Estado del nombre; `POST /amantes` al hacer clic | `src/components/crearAmante.jsx`; compuesto en `App.jsx` |
| `BuscarAmantes` | Estado de la lista; `GET /amantes?interes=cine` al hacer clic | `src/components/buscarAmantes.jsx`; compuesto en `App.jsx` |
| `App` | Contenedor y título | `src/App.jsx` |
| Punto de montaje | Arranque de React | `src/main.jsx` → `index.html` (`#root`) |

---

## Notas

- La URL del backend está **fija** en código. Para otros entornos (staging, producción), conviene usar variables de entorno de Vite (`import.meta.env.VITE_*`) y documentar los valores esperados.
- Los componentes se importan desde `crearAmante.jsx` y `buscarAmantes.jsx` (los nombres de import pueden seguir siendo `CrearAmante` y `BuscarAmantes` por convención en React).
