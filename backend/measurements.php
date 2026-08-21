<?php

require_once __DIR__ . "/api_helpers.php";

nyvoraApiStart();

try {
    $db = nyvoraDatabase();

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $where = [];
        $parameters = [];
        $patientId = $_GET["patientId"] ?? "";
        $dateFrom = $_GET["dateFrom"] ?? "";
        $dateTo = $_GET["dateTo"] ?? "";

        if ($patientId !== "") {
            $where[] = "m.patient_id = :patient_id";
            $parameters[":patient_id"] = nyvoraInteger($patientId, "paciente");
        }

        if ($dateFrom !== "") {
            $where[] = "DATE(m.measurement_date) >= :date_from";
            $parameters[":date_from"] = nyvoraDate($dateFrom, "fecha inicial");
        }

        if ($dateTo !== "") {
            $where[] = "DATE(m.measurement_date) <= :date_to";
            $parameters[":date_to"] = nyvoraDate($dateTo, "fecha final");
        }

        $sql = "SELECT
                m.id,
                m.patient_id AS patientId,
                p.full_name AS patientName,
                p.identification AS patientIdentification,
                m.measurement_date AS measurementDate,
                m.weight_kg AS weightKg,
                m.bmi,
                m.body_fat_percentage AS bodyFatPercentage,
                m.heart_rate AS heartRate,
                m.sleep_hours AS sleepHours,
                m.steps,
                m.created_at AS createdAt
            FROM measurements m
            INNER JOIN patients p ON p.id = m.patient_id";

        if ($where) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }

        $sql .= " ORDER BY m.measurement_date DESC";
        $statement = $db->prepare($sql);
        $statement->execute($parameters);
        $measurements = $statement->fetchAll();
        $kpis = $db->query("SELECT
                COUNT(*) AS total,
                COUNT(DISTINCT patient_id) AS patients,
                SUM(DATE(measurement_date) = CURDATE()) AS today,
                MAX(measurement_date) AS latest
            FROM measurements")->fetch();

        nyvoraRespond(200, true, "", [
            "data" => $measurements,
            "kpis" => [
                "total" => (int) $kpis["total"],
                "patients" => (int) $kpis["patients"],
                "today" => (int) $kpis["today"],
                "latest" => $kpis["latest"]
            ]
        ]);
    }

    nyvoraMethod(["POST"]);
    $data = nyvoraRequestData();
    $patientId = nyvoraInteger($data["patientId"] ?? null, "paciente");
    $weight = nyvoraDecimal($data["weightKg"] ?? null, "peso", true);

    if ($weight <= 0 || $weight > 500) {
        nyvoraRespond(422, false, "El peso no se encuentra en el rango permitido.");
    }

    $patientStatement = $db->prepare("SELECT height_m FROM patients WHERE id = :id AND is_active = TRUE");
    $patientStatement->execute([":id" => $patientId]);
    $height = $patientStatement->fetchColumn();

    if (!$height) {
        nyvoraRespond(422, false, "El paciente debe tener una estatura registrada para calcular el IMC.");
    }

    $bmi = round($weight / ((float) $height * (float) $height), 2);
    $measurementDate = trim((string) ($data["measurementDate"] ?? ""));

    if ($measurementDate === "") {
        $measurementDate = date("Y-m-d H:i:s");
    } else {
        $timestamp = strtotime($measurementDate);

        if ($timestamp === false) {
            nyvoraRespond(422, false, "La fecha de medición no es válida.");
        }

        $measurementDate = date("Y-m-d H:i:s", $timestamp);
    }

    $statement = $db->prepare("INSERT INTO measurements (
            patient_id, measurement_date, weight_kg, bmi, body_fat_percentage,
            heart_rate, sleep_hours, steps
        ) VALUES (
            :patient_id, :measurement_date, :weight_kg, :bmi, :body_fat_percentage,
            :heart_rate, :sleep_hours, :steps
        )");
    $statement->execute([
        ":patient_id" => $patientId,
        ":measurement_date" => $measurementDate,
        ":weight_kg" => $weight,
        ":bmi" => $bmi,
        ":body_fat_percentage" => nyvoraDecimal($data["bodyFatPercentage"] ?? null, "grasa corporal"),
        ":heart_rate" => nyvoraInteger($data["heartRate"] ?? null, "frecuencia cardíaca", false),
        ":sleep_hours" => nyvoraDecimal($data["sleepHours"] ?? null, "horas de sueño"),
        ":steps" => nyvoraInteger($data["steps"] ?? null, "pasos", false)
    ]);

    $measurementId = (int) $db->lastInsertId();
    $statement = $db->prepare("SELECT id, patient_id AS patientId, measurement_date AS measurementDate,
            weight_kg AS weightKg, bmi, body_fat_percentage AS bodyFatPercentage,
            heart_rate AS heartRate, sleep_hours AS sleepHours, steps, created_at AS createdAt
        FROM measurements WHERE id = :id");
    $statement->execute([":id" => $measurementId]);

    nyvoraRespond(201, true, "Métricas registradas correctamente.", ["data" => $statement->fetch()]);
} catch (Throwable $error) {
    nyvoraHandleDatabaseException($error);
}