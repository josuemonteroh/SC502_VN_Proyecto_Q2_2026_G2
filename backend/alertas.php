<?php

header("Access-Control-Allow-Origin: *");
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


    // Cambiar el estado de una alerta
    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        $alertId = filter_input(
            INPUT_POST,
            "alert_id",
            FILTER_VALIDATE_INT
        );

        $action = trim(
            $_POST["action"] ?? ""
        );


        if (!$alertId) {

            echo json_encode([
                "success" => false,
                "message" => "El ID de la alerta no es válido."
            ]);

            exit;
        }


        if (
            !in_array(
                $action,
                ["follow_up", "resolve"],
                true
            )
        ) {

            echo json_encode([
                "success" => false,
                "message" => "La acción no es válida."
            ]);

            exit;
        }


        if ($action === "follow_up") {

            $sql = "UPDATE alerts
                    SET status = 'FOLLOW_UP',
                        resolved_at = NULL
                    WHERE id = :id";

        } else {

            $sql = "UPDATE alerts
                    SET status = 'RESOLVED',
                        resolved_at = NOW()
                    WHERE id = :id";
        }


        $stmt = $db->prepare($sql);

        $stmt->execute([
            ":id" => $alertId
        ]);


        echo json_encode([
            "success" => true,
            "message" =>
                $action === "follow_up"
                    ? "La alerta ahora está en seguimiento."
                    : "La alerta fue marcada como resuelta."
        ]);

        exit;
    }


    /* Consultar alertas */

    $sql = "SELECT
                a.id,
                a.patient_id AS patientId,
                p.full_name AS patientName,
                p.identification AS patientIdentification,
                a.alert_type AS alertType,
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