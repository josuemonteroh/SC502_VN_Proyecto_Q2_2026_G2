USE nyvora_db;
-- Índice para consultar el historial de métricas
-- de un paciente ordenado por fecha.
CREATE INDEX idx_measurements_patient_date
ON measurements(patient_id, measurement_date);


-- Índice para consultar alertas por paciente.
CREATE INDEX idx_alerts_patient
ON alerts(patient_id);


-- Índice para buscar alertas activas o resueltas.
CREATE INDEX idx_alerts_status
ON alerts(status);


-- Índice para consultar notas de un paciente.
CREATE INDEX idx_patient_notes_patient
ON patient_notes(patient_id);


-- Índices para agenda de citas.
CREATE INDEX idx_appointments_date_status
ON appointments(appointment_date, status);

CREATE INDEX idx_appointments_patient
ON appointments(patient_id);


-- Índices para listados y filtros de medicamentos.
CREATE INDEX idx_medications_status
ON medications(status);

CREATE INDEX idx_medications_name
ON medications(name);


-- Índices para tratamientos por paciente, estado y medicamento.
CREATE INDEX idx_treatments_patient
ON treatments(patient_id);

CREATE INDEX idx_treatments_medication
ON treatments(medication_id);

CREATE INDEX idx_treatments_status_dates
ON treatments(status, start_date, end_date);