"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const controls = {
        search: document.getElementById("patient-search"),
        results: document.getElementById("patient-search-results"),
        statusFilter: document.getElementById("patient-status-filter"),
        orderFilter: document.getElementById("patient-order-filter"),
        open: document.getElementById("open-patient-modal"),
        table: document.querySelector("#patients-table tbody"),
        modal: document.getElementById("patient-modal"),
        form: document.getElementById("patient-form"),
        appointments: document.getElementById("patients-appointments-list")
    };

    const fields = {
        id: null,
        name: document.getElementById("patient-full-name"),
        identification: document.getElementById("patient-identification"),
        age: document.getElementById("patient-age"),
        phone: document.getElementById("patient-phone"),
        height: document.getElementById("patient-height"),
        status: document.getElementById("patient-status"),
        condition: document.getElementById("patient-condition"),
        observations: document.getElementById("patient-observations")
    };

    let patients = [];
    let upcomingAppointments = [];


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


    function normalize(value) {

        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }


    function statusInfo(status) {

        const labels = {
            ACTIVO: [
                t("active", "Active"),
                "success"
            ],

            SEGUIMIENTO: [
                t("follow_up", "Under Follow-up"),
                "warning"
            ],

            INACTIVO: [
                t("inactive", "Inactive"),
                "danger"
            ]
        };

        return labels[status] || [
            t("undefined_status", "No status"),
            "warning"
        ];
    }


    function appointmentTypeLabel(type) {

        const labels = {
            VALORACION_INICIAL:
                t("initial_assessment", "Initial Assessment"),

            CONTROL_NUTRICIONAL:
                t("nutritional_control", "Nutritional Control"),

            SEGUIMIENTO_BIOMETRICO:
                t("biometric_followup", "Biometric Follow-up"),

            REVISION_CLINICA:
                t("clinical_review", "Clinical Review"),

            OTRO:
                t("other", "Other")
        };

        return labels[type] ||
            String(type || "")
                .replaceAll("_", " ");
    }


    function showError(message) {

        window.alert(
            message
        );
    }


    async function loadPatients() {

        const query =
            new URLSearchParams();

        if (
            controls.search.value.trim()
        ) {

            query.set(
                "search",
                controls.search.value.trim()
            );
        }


        if (
            controls.statusFilter.value !==
            "Estado"
        ) {

            query.set(
                "status",
                controls.statusFilter.value.toUpperCase()
            );
        }


        const order = {

            Nombre:
                "name",

            Edad:
                "age",

            "Último control":
                "lastMeasurement",

            Name:
                "name",

            Age:
                "age",

            "Last Checkup":
                "lastMeasurement"

        }[
            controls.orderFilter.value
        ];


        if (order) {

            query.set(
                "order",
                order
            );
        }


        try {

            const result =
                await nyvoraApi(
                    `patients.php?${query}`
                );


            patients =
                result.data || [];


            upcomingAppointments =
                result.upcomingAppointments || [];


            render(
                result.kpis || {}
            );


        } catch (error) {

            console.error(
                error
            );


            controls.table.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="patients-empty-row">

                        ${nyvoraEscapeHtml(
                            error.message
                        )}

                    </td>
                </tr>
            `;
        }
    }


    function render(kpis) {

        const assign =
            (
                id,
                value
            ) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (element) {

                    element.textContent =
                        value ?? 0;
                }
            };


        assign(
            "kpi-patients-total",
            kpis.total
        );


        assign(
            "kpi-patients-active",
            kpis.active
        );


        assign(
            "kpi-patients-followup",
            kpis.followup
        );


        assign(
            "kpi-patients-alerts",
            kpis.activeAlerts
        );


        assign(
            "summary-patients",
            kpis.total
        );


        assign(
            "summary-active",
            kpis.active
        );


        assign(
            "summary-followup",
            kpis.followup
        );


        assign(
            "summary-alerts",
            kpis.activeAlerts
        );


        renderTable();

        renderAppointments();
    }


    function renderTable() {

        controls.table.innerHTML =
            "";


        if (
            !patients.length
        ) {

            controls.table.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="patients-empty-row">

                        ${t(
                            "no_patients_filter",
                            "No patients were found with the selected filters."
                        )}

                    </td>
                </tr>
            `;

            return;
        }


        patients.forEach(
            (patient) => {

                const [
                    label,
                    className
                ] =
                    statusInfo(
                        patient.status
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>

                        <i class="fa-solid fa-user"></i>

                        ${nyvoraEscapeHtml(
                            patient.fullName
                        )}

                    </td>


                    <td>

                        ${
                            patient.age ??
                            t(
                                "no_data",
                                "N/A"
                            )
                        }

                    </td>


                    <td>

                        ${
                            patient.initialWeightKg != null
                                ? `${patient.initialWeightKg} kg`
                                : t(
                                    "no_record",
                                    "No record"
                                )
                        }

                    </td>


                    <td>

                        ${
                            patient.lastMeasurementDate
                                ? nyvoraFormatDate(
                                    patient.lastMeasurementDate
                                )
                                : t(
                                    "no_checkups",
                                    "No checkups"
                                )
                        }

                    </td>


                    <td>

                        <span
                            class="badge ${className}">

                            ${label}

                        </span>

                    </td>


                    <td>

                        <a
                            href="historial.html?id=${patient.id}"
                            class="action-link"
                            title="${t(
                                "open_record",
                                "Open Record"
                            )}">

                            <i class="fa-solid fa-eye"></i>

                            ${t(
                                "open_record",
                                "Open Record"
                            )}

                        </a>


                        <button
                            type="button"
                            class="action-link patient-edit"
                            title="${t(
                                "edit_patient",
                                "Edit Patient"
                            )}">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                    </td>
                `;


                row
                    .querySelector(
                        ".patient-edit"
                    )
                    .addEventListener(
                        "click",
                        () =>
                            openModal(
                                patient
                            )
                    );


                controls.table.appendChild(
                    row
                );
            }
        );
    }


    function renderAppointments() {

        if (
            !controls.appointments
        ) {

            return;
        }


        controls.appointments.innerHTML =
            "";


        if (
            !upcomingAppointments.length
        ) {

            controls.appointments.innerHTML = `

                <div
                    class="patients-empty-state">

                    <div
                        class="patients-empty-state-icon">

                        <i
                            class="fa-regular fa-calendar">
                        </i>

                    </div>


                    <div>

                        <strong>

                            ${t(
                                "no_appointments",
                                "No appointments scheduled."
                            )}

                        </strong>


                        <span>

                            ${t(
                                "appointments_empty_description",
                                "Upcoming appointments will appear here when scheduled."
                            )}

                        </span>

                    </div>

                </div>
            `;

            return;
        }


        upcomingAppointments.forEach(
            (appointment) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "patients-appointment-item";


                item.innerHTML = `

                    <div>

                        <strong>

                            ${nyvoraEscapeHtml(
                                appointment.patientName
                            )}

                        </strong>


                        <span>

                            ${nyvoraEscapeHtml(
                                appointmentTypeLabel(
                                    appointment.type
                                )
                            )}

                        </span>

                    </div>


                    <time>

                        ${nyvoraFormatDate(
                            appointment.date
                        )}

                        ${String(
                            appointment.time
                        ).slice(
                            0,
                            5
                        )}

                    </time>
                `;


                controls.appointments.appendChild(
                    item
                );
            }
        );
    }


    function renderSuggestions() {

        const term =
            normalize(
                controls.search.value
            );


        controls.results.innerHTML =
            "";


        if (!term) {

            controls.results.classList.remove(
                "open"
            );

            return;
        }


        const matches =
            patients
                .filter(
                    (patient) =>
                        [
                            patient.fullName,
                            patient.identification,
                            patient.phone,
                            patient.status
                        ]
                        .some(
                            (value) =>
                                normalize(
                                    value
                                ).includes(
                                    term
                                )
                        )
                )
                .slice(
                    0,
                    8
                );


        controls.results.innerHTML =
            matches.length
                ? ""
                : `
                    <div
                        class="patient-search-empty">

                        ${t(
                            "no_patients_found",
                            "No patients found."
                        )}

                    </div>
                `;


        matches.forEach(
            (patient) => {

                const option =
                    document.createElement(
                        "button"
                    );


                option.type =
                    "button";


                option.className =
                    "patient-search-option";


                option.innerHTML = `

                    <div
                        class="patient-search-option-icon">

                        <i
                            class="fa-regular fa-user">
                        </i>

                    </div>


                    <div
                        class="patient-search-option-info">

                        <strong>

                            ${nyvoraEscapeHtml(
                                patient.fullName
                            )}

                        </strong>


                        <span>

                            ${nyvoraEscapeHtml(
                                [
                                    patient.identification,
                                    patient.phone
                                ]
                                .filter(Boolean)
                                .join(" · ") ||

                                t(
                                    "registered_patient",
                                    "Registered patient"
                                )
                            )}

                        </span>

                    </div>
                `;


                option.addEventListener(
                    "click",
                    () => {

                        controls.search.value =
                            patient.fullName;


                        controls.results.classList.remove(
                            "open"
                        );


                        loadPatients();
                    }
                );


                controls.results.appendChild(
                    option
                );
            }
        );


        controls.results.classList.add(
            "open"
        );
    }


    function clearErrors() {

        controls.form
            .querySelectorAll(
                ".patient-field"
            )
            .forEach(
                (field) =>
                    field.classList.remove(
                        "has-error"
                    )
            );


        controls.form
            .querySelectorAll(
                ".field-error"
            )
            .forEach(
                (element) =>
                    element.textContent =
                        ""
            );
    }


    function fieldError(
        field,
        message
    ) {

        const container =
            field.closest(
                ".patient-field"
            );


        if (!container) {

            return;
        }


        container.classList.add(
            "has-error"
        );


        const error =
            container.querySelector(
                ".field-error"
            );


        if (error) {

            error.textContent =
                message;
        }
    }


    function valid() {

        clearErrors();

        let result =
            true;


        const age =
            Number(
                fields.age.value
            );


        const height =
            Number(
                fields.height.value
            );


        if (
            !fields.name.value.trim()
        ) {

            fieldError(
                fields.name,
                t(
                    "name_required",
                    "Enter the full name."
                )
            );

            result =
                false;
        }


        if (
            !Number.isFinite(age) ||
            age < 0 ||
            age > 120
        ) {

            fieldError(
                fields.age,
                t(
                    "age_invalid",
                    "Enter a valid age."
                )
            );

            result =
                false;
        }


        if (
            !Number.isFinite(height) ||
            height < 0.5 ||
            height > 2.5
        ) {

            fieldError(
                fields.height,
                t(
                    "height_invalid",
                    "Enter a valid height."
                )
            );

            result =
                false;
        }


        return result;
    }


    function openModal(
        patient = null
    ) {

        fields.id =
            patient?.id ||
            null;


        controls.form.reset();

        clearErrors();


        document.getElementById(
            "patient-modal-title"
        ).textContent =

            patient
                ? t(
                    "edit_patient",
                    "Edit Patient"
                )
                : t(
                    "save_patient",
                    "Register Patient"
                );


        if (patient) {

            fields.name.value =
                patient.fullName ||
                "";


            fields.identification.value =
                patient.identification ||
                "";


            fields.age.value =
                patient.age ??
                "";


            fields.phone.value =
                patient.phone ||
                "";


            fields.height.value =
                patient.heightM ??
                "";


            fields.status.value =
                patient.status ||
                "ACTIVO";


            fields.condition.value =
                patient.conditionGeneral ||
                "";


            fields.observations.value =
                patient.observations ||
                "";

        } else {

            fields.status.value =
                "ACTIVO";
        }


        controls.modal.classList.add(
            "is-open"
        );


        controls.modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "patient-modal-open"
        );


        fields.name.focus();
    }


    function closeModal() {

        controls.modal.classList.remove(
            "is-open"
        );


        controls.modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "patient-modal-open"
        );


        fields.id =
            null;
    }


    async function save(
        event
    ) {

        event.preventDefault();


        if (
            !valid()
        ) {

            return;
        }


        const body = {

            fullName:
                fields.name.value.trim(),

            identification:
                fields.identification.value.trim(),

            age:
                Number(
                    fields.age.value
                ),

            phone:
                fields.phone.value.trim(),

            heightM:
                Number(
                    fields.height.value
                ),

            status:
                fields.status.value,

            conditionGeneral:
                fields.condition.value.trim(),

            observations:
                fields.observations.value.trim()
        };


        if (
            fields.id
        ) {

            body.id =
                fields.id;
        }


        try {

            const result =
                await nyvoraApi(
                    "patients.php",
                    {
                        method:
                            fields.id
                                ? "PUT"
                                : "POST",

                        body:
                            body
                    }
                );


            closeModal();


            nyvoraNotify(
                "patients"
            );


            await loadPatients();


            showError(
                result.message
            );


        } catch (error) {

            showError(
                error.message
            );
        }
    }


    controls.search.addEventListener(
        "input",
        () => {

            renderSuggestions();

            loadPatients();
        }
    );


    controls.statusFilter.addEventListener(
        "change",
        loadPatients
    );


    controls.orderFilter.addEventListener(
        "change",
        loadPatients
    );


    controls.open.addEventListener(
        "click",
        () =>
            openModal()
    );


    controls.form.addEventListener(
        "submit",
        save
    );


    document
        .getElementById(
            "close-patient-modal"
        )
        .addEventListener(
            "click",
            closeModal
        );


    document
        .getElementById(
            "cancel-patient-modal"
        )
        .addEventListener(
            "click",
            closeModal
        );


    controls.modal
        .querySelector(
            ".patient-modal-backdrop"
        )
        .addEventListener(
            "click",
            closeModal
        );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                closeModal();
            }
        }
    );


    window.addEventListener(
        "nyvora:data-changed",
        (event) => {

            if (
                event.detail.type !==
                "patients"
            ) {

                loadPatients();
            }
        }
    );


    document.addEventListener(
        "languageChanged",
        () => {

            loadPatients();
        }
    );


    loadPatients();
});