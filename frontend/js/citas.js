"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const api = "appointments.php";

    const search =
        document.getElementById(
            "appointment-search"
        );

    const dateFilter =
        document.getElementById(
            "appointment-date-filter"
        );

    const statusFilter =
        document.getElementById(
            "appointment-status-filter"
        );

    const table =
        document.querySelector(
            "#appointments-table tbody"
        );

    const todayList =
        document.getElementById(
            "appointments-today-list"
        );

    const upcomingList =
        document.getElementById(
            "appointments-upcoming-list"
        );

    const modal =
        document.getElementById(
            "appointment-modal"
        );

    const form =
        document.getElementById(
            "appointment-form"
        );

    const patient =
        document.getElementById(
            "appointment-patient"
        );


    const fields = {

        id: null,

        date:
            document.getElementById(
                "appointment-date"
            ),

        time:
            document.getElementById(
                "appointment-time"
            ),

        type:
            document.getElementById(
                "appointment-type"
            ),

        status:
            document.getElementById(
                "appointment-status"
            ),

        reason:
            document.getElementById(
                "appointment-reason"
            ),

        notes:
            document.getElementById(
                "appointment-notes"
            )
    };


    let appointments = [];

    let patients = [];


    function traducir(
        clave,
        valorDefault = ""
    ) {

        if (
            typeof translations !== "undefined" &&
            typeof currentLanguage !== "undefined" &&
            translations[currentLanguage] &&
            translations[currentLanguage][clave] !== undefined
        ) {

            return translations[currentLanguage][clave];
        }

        return valorDefault;
    }


    const escape =
        nyvoraEscapeHtml;


    const dateToday =
        () =>
            new Date()
                .toISOString()
                .slice(0, 10);


    function typeLabel(
        value
    ) {

        const tipos = {

            VALORACION_INICIAL:
                traducir(
                    "initial_assessment",
                    "Valoración inicial"
                ),

            CONTROL_NUTRICIONAL:
                traducir(
                    "nutritional_control",
                    "Control nutricional"
                ),

            SEGUIMIENTO_BIOMETRICO:
                traducir(
                    "biometric_followup",
                    "Seguimiento biométrico"
                ),

            REVISION_CLINICA:
                traducir(
                    "clinical_review",
                    "Revisión clínica"
                ),

            OTRO:
                traducir(
                    "other",
                    "Otro"
                )
        };


        if (
            tipos[value]
        ) {

            return tipos[value];
        }


        return String(
            value || ""
        )
            .replaceAll(
                "_",
                " "
            )
            .toLowerCase()
            .replace(
                /(^|\s)\S/g,
                (letter) =>
                    letter.toUpperCase()
            );
    }


    function statusInfo(
        status
    ) {

        const estados = {

            PROGRAMADA: {

                texto:
                    traducir(
                        "scheduled",
                        "Programada"
                    ),

                clase:
                    "programada"
            },

            CONFIRMADA: {

                texto:
                    traducir(
                        "confirmed",
                        "Confirmada"
                    ),

                clase:
                    "confirmada"
            },

            COMPLETADA: {

                texto:
                    traducir(
                        "completed",
                        "Completada"
                    ),

                clase:
                    "completada"
            },

            CANCELADA: {

                texto:
                    traducir(
                        "cancelled",
                        "Cancelada"
                    ),

                clase:
                    "cancelada"
            }
        };


        return (
            estados[status] || {

                texto:
                    traducir(
                        "undefined_status",
                        "Sin estado"
                    ),

                clase:
                    "programada"
            }
        );
    }


    async function loadPatients() {

        const result =
            await nyvoraApi(
                "patients.php"
            );


        patients =
            (
                result.data ||
                []
            )
                .filter(
                    (item) =>
                        item.status !==
                        "INACTIVO"
                );
    }


    async function load() {

        const query =
            new URLSearchParams();


        if (
            search.value.trim()
        ) {

            query.set(
                "search",
                search.value.trim()
            );
        }


        if (
            dateFilter.value
        ) {

            query.set(
                "date",
                dateFilter.value
            );
        }


        if (
            statusFilter.value
        ) {

            query.set(
                "status",
                statusFilter.value
            );
        }


        try {

            const result =
                await nyvoraApi(
                    `${api}?${query}`
                );


            appointments =
                result.data ||
                [];


            render(
                result.kpis ||
                {}
            );


        } catch (error) {

            table.innerHTML = `
                <tr>

                    <td
                        colspan="7"
                        class="appointments-empty-row">

                        ${escape(
                            error.message
                        )}

                    </td>

                </tr>
            `;
        }
    }


    function render(
        kpis
    ) {

        const valores = [

            [
                "kpi-appointments-today",
                kpis.today
            ],

            [
                "kpi-appointments-upcoming",
                kpis.upcoming
            ],

            [
                "kpi-appointments-completed",
                kpis.completed
            ],

            [
                "kpi-appointments-pending",
                kpis.pending
            ]
        ];


        valores.forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (element) {

                    element.textContent =
                        value ??
                        0;
                }
            }
        );


        table.innerHTML =
            "";


        if (
            !appointments.length
        ) {

            table.innerHTML = `
                <tr>

                    <td
                        colspan="7"
                        class="appointments-empty-row">

                        ${traducir(
                            "no_appointments_filters",
                            "No se encontraron citas con los filtros seleccionados."
                        )}

                    </td>

                </tr>
            `;
        }


        appointments.forEach(
            (appointment) => {

                const estado =
                    statusInfo(
                        appointment.status
                    );


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${nyvoraFormatDate(
                            appointment.date
                        )}
                    </td>


                    <td>
                        ${String(
                            appointment.time
                        ).slice(
                            0,
                            5
                        )}
                    </td>


                    <td>
                        ${escape(
                            appointment.patientName
                        )}
                    </td>


                    <td>
                        ${escape(
                            typeLabel(
                                appointment.type
                            )
                        )}
                    </td>


                    <td>

                        <span
                            class="appointment-status ${estado.clase}">

                            ${estado.texto}

                        </span>

                    </td>


                    <td>
                        ${escape(
                            appointment.professional ||
                            traducir(
                                "no_data",
                                "N/D"
                            )
                        )}
                    </td>


                    <td>

                        <a
                            href="historial.html?id=${appointment.patientId}"
                            class="appointment-action-link"
                            title="${traducir(
                                "open_record",
                                "Abrir Expediente"
                            )}">

                            <i class="fa-solid fa-folder-open"></i>

                        </a>


                        <button
                            type="button"
                            class="appointment-action-link edit-appointment"
                            title="${traducir(
                                "reschedule",
                                "Reprogramar"
                            )}">

                            <i class="fa-solid fa-calendar-pen"></i>

                        </button>


                        ${
                            appointment.status !== "CANCELADA" &&
                            appointment.status !== "COMPLETADA"
                                ? `
                                    <button
                                        type="button"
                                        class="appointment-action-link cancel-appointment"
                                        title="${traducir(
                                            "cancel_appointment",
                                            "Cancelar"
                                        )}">

                                        <i class="fa-solid fa-ban"></i>

                                    </button>
                                `
                                : ""
                        }

                    </td>
                `;


                row.querySelector(
                    ".edit-appointment"
                ).addEventListener(
                    "click",
                    () =>
                        openModal(
                            appointment
                        )
                );


                row
                    .querySelector(
                        ".cancel-appointment"
                    )
                    ?.addEventListener(
                        "click",
                        () =>
                            cancel(
                                appointment
                            )
                    );


                table.appendChild(
                    row
                );
            }
        );


        renderList(
            todayList,
            appointments.filter(
                (item) =>
                    item.date ===
                        dateToday() &&
                    item.status !==
                        "CANCELADA"
            ),
            false
        );


        renderList(
            upcomingList,
            appointments
                .filter(
                    (item) =>
                        item.date >
                            dateToday() &&
                        [
                            "PROGRAMADA",
                            "CONFIRMADA"
                        ].includes(
                            item.status
                        )
                )
                .slice(
                    0,
                    6
                ),
            true
        );
    }


    function renderList(
        container,
        items,
        includeDate
    ) {

        container.innerHTML =
            "";


        if (
            !items.length
        ) {

            container.innerHTML = `
                <div class="appointments-empty-state">

                    <div class="appointments-empty-icon">

                        <i class="fa-regular fa-calendar"></i>

                    </div>


                    <div>

                        <strong>
                            ${traducir(
                                "no_registered_appointments",
                                "No hay citas registradas."
                            )}
                        </strong>


                        <span>
                            ${traducir(
                                "appointments_will_appear",
                                "Las citas aparecerán aquí cuando se programen."
                            )}
                        </span>

                    </div>

                </div>
            `;

            return;
        }


        items.forEach(
            (item) => {

                const estado =
                    statusInfo(
                        item.status
                    );


                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "appointment-item";


                element.innerHTML = `

                    <div class="appointment-time">

                        ${
                            includeDate
                                ? nyvoraFormatDate(
                                    item.date
                                )
                                : String(
                                    item.time
                                ).slice(
                                    0,
                                    5
                                )
                        }

                    </div>


                    <div class="appointment-info">

                        <strong>
                            ${escape(
                                item.patientName
                            )}
                        </strong>


                        <span>

                            ${escape(
                                typeLabel(
                                    item.type
                                )
                            )}

                            ${
                                includeDate
                                    ? ` · ${String(
                                        item.time
                                    ).slice(
                                        0,
                                        5
                                    )}`
                                    : ""
                            }

                        </span>

                    </div>


                    <div class="appointment-actions">

                        <span
                            class="appointment-status ${estado.clase}">

                            ${estado.texto}

                        </span>

                    </div>
                `;


                container.appendChild(
                    element
                );
            }
        );
    }


    function populatePatients(
        selected = ""
    ) {

        patient.innerHTML = `
            <option
                value=""
                disabled>

                ${traducir(
                    "select_patient",
                    "Seleccione un paciente"
                )}

            </option>
        `;


        patients.forEach(
            (item) => {

                patient.add(
                    new Option(
                        item.fullName,
                        item.id,
                        false,
                        Number(item.id) ===
                            Number(selected)
                    )
                );
            }
        );
    }


    function openModal(
        appointment = null
    ) {

        fields.id =
            appointment?.id ||
            null;


        form.reset();


        populatePatients(
            appointment?.patientId
        );


        document.getElementById(
            "appointment-modal-title"
        ).textContent =
            appointment
                ? traducir(
                    "reprogram_appointment",
                    "Reprogramar Cita"
                )
                : traducir(
                    "new_appointment",
                    "Nueva Cita"
                );


        fields.date.value =
            appointment?.date ||
            "";


        fields.time.value =
            appointment?.time ||
            "";


        fields.type.value =
            appointment?.type ||
            "";


        fields.status.value =
            appointment?.status ||
            "PROGRAMADA";


        fields.reason.value =
            appointment?.reason ||
            "";


        fields.notes.value =
            appointment?.notes ||
            "";


        fields.date.min =
            dateToday();


        modal.classList.add(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "appointment-modal-open"
        );
    }


    function closeModal() {

        modal.classList.remove(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "appointment-modal-open"
        );


        fields.id =
            null;
    }


    async function save(
        event
    ) {

        event.preventDefault();


        if (
            !patient.value ||
            !fields.date.value ||
            !fields.time.value ||
            !fields.type.value
        ) {

            return;
        }


        const body = {

            patientId:
                Number(
                    patient.value
                ),

            date:
                fields.date.value,

            time:
                fields.time.value,

            type:
                fields.type.value,

            status:
                fields.status.value,

            reason:
                fields.reason.value.trim(),

            notes:
                fields.notes.value.trim()
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
                    api,
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
                "appointments"
            );


            await load();


            alert(
                result.message
            );


        } catch (error) {

            alert(
                error.message
            );
        }
    }


    async function cancel(
        appointment
    ) {

        if (
            !window.confirm(
                `${traducir(
                    "confirm_cancel_appointment",
                    "¿Cancelar la cita?"
                )}\n\n${appointment.patientName}`
            )
        ) {

            return;
        }


        try {

            await nyvoraApi(
                api,
                {
                    method:
                        "PATCH",

                    body: {

                        id:
                            appointment.id,

                        status:
                            "CANCELADA"
                    }
                }
            );


            nyvoraNotify(
                "appointments"
            );


            await load();


        } catch (error) {

            alert(
                error.message
            );
        }
    }


    search.addEventListener(
        "input",
        load
    );


    dateFilter.addEventListener(
        "change",
        load
    );


    statusFilter.addEventListener(
        "change",
        load
    );


    document
        .getElementById(
            "open-appointment-modal"
        )
        .addEventListener(
            "click",
            async () => {

                try {

                    await loadPatients();

                    openModal();

                } catch (error) {

                    alert(
                        error.message
                    );
                }
            }
        );


    form.addEventListener(
        "submit",
        save
    );


    [
        document.getElementById(
            "close-appointment-modal"
        ),

        document.getElementById(
            "cancel-appointment-modal"
        ),

        modal.querySelector(
            ".appointment-modal-backdrop"
        )

    ].forEach(
        (button) => {

            button.addEventListener(
                "click",
                closeModal
            );
        }
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


    document.addEventListener(
        "languageChanged",
        () => {

            render({
                today:
                    appointments.filter(
                        (item) =>
                            item.date ===
                            dateToday()
                    ).length,

                upcoming:
                    appointments.filter(
                        (item) =>
                            item.date >
                                dateToday() &&
                            [
                                "PROGRAMADA",
                                "CONFIRMADA"
                            ].includes(
                                item.status
                            )
                    ).length,

                completed:
                    appointments.filter(
                        (item) =>
                            item.status ===
                            "COMPLETADA"
                    ).length,

                pending:
                    appointments.filter(
                        (item) =>
                            [
                                "PROGRAMADA",
                                "CONFIRMADA"
                            ].includes(
                                item.status
                            )
                    ).length
            });


            if (
                modal.classList.contains(
                    "is-open"
                )
            ) {

                document.getElementById(
                    "appointment-modal-title"
                ).textContent =
                    fields.id
                        ? traducir(
                            "reprogram_appointment",
                            "Reprogramar Cita"
                        )
                        : traducir(
                            "new_appointment",
                            "Nueva Cita"
                        );


                populatePatients(
                    patient.value
                );
            }
        }
    );


    load();

});