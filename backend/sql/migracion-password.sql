-- Ejecutar ANTES de migrar: el hash (sal:hash) mide 161 caracteres
ALTER TABLE users ALTER COLUMN password VARCHAR(255) NOT NULL;
