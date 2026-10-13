// Convierte las contraseñas en texto plano de la BDD a hash (sal + pimienta).
// Es seguro correrlo varias veces: omite las que ya están hasheadas.
import "dotenv/config";
import { getConnection, sql } from "../utils/db.js";
import { hashPassword, isHashed } from "../utils/hash.js";

const pool = await getConnection();
const { recordset } = await pool.request().query("SELECT id, password FROM users");

let updated = 0;
let skipped = 0;
for (const user of recordset) {
  if (isHashed(user.password)) {
    skipped++;
    continue;
  }
  const hashed = await hashPassword(user.password);
  await pool
    .request()
    .input("id", sql.Int, user.id)
    .input("password", sql.VarChar, hashed)
    .query("UPDATE users SET password = @password WHERE id = @id");
  updated++;
}

console.log(`Contraseñas actualizadas: ${updated} | ya hasheadas: ${skipped}`);
await pool.close();
