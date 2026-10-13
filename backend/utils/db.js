import sql from "mssql";

const options = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const getConnection = async () => {
  // sql.connect reutiliza el pool global si ya existe
  const pool = await sql.connect(options);
  return pool;
};

export { sql };
