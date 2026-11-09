# SpoilerAlert — Frontend

App móvil de SpoilerAlert, hecha con Ionic + Angular y empaquetada con Capacitor. Consume la API del [`backend/`](../backend/README.md).
Mockups interactivos: [SpoilerAlert — Mockups](https://claude.ai/artifact/NauHvj9gkJR2MzXVXn4ofF) (Claude Design).

---

## Stack

| Capa               | Tecnología                                         |
| ------------------ | -------------------------------------------------- |
| Framework          | Ionic 9 + Angular 22 (componentes *standalone*)    |
| Lenguaje           | TypeScript                                         |
| App nativa         | Capacitor 8 (Android)                              |
| Navegación         | Angular Router + pestañas de Ionic (`ion-tabs`)    |
| Estado             | Signals de Angular                                 |
| HTTP               | `HttpClient` + interceptor que añade el JWT        |
| Sesión             | JWT guardado con `@capacitor/preferences`          |
| Fuentes            | Bebas Neue (títulos) y Manrope (texto), de Google Fonts |
| Gestor de paquetes | pnpm                                               |

---

## Cómo ejecutar

1. Instalar dependencias: `pnpm install`.
2. Arrancar el backend (ver [`backend/README.md`](../backend/README.md)).
3. Poner la URL de la API en `src/environments/environment.ts` (`apiUrl`):
   - Navegador: `http://localhost:3000/api/v1`
   - Emulador de Android: `http://10.0.2.2:3000/api/v1`
   - Teléfono físico: `http://<IP de la PC>:3000/api/v1`. El teléfono y la PC tienen que estar en la misma red WiFi.
4. **En el navegador:** `pnpm start` (equivale a `ionic serve`) → `http://localhost:8100`.
5. **En Android:** `pnpm build`, luego `npx cap sync android` y `npx cap run android`. Hace falta Android Studio.

En desarrollo la API usa `http`, así que `capacitor.config.ts` lleva `server: { androidScheme: 'http', cleartext: true }`. Sin eso, Android bloquea las peticiones.

---

## Arquitectura

```mermaid
flowchart LR
    U(["Usuario"]) --> P["Pages"] --> CMP["Components"]
    P --> AUTH["AuthService<br/>sesión (signals)"] --> ST["Preferences<br/>token"]
    P --> API["api"] --> HC["HttpClient +<br/>interceptor"] -- "HTTP + JWT" --> BE[("API REST")]
```

Las páginas nunca usan `HttpClient` directamente: piden los datos a los servicios de `api`. `auth.interceptor.ts` es el único que añade el token; si la API responde `401`, cierra la sesión y lleva al login.

| Carpeta (`src/app/`) | Responsabilidad                                                        |
| -------------------- | ---------------------------------------------------------------------- |
| `pages`              | Pantallas. Una carpeta por ruta.                                       |
| `components`         | Piezas de UI reutilizables (ver abajo).                                |
| `api`                | Llamadas al backend, un servicio por recurso: `auth`, `users`, `programs`, `reviews`. |
| `core`               | `AuthService`, interceptor y guards (`authGuard`, `adminGuard`).       |
| `models`             | Interfaces de TypeScript de las respuestas de la API.                  |
| `constants`          | Enums (copia de los del backend) y sus etiquetas para la interfaz.     |
| `utils`              | Funciones de apoyo: estrellas, fechas, imágenes de respaldo.           |

| Otras carpetas (`src/`) | Responsabilidad |
| ----------------------- | --------------- |
| `environments`          | URL de la API por entorno. |
| `theme`                 | Colores y variables de Ionic (`variables.scss`). |

---

## Pantallas

La app tiene dos módulos para todos los usuarios, **Home** y **My profile**, y uno extra para el admin, **Users**. Para un usuario `normal` y un `critic` la app es igual: solo cambia el tipo que se muestra en su perfil.

| Ruta                    | Pantalla (título en la app) | Acceso  | Contenido |
| ----------------------- | --------------------------- | ------- | --------- |
| `/login`                | Log in          | Público | **Primera pantalla.** Username o email y contraseña. El botón se activa cuando ambos campos tienen texto. Pestaña para pasar a *Sign up*. |
| `/signup`               | Sign up         | Público | Username, email, contraseña y confirmación. Avisa si las contraseñas no coinciden. Crea siempre un usuario `normal`. |
| `/tabs/home`            | Home            | Usuario | Pestañas **Movies** y **Series**. Buscador por nombre y panel de filtros: categoría, año (desde / hasta), puntaje mínimo de críticos, puntaje mínimo de audiencia y orden. Por defecto, de la más nueva a la más vieja. Películas y series usan la misma tarjeta. |
| `/programs/:id`         | Details         | Usuario | Todos los campos del programa: carátula, título, tipo, año, fecha de estreno, duración (películas) o temporadas (series), categorías, sinopsis y actores. Los dos promedios (críticos y audiencia) con estrellas. Reseñas separadas en *Critics* / *Audience*. Botón *Write a review*. |
| `/programs/:id/review`  | My review       | Usuario | Crear o editar la propia reseña: puntaje 1–100 con deslizador y estrellas en vivo, y comentario opcional (máx. 300). Al editar, permite borrarla. |
| `/users/:id`            | Profile         | Usuario | Perfil público, solo datos no sensibles: username, fecha de registro, tipo, cantidad de reseñas, promedio de puntos dados y sus reseñas. |
| `/tabs/profile`         | My profile      | Usuario | Mis datos (incluido mi email), tipo, estadísticas y mis reseñas con editar y borrar. Editar perfil, cerrar sesión y borrar cuenta. |
| `/tabs/profile/edit`    | Edit profile    | Usuario | Username, email y, opcionalmente, nueva contraseña con confirmación. El tipo se muestra pero no se puede cambiar. |
| `/tabs/users`           | Users           | Admin   | Buscar usuarios por username o email, filtrar por tipo y cambiar a cada uno entre *Normal* y *Critic*. Los admins aparecen marcados y no se pueden cambiar. |

- Todas las rutas, salvo `/login` y `/signup`, usan `authGuard`. Sin sesión se va al login.
- La pestaña **Users** solo aparece si `type = admin`, y la ruta está protegida con `adminGuard`.
- Al tocar el nombre del autor de una reseña se abre su perfil público (`/users/:id`).
- **Toda la interfaz está en inglés**, igual que los datos de OMDb. Los enums se muestran con las etiquetas de `constants` (ej. `science_fiction` → "Sci-Fi").

### Puntajes y estrellas

- Las estrellas se calculan con `Math.ceil(points / 20)`: 1–20 = 1 estrella, 21–40 = 2, 41–60 = 3, 61–80 = 4, 81–100 = 5. Se usa la misma regla para las reseñas y para los promedios.
- Si un grupo no tiene reseñas, su promedio se muestra como "—".
- En las tarjetas, el puntaje de críticos lleva un icono de insignia y el de audiencia un icono de personas, para no depender solo del color.

---

## Componentes

| Componente        | Dónde se usa | Qué muestra |
| ----------------- | ------------ | ----------- |
| `program-card`    | Home         | Carátula, título, año, dos primeras categorías y los dos promedios. La misma para películas y series. |
| `filter-sheet`    | Home         | Panel inferior con orden, categorías, años y puntajes mínimos. |
| `score-box`       | Details      | Un promedio (críticos o audiencia) con su número, estrellas y cantidad de reseñas. |
| `star-rating`     | Details, My review, perfiles | Las 5 estrellas a partir de `points`. |
| `review-item`     | Details, perfiles | Autor (con enlace a su perfil), insignia de crítico, fecha, puntaje, estrellas y comentario si lo hay. |
| `user-type-badge` | Perfiles, Users | Insignia *Normal user*, *Critic* o *Admin*. |
| `tab-bar`         | Home, My profile, Users | Pestañas inferiores; *Users* solo para admin. |

---

## Diseño

Los mockups de todas las pantallas están en [Claude Design](https://claude.ai/artifact/NauHvj9gkJR2MzXVXn4ofF), con navegación entre pantallas. Valores base para `theme/variables.scss`:

| Token          | Valor     | Uso |
| -------------- | --------- | --- |
| Fondo          | `#0F0B0B` | Fondo de todas las pantallas. |
| Superficie     | `#1A1414` | Tarjetas, campos y paneles. |
| Barra inferior | `#140F0F` | Tab bar y botones fijos. |
| Acento         | `#DB3125` | Botones principales y pestaña activa. |
| Acento texto   | `#FF5A4D` | Enlaces y textos en rojo sobre fondo oscuro. |
| Estrellas      | `#F5B83D` | Estrellas e icono de audiencia. |
| Texto          | `#F4EFEC` | Texto principal. |
| Texto suave    | `#A8A09C` | Etiquetas y datos secundarios. |
