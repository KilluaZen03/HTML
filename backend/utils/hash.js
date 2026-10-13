import crypto from "node:crypto";

// Parámetros del hash de contraseñas (solo se usa el módulo crypto de Node)
const SALT_BYTES = 16; // sal aleatoria única por contraseña
const KEY_LEN = 64;    // longitud del hash derivado (bytes)

// Pimienta: secreto global guardado en .env (NO en la BDD).
// Se mezcla con HMAC-SHA256 antes de aplicar scrypt.
const applyPepper = (password) =>
  crypto
    .createHmac("sha256", process.env.PEPPER ?? "")
    .update(String(password))
    .digest();

// Formato guardado en la BDD:  <sal en hex>:<hash en hex>
export const hashPassword = (password) =>
  new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SALT_BYTES);
    crypto.scrypt(applyPepper(password), salt, KEY_LEN, (err, key) => {
      if (err) return reject(err);
      resolve(`${salt.toString("hex")}:${key.toString("hex")}`);
    });
  });

// ¿El valor guardado ya tiene el formato sal:hash?
export const isHashed = (value) =>
  /^[0-9a-f]{32}:[0-9a-f]{128}$/.test(String(value));

export const verifyPassword = (password, stored) =>
  new Promise((resolve, reject) => {
    if (!isHashed(stored)) return resolve(false);
    const [saltHex, hashHex] = stored.split(":");
    const expected = Buffer.from(hashHex, "hex");
    crypto.scrypt(
      applyPepper(password),
      Buffer.from(saltHex, "hex"),
      expected.length,
      (err, key) => {
        if (err) return reject(err);
        // comparación en tiempo constante
        resolve(crypto.timingSafeEqual(key, expected));
      }
    );
  });
