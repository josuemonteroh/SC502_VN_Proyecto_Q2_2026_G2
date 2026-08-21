USE nyvora_db;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

TRUNCATE TABLE patient_notes;
TRUNCATE TABLE alerts;
TRUNCATE TABLE measurements;
TRUNCATE TABLE treatments;
TRUNCATE TABLE appointments;
TRUNCATE TABLE medications;
TRUNCATE TABLE patients;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;

SET FOREIGN_KEY_CHECKS=1;

INSERT INTO roles (id, name, description) VALUES
(1, 'ADMIN', 'Administrador del sistema'),
(2, 'DOCTOR', 'Profesional de salud'),
(3, 'USER', 'Usuario del sistema');

INSERT INTO users (id, role_id, full_name, email, password_hash, is_active) VALUES
(1, 1, 'Administrador Nyvora', 'admin@nyvora.com', '$2y$12$gV/ikbUl9PECqRzydQ7oX.I0oqh0q4z.r9/bEZPXvdX0SMKGy6Rci', TRUE),
(2, 2, 'Dr. Hernandez C.', 'doctor@nyvora.com', '$2y$12$gV/ikbUl9PECqRzydQ7oX.I0oqh0q4z.r9/bEZPXvdX0SMKGy6Rci', TRUE),
(3, 3, 'Usuario de Prueba', 'usuario@nyvora.com', '$2y$12$gV/ikbUl9PECqRzydQ7oX.I0oqh0q4z.r9/bEZPXvdX0SMKGy6Rci', TRUE);

INSERT INTO patients (id, user_id, full_name, identification, age, phone, height_m, condition_general, observations, status, is_active) VALUES
(1, 1, 'Carlos Rodriguez', '1-1001-1001', 28, '8888-1001', 1.78, 'Sobrepeso moderado', 'Seguimiento preventivo de peso y actividad.', 'ACTIVO', TRUE),
(2, 1, 'Maria Gonzalez', '1-1002-1002', 35, '8888-1002', 1.65, 'Sobrepeso moderado', 'Revisar sueño y frecuencia cardiaca.', 'ACTIVO', TRUE),
(3, 1, 'Andres Vargas', '1-1003-1003', 42, '8888-1003', 1.82, 'Sobrepeso', 'Seguimiento de evolucion general.', 'ACTIVO', TRUE),
(4, 1, 'Sofia Martinez', '1-1004-1004', 24, '8888-1004', 1.70, 'Sobrepeso leve', 'Mantener actividad fisica adecuada.', 'ACTIVO', TRUE);

INSERT INTO medications (id, name, presentation, concentration, reference_dose, reference_frequency, status, observations) VALUES
(1, 'Metformina', 'Tabletas', '500 mg', '1 tableta', 'Cada 12 horas', 'ACTIVO', 'Control metabolico.'),
(2, 'Losartan', 'Tabletas', '50 mg', '1 tableta', 'Cada 24 horas', 'ACTIVO', 'Control de presion arterial.'),
(3, 'Atorvastatina', 'Tabletas', '20 mg', '1 tableta', 'Cada 24 horas', 'EN_USO', 'Control de colesterol.'),
(4, 'Omeprazol', 'Cápsulas', '20 mg', '1 cápsula', 'Cada 24 horas', 'ACTIVO', 'Proteccion gastrica.'),
(5, 'Paracetamol', 'Tabletas', '500 mg', '1 tableta', 'Cada 8 horas', 'INACTIVO', 'Medicamento de referencia.'),
(6, 'Amoxicilina', 'Cápsulas', '500 mg', '1 cápsula', 'Cada 8 horas', 'ACTIVO', 'Tratamiento antibiotico.'),
(7, 'Loratadina', 'Tabletas', '10 mg', '1 tableta', 'Cada 24 horas', 'ACTIVO', 'Control de sintomas.'),
(8, 'Amoxicilina', 'Tabletas', '500 mg', '1 cápsula', 'Cada 8 horas', 'INACTIVO', 'Registro inactivo.');

INSERT INTO treatments (id, patient_id, medication_id, name, dose, frequency, status, start_date, end_date, indications, observations) VALUES
(1, 1, 6, 'Tratamiento antibiotico', '500 mg', 'Cada 8 horas', 'ACTIVO', '2026-08-10', '2026-08-24', 'Completar el tratamiento indicado.', 'Seguimiento de respuesta.'),
(2, 2, 2, 'Control de presion arterial', '50 mg', 'Cada 24 horas', 'ACTIVO', '2026-08-05', NULL, 'Tomar a la misma hora todos los dias.', 'Control periodico.'),
(3, 1, 1, 'Control metabolico', '500 mg', 'Cada 12 horas', 'ACTIVO', '2026-08-01', NULL, 'Tomar despues de las comidas.', 'Seguimiento metabolico.'),
(4, 3, 3, 'Control de colesterol', '20 mg', 'Cada 24 horas', 'ACTIVO', '2026-07-20', '2026-08-30', 'Tomar por la noche.', 'Revisar evolucion.'),
(5, 2, 7, 'Control de sintomas', '10 mg', 'Cada 24 horas', 'SUSPENDIDO', '2026-07-15', '2026-08-05', 'Suspender segun evolucion.', 'Tratamiento suspendido.'),
(6, 4, 4, 'Proteccion gastrica', '20 mg', 'Cada 24 horas', 'COMPLETADO', '2026-07-01', '2026-08-01', 'Tomar antes del desayuno.', 'Tratamiento completado.');

INSERT INTO appointments (id, patient_id, professional_id, appointment_date, appointment_time, appointment_type, status, reason, notes) VALUES
(1, 1, 2, '2026-08-21', '09:00:00', 'CONTROL_NUTRICIONAL', 'CONFIRMADA', 'Control mensual', 'Revisar evolucion de peso.'),
(2, 2, 2, '2026-08-21', '11:00:00', 'SEGUIMIENTO_BIOMETRICO', 'PROGRAMADA', 'Seguimiento biometrico', 'Registrar nuevas metricas.'),
(3, 3, 2, '2026-08-22', '10:00:00', 'REVISION_CLINICA', 'CONFIRMADA', 'Revision clinica', 'Evaluar evolucion general.'),
(4, 4, 2, '2026-08-24', '14:00:00', 'CONTROL_NUTRICIONAL', 'PROGRAMADA', 'Control nutricional', 'Revisar habitos alimenticios.'),
(5, 1, 2, '2026-08-26', '15:00:00', 'SEGUIMIENTO_BIOMETRICO', 'PROGRAMADA', 'Control de metricas', 'Registrar peso y frecuencia cardiaca.'),
(6, 2, 2, '2026-08-15', '10:00:00', 'REVISION_CLINICA', 'COMPLETADA', 'Control realizado', 'Seguimiento completado.');

INSERT INTO measurements (id, patient_id, measurement_date, weight_kg, bmi, body_fat_percentage, heart_rate, sleep_hours, steps) VALUES
(1, 1, '2026-08-01 08:00:00', 72.90, 23.0, 22.4, 74, 7.0, 6200),
(2, 1, '2026-08-08 08:00:00', 72.70, 22.9, 22.1, 72, 7.2, 6900),
(3, 1, '2026-08-15 08:00:00', 72.50, 22.9, 21.9, 71, 7.4, 7400),
(4, 2, '2026-08-01 08:00:00', 82.80, 30.4, 35.0, 88, 5.5, 3500),
(5, 2, '2026-08-07 08:00:00', 82.40, 30.3, 34.7, 86, 5.9, 4100),
(6, 2, '2026-08-14 08:00:00', 82.00, 30.1, 34.5, 84, 6.1, 4600),
(7, 3, '2026-08-04 08:00:00', 78.60, 23.7, 23.5, 78, 6.6, 5200),
(8, 3, '2026-08-11 08:00:00', 78.20, 23.6, 23.2, 76, 7.0, 5900),
(9, 3, '2026-08-18 08:00:00', 78.00, 23.5, 23.0, 75, 7.2, 6500),
(10, 4, '2026-08-03 08:00:00', 60.90, 21.1, 22.0, 70, 7.1, 7200),
(11, 4, '2026-08-10 08:00:00', 60.70, 21.0, 21.8, 69, 7.3, 7900),
(12, 4, '2026-08-17 08:00:00', 60.50, 20.9, 21.6, 68, 7.5, 8400);

INSERT INTO alerts (id, patient_id, alert_type, message, status, created_at, resolved_at) VALUES
(1, 1, 'Weight', 'A decrease in weight was detected during the latest checkups.', 'ACTIVE', '2026-08-15 09:00:00', NULL),
(2, 2, 'Sleep', 'Few hours of sleep were recorded during the latest checkup.', 'ACTIVE', '2026-08-14 09:00:00', NULL),
(3, 2, 'Heart Rate', 'The recorded heart rate requires follow-up.', 'ACTIVE', '2026-08-14 09:10:00', NULL),
(4, 3, 'Follow-up', 'The patient shows favorable progress in recent checkups.', 'RESOLVED', '2026-08-05 09:00:00', '2026-08-10 14:30:00'),
(5, 4, 'Physical Activity', 'The patient has an adequate level of physical activity.', 'RESOLVED', '2026-08-01 09:00:00', '2026-08-03 09:00:00');

INSERT INTO patient_notes (id, patient_id, note, created_at) VALUES
(1, 1, 'Weight continues to improve with regular activity.', '2026-08-15 11:00:00'),
(2, 2, 'Improve sleep schedule and continue biometric follow-up.', '2026-08-14 11:05:00'),
(3, 3, 'Patient shows favorable progress in recent checkups.', '2026-08-18 11:10:00'),
(4, 4, 'Maintain current physical activity level.', '2026-08-17 11:15:00');

ALTER TABLE roles AUTO_INCREMENT = 4;
ALTER TABLE users AUTO_INCREMENT = 4;
ALTER TABLE patients AUTO_INCREMENT = 5;
ALTER TABLE medications AUTO_INCREMENT = 9;
ALTER TABLE treatments AUTO_INCREMENT = 7;
ALTER TABLE appointments AUTO_INCREMENT = 7;
ALTER TABLE measurements AUTO_INCREMENT = 13;
ALTER TABLE alerts AUTO_INCREMENT = 6;
ALTER TABLE patient_notes AUTO_INCREMENT = 5;
