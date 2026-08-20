<?php

session_start();

require_once __DIR__ . "/config/Conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: http://localhost:8080/login.html");
    exit;
}

$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

if ($email === "" || $password === "") {
    header("Location: http://localhost:8080/login.html?error=campos");
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: http://localhost:8080/login.html?error=email");
    exit;
}

try {

    $conexion = new Conexion();
    $db = $conexion->conectar();

    $sql = "SELECT
                u.id,
                u.full_name,
                u.email,
                u.password_hash,
                u.is_active,
                r.name AS role
            FROM users u
            INNER JOIN roles r
                ON r.id = u.role_id
            WHERE u.email = :email
            LIMIT 1";

    $stmt = $db->prepare($sql);

    $stmt->execute([
        ":email" => $email
    ]);

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        header("Location: http://localhost:8080/login.html?error=credenciales");
        exit;
    }

    if (!$usuario["is_active"]) {
        header("Location: http://localhost:8080/login.html?error=inactivo");
        exit;
    }

    if (!password_verify($password, $usuario["password_hash"])) {
        header("Location: http://localhost:8080/login.html?error=credenciales");
        exit;
    }

    session_regenerate_id(true);

    $_SESSION["usuario_id"] = $usuario["id"];
    $_SESSION["usuario_nombre"] = $usuario["full_name"];
    $_SESSION["usuario_email"] = $usuario["email"];
    $_SESSION["usuario_rol"] = $usuario["role"];

    header("Location: http://localhost:8080/pages/dashboard.html");
    exit;

} catch (PDOException $e) {

    header("Location: http://localhost:8080/login.html?error=servidor");
    exit;
}