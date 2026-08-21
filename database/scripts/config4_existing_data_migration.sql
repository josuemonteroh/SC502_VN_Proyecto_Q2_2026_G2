USE nyvora_db;

-- Existing Docker volumes do not rerun the initial schema scripts.
SET @add_height_m = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE patients ADD COLUMN height_m DECIMAL(4,2) NULL AFTER phone',
        'SELECT 1'
    )
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
        AND table_name = 'patients'
        AND column_name = 'height_m'
);
PREPARE add_height_m FROM @add_height_m;
EXECUTE add_height_m;
DEALLOCATE PREPARE add_height_m;

SET @add_status = (
    SELECT IF(
        COUNT(*) = 0,
        "ALTER TABLE patients ADD COLUMN status VARCHAR(30) NOT NULL DEFAULT 'ACTIVO' AFTER observations",
        'SELECT 1'
    )
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
        AND table_name = 'patients'
        AND column_name = 'status'
);
PREPARE add_status FROM @add_status;
EXECUTE add_status;
DEALLOCATE PREPARE add_status;

UPDATE patients
SET height_m = CASE identification
    WHEN '1-1234-5678' THEN 1.71
    WHEN '2-2345-6789' THEN 1.76
    WHEN '1-1456-7890' THEN 1.65
    WHEN '1-1678-9012' THEN 1.77
    WHEN '2-1890-1234' THEN 1.67
    WHEN '2-2012-3456' THEN 1.76
    WHEN '1-2234-5678' THEN 1.65
    WHEN '1-2456-7890' THEN 1.73
    WHEN '2-2678-9012' THEN 1.72
    WHEN '2-2890-1234' THEN 1.77
    WHEN '1-3012-3456' THEN 1.65
    WHEN '1-3234-5678' THEN 1.74
    WHEN '2-3456-7890' THEN 1.71
    WHEN '2-3678-9012' THEN 1.75
    WHEN '1-3890-1234' THEN 1.65
END
WHERE height_m IS NULL;

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    professional_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PROGRAMADA',
    reason VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointments_patients
        FOREIGN KEY (patient_id) REFERENCES patients(id),
    CONSTRAINT fk_appointments_users
        FOREIGN KEY (professional_id) REFERENCES users(id),
    INDEX idx_appointments_date_status (appointment_date, status),
    INDEX idx_appointments_patient (patient_id)
);

CREATE TABLE IF NOT EXISTS medications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    presentation VARCHAR(50) NOT NULL,
    concentration VARCHAR(80) NOT NULL,
    reference_dose VARCHAR(120),
    reference_frequency VARCHAR(120),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_medications_status (status),
    INDEX idx_medications_name (name)
);

CREATE TABLE IF NOT EXISTS treatments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    medication_id INT NULL,
    name VARCHAR(150) NOT NULL,
    dose VARCHAR(120),
    frequency VARCHAR(120),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    start_date DATE NOT NULL,
    end_date DATE NULL,
    indications TEXT,
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_treatments_patients
        FOREIGN KEY (patient_id) REFERENCES patients(id),
    CONSTRAINT fk_treatments_medications
        FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE SET NULL,
    INDEX idx_treatments_patient (patient_id),
    INDEX idx_treatments_medication (medication_id),
    INDEX idx_treatments_status_dates (status, start_date, end_date)
);