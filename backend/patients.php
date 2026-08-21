<?php

require_once __DIR__ . "/api_helpers.php";

nyvoraApiStart();

function patientPayload(PDO $db, int $patientId): array
{
    // Obtiene toda la información de un paciente junto con su primera y última medición.
    $statement = $db->prepare("
        SELECT
            p.id,
            p.full_name AS fullName,
            p.identification,
            p.age,
            p.phone,
            p.height_m AS heightM,
            p.condition_general AS conditionGeneral,
            p.observations,
            p.status,
            p.is_active AS isActive,
            p.created_at AS createdAt,
            p.updated_at AS updatedAt,

            (
                SELECT m.weight_kg
                FROM measurements m
                WHERE m.patient_id = p.id
                ORDER BY m.measurement_date ASC
                LIMIT 1
            ) AS initialWeightKg,

            (
                SELECT MAX(m.measurement_date)
                FROM measurements m
                WHERE m.patient_id = p.id
            ) AS lastMeasurementDate

        FROM patients p
        WHERE p.id = :id
    ");

    $statement->execute([
        ":id" => $patientId
    ]);

    $patient = $statement->fetch();

    if (!$patient) {
        nyvoraRespond(
            404,
            false,
            "Paciente no encontrado."
        );
    }

    return $patient;
}

function patientList(PDO $db): array
{
    $search = trim(
        $_GET["search"] ?? ""
    );

    $status = trim(
        $_GET["status"] ?? ""
    );

    $order = $_GET["order"] ?? "name";

    // Define las opciones permitidas para ordenar el listado.
    $orders = [
        "name" =>
            "p.full_name ASC",

        "age" =>
            "p.age ASC, p.full_name ASC",

        "lastMeasurement" =>
            "lastMeasurementDate DESC, p.full_name ASC"
    ];

    $orderBy =
        $orders[$order] ??
        "p.full_name ASC";

    $where = [];
    $parameters = [];

    // La búsqueda utiliza parámetros diferentes para evitar conflictos con PDO.
    if ($search !== "") {

        $where[] = "
            (
                p.id = :search_id
                OR p.full_name LIKE :search_name
                OR p.identification LIKE :search_identification
                OR p.phone LIKE :search_phone
                OR p.status LIKE :search_status
            )
        ";

        $searchValue = "%{$search}%";
        
        $parameters[
            ":search_id"
        ] =
            ctype_digit($search)
                ? (int) $search
                : 0;        

        $parameters[
            ":search_name"
        ] = $searchValue;

        $parameters[
            ":search_identification"
        ] = $searchValue;

        $parameters[
            ":search_phone"
        ] = $searchValue;

        $parameters[
            ":search_status"
        ] = $searchValue;
    }

    // Filtra los pacientes por su estado actual.
    if ($status !== "") {

        $where[] =
            "p.status = :status";

        $parameters[
            ":status"
        ] =
            strtoupper($status);
    }

    $sql = "
        SELECT
            p.id,
            p.full_name AS fullName,
            p.identification,
            p.age,
            p.phone,
            p.height_m AS heightM,
            p.condition_general AS conditionGeneral,
            p.observations,
            p.status,
            p.is_active AS isActive,
            p.created_at AS createdAt,
            p.updated_at AS updatedAt,

            (
                SELECT m.weight_kg
                FROM measurements m
                WHERE m.patient_id = p.id
                ORDER BY m.measurement_date ASC
                LIMIT 1
            ) AS initialWeightKg,

            (
                SELECT MAX(m.measurement_date)
                FROM measurements m
                WHERE m.patient_id = p.id
            ) AS lastMeasurementDate

        FROM patients p
    ";

    if ($where) {

        $sql .=
            " WHERE " .
            implode(
                " AND ",
                $where
            );
    }

    $sql .=
        " ORDER BY " .
        $orderBy;

    $statement =
        $db->prepare($sql);

    $statement->execute(
        $parameters
    );

    return $statement->fetchAll();
}

try {

    $db =
        nyvoraDatabase();

    $method =
        $_SERVER["REQUEST_METHOD"];

    // Devuelve la lista de pacientes, indicadores y próximas citas.
    if ($method === "GET") {

        $patients =
            patientList($db);

        $kpiStatement =
            $db->query("
                SELECT
                    COUNT(*) AS total,

                    SUM(
                        status = 'ACTIVO'
                    ) AS active,

                    SUM(
                        status = 'SEGUIMIENTO'
                    ) AS followup

                FROM patients
            ");

        $kpis =
            $kpiStatement->fetch();

        $activeAlerts =
            (int)
            $db->query("
                SELECT COUNT(*)
                FROM alerts
                WHERE status = 'ACTIVE'
            ")->fetchColumn();

        $appointments = [];

        // Las citas son información adicional; si ocurre un problema aquí,
        // el listado de pacientes todavía puede funcionar.
        try {

            $appointmentStatement =
                $db->query("
                    SELECT
                        a.id,
                        a.patient_id AS patientId,
                        p.full_name AS patientName,
                        a.appointment_date AS date,

                        TIME_FORMAT(
                            a.appointment_time,
                            '%H:%i'
                        ) AS time,

                        a.appointment_type AS type,
                        a.status

                    FROM appointments a

                    INNER JOIN patients p
                        ON p.id = a.patient_id

                    WHERE
                        a.appointment_date >= CURDATE()

                        AND a.status IN (
                            'PROGRAMADA',
                            'CONFIRMADA'
                        )

                    ORDER BY
                        a.appointment_date ASC,
                        a.appointment_time ASC

                    LIMIT 5
                ");

            $appointments =
                $appointmentStatement->fetchAll();

        } catch (Throwable $appointmentError) {

            $appointments = [];
        }

        nyvoraRespond(
            200,
            true,
            "",
            [
                "data" =>
                    $patients,

                "kpis" => [

                    "total" =>
                        (int) (
                            $kpis["total"] ?? 0
                        ),

                    "active" =>
                        (int) (
                            $kpis["active"] ?? 0
                        ),

                    "followup" =>
                        (int) (
                            $kpis["followup"] ?? 0
                        ),

                    "activeAlerts" =>
                        $activeAlerts
                ],

                "upcomingAppointments" =>
                    $appointments
            ]
        );
    }

    nyvoraMethod([
        "POST",
        "PUT"
    ]);

    $data =
        nyvoraRequestData();

    // Valida la información recibida desde el formulario.
    $fullName =
        nyvoraText(
            $data["fullName"] ?? null,
            "nombre completo",
            true,
            150
        );

    $identification =
        nyvoraText(
            $data["identification"] ?? null,
            "identificación",
            false,
            50
        );

    $age =
        nyvoraInteger(
            $data["age"] ?? null,
            "edad"
        );

    $heightM =
        nyvoraDecimal(
            $data["heightM"] ?? null,
            "estatura",
            true
        );

    if (
        $age < 0 ||
        $age > 120 ||
        $heightM < 0.5 ||
        $heightM > 2.5
    ) {

        nyvoraRespond(
            422,
            false,
            "La edad o estatura no se encuentra en el rango permitido."
        );
    }

    $payload = [

        ":full_name" =>
            $fullName,

        ":identification" =>
            $identification,

        ":age" =>
            $age,

        ":phone" =>
            nyvoraText(
                $data["phone"] ?? null,
                "teléfono",
                false,
                30
            ),

        ":height_m" =>
            $heightM,

        ":condition_general" =>
            nyvoraText(
                $data["conditionGeneral"] ?? null,
                "condición general",
                false,
                150
            ),

        ":observations" =>
            nyvoraText(
                $data["observations"] ?? null,
                "observaciones"
            ),

        ":status" =>
            nyvoraChoice(
                $data["status"] ?? "ACTIVO",
                "estado",
                [
                    "ACTIVO",
                    "SEGUIMIENTO",
                    "INACTIVO"
                ]
            )
    ];

    $payload[":is_active"] =
        $payload[":status"] !==
        "INACTIVO"
            ? 1
            : 0;

    // Registra un paciente nuevo.
    if ($method === "POST") {

        $payload[
            ":user_id"
        ] =
            $_SESSION[
                "usuario_id"
            ];

        $statement =
            $db->prepare("
                INSERT INTO patients (
                    user_id,
                    full_name,
                    identification,
                    age,
                    phone,
                    height_m,
                    condition_general,
                    observations,
                    status,
                    is_active
                )
                VALUES (
                    :user_id,
                    :full_name,
                    :identification,
                    :age,
                    :phone,
                    :height_m,
                    :condition_general,
                    :observations,
                    :status,
                    :is_active
                )
            ");

        $statement->execute(
            $payload
        );

        $newId =
            (int)
            $db->lastInsertId();

        nyvoraRespond(
            201,
            true,
            "Paciente registrado correctamente.",
            [
                "data" =>
                    patientPayload(
                        $db,
                        $newId
                    )
            ]
        );
    }

    // Actualiza la información de un paciente existente.
    $patientId =
        nyvoraRecordId(
            $data
        );

    $payload[":id"] =
        $patientId;

    $statement =
        $db->prepare("
            UPDATE patients
            SET
                full_name = :full_name,
                identification = :identification,
                age = :age,
                phone = :phone,
                height_m = :height_m,
                condition_general = :condition_general,
                observations = :observations,
                status = :status,
                is_active = :is_active
            WHERE id = :id
        ");

    $statement->execute(
        $payload
    );

    if (
        $statement->rowCount() === 0
    ) {

        patientPayload(
            $db,
            $patientId
        );
    }

    nyvoraRespond(
        200,
        true,
        "Paciente actualizado correctamente.",
        [
            "data" =>
                patientPayload(
                    $db,
                    $patientId
                )
        ]
    );

} catch (Throwable $error) {

    nyvoraHandleDatabaseException(
        $error
    );
}