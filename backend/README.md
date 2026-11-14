# SpoilerAlert — Backend

API REST de SpoilerAlert: usuarios, películas y series (programas) y reseñas.
Diseño de la base de datos: [`docs/DESIGN.md`](docs/DESIGN.md)

---

## Stack

| Capa          | Tecnología                               |
| ------------- | ---------------------------------------- |
| Runtime       | Node.js (≥ 22)                           |
| Framework     | Express 5                                |
| Base de datos | MongoDB (Atlas) + Mongoose               |
| Autenticación | JWT + bcrypt                             |
| Validación    | zod                                      |
| API externa   | OMDb (con el `fetch` nativo de Node)     |

---

## Arquitectura

```mermaid
flowchart LR
    REQ(["Petición"]) --> R["Routes"] --> MW["Middlewares"] --> C["Controllers"] --> S["Services"] --> M["Models"] --> DB[("MongoDB")]
    S -.-> CL["clients/omdb"] -.-> OMDB[("OMDb")]
```

| Carpeta (`src/`) | Responsabilidad                                                        |
| ---------------- | ---------------------------------------------------------------------- |
| `routes`         | Endpoints y sus middlewares.                                           |
| `middlewares`    | Autenticación, permisos por tipo de usuario, validación y errores.     |
| `schemas`        | Validación de los datos de entrada (zod).                              |
| `controllers`    | Reciben la petición y devuelven la respuesta.                          |
| `services`       | Lógica de negocio: importación desde OMDb, promedios, permisos.        |
| `models`         | Modelos de Mongoose.                                                   |
| `clients`        | Cliente de OMDb. Es el único lugar que llama a la API externa y traduce sus respuestas. |
| `constants`      | Enums, códigos de error, estados HTTP, reglas de campos y mapa de géneros de OMDb. Los que usa el frontend se copian tal cual. |
| `config`, `utils` | Configuración y funciones compartidas.                                |
| `scripts`        | `seed.js` y `seed-titles.json`: importa una lista inicial de títulos. `seed-demo.js` y `demo-data.json`: crea usuarios de prueba y reseñas generadas. |

---

## Endpoints

Base: `/api/v1`. Todas las respuestas son JSON.

### Convenciones

- **Sesión:** todas las rutas, salvo registro e inicio de sesión, piden el header `Authorization: Bearer <token>`. El token dura 7 días.
- **Listas:** devuelven `{ data, page, limit, total }`. Por defecto `limit = 20` (máximo 50).
- **Errores:** devuelven `{ error: { code, message, details? } }`. El frontend debe usar `code` (estable), nunca `message`. Los códigos están en `src/constants/errorCodes.js`:

  | HTTP  | `code`             | Cuándo | `details` |
  | ----- | ------------------ | ------ | --------- |
  | `400` | `VALIDATION_ERROR` | Datos inválidos (zod) | `[{ path, message }]`, uno por campo inválido |
  | `400` | `BAD_REQUEST`      | Petición mal formada (por ejemplo, JSON inválido) | — |
  | `401` | `UNAUTHORIZED`     | Sin sesión, token inválido o vencido, o login incorrecto | — |
  | `403` | `FORBIDDEN`        | Sin permiso | — |
  | `404` | `NOT_FOUND`        | No existe | — |
  | `409` | `CONFLICT`         | Duplicado (email, username o segunda reseña del mismo título) | `{ fields: [...] }`, los campos duplicados |
  | `500` | `INTERNAL_ERROR`   | Error inesperado del servidor | — |
- **Acceso** (columna de las tablas):
  - **Público**: sin sesión.
  - **Usuario**: cualquier sesión (`normal`, `critic` o `admin`).
  - **Dueño**: el autor de la reseña.
  - **Admin**: `type = admin`.

### Auth

| Método | Ruta             | Acceso  | Descripción |
| ------ | ---------------- | ------- | ----------- |
| POST   | `/auth/register` | Público | Crea una cuenta con `type = normal`: `{ username, email, password }`. Responde `201 { token, user }`. Si se envía `type`, se ignora. |
| POST   | `/auth/login`    | Público | `{ login, password }`, donde `login` es el username o el email. Responde `200 { token, user }`. |
| GET    | `/auth/me`       | Usuario | Responde `200 { user }`: el usuario de la sesión, con su email. |

`user` en las respuestas de Auth y de `PATCH /users/me`: `{ _id, username, email, type, createdAt, updatedAt }`. Nunca incluye `passwordHash`.

Las reglas de `username`, `email` y `password` están en [`DESIGN.md`](docs/DESIGN.md#reglas-de-los-campos).

### Usuarios

| Método | Ruta                  | Acceso  | Descripción |
| ------ | --------------------- | ------- | ----------- |
| PATCH  | `/users/me`           | Usuario | Edita la propia cuenta: `username`, `email` y/o `password` (al menos uno). Responde `200 { user }`. `409` si el username o el email ya existen. |
| DELETE | `/users/me`           | Usuario | Borra la propia cuenta y sus reseñas, y recalcula los promedios afectados. Responde `204` sin cuerpo. Después, el token deja de servir (`401`). |
| GET    | `/users/:id`          | Usuario | Perfil público. Responde `200 { user: { _id, username, type, createdAt, reviewsCount, pointsMean } }`. Nunca devuelve el email. `pointsMean` es `null` si no tiene reseñas. `404` si no existe. |
| GET    | `/users/:id/reviews`  | Usuario | Reseñas del usuario, de la más reciente a la más antigua. `page`, `limit`. Formato de cada elemento abajo. `404` si el usuario no existe. |
| GET    | `/users`              | Admin   | Lista para el módulo **Users**, de la cuenta más nueva a la más vieja. Cada elemento: `{ _id, username, email, type, createdAt, reviewsCount }`. Filtros: `q` (username o email), `type`, `page`, `limit`. |
| PATCH  | `/users/:id/type`     | Admin   | `{ type: 'normal' \| 'critic' }`. Responde `200 { user }`. Recalcula los promedios de los títulos que ese usuario reseñó. No permite crear admins ni cambiar a un admin (`403`). |

`reviewsCount` y `pointsMean` se calculan al pedirlos, con una agregación sobre `reviews`; no se guardan en `users`.

Cada elemento de `GET /users/:id/reviews` (`program` es un resumen del título; no incluye `author`):

```json
{
  "_id": "…",
  "points": 85,
  "comment": "Texto o null",
  "createdAt": "2026-03-03T00:00:00.000Z",
  "updatedAt": "2026-03-03T00:00:00.000Z",
  "program": { "_id": "…", "title": "Dune", "type": "movie", "year": 2021, "posterUrl": "https://… o null" }
}
```

### Programas (películas y series)

No hay creación, edición ni borrado de programas: solo se leen, y se traen de OMDb cuando faltan.

| Método | Ruta               | Acceso  | Descripción |
| ------ | ------------------ | ------- | ----------- |
| GET    | `/programs`        | Usuario | Lista de una pestaña (*Movies* o *Series*) con búsqueda, filtros y orden (parámetros abajo). Si hay `q`, primero importa de OMDb los títulos que falten. |
| GET    | `/programs/:id`    | Usuario | Ficha completa. Responde `200 { program }`. La primera vez que se abre, completa los detalles desde OMDb. `404` si no existe. |

Cada `program` (en la lista y en la ficha): `{ _id, type, externalId, title, synopsis, year, releaseDate, posterUrl, genres, actors, pointsMeanNormal, pointsMeanCritics, createdAt, updatedAt }`, más `durationMin` (películas) o `seasonsCount` (series). Los campos sin dato son `null`.

Parámetros de `GET /programs`:

| Parámetro     | Valores                                    | Descripción |
| ------------- | ------------------------------------------ | ----------- |
| `type`        | `movie` \| `series`                        | Pestaña. Obligatorio. |
| `q`           | texto                                      | Busca por título. |
| `genres`      | valores de `Genre` separados por coma      | Títulos que tengan **al menos uno** de esos géneros. |
| `yearFrom`, `yearTo` | año                                 | Rango de año de estreno. |
| `minCritics`  | 0–100                                      | Promedio mínimo de críticos. |
| `minAudience` | 0–100                                      | Promedio mínimo de usuarios normales. |
| `sort`        | `newest` (default) \| `oldest` \| `critics` \| `audience` | Orden. `newest` y `oldest` usan `year` y luego `releaseDate`; `critics` y `audience`, el promedio de mayor a menor. |
| `page`, `limit` | número                                   | Paginación. |

### Reseñas

| Método | Ruta                          | Acceso  | Descripción |
| ------ | ----------------------------- | ------- | ----------- |
| GET    | `/programs/:id/reviews`       | Usuario | Reseñas del título, de la más reciente a la más antigua, con `author: { _id, username, type }`. `group=critics` (autores `critic`) o `group=audience` (autores `normal` y `admin`); sin `group`, todas. `page`, `limit`. |
| GET    | `/programs/:id/reviews/mine`  | Usuario | Responde `200 { review }`: la reseña del usuario de la sesión para ese título, o `404` si no tiene. |
| POST   | `/programs/:id/reviews`       | Usuario | Crea la reseña: `{ points, comment? }`. Responde `201 { review }`. `points` entero 1–100; `comment` opcional, hasta 300 caracteres (ver abajo). Una por usuario y título (`409` si ya existe). `404` si el título no existe. |
| PATCH  | `/reviews/:id`                | Dueño   | Edita `points` y/o `comment` (al menos uno). Responde `200 { review }`. `404` si la reseña no existe; `403` si no es del usuario. |
| DELETE | `/reviews/:id`                | Dueño   | Borra la reseña. Responde `204` sin cuerpo. `404` si la reseña no existe; `403` si no es del usuario. |

**Comentario:** una reseña puede ser solo un puntaje. En `POST`, si `comment` no se envía, o es `null` o `""`, se guarda `null`. En `PATCH`, si `comment` no se envía, no cambia; `null` o `""` lo borra.

`review` en las respuestas de `POST`, `PATCH` y `/mine` (`author` y `program` son solo ids):

```json
{ "_id": "…", "author": "…", "program": "…", "points": 85, "comment": "Texto o null", "createdAt": "…", "updatedAt": "…" }
```

En `GET /programs/:id/reviews`, cada elemento tiene los mismos campos, pero `author` es `{ _id, username, type }`.

Cada vez que se crea, edita o borra una reseña, el servicio recalcula `pointsMeanNormal` y `pointsMeanCritics` del programa (ver [`DESIGN.md`](docs/DESIGN.md#puntajes)).

---

## Importación desde OMDb

La API nunca filtra ni ordena directamente sobre OMDb: primero guarda los títulos en MongoDB y después consulta su propia base. Así los filtros por puntaje de usuarios funcionan.

1. **Búsqueda** (`GET /programs?q=...`, solo en la página 1): llama a OMDb con `?s=<q>&type=<movie|series>`, descarta lo que no sea película o serie, y guarda los títulos nuevos con un *upsert* por `externalId`. La búsqueda de OMDb solo trae título, año, tipo, id y carátula, así que se guarda eso y `synopsis` queda en `null`. Los títulos que ya existen no se tocan.
2. **Consulta local**: aplica los filtros y el orden sobre la colección `programs` y responde.
3. **Ficha** (`GET /programs/:id`): si todavía no se pidió el detalle (`detailFetchedAt` es `null`), pide el detalle a OMDb con una sola petición, `?i=<imdbId>&plot=full`. Con eso completa fecha, sinopsis, categorías, actores, y duración o temporadas.
4. **Si OMDb falla** o se agotó el cupo, la API responde con lo que ya tiene guardado; no devuelve error.

Peticiones a OMDb (base `https://www.omdbapi.com/`, siempre con `apikey`):

| Petición | Para qué |
| -------- | -------- |
| `?s=<texto>&type=<movie\|series>&page=1` | Búsqueda por nombre. Devuelve hasta 10 resultados. |
| `?i=<imdbId>&plot=full` | Detalle de una película o serie. |

### Cupo diario

La clave gratuita de OMDb permite **1.000 peticiones al día**. Cada búsqueda gasta 1 y cada ficha abierta por primera vez gasta 1; después todo sale de MongoDB. Por eso:

- Solo se consulta OMDb en la página 1 de una búsqueda con `q`, y nunca para los filtros.
- El detalle se pide una sola vez por título.
- OMDb no tiene lista de "populares", así que el `seed` importa los títulos de `scripts/seed-titles.json` (una lista de ids de IMDb).

### Traducción de datos

OMDb devuelve todo como texto y usa `"N/A"` cuando falta un dato. `clients/omdb` lo convierte antes de guardar:

| Dato de OMDb | Se guarda como |
| ------------ | -------------- |
| `"N/A"` en cualquier campo | `null` |
| `Year`: `"2010"` o `"2008–2013"` | `year`: el primer año, como número. |
| `Released`: `"16 Jul 2010"` | `releaseDate`: `Date`. |
| `Runtime`: `"148 min"` | `durationMin`: `148` (solo películas). |
| `totalSeasons`: `"5"` | `seasonsCount`: `5`. |
| `Genre`: `"Action, Sci-Fi"` | `genres`: `['action', 'science_fiction']`, con `OMDB_GENRE_MAP`. |
| `Actors`: `"Leonardo DiCaprio, Elliot Page"` | `actors`: `['Leonardo DiCaprio', 'Elliot Page']`. |

La app está en inglés, así que los textos de OMDb (título, sinopsis, actores) se guardan y se muestran tal cual, sin traducir.

---


## Crear el administrador

La app nunca crea administradores: el admin, y los datos de usuarios de prueba, se crean **directamente en MongoDB**.

**Forma recomendada:** registrar el usuario con `POST /auth/register` (así su email, username y contraseña pasan las mismas validaciones que cualquier cuenta) y después, en MongoDB Atlas → *Collections* → `users`, editar el documento y cambiar `type` a `"admin"` (o `"critic"`), en minúsculas.

**Forma manual** (sin la API levantada):

1. Generar el hash de la contraseña (dentro de `backend/`, con las dependencias instaladas). Usar costo `12`, el mismo que la app:
   ```bash
   node -e "console.log(require('bcrypt').hashSync('TuClaveSegura', 12))"
   ```
2. Insertar el usuario con `mongosh` (o desde MongoDB Atlas → *Collections* → `users` → *Insert document*):
   ```js
   db.users.insertOne({
     username: "admin",
     email: "admin@spoileralert.com",
     passwordHash: "<hash del paso 1>",
     type: "admin",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

Los usuarios de prueba se insertan igual, con `type: "normal"` o `type: "critic"`. Un documento insertado a mano no pasa por las validaciones de la app: el email debe ir en minúsculas, el username debe cumplir sus reglas y `type` debe ser exactamente `normal`, `critic` o `admin`.

---

## Cómo ejecutar

1. Dentro de `backend/`: `pnpm install`.
2. Copiar `.env.example` a `.env` y completar los valores. La clave de OMDb se pide gratis en omdbapi.com → *API Key* y llega por email.
3. `pnpm seed` → importa los títulos de `seed-titles.json`.
4. Opcional: `pnpm seed:demo` → crea usuarios de prueba y reseñas (necesita `DEMO_USER_PASSWORD`). `pnpm seed:demo --reset` los borra.
5. Crear el administrador (ver arriba).
6. `pnpm dev` → la API queda en `http://localhost:3000/api/v1`.
