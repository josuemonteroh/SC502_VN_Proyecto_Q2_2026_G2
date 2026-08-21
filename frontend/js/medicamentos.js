"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "medications.php";

    const search =
        document.getElementById("medication-search");

    const statusFilter =
        document.getElementById("medication-status-filter");

    const presentationFilter =
        document.getElementById("medication-presentation-filter");

    const body =
        document.getElementById("medications-table-body");

    const count =
        document.getElementById("medication-results-count");

    const modal =
        document.getElementById("medication-modal");

    const form =
        document.getElementById("medication-form");

    const fields = {
        id: null,

        name:
            document.getElementById("medication-name"),

        presentation:
            document.getElementById("medication-presentation"),

        concentration:
            document.getElementById("medication-concentration"),

        dose:
            document.getElementById("medication-dose"),

        frequency:
            document.getElementById("medication-frequency"),

        status:
            document.getElementById("medication-status"),

        observations:
            document.getElementById("medication-observations")
    };

    let medications = [];


    function t(key, fallback = "") {

        if (
            typeof translations !== "undefined" &&
            typeof currentLanguage !== "undefined" &&
            translations[currentLanguage] &&
            translations[currentLanguage][key] !== undefined
        ) {
            return translations[currentLanguage][key];
        }

        return fallback;
    }


    function repararTexto(valor) {

        if (
            valor === null ||
            valor === undefined
        ) {
            return "";
        }

        const texto = String(valor);

        if (
            !texto.includes("Ã") &&
            !texto.includes("Â") &&
            !texto.includes("�")
        ) {
            return texto;
        }

        try {

            const bytes = new Uint8Array(
                Array.from(texto).map(
                    caracter =>
                        caracter.charCodeAt(0)
                )
            );

            const corregido =
                new TextDecoder("utf-8")
                    .decode(bytes);

            return corregido || texto;

        } catch (error) {

            return texto;
        }
    }


    function normalizar(valor) {

        return repararTexto(valor)
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();
    }


    function statusInfo(status) {

        const states = {

            ACTIVO: [
                t(
                    "active",
                    "Active"
                ),
                "active"
            ],

            EN_USO: [
                t(
                    "in_use",
                    "In Use"
                ),
                "in-use"
            ],

            INACTIVO: [
                t(
                    "inactive",
                    "Inactive"
                ),
                "inactive"
            ]
        };

        return (
            states[status] ||
            [
                t(
                    "undefined_status",
                    "No status"
                ),
                "inactive"
            ]
        );
    }


    function presentationLabel(value) {

        const original =
            repararTexto(value);

        const labels = {

            "tabletas":
                t(
                    "tablets",
                    "Tablets"
                ),

            "capsulas":
                t(
                    "capsules",
                    "Capsules"
                ),

            "jarabe":
                t(
                    "syrup",
                    "Syrup"
                ),

            "suspension":
                t(
                    "suspension",
                    "Suspension"
                ),

            "solucion":
                t(
                    "solution",
                    "Solution"
                ),

            "inyectable":
                t(
                    "injectable",
                    "Injectable"
                ),

            "crema":
                t(
                    "cream",
                    "Cream"
                ),

            "otro":
                t(
                    "other",
                    "Other"
                )
        };

        return (
            labels[
                normalizar(original)
            ] ||
            original ||
            t(
                "no_data",
                "N/A"
            )
        );
    }


    function frequencyLabel(value) {

        if (!value) {

            return t(
                "undefined_frequency",
                "No frequency defined"
            );
        }

        const text =
            normalizar(value);

        const labels = {

            "cada 8 horas":
                t(
                    "every_8_hours",
                    "Every 8 hours"
                ),

            "cada 12 horas":
                t(
                    "every_12_hours",
                    "Every 12 hours"
                ),

            "cada 24 horas":
                t(
                    "every_24_hours",
                    "Every 24 hours"
                ),

            "cada 6 horas":
                t(
                    "every_6_hours",
                    "Every 6 hours"
                ),

            "una vez al dia":
                t(
                    "once_daily",
                    "Once daily"
                ),

            "dos veces al dia":
                t(
                    "twice_daily",
                    "Twice daily"
                )
        };

        return (
            labels[text] ||
            repararTexto(value)
        );
    }


    function doseLabel(value) {

        if (!value) {

            return t(
                "undefined_condition",
                "Not defined"
            );
        }

        const normalized =
            normalizar(value);

        if (
            normalized ===
            "1 tableta"
        ) {

            return t(
                "one_tablet",
                "1 tablet"
            );
        }

        if (
            normalized ===
            "1 capsula"
        ) {

            return t(
                "one_capsule",
                "1 capsule"
            );
        }

        if (
            normalized ===
            "2 tabletas"
        ) {

            return t(
                "two_tablets",
                "2 tablets"
            );
        }

        if (
            normalized ===
            "2 capsulas"
        ) {

            return t(
                "two_capsules",
                "2 capsules"
            );
        }

        return repararTexto(value);
    }


    function medicationName(value) {

        const name =
            repararTexto(value);

        if (
            typeof currentLanguage === "undefined" ||
            currentLanguage !== "en"
        ) {
            return name;
        }

        const names = {

            "amoxicilina":
                "Amoxicillin",

            "losartan":
                "Losartan",

            "metformina":
                "Metformin",

            "atorvastatina":
                "Atorvastatin",

            "loratadina":
                "Loratadine",

            "omeprazol":
                "Omeprazole",

            "paracetamol":
                "Paracetamol",

            "ibuprofeno":
                "Ibuprofen"
        };

        return (
            names[
                normalizar(name)
            ] ||
            name
        );
    }


    async function load() {

        const params =
            new URLSearchParams();

        if (
            search.value.trim()
        ) {

            params.set(
                "search",
                search.value.trim()
            );
        }

        if (
            statusFilter.value
        ) {

            params.set(
                "status",
                statusFilter.value
            );
        }

        if (
            presentationFilter.value
        ) {

            params.set(
                "presentation",
                presentationFilter.value
            );
        }

        try {

            const result =
                await nyvoraApi(
                    `${API_URL}?${params.toString()}`
                );

            medications =
                result.data || [];

            render(
                result.kpis || {}
            );

        } catch (error) {

            console.error(
                "Error cargando medicamentos:",
                error
            );

            body.innerHTML = `
                <tr>
                    <td colspan="7">

                        ${nyvoraEscapeHtml(
                            error.message ||
                            t(
                                "request_error",
                                "The operation could not be completed."
                            )
                        )}

                    </td>
                </tr>
            `;
        }
    }


    function render(kpis) {

        const total =
            document.getElementById(
                "kpi-medications-total"
            );

        const active =
            document.getElementById(
                "kpi-medications-active"
            );

        const used =
            document.getElementById(
                "kpi-medications-used"
            );

        const inactive =
            document.getElementById(
                "kpi-medications-inactive"
            );


        if (total) {

            total.textContent =
                kpis.total ?? 0;
        }

        if (active) {

            active.textContent =
                kpis.active ?? 0;
        }

        if (used) {

            used.textContent =
                kpis.inUse ?? 0;
        }

        if (inactive) {

            inactive.textContent =
                kpis.inactive ?? 0;
        }


        body.innerHTML = "";


        const amount =
            medications.length;


        count.textContent =
            `${amount} ${
                amount === 1
                    ? t(
                        "results_one",
                        "result"
                    )
                    : t(
                        "results_many",
                        "results"
                    )
            }`;


        if (
            !medications.length
        ) {

            body.innerHTML = `
                <tr class="empty-medications">

                    <td colspan="7">

                        <div class="empty-state">

                            <div class="empty-state-icon">

                                <i class="fa-solid fa-capsules"></i>

                            </div>

                            <strong>

                                ${t(
                                    "no_medications_registered",
                                    "No medications registered"
                                )}

                            </strong>

                            <p>

                                ${t(
                                    "medications_will_appear",
                                    "Medications will appear here as they are registered."
                                )}

                            </p>

                        </div>

                    </td>

                </tr>
            `;

            return;
        }


        medications.forEach(
            medication => {

                const [
                    statusText,
                    statusClass
                ] =
                    statusInfo(
                        medication.status
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <div class="medication-name-cell">

                            <div class="medication-table-icon">

                                <i class="fa-solid fa-capsules"></i>

                            </div>

                            <div class="medication-name-info">

                                <strong>

                                    ${nyvoraEscapeHtml(
                                        medicationName(
                                            medication.name
                                        )
                                    )}

                                </strong>

                                <span>

                                    ${nyvoraEscapeHtml(
                                        frequencyLabel(
                                            medication.frequency
                                        )
                                    )}

                                </span>

                            </div>

                        </div>

                    </td>


                    <td>

                        ${nyvoraEscapeHtml(
                            presentationLabel(
                                medication.presentation
                            )
                        )}

                    </td>


                    <td>

                        ${nyvoraEscapeHtml(
                            repararTexto(
                                medication.concentration ||
                                t(
                                    "no_data",
                                    "N/A"
                                )
                            )
                        )}

                    </td>


                    <td>

                        ${nyvoraEscapeHtml(
                            doseLabel(
                                medication.dose
                            )
                        )}

                    </td>


                    <td>

                        <span
                            class="medication-badge ${statusClass}">

                            ${statusText}

                        </span>

                    </td>


                    <td>

                        ${medication.associatedPatients || 0}

                    </td>


                    <td>

                        <div class="medication-row-actions">

                            <button
                                type="button"
                                class="medication-action-button edit"
                                title="${t(
                                    "edit",
                                    "Edit"
                                )}">

                                <i class="fa-solid fa-pen"></i>

                            </button>


                            <button
                                type="button"
                                class="medication-action-button disable"
                                title="${t(
                                    "deactivate_medication",
                                    "Deactivate"
                                )}">

                                <i class="fa-solid fa-ban"></i>

                            </button>

                        </div>

                    </td>
                `;


                row.querySelector(
                    ".edit"
                ).addEventListener(
                    "click",
                    () =>
                        openModal(
                            medication
                        )
                );


                row.querySelector(
                    ".disable"
                ).addEventListener(
                    "click",
                    () =>
                        deactivateMedication(
                            medication
                        )
                );


                body.appendChild(
                    row
                );
            }
        );
    }


    async function loadMedication(id) {

        try {

            const result =
                await nyvoraApi(
                    `${API_URL}?id=${id}`
                );


            if (
                result.data &&
                !Array.isArray(
                    result.data
                )
            ) {

                return result.data;
            }


            if (
                Array.isArray(
                    result.data
                ) &&
                result.data.length
            ) {

                return result.data[0];
            }


            return null;

        } catch (error) {

            console.error(
                "Error obteniendo medicamento:",
                error
            );

            return null;
        }
    }


    async function openModal(
        medication = null
    ) {

        fields.id =
            medication?.id ||
            null;


        form.reset();


        if (
            medication?.id
        ) {

            const current =
                await loadMedication(
                    medication.id
                );

            if (current) {

                medication =
                    current;
            }
        }


        document.getElementById(
            "medication-modal-title"
        ).textContent =

            medication

                ? t(
                    "edit_medication",
                    "Edit Medication"
                )

                : t(
                    "register_medication",
                    "Register Medication"
                );


        fields.name.value =
            repararTexto(
                medication?.name ||
                ""
            );


        fields.presentation.value =
            repararTexto(
                medication?.presentation ||
                ""
            );


        fields.concentration.value =
            repararTexto(
                medication?.concentration ||
                ""
            );


        fields.dose.value =
            repararTexto(
                medication?.dose ||
                ""
            );


        fields.frequency.value =
            repararTexto(
                medication?.frequency ||
                ""
            );


        fields.status.value =
            medication?.status ||
            "ACTIVO";


        fields.observations.value =
            repararTexto(
                medication?.observations ||
                ""
            );


        modal.classList.add(
            "active"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-open"
        );
    }


    function closeModal() {

        modal.classList.remove(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );

        fields.id =
            null;
    }


    async function saveMedication(
        event
    ) {

        event.preventDefault();


        const name =
            fields.name.value.trim();

        const presentation =
            fields.presentation.value;

        const concentration =
            fields.concentration.value.trim();


        if (
            !name ||
            !presentation ||
            !concentration
        ) {

            alert(
                t(
                    "required_fields",
                    "Required fields"
                )
            );

            return;
        }


        const data = {

            name:
                name,

            presentation:
                presentation,

            concentration:
                concentration,

            dose:
                fields.dose.value.trim(),

            frequency:
                fields.frequency.value.trim(),

            status:
                fields.status.value,

            observations:
                fields.observations.value.trim()
        };


        let method =
            "POST";


        if (
            fields.id
        ) {

            method =
                "PUT";

            data.id =
                Number(
                    fields.id
                );
        }


        try {

            const result =
                await nyvoraApi(
                    API_URL,
                    {
                        method,
                        body: data
                    }
                );


            closeModal();


            nyvoraNotify(
                "medications"
            );


            await load();


            alert(
                result.message ||
                t(
                    "settings_saved",
                    "Operation completed successfully."
                )
            );


        } catch (error) {

            console.error(
                "Error guardando medicamento:",
                error
            );


            alert(
                error.message ||
                t(
                    "request_error",
                    "The operation could not be completed."
                )
            );
        }
    }


    async function deactivateMedication(
        medication
    ) {

        const confirmText =
            t(
                "confirm_deactivate_medication",
                "Deactivate this medication?"
            );


        if (
            !window.confirm(
                `${confirmText}\n\n${medicationName(
                    medication.name
                )}`
            )
        ) {

            return;
        }


        try {

            await nyvoraApi(
                API_URL,
                {
                    method:
                        "PATCH",

                    body: {

                        id:
                            Number(
                                medication.id
                            ),

                        status:
                            "INACTIVO"
                    }
                }
            );


            nyvoraNotify(
                "medications"
            );


            await load();


        } catch (error) {

            console.error(
                "Error desactivando medicamento:",
                error
            );


            alert(
                error.message ||
                t(
                    "request_error",
                    "The operation could not be completed."
                )
            );
        }
    }


    search.addEventListener(
        "input",
        load
    );


    statusFilter.addEventListener(
        "change",
        load
    );


    presentationFilter.addEventListener(
        "change",
        load
    );


    document
        .getElementById(
            "open-medication-modal"
        )
        .addEventListener(
            "click",
            () =>
                openModal()
        );


    form.addEventListener(
        "submit",
        saveMedication
    );


    document
        .getElementById(
            "close-medication-modal"
        )
        .addEventListener(
            "click",
            closeModal
        );


    document
        .getElementById(
            "cancel-medication"
        )
        .addEventListener(
            "click",
            closeModal
        );


    modal
        .querySelector(
            ".medication-modal-backdrop"
        )
        .addEventListener(
            "click",
            closeModal
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeModal();
            }
        }
    );


    document.addEventListener(
        "languageChanged",
        () => {

            load();


            if (
                modal.classList.contains(
                    "active"
                )
            ) {

                document.getElementById(
                    "medication-modal-title"
                ).textContent =

                    fields.id

                        ? t(
                            "edit_medication",
                            "Edit Medication"
                        )

                        : t(
                            "register_medication",
                            "Register Medication"
                        );
            }
        }
    );


    load();
});