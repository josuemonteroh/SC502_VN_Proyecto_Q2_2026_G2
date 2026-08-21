<?php
require __DIR__ . '/config/Conexion.php';

$errores = [];
$exito = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $password2 = $_POST['password2'] ?? '';

    // Validaciones del lado del servidor
    if (empty($nombre)) $errores[] = 'El nombre es obligatorio.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errores[] = 'El correo no es válido.';
    if (strlen($password) < 6) $errores[] = 'La contraseña debe tener al menos 6 caracteres.';
    if ($password !== $password2) $errores[] = 'Las contraseñas no coinciden.';

    if (empty($errores)) {
        try {
            // La conexión nunca se creaba: $pdo no existía y cualquier
            // registro válido terminaba en un error fatal (500).
            $conexion = new Conexion();
            $pdo = $conexion->conectar();

            // Verificar si el correo ya existe
            $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
            $stmt->execute([$email]);

            if ($stmt->fetch()) {
                $errores[] = 'Ese correo ya está registrado.';
            } else {
                // Buscar el id del rol "USER"
                $stmtRol = $pdo->prepare('SELECT id FROM roles WHERE name = ?');
                $stmtRol->execute(['USER']);
                $rol = $stmtRol->fetch();

                if (!$rol) {
                    $errores[] = 'No se encontró el rol USER. Verifica que roles.sql se haya ejecutado.';
                } else {

                    // Hashea la contraseña antes de guardarla
                    $hash = password_hash($password, PASSWORD_DEFAULT);

                    $stmt = $pdo->prepare('INSERT INTO users (role_id, full_name, email, password_hash) VALUES (?, ?, ?, ?)');
                    $stmt->execute([$rol['id'], $nombre, $email, $hash]);

                    $exito = true;
                }
            }
        } catch (PDOException $e) {
            $errores[] = 'Error de conexión con la base de datos.';
        }
    }
}
?>