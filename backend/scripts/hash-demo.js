import "dotenv/config";
import crypto from "node:crypto";
import { hashPassword, verifyPassword } from "../utils/hash.js";

const sha256 = (text) => crypto.createHash("sha256").update(text).digest("hex");

// Cuántos bits son distintos entre dos hashes hex
const bitsDiff = (a, b) => {
  let n = 0;
  for (let i = 0; i < a.length; i += 2) {
    let x = parseInt(a.slice(i, i + 2), 16) ^ parseInt(b.slice(i, i + 2), 16);
    while (x) { n += x & 1; x >>= 1; }
  }
  return n;
};

console.log("=== 1) Hash de un texto (SHA-256) ===");
const t1 = "hola mundo";
console.log(`"${t1}" ->`, sha256(t1));

console.log("\n=== 2) Mismo texto = mismo hash ===");
const t1b = "hola mundo";
console.log(`"${t1b}" ->`, sha256(t1b));
console.log("¿Iguales?", sha256(t1) === sha256(t1b));

console.log("\n=== 3) Texto modificado ligeramente (efecto avalancha) ===");
for (const t2 of ["Hola mundo", "hola mundo.", "hola mundp"]) {
  const h1 = sha256(t1);
  const h2 = sha256(t2);
  const bits = bitsDiff(h1, h2);
  console.log(`"${t2}" -> ${h2}`);
  console.log(`   bits distintos: ${bits}/256 (${((bits / 256) * 100).toFixed(1)}%)`);
}

console.log("\n=== 4) Contraseñas con sal distinta (scrypt) ===");
const pass = "1234";
const a = await hashPassword(pass);
const b = await hashPassword(pass);
console.log("hash 1:", a);
console.log("hash 2:", b);
console.log("¿Iguales aunque la contraseña es la misma?", a === b);
console.log("verify(1234, hash 1):", await verifyPassword("1234", a));
console.log("verify(1234, hash 2):", await verifyPassword("1234", b));
console.log("verify(12345, hash 1):", await verifyPassword("12345", a));
