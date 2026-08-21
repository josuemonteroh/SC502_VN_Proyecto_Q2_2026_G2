<?php

require_once __DIR__ . "/api_helpers.php";

function treatmentPayload(PDO $db, int $treatmentId): array {
    $statement = $db->prepare("SELECT
            t.id,
            t.patient_id AS patientId,
            p.full_name AS patientName,
            p.identification AS patientIdentification,
            t.medication_id AS medicationId,
            m.name AS medicationName,
            m.presentation AS medicationPresentation,
            m.concentration AS medicationConcentration,
            t.name,
            t.dose,
            t.frequency,
            t.status,
            t.start_date AS startDate,
            t.end_date AS endDate,
            t.indications,
            t.observations,
            t.created_at AS createdAt,
            t.updated_at AS updatedAt
        FROM treatments t
        INNER JOIN patients p ON p.id = t.patient_id
        LEFT JOIN medications m ON m.id = t.medication_id
        WHERE t.id = :id");
    $statement->execute([":id" => $treatmentId]);
    $treatment = $statement->fetch();

    if (!$treatment) {
        nyvoraRespond(404, false, "Tratamiento no encontrado.");
    }

    return $treatment;
}

nyvoraApiStart();

try {
    $db = nyvoraDatabase();
    $method = $_SERVER["REQUEST_METHOD"];

    if ($method === "GET") {
        $where = [];
        $parameters = [];
        $search = trim($_GET["search"] ?? "");
        $status = trim($_GET["status"] ?? "");

        if ($search !== "") {
            $where[] = "(t.name LIKE :search OR p.full_name LIKE :search OR p.identification LIKE :search OR m.name LIKE :search OR m.presentation LIKE :search OR m.concentration LIKE :search)";
            $parameters[":search"] = "%{$search}%";
        }

        if ($status !== "") {
            $where[] = "t.status = :status";
            $parameters[":status"] = nyvoraChoice($status, "estado", ["ACTIVO", "PENDIENTE", "COMPLETADO", "SUSPENDIDO"]);
        }

        $sql = "SELECT
                t.id,
                t.patient_id AS patientId,
                p.full_name AS patientName,
                p.identification AS patientIdentification,
                t.medication_id AS medicationId,
                m.name AS medicationName,
                m.presentation AS medicationPresentation,
                m.concentration AS medicationConcentration,
                t.name,
                t.dose,
                t.frequency,
                t.status,
                t.start_date AS startDate,
                t.end_date AS endDate,
                t.indications,
                t.observations,
                t.created_at AS createdAt,
                t.updated_at AS updatedAt
            FROM treatments t
            INNER JOIN patients p ON p.id = t.patient_id
            LEFT JOIN medications m ON m.id = t.medication_id";

        if ($where) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }

        $sql .= " ORDER BY t.start_date DESC, t.id DESC";
        $statement = $db->prepare($sql);
        $statement->execute($parameters);
        $treatments = $statement->fetchAll();
        $kpis = $db->query("SELECT
                SUM(status = 'ACTIVO') AS active,
                SUM(status = 'ACTIVO' AND end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)) AS ending,
                SUM(status = 'COMPLETADO') AS completed,
                SUM(status = 'SUSPENDIDO') AS suspended
            FROM treatments")->fetch();

        nyvoraRespond(200, true, "", [
            "data" => $treatments,
            "kpis" => [
                "active" => (int) $kpis["active"],
                "ending" => (int) $kpis["ending"],
                "completed" => (int) $kpis["completed"],
                "suspended" => (int) $kpis["suspended"]
            ]
        ]);
    }

    $data = nyvoraRequestData();

    if ($method === "DELETE") {
        $treatmentId = nyvoraRecordId($data);
        $statement = $db->prepare("UPDATE treatments SET status = 'SUSPENDIDO' WHERE id = :id");
        $statement->execute([":id" => $treatmentId]);
        nyvoraRespond(200, true, "Tratamiento suspendido correctamente.", ["data" => treatmentPayload($db, $treatmentId)]);
    }

    nyvoraMethod(["POST", "PUT"]);
    $patientId = nyvoraInteger($data["patientId"] ?? null, "paciente");
    $patient = $db->prepare("SELECT id FROM patients WHERE id = :id AND is_active = TRUE");
    $patient->execute([":id" => $patientId]);

    if (!$patient->fetchColumn()) {
        nyvoraRespond(422, false, "El paciente seleccionado no está disponible.");
    }

    $medicationId = nyvoraInteger($data["medicationId"] ?? null, "medicamento", false);

    if ($medicationId !== null) {
        $medication = $db->prepare("SELECT id FROM medications WHERE id = :id AND status != 'INACTIVO'");
        $medication->execute([":id" => $medicationId]);

        if (!$medication->fetchColumn()) {
            nyvoraRespond(422, false, "El medicamento seleccionado no está disponible.");
        }
    }

    $startDate = nyvoraDate($data["startDate"] ?? null, "fecha de inicio");
    $endDate = trim((string) ($data["endDate"] ?? ""));

    if ($endDate !== "") {
        $endDate = nyvoraDate($endDate, "fecha de finalización");

        if ($endDate < $startDate) {
            nyvoraRespond(422, false, "La fecha de finalización no puede ser anterior al inicio.");
        }
    } else {
        $endDate = null;
    }

    $payload = [
        ":patient_id" => $patientId,
        ":medication_id" => $medicationId,
        ":name" => nyvoraText($data["name"] ?? null, "nombre", true, 150),
        ":dose" => nyvoraText($data["dose"] ?? null, "dosis", false, 120),
        ":frequency" => nyvoraText($data["frequency"] ?? null, "frecuencia", false, 120),
        ":status" => nyvoraChoice($data["status"] ?? "ACTIVO", "estado", ["ACTIVO", "PENDIENTE", "COMPLETADO", "SUSPENDIDO"]),
        ":start_date" => $startDate,
        ":end_date" => $endDate,
        ":indications" => nyvoraText($data["indications"] ?? null, "indicaciones"),
        ":observations" => nyvoraText($data["observations"] ?? null, "observaciones")
    ];

    if ($method === "POST") {
        $statement = $db->prepare("INSERT INTO treatments (
                patient_id, medication_id, name, dose, frequency, status,
                start_date, end_date, indications, observations
            ) VALUES (
                :patient_id, :medication_id, :name, :dose, :frequency, :status,
                :start_date, :end_date, :indications, :observations
            )");
        $statement->execute($payload);
        nyvoraRespond(201, true, "Tratamiento registrado correctamente.", ["data" => treatmentPayload($db, (int) $db->lastInsertId())]);
    }

    $treatmentId = nyvoraRecordId($data);
    $payload[":id"] = $treatmentId;
    $statement = $db->prepare("UPDATE treatments SET
            patient_id = :patient_id,
            medication_id = :medication_id,
            name = :name,
            dose = :dose,
            frequency = :frequency,
            status = :status,
            start_date = :start_date,
            end_date = :end_date,
            indications = :indications,
            observations = :observations
        WHERE id = :id");
    $statement->execute($payload);
    nyvoraRespond(200, true, "Tratamiento actualizado correctamente.", ["data" => treatmentPayload($db, $treatmentId)]);
} catch (Throwable $error) {
    nyvoraHandleDatabaseException($error);
}