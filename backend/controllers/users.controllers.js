import { getConnection, sql } from "../utils/db.js";
import { hashPassword } from "../utils/hash.js";

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) ? id : null;
};

// READ (todos)
export const getUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT id, name, email FROM users");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ (uno)
export const getUser = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "id inválido" });

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT id, name, email FROM users WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
export const postUser = async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email y password son requeridos" });
    }

    const passwordHash = await hashPassword(password);
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, passwordHash)
      .query(
        `INSERT INTO users (name, email, password)
         OUTPUT INSERTED.id, INSERTED.name, INSERTED.email
         VALUES (@name, @email, @password)`
      );

    res.status(201).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const putUser = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "id inválido" });

    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email y password son requeridos" });
    }

    const passwordHash = await hashPassword(password);
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar, name)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, passwordHash)
      .query("UPDATE users SET name = @name, email = @email, password = @password WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario " + id + " actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteUser = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "id inválido" });

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM users WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario " + id + " eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
