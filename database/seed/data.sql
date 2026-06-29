USE nyvora_db;

-- DATOS DE PRUEBA: USUARIOS

-- Estos password_hash son ejemplos.
-- Más adelante, el backend PHP debe generar
-- contraseñas con password_hash() o de otra manera si desean.

INSERT INTO users (
    role_id,
    full_name,
    email,
    password_hash,
    is_active
)
VALUES
(
    (SELECT id FROM roles WHERE name = 'ADMIN'),
    'Administrador Nyvora',
    'admin@nyvora.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    TRUE
),
(
    (SELECT id FROM roles WHERE name = 'USER'),
    'Usuario de Prueba',
    'usuario@nyvora.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    TRUE
);

-- OBTENER EL ID DEL USUARIO QUE ADMINISTRA
-- LOS PACIENTES DE PRUEBA

SET @user_id = (
    SELECT id
    FROM users
    WHERE email = 'usuario@nyvora.com'
);

-- DATOS DE PRUEBA: PACIENTES

INSERT INTO patients (
    user_id,
    full_name,
    identification,
    age,
    phone,
    condition_general,
    observations,
    is_active
)
VALUES
(
    @user_id,
    'María Rodríguez Vargas',
    '1-1234-5678',
    35,
    '8888-1111',
    'Sobrepeso moderado',
    'Paciente en seguimiento preventivo.',
    TRUE
),
(
    @user_id,
    'Carlos Hernández Mora',
    '2-2345-6789',
    42,
    '8888-2222',
    'Sobrepeso y baja actividad física',
    'Se recomienda mejorar caminatas diarias.',
    TRUE
);

-- OBTENER IDS DE LOS PACIENTES

SET @patient_maria = (
    SELECT id
    FROM patients
    WHERE identification = '1-1234-5678'
);

SET @patient_carlos = (
    SELECT id
    FROM patients
    WHERE identification = '2-2345-6789'
);

-- DATOS DE PRUEBA: MÉTRICAS DE MARÍA

INSERT INTO measurements (
    patient_id,
    measurement_date,
    weight_kg,
    bmi,
    body_fat_percentage,
    heart_rate,
    sleep_hours,
    steps
)
VALUES
(
    @patient_maria,
    '2026-06-01 08:00:00',
    82.50,
    28.10,
    34.20,
    76,
    6.50,
    4200
),
(
    @patient_maria,
    '2026-06-08 08:00:00',
    81.80,
    27.90,
    33.80,
    74,
    7.00,
    5600
),
(
    @patient_maria,
    '2026-06-15 08:00:00',
    81.20,
    27.70,
    33.40,
    72,
    7.50,
    6800
);

-- DATOS DE PRUEBA: MÉTRICAS DE CARLOS


INSERT INTO measurements (
    patient_id,
    measurement_date,
    weight_kg,
    bmi,
    body_fat_percentage,
    heart_rate,
    sleep_hours,
    steps
)
VALUES
(
    @patient_carlos,
    '2026-06-01 08:00:00',
    96.40,
    31.20,
    36.50,
    88,
    5.50,
    2500
),
(
    @patient_carlos,
    '2026-06-08 08:00:00',
    97.10,
    31.40,
    36.90,
    90,
    5.00,
    2200
),
(
    @patient_carlos,
    '2026-06-15 08:00:00',
    97.80,
    31.60,
    37.20,
    92,
    5.25,
    1800
);

-- DATOS DE PRUEBA: ALERTAS


INSERT INTO alerts (
    patient_id,
    alert_type,
    message,
    status,
    created_at
)
VALUES
(
    @patient_carlos,
    'Aumento de peso',
    'El paciente presenta un aumento constante de peso durante las últimas semanas.',
    'ACTIVE',
    '2026-06-15 09:00:00'
),
(
    @patient_carlos,
    'Baja actividad física',
    'El promedio de pasos diarios del paciente se encuentra por debajo del objetivo recomendado.',
    'ACTIVE',
    '2026-06-15 09:10:00'
),
(
    @patient_maria,
    'Mejora de actividad',
    'La paciente ha aumentado progresivamente su cantidad de pasos diarios.',
    'RESOLVED',
    '2026-06-15 09:20:00'
);

-- DATOS DE PRUEBA: NOTAS DEL PACIENTE

INSERT INTO patient_notes (
    patient_id,
    note,
    created_at
)
VALUES
(
    @patient_maria,
    'La paciente ha mostrado una mejora en actividad física y horas de sueño.',
    '2026-06-15 10:00:00'
),
(
    @patient_carlos,
    'Se recomienda iniciar caminatas de al menos 20 minutos diarios.',
    '2026-06-15 10:15:00'
);