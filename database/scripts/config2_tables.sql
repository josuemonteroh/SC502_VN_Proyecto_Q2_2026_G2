USE nyvora_db;


-- Tabla de roles
-- Ejemplos: ADMIN, USER
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);


-- Tabla de usuarios que pueden iniciar sesión
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    FOREIGN KEY (role_id) REFERENCES roles(id)
);


-- Tabla de pacientes
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

    full_name VARCHAR(150) NOT NULL,
    identification VARCHAR(50),
    age INT,
    phone VARCHAR(30),

    condition_general VARCHAR(150),
    observations TEXT,

    FOREIGN KEY (user_id) REFERENCES users(id)
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

    FOREIGN KEY (patient_id) REFERENCES patients(id)
);


-- Tabla de alertas preventivas simples
CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,

    alert_type VARCHAR(100),
    message TEXT,
    status VARCHAR(30),

    created_at DATETIME,

    FOREIGN KEY (patient_id) REFERENCES patients(id)
);


-- Tabla de notas u observaciones adicionales
CREATE TABLE patient_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,

    note TEXT,
    created_at DATETIME,

    FOREIGN KEY (patient_id) REFERENCES patients(id)
);