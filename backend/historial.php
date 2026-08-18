<?php

require_once __DIR__ . '/config/Conexion.php';

header('Content-Type: application/json');

try {

    $conexion = new Conexion();
    $db = $conexion->conectar();

    $patientId = $_GET['patient_id'] ?? null;

    if (!$patientId) {
        echo json_encode([
            "success" => false,
            "message" => "Debe indicar un paciente."
        ]);
        exit;
    }

    $sql = "SELECT
                id,
                patient_id,
                measurement_date,
                weight_kg,
                bmi,
                body_fat_percentage,
                heart_rate,
                sleep_hours,
                steps
            FROM measurements
            WHERE patient_id = ?
            ORDER BY measurement_date DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute([$patientId]);

    $historial = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $historial
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Error al consultar el historial."
    ]);
}
?>