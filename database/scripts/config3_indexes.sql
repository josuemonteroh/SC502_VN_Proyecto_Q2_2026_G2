-- Índice para consultar el historial de métricas
-- de un paciente ordenado por fecha.
USE nyvora_db;

-- Usuarios

CREATE INDEX idx_users_role
ON users(role_id);

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_users_active
ON users(is_active);

-- Pacientes

CREATE INDEX idx_patients_user
ON patients(user_id);

CREATE INDEX idx_patients_full_name
ON patients(full_name);

CREATE INDEX idx_patients_identification
ON patients(identification);

CREATE INDEX idx_patients_status
ON patients(status);

CREATE INDEX idx_patients_active
ON patients(is_active);

-- Medicamentos

CREATE INDEX idx_medications_name
ON medications(name);

CREATE INDEX idx_medications_presentation
ON medications(presentation);

CREATE INDEX idx_medications_status
ON medications(status);

-- Citas

CREATE INDEX idx_appointments_patient
ON appointments(patient_id);

CREATE INDEX idx_appointments_user
ON appointments(user_id);

CREATE INDEX idx_appointments_date
ON appointments(appointment_date);

CREATE INDEX idx_appointments_status
ON appointments(status);

CREATE INDEX idx_appointments_patient_date
ON appointments(patient_id, appointment_date);

-- Métricas

CREATE INDEX idx_measurements_patient
ON measurements(patient_id);

CREATE INDEX idx_measurements_date
ON measurements(measurement_date);

CREATE INDEX idx_measurements_patient_date
ON measurements(patient_id, measurement_date);

-- Tratamientos

CREATE INDEX idx_treatments_patient
ON treatments(patient_id);

CREATE INDEX idx_treatments_medication
ON treatments(medication_id);

CREATE INDEX idx_treatments_status
ON treatments(status);

CREATE INDEX idx_treatments_dates
ON treatments(start_date, end_date);

-- Alertas

CREATE INDEX idx_alerts_patient
ON alerts(patient_id);

CREATE INDEX idx_alerts_priority
ON alerts(priority);

CREATE INDEX idx_alerts_status
ON alerts(status);

CREATE INDEX idx_alerts_patient_status
ON alerts(patient_id, status);

CREATE INDEX idx_alerts_created_at
ON alerts(created_at);

-- Notas clínicas

CREATE INDEX idx_patient_notes_patient
ON patient_notes(patient_id);

CREATE INDEX idx_patient_notes_user
ON patient_notes(user_id);

CREATE INDEX idx_patient_notes_created_at
ON patient_notes(created_at);