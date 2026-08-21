<?php

require_once __DIR__ . "/api_helpers.php";


function appointmentPayload(
    PDO $db,
    int $appointmentId
): array {

    $statement = $db->prepare("
        SELECT
            a.id,
            a.patient_id AS patientId,
            p.full_name AS patientName,
            p.identification AS patientIdentification,
            a.appointment_date AS date,
            TIME_FORMAT(
                a.appointment_time,
                '%H:%i'
            ) AS time,
            a.appointment_type AS type,
            a.status,
            a.reason,
            a.notes,
            u.full_name AS professional,
            a.created_at AS createdAt,
            a.updated_at AS updatedAt

        FROM appointments a

        INNER JOIN patients p
            ON p.id = a.patient_id

        INNER JOIN users u
            ON u.id = a.professional_id

        WHERE a.id = :id
    ");


    $statement->execute([
        ":id" =>
            $appointmentId
    ]);


    $appointment =
        $statement->fetch();


    if (!$appointment) {

        nyvoraRespond(
            404,
            false,
            "Cita no encontrada."
        );
    }


    return $appointment;
}


nyvoraApiStart();


try {

    $db =
        nyvoraDatabase();

    $method =
        $_SERVER["REQUEST_METHOD"];


    /* =========================
       GET
    ========================= */

    if ($method === "GET") {

        $where = [];

        $parameters = [];


        $search =
            trim(
                $_GET["search"] ?? ""
            );

        $date =
            trim(
                $_GET["date"] ?? ""
            );

        $status =
            trim(
                $_GET["status"] ?? ""
            );


        /* Búsqueda */

        if ($search !== "") {

            $where[] = "
                (
                    p.full_name LIKE :search_name
                    OR p.identification LIKE :search_identification
                    OR a.appointment_type LIKE :search_type
                )
            ";

            $searchValue =
                "%{$search}%";


            $parameters[
                ":search_name"
            ] =
                $searchValue;


            $parameters[
                ":search_identification"
            ] =
                $searchValue;


            $parameters[
                ":search_type"
            ] =
                $searchValue;
        }


        /* Fecha */

        if ($date !== "") {

            $where[] =
                "a.appointment_date = :date";


            $parameters[
                ":date"
            ] =
                nyvoraDate(
                    $date,
                    "fecha"
                );
        }


        /* Estado */

        if ($status !== "") {

            $where[] =
                "a.status = :status";


            $parameters[
                ":status"
            ] =
                nyvoraChoice(
                    $status,
                    "estado",
                    [
                        "PROGRAMADA",
                        "CONFIRMADA",
                        "COMPLETADA",
                        "CANCELADA"
                    ]
                );
        }


        /* Consulta */

        $sql = "

            SELECT
                a.id,
                a.patient_id AS patientId,
                p.full_name AS patientName,
                p.identification AS patientIdentification,
                a.appointment_date AS date,

                TIME_FORMAT(
                    a.appointment_time,
                    '%H:%i'
                ) AS time,

                a.appointment_type AS type,
                a.status,
                a.reason,
                a.notes,
                u.full_name AS professional,
                a.created_at AS createdAt,
                a.updated_at AS updatedAt

            FROM appointments a

            INNER JOIN patients p
                ON p.id = a.patient_id

            INNER JOIN users u
                ON u.id = a.professional_id

        ";


        if ($where) {

            $sql .=
                " WHERE " .
                implode(
                    " AND ",
                    $where
                );
        }


        $sql .= "

            ORDER BY
                a.appointment_date ASC,
                a.appointment_time ASC
        ";


        $statement =
            $db->prepare(
                $sql
            );


        $statement->execute(
            $parameters
        );


        $appointments =
            $statement->fetchAll();


        /* KPIs */

        $kpiStatement =
            $db->query("
                SELECT

                    SUM(
                        appointment_date =
                        CURDATE()
                        AND status != 'CANCELADA'
                    ) AS today,

                    SUM(
                        appointment_date >
                        CURDATE()
                        AND status IN (
                            'PROGRAMADA',
                            'CONFIRMADA'
                        )
                    ) AS upcoming,

                    SUM(
                        status =
                        'COMPLETADA'
                    ) AS completed,

                    SUM(
                        status IN (
                            'PROGRAMADA',
                            'CONFIRMADA'
                        )
                    ) AS pending

                FROM appointments
            ");


        $kpis =
            $kpiStatement->fetch();


        nyvoraRespond(
            200,
            true,
            "",
            [
                "data" =>
                    $appointments,

                "kpis" => [

                    "today" =>
                        (int) (
                            $kpis["today"] ??
                            0
                        ),

                    "upcoming" =>
                        (int) (
                            $kpis["upcoming"] ??
                            0
                        ),

                    "completed" =>
                        (int) (
                            $kpis["completed"] ??
                            0
                        ),

                    "pending" =>
                        (int) (
                            $kpis["pending"] ??
                            0
                        )
                ]
            ]
        );
    }


    /* =========================
       BODY
    ========================= */

    $data =
        nyvoraRequestData();


    /* =========================
       PATCH
    ========================= */

    if ($method === "PATCH") {

        $appointmentId =
            nyvoraRecordId(
                $data
            );


        $status =
            nyvoraChoice(
                $data["status"] ?? "",
                "estado",
                [
                    "CANCELADA"
                ]
            );


        $statement =
            $db->prepare("
                UPDATE appointments

                SET
                    status = :status

                WHERE id = :id
            ");


        $statement->execute([
            ":status" =>
                $status,

            ":id" =>
                $appointmentId
        ]);


        nyvoraRespond(
            200,
            true,
            "Cita cancelada correctamente.",
            [
                "data" =>
                    appointmentPayload(
                        $db,
                        $appointmentId
                    )
            ]
        );
    }


    /* =========================
       POST / PUT
    ========================= */

    nyvoraMethod([
        "POST",
        "PUT"
    ]);


    $patientId =
        nyvoraInteger(
            $data["patientId"] ?? null,
            "paciente"
        );


    /* Verificar paciente */

    $patient =
        $db->prepare("
            SELECT id
            FROM patients
            WHERE id = :id
            AND is_active = TRUE
        ");


    $patient->execute([
        ":id" =>
            $patientId
    ]);


    if (
        !$patient->fetchColumn()
    ) {

        nyvoraRespond(
            422,
            false,
            "El paciente seleccionado no está disponible."
        );
    }


    /* Datos */

    $payload = [

        ":patient_id" =>
            $patientId,

        ":appointment_date" =>
            nyvoraDate(
                $data["date"] ?? null,
                "fecha"
            ),

        ":appointment_time" =>
            nyvoraTime(
                $data["time"] ?? null,
                "hora"
            ),

        ":appointment_type" =>
            nyvoraChoice(
                $data["type"] ?? null,
                "tipo",
                [
                    "VALORACION_INICIAL",
                    "CONTROL_NUTRICIONAL",
                    "SEGUIMIENTO_BIOMETRICO",
                    "REVISION_CLINICA",
                    "OTRO"
                ]
            ),

        ":status" =>
            nyvoraChoice(
                $data["status"] ??
                "PROGRAMADA",
                "estado",
                [
                    "PROGRAMADA",
                    "CONFIRMADA",
                    "COMPLETADA",
                    "CANCELADA"
                ]
            ),

        ":reason" =>
            nyvoraText(
                $data["reason"] ?? null,
                "motivo",
                false,
                255
            ),

        ":notes" =>
            nyvoraText(
                $data["notes"] ?? null,
                "observaciones"
            )
    ];


    /* =========================
       POST
    ========================= */

    if ($method === "POST") {

        $payload[
            ":professional_id"
        ] =
            $_SESSION[
                "usuario_id"
            ];


        $statement =
            $db->prepare("
                INSERT INTO appointments (

                    patient_id,
                    professional_id,
                    appointment_date,
                    appointment_time,
                    appointment_type,
                    status,
                    reason,
                    notes

                )

                VALUES (

                    :patient_id,
                    :professional_id,
                    :appointment_date,
                    :appointment_time,
                    :appointment_type,
                    :status,
                    :reason,
                    :notes

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
            "Cita registrada correctamente.",
            [
                "data" =>
                    appointmentPayload(
                        $db,
                        $newId
                    )
            ]
        );
    }


    /* =========================
       PUT
    ========================= */

    $appointmentId =
        nyvoraRecordId(
            $data
        );


    $payload[
        ":id"
    ] =
        $appointmentId;


    $statement =
        $db->prepare("
            UPDATE appointments

            SET
                patient_id =
                    :patient_id,

                appointment_date =
                    :appointment_date,

                appointment_time =
                    :appointment_time,

                appointment_type =
                    :appointment_type,

                status =
                    :status,

                reason =
                    :reason,

                notes =
                    :notes

            WHERE id = :id
        ");


    $statement->execute(
        $payload
    );


    nyvoraRespond(
        200,
        true,
        "Cita actualizada correctamente.",
        [
            "data" =>
                appointmentPayload(
                    $db,
                    $appointmentId
                )
        ]
    );


} catch (Throwable $error) {

    nyvoraHandleDatabaseException(
        $error
    );
}