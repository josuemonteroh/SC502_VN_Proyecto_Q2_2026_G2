USE nyvora_db;

-- Roles iniciales del sistema.

INSERT INTO roles (name, description)
VALUES
    ('ADMIN', 'Administrador de la plataforma'),
    ('USER', 'Usuario encargado de registrar y consultar pacientes');