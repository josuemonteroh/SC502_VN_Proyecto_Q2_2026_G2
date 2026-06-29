USE nyvora_db;


-- Tabla de roles
-- Ejemplos: ADMIN, USER
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(150),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tabla de usuarios que pueden iniciar sesión
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,

    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_roles
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
);


-- Tabla de pacientes
-- Información general de cada paciente.
-- user_id representa el usuario que registra
-- o administra al paciente.
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    full_name VARCHAR(150) NOT NULL,
    identification VARCHAR(50) NOT NULL UNIQUE,
    age INT,
    phone VARCHAR(30),

    condition_general VARCHAR(150),
    observations TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_patients_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);


-- Tabla de métricas biométricas y hábitos
CREATE TABLE measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,

    measurement_date DATETIME NOT NULL,

    weight_kg DECIMAL(6,2),
    bmi DECIMAL(5,2),
    body_fat_percentage DECIMAL(5,2),

    heart_rate INT,
    sleep_hours DECIMAL(4,2),
    steps INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_measurements_patients
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
);


-- Tabla de alertas preventivas simples
CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,

    alert_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,

    CONSTRAINT fk_alerts_patients
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
);


-- Tabla de notas u observaciones adicionales
CREATE TABLE patient_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,

    note TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notes_patients
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
);