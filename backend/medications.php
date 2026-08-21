<?php

require_once __DIR__ . "/api_helpers.php";

function medicationPayload(PDO $db, int $medicationId): array {
    $statement = $db->prepare("SELECT
            m.id,
            m.name,
            m.presentation,
            m.concentration,
            m.reference_dose AS dose,
            m.reference_frequency AS frequency,
            m.status,
            m.observations,
            m.created_at AS createdAt,
            m.updated_at AS updatedAt,
            COUNT(DISTINCT CASE WHEN t.status = 'ACTIVO' THEN t.patient_id END) AS associatedPatients
        FROM medications m
        LEFT JOIN treatments t ON t.medication_id = m.id
        WHERE m.id = :id
        GROUP BY m.id");
    $statement->execute([":id" => $medicationId]);
    $medication = $statement->fetch();

    if (!$medication) {
        nyvoraRespond(404, false, "Medicamento no encontrado.");
    }

    return $medication;
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
        $presentation = trim($_GET["presentation"] ?? "");

        if ($search !== "") {
            $where[] = "(m.name LIKE :search OR m.presentation LIKE :search OR m.concentration LIKE :search OR m.reference_dose LIKE :search OR m.reference_frequency LIKE :search)";
            $parameters[":search"] = "%{$search}%";
        }

        if ($status !== "") {
            $where[] = "m.status = :status";
            $parameters[":status"] = nyvoraChoice($status, "estado", ["ACTIVO", "EN_USO", "INACTIVO"]);
        }

        if ($presentation !== "") {
            $where[] = "m.presentation = :presentation";
            $parameters[":presentation"] = $presentation;
        }

        $sql = "SELECT
                m.id,
                m.name,
                m.presentation,
                m.concentration,
                m.reference_dose AS dose,
                m.reference_frequency AS frequency,
                m.status,
                m.observations,
                m.created_at AS createdAt,
                m.updated_at AS updatedAt,
                COUNT(DISTINCT CASE WHEN t.status = 'ACTIVO' THEN t.patient_id END) AS associatedPatients
            FROM medications m
            LEFT JOIN treatments t ON t.medication_id = m.id";

        if ($where) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }

        $sql .= " GROUP BY m.id ORDER BY m.name";
        $statement = $db->prepare($sql);
        $statement->execute($parameters);
        $medications = $statement->fetchAll();
        $kpis = $db->query("SELECT
                COUNT(*) AS total,
                SUM(status = 'ACTIVO') AS active,
                SUM(status = 'EN_USO') AS inUse,
                SUM(status = 'INACTIVO') AS inactive
            FROM medications")->fetch();

        nyvoraRespond(200, true, "", [
            "data" => $medications,
            "kpis" => [
                "total" => (int) $kpis["total"],
                "active" => (int) $kpis["active"],
                "inUse" => (int) $kpis["inUse"],
                "inactive" => (int) $kpis["inactive"]
            ]
        ]);
    }

    $data = nyvoraRequestData();

    if ($method === "PATCH" || $method === "DELETE") {
        $medicationId = nyvoraRecordId($data);
        $status = $method === "DELETE" ? "INACTIVO" : nyvoraChoice($data["status"] ?? "", "estado", ["ACTIVO", "EN_USO", "INACTIVO"]);
        $statement = $db->prepare("UPDATE medications SET status = :status WHERE id = :id");
        $statement->execute([":status" => $status, ":id" => $medicationId]);
        nyvoraRespond(200, true, "Estado del medicamento actualizado correctamente.", ["data" => medicationPayload($db, $medicationId)]);
    }

    nyvoraMethod(["POST", "PUT"]);
    $payload = [
        ":name" => nyvoraText($data["name"] ?? null, "nombre", true, 120),
        ":presentation" => nyvoraText($data["presentation"] ?? null, "presentación", true, 50),
        ":concentration" => nyvoraText($data["concentration"] ?? null, "concentración", true, 80),
        ":reference_dose" => nyvoraText($data["dose"] ?? null, "dosis", false, 120),
        ":reference_frequency" => nyvoraText($data["frequency"] ?? null, "frecuencia", false, 120),
        ":status" => nyvoraChoice($data["status"] ?? "ACTIVO", "estado", ["ACTIVO", "EN_USO", "INACTIVO"]),
        ":observations" => nyvoraText($data["observations"] ?? null, "observaciones")
    ];

    if ($method === "POST") {
        $statement = $db->prepare("INSERT INTO medications (
                name, presentation, concentration, reference_dose,
                reference_frequency, status, observations
            ) VALUES (
                :name, :presentation, :concentration, :reference_dose,
                :reference_frequency, :status, :observations
            )");
        $statement->execute($payload);
        nyvoraRespond(201, true, "Medicamento registrado correctamente.", ["data" => medicationPayload($db, (int) $db->lastInsertId())]);
    }

    $medicationId = nyvoraRecordId($data);
    $payload[":id"] = $medicationId;
    $statement = $db->prepare("UPDATE medications SET
            name = :name,
            presentation = :presentation,
            concentration = :concentration,
            reference_dose = :reference_dose,
            reference_frequency = :reference_frequency,
            status = :status,
            observations = :observations
        WHERE id = :id");
    $statement->execute($payload);
    nyvoraRespond(200, true, "Medicamento actualizado correctamente.", ["data" => medicationPayload($db, $medicationId)]);
} catch (Throwable $error) {
    nyvoraHandleDatabaseException($error);
}