<?php

require_once __DIR__ . "/api_helpers.php";

function medicationPayload(PDO $db, int $medicationId): array
{
    // Busca un medicamento específico y calcula cuántos pacientes lo tienen en uso.
    $statement = $db->prepare("
        SELECT
            m.id,
            m.name,
            m.presentation,
            m.concentration,
            m.reference_dose AS dose,
            m.reference_frequency AS frequency,
            m.status,
            m.observations,
            m.created_at AS createdAt,
            m.updated_at AS updatedAt,
            COUNT(
                DISTINCT CASE
                    WHEN t.status = 'ACTIVO'
                    THEN t.patient_id
                END
            ) AS associatedPatients
        FROM medications m
        LEFT JOIN treatments t
            ON t.medication_id = m.id
        WHERE m.id = :id
        GROUP BY
            m.id,
            m.name,
            m.presentation,
            m.concentration,
            m.reference_dose,
            m.reference_frequency,
            m.status,
            m.observations,
            m.created_at,
            m.updated_at
    ");

    $statement->execute([
        ":id" => $medicationId
    ]);

    $medication = $statement->fetch();

    if (!$medication) {
        nyvoraRespond(
            404,
            false,
            "Medicamento no encontrado."
        );
    }

    return $medication;
}

nyvoraApiStart();

try {

    $db = nyvoraDatabase();
    $method = $_SERVER["REQUEST_METHOD"];

    // Obtiene los medicamentos aplicando los filtros enviados desde la pantalla.
    if ($method === "GET") {

        $where = [];
        $parameters = [];

        $search = trim(
            $_GET["search"] ?? ""
        );

        $status = trim(
            $_GET["status"] ?? ""
        );

        $presentation = trim(
            $_GET["presentation"] ?? ""
        );

        // Se usan parámetros separados porque PDO puede tener problemas al reutilizar el mismo placeholder.
        if ($search !== "") {

            $where[] = "
                (
                    m.name LIKE :search_name
                    OR m.presentation LIKE :search_presentation
                    OR m.concentration LIKE :search_concentration
                    OR m.reference_dose LIKE :search_dose
                    OR m.reference_frequency LIKE :search_frequency
                )
            ";

            $searchValue = "%{$search}%";

            $parameters[":search_name"] =
                $searchValue;

            $parameters[":search_presentation"] =
                $searchValue;

            $parameters[":search_concentration"] =
                $searchValue;

            $parameters[":search_dose"] =
                $searchValue;

            $parameters[":search_frequency"] =
                $searchValue;
        }

        if ($status !== "") {

            $where[] =
                "m.status = :status";

            $parameters[":status"] =
                nyvoraChoice(
                    $status,
                    "estado",
                    [
                        "ACTIVO",
                        "EN_USO",
                        "INACTIVO"
                    ]
                );
        }

        if ($presentation !== "") {

            $where[] =
                "m.presentation = :presentation";

            $parameters[":presentation"] =
                $presentation;
        }

        $sql = "
            SELECT
                m.id,
                m.name,
                m.presentation,
                m.concentration,
                m.reference_dose AS dose,
                m.reference_frequency AS frequency,
                m.status,
                m.observations,
                m.created_at AS createdAt,
                m.updated_at AS updatedAt,
                COUNT(
                    DISTINCT CASE
                        WHEN t.status = 'ACTIVO'
                        THEN t.patient_id
                    END
                ) AS associatedPatients
            FROM medications m
            LEFT JOIN treatments t
                ON t.medication_id = m.id
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
            GROUP BY
                m.id,
                m.name,
                m.presentation,
                m.concentration,
                m.reference_dose,
                m.reference_frequency,
                m.status,
                m.observations,
                m.created_at,
                m.updated_at
            ORDER BY
                m.name ASC
        ";

        $statement = $db->prepare(
            $sql
        );

        $statement->execute(
            $parameters
        );

        $medications =
            $statement->fetchAll();

        $kpiStatement =
            $db->query("
                SELECT
                    COUNT(*) AS total,
                    SUM(
                        status = 'ACTIVO'
                    ) AS active,
                    SUM(
                        status = 'EN_USO'
                    ) AS inUse,
                    SUM(
                        status = 'INACTIVO'
                    ) AS inactive
                FROM medications
            ");

        $kpis =
            $kpiStatement->fetch();

        nyvoraRespond(
            200,
            true,
            "",
            [
                "data" =>
                    $medications,

                "kpis" => [

                    "total" =>
                        (int) (
                            $kpis["total"] ?? 0
                        ),

                    "active" =>
                        (int) (
                            $kpis["active"] ?? 0
                        ),

                    "inUse" =>
                        (int) (
                            $kpis["inUse"] ?? 0
                        ),

                    "inactive" =>
                        (int) (
                            $kpis["inactive"] ?? 0
                        )
                ]
            ]
        );
    }

    $data =
        nyvoraRequestData();

    // Cambia el estado del medicamento o lo marca como inactivo.
    if (
        $method === "PATCH" ||
        $method === "DELETE"
    ) {

        $medicationId =
            nyvoraRecordId(
                $data
            );

        if ($method === "DELETE") {

            $status =
                "INACTIVO";

        } else {

            $status =
                nyvoraChoice(
                    $data["status"] ?? "",
                    "estado",
                    [
                        "ACTIVO",
                        "EN_USO",
                        "INACTIVO"
                    ]
                );
        }

        $statement =
            $db->prepare("
                UPDATE medications
                SET
                    status = :status
                WHERE id = :id
            ");

        $statement->execute([
            ":status" =>
                $status,

            ":id" =>
                $medicationId
        ]);

        nyvoraRespond(
            200,
            true,
            "Estado del medicamento actualizado correctamente.",
            [
                "data" =>
                    medicationPayload(
                        $db,
                        $medicationId
                    )
            ]
        );
    }

    nyvoraMethod([
        "POST",
        "PUT"
    ]);

    // Se validan los datos antes de guardar o actualizar el medicamento.
    $payload = [

        ":name" =>
            nyvoraText(
                $data["name"] ?? null,
                "nombre",
                true,
                120
            ),

        ":presentation" =>
            nyvoraText(
                $data["presentation"] ?? null,
                "presentación",
                true,
                50
            ),

        ":concentration" =>
            nyvoraText(
                $data["concentration"] ?? null,
                "concentración",
                true,
                80
            ),

        ":reference_dose" =>
            nyvoraText(
                $data["dose"] ?? null,
                "dosis",
                false,
                120
            ),

        ":reference_frequency" =>
            nyvoraText(
                $data["frequency"] ?? null,
                "frecuencia",
                false,
                120
            ),

        ":status" =>
            nyvoraChoice(
                $data["status"] ?? "ACTIVO",
                "estado",
                [
                    "ACTIVO",
                    "EN_USO",
                    "INACTIVO"
                ]
            ),

        ":observations" =>
            nyvoraText(
                $data["observations"] ?? null,
                "observaciones"
            )
    ];

    // Registra un medicamento nuevo.
    if ($method === "POST") {

        $statement =
            $db->prepare("
                INSERT INTO medications (
                    name,
                    presentation,
                    concentration,
                    reference_dose,
                    reference_frequency,
                    status,
                    observations
                )
                VALUES (
                    :name,
                    :presentation,
                    :concentration,
                    :reference_dose,
                    :reference_frequency,
                    :status,
                    :observations
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
            "Medicamento registrado correctamente.",
            [
                "data" =>
                    medicationPayload(
                        $db,
                        $newId
                    )
            ]
        );
    }

    // Actualiza un medicamento existente.
    $medicationId =
        nyvoraRecordId(
            $data
        );

    $payload[":id"] =
        $medicationId;

    $statement =
        $db->prepare("
            UPDATE medications
            SET
                name = :name,
                presentation = :presentation,
                concentration = :concentration,
                reference_dose = :reference_dose,
                reference_frequency = :reference_frequency,
                status = :status,
                observations = :observations
            WHERE id = :id
        ");

    $statement->execute(
        $payload
    );

    nyvoraRespond(
        200,
        true,
        "Medicamento actualizado correctamente.",
        [
            "data" =>
                medicationPayload(
                    $db,
                    $medicationId
                )
        ]
    );

} catch (Throwable $error) {

    nyvoraHandleDatabaseException(
        $error
    );
}