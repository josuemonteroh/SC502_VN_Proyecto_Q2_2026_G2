<?php

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

$origenesPermitidos = [
    "http://localhost:8080"
];

if (in_array($origin, $origenesPermitidos, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Max-Age: 86400");
    header("Vary: Origin");
}

header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}


require_once __DIR__ . "/config/Conexion.php";


try {

    $conexion = new Conexion();
    $db = $conexion->conectar();


    // Si no se recibe un paciente, devuelve la lista para llenar el buscador
    if (!isset($_GET["patient_id"])) {

        $sql = "SELECT
                    id,
                    full_name AS fullName,
                    age,
                    condition_general AS conditionGeneral,
                    observations,
                    is_active AS isActive,
                    identification,
                    phone
                FROM patients
                WHERE is_active = 1
                ORDER BY full_name ASC";

        $stmt = $db->prepare($sql);
        $stmt->execute();

        $pacientes =
            $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $pacientes
        ]);

        exit;
    }


    $patientId = filter_input(
        INPUT_GET,
        "patient_id",
        FILTER_VALIDATE_INT
    );


    if (!$patientId) {

        echo json_encode([
            "success" => false,
            "message" => "El ID del paciente no es válido."
        ]);

        exit;
    }


    $sqlPaciente = "SELECT
                        id,
                        full_name AS fullName,
                        age,
                        condition_general AS conditionGeneral,
                        observations,
                        is_active AS isActive,
                        identification,
                        phone
                    FROM patients
                    WHERE id = :patient_id";

    $stmtPaciente =
        $db->prepare($sqlPaciente);

    $stmtPaciente->execute([
        ":patient_id" => $patientId
    ]);

    $paciente =
        $stmtPaciente->fetch(
            PDO::FETCH_ASSOC
        );


    if (!$paciente) {

        echo json_encode([
            "success" => false,
            "message" => "Paciente no encontrado."
        ]);

        exit;
    }


    $sqlMediciones = "SELECT
                        id,
                        patient_id AS patientId,
                        measurement_date AS measurementDate,
                        weight_kg AS weightKg,
                        bmi,
                        body_fat_percentage AS bodyFatPercentage,
                        heart_rate AS heartRate,
                        sleep_hours AS sleepHours,
                        steps
                      FROM measurements
                      WHERE patient_id = :patient_id
                      ORDER BY measurement_date DESC";

    $stmtMediciones =
        $db->prepare($sqlMediciones);

    $stmtMediciones->execute([
        ":patient_id" => $patientId
    ]);

    $mediciones =
        $stmtMediciones->fetchAll(
            PDO::FETCH_ASSOC
        );


    $sqlNotas = "SELECT
                    id,
                    note,
                    created_at AS createdAt
                 FROM patient_notes
                 WHERE patient_id = :patient_id
                 ORDER BY created_at DESC";

    $stmtNotas =
        $db->prepare($sqlNotas);

    $stmtNotas->execute([
        ":patient_id" => $patientId
    ]);

    $notas =
        $stmtNotas->fetchAll(
            PDO::FETCH_ASSOC
        );


    echo json_encode([
        "success" => true,
        "patient" => $paciente,
        "measurements" => $mediciones,
        "notes" => $notas
    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error de base de datos.",
        "error" => $e->getMessage()
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error interno del servidor.",
        "error" => $e->getMessage()
    ]);
}