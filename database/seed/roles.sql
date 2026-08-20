USE nyvora_db;

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Roles iniciales del sistema

INSERT INTO roles (name, description)
VALUES
    ('ADMIN', 'Administrador de la plataforma'),
    ('USER', 'Usuario encargado de registrar y consultar pacientes'),
    ('DOCTOR', 'Profesional encargado del seguimiento clínico de pacientes');