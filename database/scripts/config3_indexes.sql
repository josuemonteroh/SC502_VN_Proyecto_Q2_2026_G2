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