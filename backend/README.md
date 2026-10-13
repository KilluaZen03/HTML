# Backend REST API

API con Node.js, Express y SQL Server (mssql).

## Uso
1. `npm install`
2. Copia `.env.example` a `.env` y llena tus datos.
3. Crea la tabla con `sql/schema.sql`.
4. `npm start` → http://localhost:4000

## Rutas
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/`, `/marco`, `/ping` | Rutas de prueba |
| POST | `/login` | Body: `{email, password}` |
| GET | `/users` | Lista usuarios |
| GET | `/users/:id` | Un usuario |
| POST | `/users` | Crea usuario `{name, email, password}` |
| PUT | `/users/:id` | Actualiza usuario |
| DELETE | `/users/:id` | Elimina usuario |

## Hash de contraseñas (práctica de seguridad)
Solo se usa el módulo `crypto` de Node (`utils/hash.js`).

- **Algoritmo:** `scrypt` (derivación de claves lenta, pensada para contraseñas).
- **Sal:** 16 bytes aleatorios distintos por cada contraseña, guardados junto al hash con el formato `sal:hash` (161 caracteres).
- **Pimienta:** secreto `PEPPER` en `.env` (no está en la BDD); se mezcla con HMAC-SHA256 antes de scrypt. No lo cambies después de migrar, o ya nadie podrá iniciar sesión.
- **Comparación:** `crypto.timingSafeEqual` (tiempo constante).

### Pasos para actualizar la BDD
1. Ejecuta `sql/migracion-password.sql` (amplía la columna `password` a 255).
2. Pon un valor largo y aleatorio en `PEPPER` dentro de `.env`.
3. `npm run migrate-passwords` convierte las contraseñas existentes (se puede repetir sin problema).
4. `npm run hash-demo` muestra el hash de un texto, que el mismo texto da el mismo hash y el efecto de cambiar una letra.
