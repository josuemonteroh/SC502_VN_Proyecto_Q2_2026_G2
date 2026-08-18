<?php
session_start();

require __DIR__ . '/config/Conexion.php';

if (!empty($_SESSION['usuario_id'])) {
    header('Location: ../frontend/pages/dashboard.html');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $error = 'Completa todos los campos.';
    } else {
        $stmt = $pdo->prepare(
            'SELECT users.id, users.full_name, users.email, users.password_hash, roles.name AS rol
             FROM users
             JOIN roles ON roles.id = users.role_id
             WHERE users.email = ?
             AND users.is_active = 1'
        );

        $stmt->execute([$email]);
        $usuario = $stmt->fetch();

        if ($usuario && password_verify($password, $usuario['password_hash'])) {
            session_regenerate_id(true);

            $_SESSION['usuario_id'] = $usuario['id'];
            $_SESSION['usuario_nombre'] = $usuario['full_name'];
            $_SESSION['usuario_email'] = $usuario['email'];
            $_SESSION['usuario_rol'] = $usuario['rol'];

            header('Location: ../frontend/pages/dashboard.html');
            exit;
        } else {
            $error = 'Correo o contraseña incorrectos.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Error de inicio de sesión</title>
</head>
<body>
    <h2>No se pudo iniciar sesión</h2>

    <p><?php echo htmlspecialchars($error); ?></p>

    <a href="../frontend/login.html">Volver al login</a>
</body>
</html>