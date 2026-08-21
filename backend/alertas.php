<?php

header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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


    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        $alertId =
            filter_input(
                INPUT_POST,
                "alert_id",
                FILTER_VALIDATE_INT
            );

        $accion =
            $_POST["action"] ?? "";


        if (!$alertId) {

            echo json_encode([
                "success" => false,
                "message" => "ID de alerta no válido."
            ]);

            exit;
        }


        if (
            $accion !== "follow_up" &&
            $accion !== "resolve"
        ) {

            echo json_encode([
                "success" => false,
                "message" => "Acción no válida."
            ]);

            exit;
        }


        if ($accion === "follow_up") {

            $sql = "UPDATE alerts
                    SET status = 'FOLLOW_UP',
                        resolved_at = NULL
                    WHERE id = :id";

            $stmt =
                $db->prepare($sql);

            $stmt->execute([
                ":id" => $alertId
            ]);


            echo json_encode([
                "success" => true,
                "message" =>
                    "La alerta pasó a seguimiento."
            ]);

            exit;
        }


        if ($accion === "resolve") {

            $sql = "UPDATE alerts
                    SET status = 'RESOLVED',
                        resolved_at = NOW()
                    WHERE id = :id";

            $stmt =
                $db->prepare($sql);

            $stmt->execute([
                ":id" => $alertId
            ]);


            echo json_encode([
                "success" => true,
                "message" =>
                    "La alerta fue resuelta."
            ]);

            exit;
        }
    }


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
        "message" =>
            "Error de base de datos.",
        "error" =>
            $e->getMessage()
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" =>
            "Error interno del servidor.",
        "error" =>
            $e->getMessage()
    ]);
}