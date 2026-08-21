"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "medications.php";

    const search = document.getElementById("medication-search");
    const statusFilter = document.getElementById("medication-status-filter");
    const presentationFilter = document.getElementById("medication-presentation-filter");

    const body = document.getElementById("medications-table-body");
    const count = document.getElementById("medication-results-count");

    const modal = document.getElementById("medication-modal");
    const form = document.getElementById("medication-form");

    const fields = {
        id: null,
        name: document.getElementById("medication-name"),
        presentation: document.getElementById("medication-presentation"),
        concentration: document.getElementById("medication-concentration"),
        dose: document.getElementById("medication-dose"),
        frequency: document.getElementById("medication-frequency"),
        status: document.getElementById("medication-status"),
        observations: document.getElementById("medication-observations")
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

    function statusInfo(status) {
        const states = {
            ACTIVO: [
                t("active", "Activo"),
                "active"
            ],
            EN_USO: [
                t("in_use", "En uso"),
                "in-use"
            ],
            INACTIVO: [
                t("inactive", "Inactivo"),
                "inactive"
            ]
        };

        return states[status] || [
            t("undefined_status", "Sin estado"),
            "inactive"
        ];
    }

    function presentationLabel(value) {
        const labels = {
            "Tabletas": t("tablets", "Tabletas"),
            "Cápsulas": t("capsules", "Cápsulas"),
            "Jarabe": t("syrup", "Jarabe"),
            "Suspensión": t("suspension", "Suspensión"),
            "Solución": t("solution", "Solución"),
            "Inyectable": t("injectable", "Inyectable"),
            "Crema": t("cream", "Crema"),
            "Otro": t("other", "Otro")
        };

        return labels[value] || value || t("no_data", "N/D");
    }

    async function load() {

        const params = new URLSearchParams();

        if (search.value.trim()) {
            params.set(
                "search",
                search.value.trim()
            );
        }

        if (statusFilter.value) {
            params.set(
                "status",
                statusFilter.value
            );
        }

        if (presentationFilter.value) {
            params.set(
                "presentation",
                presentationFilter.value
            );
        }

        try {

            const result = await nyvoraApi(
                `${API_URL}?${params.toString()}`
            );

            medications = result.data || [];

            render(result.kpis || {});

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
                                "No fue posible completar la operación."
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
                    ? t("results_one", "resultado")
                    : t("results_many", "resultados")
            }`;

        if (!medications.length) {

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
                                    "No hay medicamentos registrados"
                                )}
                            </strong>

                            <p>
                                ${t(
                                    "medications_will_appear",
                                    "Los medicamentos aparecerán aquí conforme sean registrados."
                                )}
                            </p>

                        </div>
                    </td>
                </tr>
            `;

            return;
        }

        medications.forEach(medication => {

            const [statusText, statusClass] =
                statusInfo(
                    medication.status
                );

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    <div class="medication-name-cell">

                        <div class="medication-table-icon">
                            <i class="fa-solid fa-capsules"></i>
                        </div>

                        <div class="medication-name-info">

                            <strong>
                                ${nyvoraEscapeHtml(
                                    medication.name
                                )}
                            </strong>

                            <span>
                                ${nyvoraEscapeHtml(
                                    medication.frequency ||
                                    t(
                                        "undefined_frequency",
                                        "Sin frecuencia definida"
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
                        medication.concentration ||
                        t("no_data", "N/D")
                    )}
                </td>

                <td>
                    ${nyvoraEscapeHtml(
                        medication.dose ||
                        t(
                            "undefined_condition",
                            "Sin definir"
                        )
                    )}
                </td>

                <td>
                    <span class="medication-badge ${statusClass}">
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
                                "Editar"
                            )}">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button
                            type="button"
                            class="medication-action-button disable"
                            title="${t(
                                "deactivate_medication",
                                "Dar de baja"
                            )}">

                            <i class="fa-solid fa-ban"></i>

                        </button>

                    </div>

                </td>
            `;

            row
                .querySelector(".edit")
                .addEventListener(
                    "click",
                    () => openModal(medication)
                );

            row
                .querySelector(".disable")
                .addEventListener(
                    "click",
                    () => deactivateMedication(medication)
                );

            body.appendChild(row);
        });
    }

    async function loadMedication(id) {

        try {

            const result =
                await nyvoraApi(
                    `${API_URL}?id=${id}`
                );

            if (
                result.data &&
                !Array.isArray(result.data)
            ) {
                return result.data;
            }

            if (
                Array.isArray(result.data) &&
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

    async function openModal(medication = null) {

        fields.id =
            medication?.id || null;

        form.reset();

        if (medication?.id) {

            const current =
                await loadMedication(
                    medication.id
                );

            if (current) {
                medication = current;
            }
        }

        document.getElementById(
            "medication-modal-title"
        ).textContent =
            medication
                ? t(
                    "edit_medication",
                    "Editar Medicamento"
                )
                : t(
                    "register_medication",
                    "Registrar Medicamento"
                );

        fields.name.value =
            medication?.name || "";

        fields.presentation.value =
            medication?.presentation || "";

        fields.concentration.value =
            medication?.concentration || "";

        fields.dose.value =
            medication?.dose || "";

        fields.frequency.value =
            medication?.frequency || "";

        fields.status.value =
            medication?.status || "ACTIVO";

        fields.observations.value =
            medication?.observations || "";

        modal.classList.add("active");

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

        fields.id = null;
    }

    async function saveMedication(event) {

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
                    "Campos obligatorios"
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

        if (fields.id) {

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
                    "save_success",
                    "Operación realizada correctamente."
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
                    "No fue posible completar la operación."
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
                "¿Dar de baja este medicamento?"
            );

        if (
            !window.confirm(
                `${confirmText}\n\n${medication.name}`
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
                    "No fue posible completar la operación."
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
            () => openModal()
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
                            "Editar Medicamento"
                        )
                        : t(
                            "register_medication",
                            "Registrar Medicamento"
                        );
            }
        }
    );

    load();
});