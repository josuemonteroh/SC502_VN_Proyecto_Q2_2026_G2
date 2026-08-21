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

    /* Indicadores */

    $totalPacientes = (int) $db
        ->query("
            SELECT COUNT(*)
            FROM patients
        ")
        ->fetchColumn();

    $totalMediciones = (int) $db
        ->query("
            SELECT COUNT(*)
            FROM measurements
        ")
        ->fetchColumn();

    $alertasActivas = (int) $db
        ->query("
            SELECT COUNT(*)
            FROM alerts
            WHERE status = 'ACTIVE'
        ")
        ->fetchColumn();

    $pacientesActivos = (int) $db
        ->query("
            SELECT COUNT(*)
            FROM patients
            WHERE is_active = TRUE
        ")
        ->fetchColumn();

    $porcentajeActivos = $totalPacientes > 0
        ? (int) round(($pacientesActivos / $totalPacientes) * 100)
        : 0;

    /* Citas de hoy */

    $sqlCitasHoy = "
        SELECT
            a.id,
            a.patient_id,
            a.professional_id,
            a.appointment_date,
            a.appointment_time,
            a.appointment_type,
            a.status,
            a.reason,
            a.notes,
            p.full_name AS patient_name,
            u.full_name AS professional_name
        FROM appointments a
        INNER JOIN patients p
            ON p.id = a.patient_id
        INNER JOIN users u
            ON u.id = a.professional_id
        WHERE a.appointment_date = CURDATE()
        ORDER BY a.appointment_time ASC
    ";

    $citasHoy = $db
        ->query($sqlCitasHoy)
        ->fetchAll(PDO::FETCH_ASSOC);

    $totalCitasHoy = count($citasHoy);

    /* Pacientes recientes */

    $sqlPacientes = "
        SELECT
            p.id,
            p.full_name,
            p.age,
            p.is_active,
            MAX(m.measurement_date) AS last_control
        FROM patients p
        LEFT JOIN measurements m
            ON m.patient_id = p.id
        GROUP BY
            p.id,
            p.full_name,
            p.age,
            p.is_active,
            p.created_at
        ORDER BY p.created_at DESC
        LIMIT 5
    ";

    $pacientesRecientes = $db
        ->query($sqlPacientes)
        ->fetchAll(PDO::FETCH_ASSOC);

    /* Alertas recientes */

    $sqlAlertas = "
        SELECT
            a.id,
            a.patient_id,
            p.full_name AS patient_name,
            a.alert_type,
            a.message,
            a.status,
            a.created_at
        FROM alerts a
        INNER JOIN patients p
            ON p.id = a.patient_id
        WHERE a.status = 'ACTIVE'
        ORDER BY a.created_at DESC
        LIMIT 5
    ";

    $alertasRecientes = $db
        ->query($sqlAlertas)
        ->fetchAll(PDO::FETCH_ASSOC);

    /* Evolución de peso por paciente */

    $sqlPeso = "
        SELECT
            m.id,
            m.patient_id,
            p.full_name AS patient_name,
            m.measurement_date,
            m.weight_kg
        FROM measurements m
        INNER JOIN patients p
            ON p.id = m.patient_id
        WHERE m.weight_kg IS NOT NULL
        ORDER BY
            m.patient_id ASC,
            m.measurement_date ASC
    ";

    $peso = $db
        ->query($sqlPeso)
        ->fetchAll(PDO::FETCH_ASSOC);

    /* Pacientes por estado */

    $estadoPacientes = [
        "activos" => $pacientesActivos,
        "inactivos" => $totalPacientes - $pacientesActivos
    ];

    /* Alertas por tipo */

    $sqlTiposAlertas = "
        SELECT
            alert_type,
            COUNT(*) AS total
        FROM alerts
        GROUP BY alert_type
        ORDER BY
            total DESC,
            alert_type ASC
    ";

    $tiposAlertas = $db
        ->query($sqlTiposAlertas)
        ->fetchAll(PDO::FETCH_ASSOC);

    /* Respuesta */

    echo json_encode([
        "success" => true,

        "data" => [
            "kpis" => [
                "patients" => $totalPacientes,
                "measurements" => $totalMediciones,
                "activeAlerts" => $alertasActivas,
                "activePatientsPercentage" => $porcentajeActivos,
                "appointments" => $totalCitasHoy,
                "todayAppointments" => $totalCitasHoy
            ],

            "recentPatients" => $pacientesRecientes,

            "recentAlerts" => $alertasRecientes,

            "todayAppointments" => $citasHoy,

            "weightEvolution" => $peso,

            "patientStatus" => $estadoPacientes,

            "alertsByType" => $tiposAlertas
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    error_log(
        "[NYVORA DASHBOARD] " .
        $e->getMessage()
    );

    echo json_encode([
        "success" => false,
        "message" => "Error al cargar la información del dashboard."
    ]);
}