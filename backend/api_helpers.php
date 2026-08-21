<?php

require_once __DIR__ . "/config/Conexion.php";

function nyvoraApiStart(): void {
    $origin = $_SERVER["HTTP_ORIGIN"] ?? "";

    if ($origin === "http://localhost:8080") {
        header("Access-Control-Allow-Origin: " . $origin);
        header("Access-Control-Allow-Credentials: true");
        header("Vary: Origin");
    }

    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json; charset=UTF-8");

    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(204);
        exit;
    }

    session_start();

    if (empty($_SESSION["usuario_id"])) {
        nyvoraRespond(401, false, "No hay sesión activa.");
    }
}

function nyvoraDatabase(): PDO {
    $conexion = new Conexion();
    return $conexion->conectar();
}

function nyvoraRequestData(): array {
    $contentType = $_SERVER["CONTENT_TYPE"] ?? "";

    if (stripos($contentType, "application/json") !== false) {
        $data = json_decode(file_get_contents("php://input"), true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
            nyvoraRespond(400, false, "El cuerpo de la solicitud no es válido.");
        }

        return $data;
    }

    return $_POST;
}

function nyvoraRespond(int $status, bool $success, string $message = "", array $payload = []): void {
    http_response_code($status);

    $response = array_merge([
        "success" => $success
    ], $payload);

    if ($message !== "") {
        $response["message"] = $message;
    }

    echo json_encode($response);
    exit;
}

function nyvoraMethod(array $methods): void {
    if (!in_array($_SERVER["REQUEST_METHOD"], $methods, true)) {
        nyvoraRespond(405, false, "Método no permitido.");
    }
}

function nyvoraInteger($value, string $field, bool $required = true): ?int {
    if ($value === null || $value === "") {
        if ($required) {
            nyvoraRespond(422, false, "El campo {$field} es obligatorio.");
        }

        return null;
    }

    $integer = filter_var($value, FILTER_VALIDATE_INT);

    if ($integer === false) {
        nyvoraRespond(422, false, "El campo {$field} no es válido.");
    }

    return $integer;
}

function nyvoraDecimal($value, string $field, bool $required = false): ?float {
    if ($value === null || $value === "") {
        if ($required) {
            nyvoraRespond(422, false, "El campo {$field} es obligatorio.");
        }

        return null;
    }

    if (!is_numeric($value)) {
        nyvoraRespond(422, false, "El campo {$field} no es válido.");
    }

    return (float) $value;
}

function nyvoraText($value, string $field, bool $required = false, int $maxLength = 0): ?string {
    $text = trim((string) ($value ?? ""));

    if ($required && $text === "") {
        nyvoraRespond(422, false, "El campo {$field} es obligatorio.");
    }

    if ($maxLength > 0 && mb_strlen($text) > $maxLength) {
        nyvoraRespond(422, false, "El campo {$field} excede la longitud permitida.");
    }

    return $text === "" ? null : $text;
}

function nyvoraChoice($value, string $field, array $allowed): string {
    $choice = strtoupper(trim((string) $value));

    if (!in_array($choice, $allowed, true)) {
        nyvoraRespond(422, false, "El campo {$field} no es válido.");
    }

    return $choice;
}

function nyvoraDate($value, string $field): string {
    $date = trim((string) $value);
    $parsed = DateTime::createFromFormat("Y-m-d", $date);

    if (!$parsed || $parsed->format("Y-m-d") !== $date) {
        nyvoraRespond(422, false, "El campo {$field} no es válido.");
    }

    return $date;
}

function nyvoraTime($value, string $field): string {
    $time = trim((string) $value);
    $parsed = DateTime::createFromFormat("H:i", $time);

    if (!$parsed || $parsed->format("H:i") !== $time) {
        nyvoraRespond(422, false, "El campo {$field} no es válido.");
    }

    return $time . ":00";
}

function nyvoraRecordId(array $data): int {
    return nyvoraInteger($data["id"] ?? $_GET["id"] ?? null, "id");
}

function nyvoraHandleDatabaseException(Throwable $error): void {
    if ($error instanceof PDOException && $error->getCode() === "23000") {
        nyvoraRespond(409, false, "El registro ya existe o tiene información relacionada.");
    }

    nyvoraRespond(500, false, "No fue posible completar la operación.");
}