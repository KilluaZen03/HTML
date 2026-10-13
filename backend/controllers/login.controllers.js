import { getConnection, sql } from "../utils/db.js";
import { verifyPassword } from "../utils/hash.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ login: false, message: "email y password son requeridos" });
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT id, name, email, password FROM users WHERE email = @email");

    const user = result.recordset[0];

    if (user && (await verifyPassword(password, user.password))) {
      const { password: _omit, ...safeUser } = user; // no devolver la contraseña
      return res.status(200).json({ login: true, user: safeUser });
    }
    res.status(401).json({ login: false, user: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
