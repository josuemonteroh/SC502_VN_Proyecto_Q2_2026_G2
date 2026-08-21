USE nyvora_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS patient_notes;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS treatments;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS measurements;
DROP TABLE IF EXISTS medications;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- Roles

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuarios

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
        ON UPDATE CASCADE
);

-- Pacientes

CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

    full_name VARCHAR(150) NOT NULL,
    identification VARCHAR(50) NOT NULL UNIQUE,
    age INT NOT NULL,
    phone VARCHAR(30),
    height_m DECIMAL(4,2),

    status ENUM('ACTIVO', 'SEGUIMIENTO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    condition_general VARCHAR(150),
    observations TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_patients_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
);

-- Medicamentos

CREATE TABLE medications (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(120) NOT NULL,
    presentation VARCHAR(80) NOT NULL,
    concentration VARCHAR(80) NOT NULL,
    dose VARCHAR(100),
    frequency VARCHAR(100),
    status ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    observations TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- Citas

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,
    user_id INT NOT NULL,

    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,

    type ENUM(
        'VALORACION_INICIAL',
        'CONTROL_NUTRICIONAL',
        'SEGUIMIENTO_BIOMETRICO',
        'REVISION_CLINICA',
        'OTRO'
    ) NOT NULL,

    status ENUM(
        'PROGRAMADA',
        'CONFIRMADA',
        'COMPLETADA',
        'CANCELADA'
    ) NOT NULL DEFAULT 'PROGRAMADA',

    reason VARCHAR(200),
    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointments_patients
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON UPDATE CASCADE,

    CONSTRAINT fk_appointments_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
);

-- Métricas biométricas

CREATE TABLE measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,

    measurement_date DATETIME NOT NULL,

    weight_kg DECIMAL(6,2) NOT NULL,
    bmi DECIMAL(5,2),
    body_fat_percentage DECIMAL(5,2),
    heart_rate INT,
    sleep_hours DECIMAL(4,2),
    steps INT,
    observations TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_measurements_patients
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON UPDATE CASCADE
);

-- Tratamientos

CREATE TABLE treatments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,
    medication_id INT NULL,

    name VARCHAR(150) NOT NULL,
    dose VARCHAR(100),
    frequency VARCHAR(100),

    start_date DATE NOT NULL,
    end_date DATE NULL,

    status ENUM(
        'ACTIVO',
        'PENDIENTE',
        'COMPLETADO',
        'SUSPENDIDO'
    ) NOT NULL DEFAULT 'ACTIVO',

    indications TEXT,
    observations TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_treatments_patients
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON UPDATE CASCADE,

    CONSTRAINT fk_treatments_medications
        FOREIGN KEY (medication_id)
        REFERENCES medications(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

-- Alertas

CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,

    alert_type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,

    priority ENUM('ALTA', 'MEDIA', 'BAJA') NOT NULL DEFAULT 'MEDIA',
    status ENUM('PENDIENTE', 'SEGUIMIENTO', 'RESUELTA') NOT NULL DEFAULT 'PENDIENTE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,

    CONSTRAINT fk_alerts_patients
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON UPDATE CASCADE
);

-- Notas de pacientes

CREATE TABLE patient_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,
    user_id INT NULL,

    note TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notes_patients
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON UPDATE CASCADE,

    CONSTRAINT fk_notes_users
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);