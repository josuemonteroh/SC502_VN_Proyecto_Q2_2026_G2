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
    header("Vary: Origin");
}

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

session_start();

if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "No hay sesión activa."
    ]);

    exit;
}

require_once __DIR__ . "/config/Conexion.php";

try {
    $conexion = new Conexion();
    $db = $conexion->conectar();

    $sql = "SELECT
                u.id,
                u.full_name,
                u.email,
                u.created_at,
                r.name AS role
            FROM users u
            INNER JOIN roles r
                ON r.id = u.role_id
            WHERE u.id = :id
            LIMIT 1";

    $stmt = $db->prepare($sql);

    $stmt->execute([
        ":id" => $_SESSION["usuario_id"]
    ]);

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Usuario no encontrado."
        ]);

        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => [
            "id" => $usuario["id"],
            "fullName" => $usuario["full_name"],
            "email" => $usuario["email"],
            "role" => $usuario["role"],
            "createdAt" => $usuario["created_at"]
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Error de base de datos.",
        "error" => $e->getMessage()
    ]);
}