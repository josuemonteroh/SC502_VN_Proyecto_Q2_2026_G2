<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}


require_once __DIR__ . "/config/Conexion.php";


try {

    $conexion = new Conexion();
    $db = $conexion->conectar();


    // Se obtiene también el nombre del paciente para mostrarlo en las alertas
    $sql = "SELECT
                a.id,
                a.patient_id AS patientId,
                p.full_name AS patientName,
                a.alert_type AS alertType,
                a.message,
                a.status,
                a.created_at AS createdAt,
                a.resolved_at AS resolvedAt

            FROM alerts a

            INNER JOIN patients p
                ON a.patient_id = p.id

            ORDER BY a.created_at DESC";


    $stmt =
        $db->prepare($sql);

    $stmt->execute();


    $alertas =
        $stmt->fetchAll(
            PDO::FETCH_ASSOC
        );


    echo json_encode([
        "success" => true,
        "data" => $alertas
    ]);


} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error al consultar las alertas.",
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