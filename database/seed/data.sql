USE nyvora_db;

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Usuarios de prueba

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
    '$2y$10$VVsGo0bBv3cqRktxSIdPfukGNmJ1i801TEjlNGbWbW7FLR8z.Dg52',
    TRUE
),
(
    (SELECT id FROM roles WHERE name = 'DOCTOR'),
    'Doctor Nyvora',
    'doctor@nyvora.com',
    '$2y$10$dpEpcsnniuQG1GSeHh.5ou5csjpSgZrPnk.m3M60ySKEi.1Kla24u',
    TRUE
),
(
    (SELECT id FROM roles WHERE name = 'USER'),
    'Usuario de Prueba',
    'usuario@nyvora.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    TRUE
);

-- Usuario encargado de los pacientes

SET @user_id = (
    SELECT id
    FROM users
    WHERE email = 'usuario@nyvora.com'
);

-- Pacientes

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
),
(
    @user_id,
    'Ana Sofía Ramírez',
    '1-1456-7890',
    29,
    '8888-3333',
    'Sobrepeso leve',
    'Mantiene buena adherencia al plan de seguimiento.',
    TRUE
),
(
    @user_id,
    'Luis Fernando Solano',
    '1-1678-9012',
    51,
    '8888-4444',
    'Obesidad grado I',
    'Requiere seguimiento frecuente de peso y actividad física.',
    TRUE
),
(
    @user_id,
    'Daniela Castro Mora',
    '2-1890-1234',
    33,
    '8888-5555',
    'Sobrepeso moderado',
    'Presenta mejoras progresivas en hábitos de sueño.',
    TRUE
),
(
    @user_id,
    'Jorge Andrés Vargas',
    '2-2012-3456',
    46,
    '8888-6666',
    'Obesidad grado I',
    'Baja actividad física durante la semana.',
    TRUE
),
(
    @user_id,
    'Valeria Jiménez Soto',
    '1-2234-5678',
    27,
    '8888-7777',
    'Sobrepeso leve',
    'Paciente con evolución favorable.',
    TRUE
),
(
    @user_id,
    'Andrés Quesada Rojas',
    '1-2456-7890',
    39,
    '8888-8888',
    'Sobrepeso moderado',
    'Se recomienda aumentar actividad cardiovascular.',
    TRUE
),
(
    @user_id,
    'Gabriela Méndez Ruiz',
    '2-2678-9012',
    44,
    '8777-1111',
    'Obesidad grado I',
    'Seguimiento de peso y frecuencia cardíaca.',
    TRUE
),
(
    @user_id,
    'Ricardo Salazar Vega',
    '2-2890-1234',
    56,
    '8777-2222',
    'Obesidad grado II',
    'Requiere seguimiento preventivo continuo.',
    TRUE
),
(
    @user_id,
    'Natalia Herrera León',
    '1-3012-3456',
    31,
    '8777-3333',
    'Sobrepeso leve',
    'Mejora constante en actividad física.',
    TRUE
),
(
    @user_id,
    'Esteban Montero Arias',
    '1-3234-5678',
    48,
    '8777-4444',
    'Sobrepeso moderado',
    'Control periódico de peso e IMC.',
    TRUE
),
(
    @user_id,
    'Laura Fernández Chaves',
    '2-3456-7890',
    37,
    '8777-5555',
    'Sobrepeso moderado',
    'Presenta dificultad para mantener horas adecuadas de sueño.',
    TRUE
),
(
    @user_id,
    'Miguel Ángel Rojas',
    '2-3678-9012',
    52,
    '8777-6666',
    'Obesidad grado I',
    'Seguimiento preventivo de actividad física.',
    TRUE
),
(
    @user_id,
    'Sofía Calderón Mora',
    '1-3890-1234',
    26,
    '8777-7777',
    'Sobrepeso leve',
    'Buen progreso durante las últimas semanas.',
    TRUE
);

-- IDs de pacientes

SET @p1 = (SELECT id FROM patients WHERE identification = '1-1234-5678');
SET @p2 = (SELECT id FROM patients WHERE identification = '2-2345-6789');
SET @p3 = (SELECT id FROM patients WHERE identification = '1-1456-7890');
SET @p4 = (SELECT id FROM patients WHERE identification = '1-1678-9012');
SET @p5 = (SELECT id FROM patients WHERE identification = '2-1890-1234');
SET @p6 = (SELECT id FROM patients WHERE identification = '2-2012-3456');
SET @p7 = (SELECT id FROM patients WHERE identification = '1-2234-5678');
SET @p8 = (SELECT id FROM patients WHERE identification = '1-2456-7890');
SET @p9 = (SELECT id FROM patients WHERE identification = '2-2678-9012');
SET @p10 = (SELECT id FROM patients WHERE identification = '2-2890-1234');
SET @p11 = (SELECT id FROM patients WHERE identification = '1-3012-3456');
SET @p12 = (SELECT id FROM patients WHERE identification = '1-3234-5678');
SET @p13 = (SELECT id FROM patients WHERE identification = '2-3456-7890');
SET @p14 = (SELECT id FROM patients WHERE identification = '2-3678-9012');
SET @p15 = (SELECT id FROM patients WHERE identification = '1-3890-1234');

-- Mediciones

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
(@p1, '2026-06-01 08:00:00', 82.50, 28.10, 34.20, 76, 6.50, 4200),
(@p1, '2026-06-08 08:00:00', 81.80, 27.90, 33.80, 74, 7.00, 5600),
(@p1, '2026-06-15 08:00:00', 81.20, 27.70, 33.40, 72, 7.50, 6800),

(@p2, '2026-06-01 08:00:00', 96.40, 31.20, 36.50, 88, 5.50, 2500),
(@p2, '2026-06-08 08:00:00', 97.10, 31.40, 36.90, 90, 5.00, 2200),
(@p2, '2026-06-15 08:00:00', 97.80, 31.60, 37.20, 92, 5.25, 1800),

(@p3, '2026-06-01 08:00:00', 74.20, 26.80, 31.10, 72, 7.00, 6500),
(@p3, '2026-06-08 08:00:00', 73.60, 26.60, 30.80, 70, 7.30, 7200),
(@p3, '2026-06-15 08:00:00', 73.10, 26.40, 30.40, 69, 7.50, 7800),

(@p4, '2026-06-01 08:00:00', 103.50, 33.10, 38.50, 86, 5.80, 3100),
(@p4, '2026-06-08 08:00:00', 102.90, 32.90, 38.10, 84, 6.10, 3600),
(@p4, '2026-06-15 08:00:00', 102.40, 32.70, 37.80, 82, 6.30, 4100),

(@p5, '2026-06-01 08:00:00', 79.80, 28.30, 33.00, 78, 6.00, 4800),
(@p5, '2026-06-08 08:00:00', 79.20, 28.10, 32.70, 76, 6.50, 5400),
(@p5, '2026-06-15 08:00:00', 78.70, 27.90, 32.20, 74, 7.00, 6200),

(@p6, '2026-06-01 08:00:00', 99.40, 32.00, 37.10, 89, 5.20, 2100),
(@p6, '2026-06-08 08:00:00', 99.10, 31.90, 36.90, 87, 5.60, 2600),
(@p6, '2026-06-15 08:00:00', 98.80, 31.80, 36.70, 85, 6.00, 3200),

(@p7, '2026-06-01 08:00:00', 70.50, 25.90, 29.50, 68, 7.20, 7200),
(@p7, '2026-06-08 08:00:00', 70.10, 25.70, 29.20, 67, 7.40, 7900),
(@p7, '2026-06-15 08:00:00', 69.60, 25.50, 28.90, 66, 7.60, 8500),

(@p8, '2026-06-01 08:00:00', 88.30, 29.10, 34.50, 80, 6.00, 3900),
(@p8, '2026-06-08 08:00:00', 87.90, 29.00, 34.20, 78, 6.40, 4500),
(@p8, '2026-06-15 08:00:00', 87.40, 28.80, 33.90, 77, 6.80, 5100),

(@p9, '2026-06-01 08:00:00', 94.20, 31.80, 36.80, 84, 5.70, 3000),
(@p9, '2026-06-08 08:00:00', 93.80, 31.60, 36.40, 82, 6.10, 3600),
(@p9, '2026-06-15 08:00:00', 93.20, 31.40, 36.10, 80, 6.40, 4200),

(@p10, '2026-06-01 08:00:00', 112.50, 36.20, 41.30, 94, 4.80, 1500),
(@p10, '2026-06-08 08:00:00', 112.80, 36.30, 41.50, 95, 4.60, 1400),
(@p10, '2026-06-15 08:00:00', 113.10, 36.40, 41.70, 96, 4.50, 1300),

(@p11, '2026-06-01 08:00:00', 72.60, 26.20, 30.00, 70, 7.10, 6800),
(@p11, '2026-06-08 08:00:00', 72.10, 26.00, 29.80, 69, 7.40, 7400),
(@p11, '2026-06-15 08:00:00', 71.60, 25.80, 29.40, 68, 7.60, 8100),

(@p12, '2026-06-01 08:00:00', 90.20, 29.70, 35.20, 82, 6.20, 4200),
(@p12, '2026-06-08 08:00:00', 89.70, 29.50, 34.90, 80, 6.50, 4700),
(@p12, '2026-06-15 08:00:00', 89.10, 29.30, 34.50, 78, 6.80, 5300),

(@p13, '2026-06-01 08:00:00', 84.30, 28.90, 34.00, 79, 5.80, 3500),
(@p13, '2026-06-08 08:00:00', 84.00, 28.80, 33.80, 78, 6.00, 3900),
(@p13, '2026-06-15 08:00:00', 83.70, 28.70, 33.60, 77, 6.30, 4300),

(@p14, '2026-06-01 08:00:00', 101.20, 32.80, 38.00, 88, 5.40, 2400),
(@p14, '2026-06-08 08:00:00', 100.80, 32.60, 37.70, 86, 5.80, 2900),
(@p14, '2026-06-15 08:00:00', 100.30, 32.40, 37.40, 84, 6.10, 3400),

(@p15, '2026-06-01 08:00:00', 68.80, 25.40, 28.70, 66, 7.40, 7600),
(@p15, '2026-06-08 08:00:00', 68.40, 25.20, 28.40, 65, 7.60, 8200),
(@p15, '2026-06-15 08:00:00', 68.00, 25.00, 28.00, 64, 7.80, 8900);

-- Alertas

INSERT INTO alerts (
    patient_id,
    alert_type,
    message,
    status,
    created_at
)
VALUES
(@p2, 'Aumento de peso', 'El paciente presenta un aumento constante de peso durante las últimas semanas.', 'ACTIVE', '2026-06-15 09:00:00'),
(@p2, 'Baja actividad física', 'El promedio de pasos diarios se encuentra por debajo del objetivo recomendado.', 'ACTIVE', '2026-06-15 09:10:00'),
(@p4, 'Actividad física baja', 'Se recomienda aumentar progresivamente la cantidad de pasos diarios.', 'ACTIVE', '2026-06-15 09:20:00'),
(@p6, 'Horas de sueño bajas', 'El paciente registra un promedio de sueño inferior al recomendado.', 'ACTIVE', '2026-06-15 09:30:00'),
(@p9, 'Seguimiento de peso', 'Se mantiene seguimiento preventivo por obesidad grado I.', 'ACTIVE', '2026-06-15 09:40:00'),
(@p10, 'Aumento de peso', 'Se registra un aumento continuo de peso y baja actividad física.', 'ACTIVE', '2026-06-15 09:50:00'),
(@p13, 'Sueño irregular', 'Se detectan horas de sueño por debajo del objetivo establecido.', 'ACTIVE', '2026-06-15 10:00:00'),
(@p14, 'Actividad física baja', 'La actividad diaria continúa por debajo del rango recomendado.', 'ACTIVE', '2026-06-15 10:10:00'),
(@p1, 'Mejora de actividad', 'La paciente ha aumentado progresivamente su cantidad de pasos diarios.', 'RESOLVED', '2026-06-15 10:20:00'),
(@p7, 'Evolución favorable', 'La paciente presenta una reducción progresiva de peso.', 'RESOLVED', '2026-06-15 10:30:00'),
(@p11, 'Mejora de actividad', 'Se observa una evolución favorable en actividad física y peso.', 'RESOLVED', '2026-06-15 10:40:00'),
(@p15, 'Evolución favorable', 'La paciente presenta una mejora constante en sus métricas.', 'RESOLVED', '2026-06-15 10:50:00');

-- Notas

INSERT INTO patient_notes (
    patient_id,
    note,
    created_at
)
VALUES
(@p1, 'La paciente ha mostrado una mejora en actividad física y horas de sueño.', '2026-06-15 11:00:00'),
(@p2, 'Se recomienda iniciar caminatas de al menos 20 minutos diarios.', '2026-06-15 11:05:00'),
(@p3, 'Mantener el plan actual y continuar con seguimiento semanal.', '2026-06-15 11:10:00'),
(@p4, 'Reforzar hábitos de actividad física y control de peso.', '2026-06-15 11:15:00'),
(@p5, 'Se observa una mejora progresiva en las horas de sueño.', '2026-06-15 11:20:00'),
(@p6, 'Paciente con baja actividad física; se recomienda aumentar caminatas.', '2026-06-15 11:25:00'),
(@p7, 'Evolución favorable durante las últimas semanas.', '2026-06-15 11:30:00'),
(@p8, 'Continuar seguimiento del peso y actividad cardiovascular.', '2026-06-15 11:35:00'),
(@p9, 'Mantener control periódico de peso y frecuencia cardíaca.', '2026-06-15 11:40:00'),
(@p10, 'Requiere seguimiento cercano por aumento progresivo de peso.', '2026-06-15 11:45:00'),
(@p11, 'Buen progreso en actividad física y reducción de peso.', '2026-06-15 11:50:00'),
(@p12, 'Mantener seguimiento de IMC y hábitos generales.', '2026-06-15 11:55:00'),
(@p13, 'Se recomienda mejorar la regularidad de las horas de sueño.', '2026-06-15 12:00:00'),
(@p14, 'Continuar seguimiento preventivo y aumentar actividad diaria.', '2026-06-15 12:05:00'),
(@p15, 'Mantener las recomendaciones actuales debido a la evolución favorable.', '2026-06-15 12:10:00');