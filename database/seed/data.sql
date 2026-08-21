USE nyvora_db;

-- USUARIOS DE PRUEBA
-- admin@nyvora.com / Admin123@
-- doctor@nyvora.com / Doctor123@

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
    '$2y$12$1tfEziUOXJiJmVOJSD0jdutEEkH1oQWZVT1UADpAI0Wm/XZQS2sfi',
    TRUE
),
(
    (SELECT id FROM roles WHERE name = 'DOCTOR'),
    'Doctor Nyvora',
    'doctor@nyvora.com',
    '$2y$12$wwUygoYcQTSqxGeA/CNGWeCSmRKd/PgIGGETCxVWC4WPQsl7k/2Aq',
    TRUE
);

-- OBTENER USUARIO DOCTOR

SET @doctor_id = (
    SELECT id
    FROM users
    WHERE email = 'doctor@nyvora.com'
);

-- PACIENTES

INSERT INTO patients (
    user_id,
    full_name,
    identification,
    age,
    phone,
    height_m,
    status,
    condition_general,
    observations,
    is_active
)
VALUES
(
    @doctor_id,
    'María Rodríguez Vargas',
    '1-1234-5678',
    35,
    '8888-1111',
    1.68,
    'ACTIVO',
    'Sobrepeso moderado',
    'Paciente en seguimiento preventivo con mejora progresiva.',
    TRUE
),
(
    @doctor_id,
    'Carlos Hernández Mora',
    '2-2345-6789',
    42,
    '8888-2222',
    1.76,
    'SEGUIMIENTO',
    'Sobrepeso y baja actividad física',
    'Se recomienda mejorar caminatas diarias y control de peso.',
    TRUE
),
(
    @doctor_id,
    'Ana López Chaves',
    '3-3456-7890',
    29,
    '8888-3333',
    1.62,
    'ACTIVO',
    'Control nutricional preventivo',
    'Paciente con seguimiento mensual de métricas biométricas.',
    TRUE
),
(
    @doctor_id,
    'Luis Fernández Castro',
    '4-4567-8901',
    51,
    '8888-4444',
    1.72,
    'INACTIVO',
    'Paciente con seguimiento suspendido',
    'Paciente inactivo temporalmente.',
    FALSE
);

-- IDS DE PACIENTES

SET @patient_maria = (
    SELECT id FROM patients WHERE identification = '1-1234-5678'
);

SET @patient_carlos = (
    SELECT id FROM patients WHERE identification = '2-2345-6789'
);

SET @patient_ana = (
    SELECT id FROM patients WHERE identification = '3-3456-7890'
);

SET @patient_luis = (
    SELECT id FROM patients WHERE identification = '4-4567-8901'
);

-- MEDICAMENTOS

INSERT INTO medications (
    name,
    presentation,
    concentration,
    dose,
    frequency,
    status,
    observations
)
VALUES
(
    'Metformina',
    'Tabletas',
    '500 mg',
    '1 tableta',
    'Cada 12 horas',
    'ACTIVO',
    'Medicamento de referencia para control metabólico.'
),
(
    'Orlistat',
    'Cápsulas',
    '120 mg',
    '1 cápsula',
    'Con comidas principales',
    'ACTIVO',
    'Uso bajo supervisión profesional.'
),
(
    'Vitamina D',
    'Cápsulas',
    '2000 UI',
    '1 cápsula',
    'Una vez al día',
    'ACTIVO',
    'Suplemento asociado a control general.'
),
(
    'Suplemento Proteico',
    'Otro',
    '25 g',
    '1 porción',
    'Según plan nutricional',
    'INACTIVO',
    'Registro de prueba actualmente inactivo.'
);

-- IDS DE MEDICAMENTOS

SET @med_metformina = (
    SELECT id FROM medications WHERE name = 'Metformina'
);

SET @med_orlistat = (
    SELECT id FROM medications WHERE name = 'Orlistat'
);

SET @med_vitamina = (
    SELECT id FROM medications WHERE name = 'Vitamina D'
);

-- CITAS

INSERT INTO appointments (
    patient_id,
    user_id,
    appointment_date,
    appointment_time,
    type,
    status,
    reason,
    notes
)
VALUES
(
    @patient_maria,
    @doctor_id,
    CURDATE(),
    '09:00:00',
    'CONTROL_NUTRICIONAL',
    'CONFIRMADA',
    'Control mensual de seguimiento',
    'Revisar evolución de peso y hábitos de sueño.'
),
(
    @patient_carlos,
    @doctor_id,
    CURDATE(),
    '11:30:00',
    'SEGUIMIENTO_BIOMETRICO',
    'PROGRAMADA',
    'Seguimiento por alerta activa',
    'Revisar peso, pasos diarios y frecuencia cardíaca.'
),
(
    @patient_ana,
    @doctor_id,
    DATE_ADD(CURDATE(), INTERVAL 3 DAY),
    '10:00:00',
    'REVISION_CLINICA',
    'PROGRAMADA',
    'Revisión clínica preventiva',
    'Control de métricas biométricas.'
),
(
    @patient_luis,
    @doctor_id,
    DATE_SUB(CURDATE(), INTERVAL 5 DAY),
    '14:00:00',
    'CONTROL_NUTRICIONAL',
    'COMPLETADA',
    'Control anterior',
    'Cita completada como dato histórico.'
);

-- MÉTRICAS DE MARÍA

INSERT INTO measurements (
    patient_id,
    measurement_date,
    weight_kg,
    bmi,
    body_fat_percentage,
    heart_rate,
    sleep_hours,
    steps,
    observations
)
VALUES
(
    @patient_maria,
    '2026-06-01 08:00:00',
    82.50,
    29.23,
    34.20,
    76,
    6.50,
    4200,
    'Primer registro biométrico.'
),
(
    @patient_maria,
    '2026-06-08 08:00:00',
    81.80,
    28.98,
    33.80,
    74,
    7.00,
    5600,
    'Mejora ligera en peso y actividad.'
),
(
    @patient_maria,
    '2026-06-15 08:00:00',
    81.20,
    28.77,
    33.40,
    72,
    7.50,
    6800,
    'Evolución positiva.'
);

-- MÉTRICAS DE CARLOS

INSERT INTO measurements (
    patient_id,
    measurement_date,
    weight_kg,
    bmi,
    body_fat_percentage,
    heart_rate,
    sleep_hours,
    steps,
    observations
)
VALUES
(
    @patient_carlos,
    '2026-06-01 08:00:00',
    96.40,
    31.12,
    36.50,
    88,
    5.50,
    2500,
    'Primer control con baja actividad física.'
),
(
    @patient_carlos,
    '2026-06-08 08:00:00',
    97.10,
    31.35,
    36.90,
    90,
    5.00,
    2200,
    'Aumento de peso y reducción de pasos.'
),
(
    @patient_carlos,
    '2026-06-15 08:00:00',
    97.80,
    31.58,
    37.20,
    92,
    5.25,
    1800,
    'Requiere seguimiento por aumento de peso.'
);

-- MÉTRICAS DE ANA

INSERT INTO measurements (
    patient_id,
    measurement_date,
    weight_kg,
    bmi,
    body_fat_percentage,
    heart_rate,
    sleep_hours,
    steps,
    observations
)
VALUES
(
    @patient_ana,
    '2026-06-10 08:00:00',
    74.30,
    28.31,
    32.00,
    78,
    7.20,
    6100,
    'Registro inicial del seguimiento.'
),
(
    @patient_ana,
    '2026-06-17 08:00:00',
    73.90,
    28.16,
    31.70,
    76,
    7.40,
    6900,
    'Ligera mejora en actividad física.'
);

-- TRATAMIENTOS

INSERT INTO treatments (
    patient_id,
    medication_id,
    name,
    dose,
    frequency,
    start_date,
    end_date,
    status,
    indications,
    observations
)
VALUES
(
    @patient_carlos,
    @med_metformina,
    'Control metabólico',
    '500 mg',
    'Cada 12 horas',
    '2026-06-01',
    '2026-09-01',
    'ACTIVO',
    'Tomar después de las comidas principales.',
    'Asociado al seguimiento por sobrepeso.'
),
(
    @patient_maria,
    @med_vitamina,
    'Apoyo nutricional preventivo',
    '2000 UI',
    'Una vez al día',
    '2026-06-05',
    '2026-08-05',
    'ACTIVO',
    'Mantener control mensual.',
    'Tratamiento preventivo complementario.'
),
(
    @patient_ana,
    @med_orlistat,
    'Control de peso',
    '120 mg',
    'Con comidas principales',
    '2026-06-10',
    '2026-07-30',
    'PENDIENTE',
    'Iniciar únicamente con aprobación profesional.',
    'Tratamiento pendiente de seguimiento.'
);

-- ALERTAS

INSERT INTO alerts (
    patient_id,
    alert_type,
    message,
    priority,
    status,
    created_at,
    resolved_at
)
VALUES
(
    @patient_carlos,
    'Aumento de peso',
    'El paciente presenta un aumento constante de peso durante las últimas semanas.',
    'ALTA',
    'PENDIENTE',
    '2026-06-15 09:00:00',
    NULL
),
(
    @patient_carlos,
    'Baja actividad física',
    'El promedio de pasos diarios del paciente se encuentra por debajo del objetivo recomendado.',
    'MEDIA',
    'SEGUIMIENTO',
    '2026-06-15 09:10:00',
    NULL
),
(
    @patient_maria,
    'Mejora de actividad',
    'La paciente ha aumentado progresivamente su cantidad de pasos diarios.',
    'BAJA',
    'RESUELTA',
    '2026-06-15 09:20:00',
    '2026-06-16 10:00:00'
);

-- NOTAS CLÍNICAS

INSERT INTO patient_notes (
    patient_id,
    user_id,
    note,
    created_at
)
VALUES
(
    @patient_maria,
    @doctor_id,
    'La paciente ha mostrado una mejora en actividad física y horas de sueño.',
    '2026-06-15 10:00:00'
),
(
    @patient_carlos,
    @doctor_id,
    'Se recomienda iniciar caminatas de al menos 20 minutos diarios.',
    '2026-06-15 10:15:00'
),
(
    @patient_ana,
    @doctor_id,
    'Paciente estable en control preventivo.',
    '2026-06-17 10:30:00'
);