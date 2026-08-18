<?php

require_once __DIR__ . '/config/Conexion.php';

header('Content-Type: application/json');

try {

    $conexion = new Conexion();
    $db = $conexion->conectar();

    $sql = "SELECT
                a.id,
                a.patient_id AS patientId,
                p.full_name AS patientName,
                a.alert_type AS type,
                a.message,
                a.status,
                a.created_at AS createdAt,
                a.resolved_at AS resolvedAt
            FROM alerts a
            INNER JOIN patients p
                ON a.patient_id = p.id
            ORDER BY a.created_at DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute();

    $alertas = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $alertas
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Error al consultar las alertas."
    ]);
}
?>