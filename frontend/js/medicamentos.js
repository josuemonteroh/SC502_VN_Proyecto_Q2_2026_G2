"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const API_URL =
        "medications.php";

    const search =
        document.getElementById(
            "medication-search"
        );

    const statusFilter =
        document.getElementById(
            "medication-status-filter"
        );

    const presentationFilter =
        document.getElementById(
            "medication-presentation-filter"
        );

    const body =
        document.getElementById(
            "medications-table-body"
        );

    const count =
        document.getElementById(
            "medication-results-count"
        );

    const modal =
        document.getElementById(
            "medication-modal"
        );

    const form =
        document.getElementById(
            "medication-form"
        );


    const fields = {

        id: null,

        name:
            document.getElementById(
                "medication-name"
            ),

        presentation:
            document.getElementById(
                "medication-presentation"
            ),

        concentration:
            document.getElementById(
                "medication-concentration"
            ),

        dose:
            document.getElementById(
                "medication-dose"
            ),

        frequency:
            document.getElementById(
                "medication-frequency"
            ),

        status:
            document.getElementById(
                "medication-status"
            ),

        observations:
            document.getElementById(
                "medication-observations"
            )
    };


    let medications = [];


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


    function statusInfo(status) {

        const estados = {

            ACTIVO: {

                texto:
                    traducir(
                        "active",
                        "Activo"
                    ),

                clase:
                    "active"
            },

            EN_USO: {

                texto:
                    traducir(
                        "in_use",
                        "En uso"
                    ),

                clase:
                    "in-use"
            },

            INACTIVO: {

                texto:
                    traducir(
                        "inactive",
                        "Inactivo"
                    ),

                clase:
                    "inactive"
            }
        };


        return (
            estados[status] || {

                texto:
                    status ||
                    traducir(
                        "undefined_status",
                        "Sin estado"
                    ),

                clase:
                    "inactive"
            }
        );
    }


    function traducirPresentacion(
        value
    ) {

        const presentaciones = {

            "Tabletas":
                traducir(
                    "tablets",
                    "Tabletas"
                ),

            "Cápsulas":
                traducir(
                    "capsules",
                    "Cápsulas"
                ),

            "Jarabe":
                traducir(
                    "syrup",
                    "Jarabe"
                ),

            "Suspensión":
                traducir(
                    "suspension",
                    "Suspensión"
                ),

            "Solución":
                traducir(
                    "solution",
                    "Solución"
                ),

            "Inyectable":
                traducir(
                    "injectable",
                    "Inyectable"
                ),

            "Crema":
                traducir(
                    "cream",
                    "Crema"
                ),

            "Otro":
                traducir(
                    "other",
                    "Otro"
                )
        };


        return (
            presentaciones[value] ||
            value ||
            traducir(
                "no_data",
                "N/D"
            )
        );
    }


    function traducirFrecuencia(
        value
    ) {

        if (
            value &&
            value.trim()
        ) {

            return value;
        }


        return traducir(
            "undefined_frequency",
            "Sin frecuencia definida"
        );
    }


    function traducirDosis(
        value
    ) {

        if (
            value &&
            value.trim()
        ) {

            return value;
        }


        return traducir(
            "undefined_condition",
            "Sin definir"
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
            statusFilter.value
        ) {

            query.set(
                "status",
                statusFilter.value
            );
        }


        if (
            presentationFilter.value
        ) {

            query.set(
                "presentation",
                presentationFilter.value
            );
        }


        try {

            const result =
                await nyvoraApi(
                    `${API_URL}?${query}`
                );


            medications =
                result.data ||
                [];


            render(
                result.kpis ||
                {}
            );


        } catch (error) {

            body.innerHTML = `
                <tr>

                    <td
                        colspan="7">

                        ${nyvoraEscapeHtml(
                            error.message
                        )}

                    </td>

                </tr>
            `;
        }
    }


    function render(kpis) {

        const values = [

            [
                "kpi-medications-total",
                kpis.total
            ],

            [
                "kpi-medications-active",
                kpis.active
            ],

            [
                "kpi-medications-used",
                kpis.inUse
            ],

            [
                "kpi-medications-inactive",
                kpis.inactive
            ]
        ];


        values.forEach(
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


        body.innerHTML =
            "";


        const cantidad =
            medications.length;


        count.textContent =
            `${cantidad} ${
                cantidad === 1
                    ? traducir(
                        "results_one",
                        "resultado"
                    )
                    : traducir(
                        "results_many",
                        "resultados"
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
                                ${traducir(
                                    "no_medications_registered",
                                    "No hay medicamentos registrados"
                                )}
                            </strong>


                            <p>
                                ${traducir(
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


        medications.forEach(
            (medication) => {

                const estado =
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
                                        medication.name
                                    )}

                                </strong>


                                <span>

                                    ${nyvoraEscapeHtml(
                                        traducirFrecuencia(
                                            medication.frequency
                                        )
                                    )}

                                </span>

                            </div>

                        </div>

                    </td>


                    <td>

                        ${nyvoraEscapeHtml(
                            traducirPresentacion(
                                medication.presentation
                            )
                        )}

                    </td>


                    <td>

                        ${nyvoraEscapeHtml(
                            medication.concentration ||
                            traducir(
                                "no_data",
                                "N/D"
                            )
                        )}

                    </td>


                    <td>

                        ${nyvoraEscapeHtml(
                            traducirDosis(
                                medication.dose
                            )
                        )}

                    </td>


                    <td>

                        <span
                            class="medication-badge ${estado.clase}">

                            ${estado.texto}

                        </span>

                    </td>


                    <td>

                        ${medication.associatedPatients || 0}

                    </td>


                    <td>

                        <div class="medication-row-actions">

                            <button
                                class="medication-action-button edit"
                                type="button"
                                title="${traducir(
                                    "edit",
                                    "Editar"
                                )}">

                                <i class="fa-solid fa-pen"></i>

                            </button>


                            <button
                                class="medication-action-button disable"
                                type="button"
                                title="${traducir(
                                    "deactivate_medication",
                                    "Dar de baja"
                                )}">

                                <i class="fa-solid fa-ban"></i>

                            </button>

                        </div>

                    </td>
                `;


                row
                    .querySelector(
                        ".edit"
                    )
                    .addEventListener(
                        "click",
                        () =>
                            open(
                                medication
                            )
                    );


                row
                    .querySelector(
                        ".disable"
                    )
                    .addEventListener(
                        "click",
                        () =>
                            deactivate(
                                medication
                            )
                    );


                body.appendChild(
                    row
                );
            }
        );
    }


    function open(
        medication = null
    ) {

        fields.id =
            medication?.id ||
            null;


        form.reset();


        document.getElementById(
            "medication-modal-title"
        ).textContent =
            medication
                ? traducir(
                    "edit_medication",
                    "Editar Medicamento"
                )
                : traducir(
                    "register_medication",
                    "Registrar Medicamento"
                );


        fields.name.value =
            medication?.name ||
            "";


        fields.presentation.value =
            medication?.presentation ||
            "";


        fields.concentration.value =
            medication?.concentration ||
            "";


        fields.dose.value =
            medication?.dose ||
            "";


        fields.frequency.value =
            medication?.frequency ||
            "";


        fields.status.value =
            medication?.status ||
            "ACTIVO";


        fields.observations.value =
            medication?.observations ||
            "";


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


    function close() {

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


    async function save(
        event
    ) {

        event.preventDefault();


        if (
            !fields.name.value.trim() ||
            !fields.presentation.value ||
            !fields.concentration.value.trim()
        ) {

            return;
        }


        const data = {

            name:
                fields.name.value.trim(),

            presentation:
                fields.presentation.value,

            concentration:
                fields.concentration.value.trim(),

            dose:
                fields.dose.value.trim(),

            frequency:
                fields.frequency.value.trim(),

            status:
                fields.status.value,

            observations:
                fields.observations.value.trim()
        };


        if (
            fields.id
        ) {

            data.id =
                fields.id;
        }


        try {

            const result =
                await nyvoraApi(
                    API_URL,
                    {
                        method:
                            fields.id
                                ? "PUT"
                                : "POST",

                        body:
                            data
                    }
                );


            close();


            nyvoraNotify(
                "medications"
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


    async function deactivate(
        medication
    ) {

        if (
            !confirm(
                `${traducir(
                    "confirm_deactivate_medication",
                    "¿Dar de baja este medicamento?"
                )}\n\n${medication.name}`
            )
        ) {

            return;
        }


        try {

            await nyvoraApi(
                API_URL,
                {
                    method:
                        "DELETE",

                    body: {
                        id:
                            medication.id
                    }
                }
            );


            nyvoraNotify(
                "medications"
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
                open()
        );


    form.addEventListener(
        "submit",
        save
    );


    const closeButton =
        document.getElementById(
            "close-medication-modal"
        );

    const cancelButton =
        document.getElementById(
            "cancel-medication"
        );

    const backdrop =
        modal.querySelector(
            ".medication-modal-backdrop"
        );


    closeButton.addEventListener(
        "click",
        close
    );


    cancelButton.addEventListener(
        "click",
        close
    );


    backdrop.addEventListener(
        "click",
        close
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                close();
            }
        }
    );


    document.addEventListener(
        "languageChanged",
        () => {

            render({


                total:
                    medications.length,

                active:
                    medications.filter(
                        (item) =>
                            item.status ===
                            "ACTIVO"
                    ).length,

                inUse:
                    medications.filter(
                        (item) =>
                            item.status ===
                            "EN_USO"
                    ).length,

                inactive:
                    medications.filter(
                        (item) =>
                            item.status ===
                            "INACTIVO"
                    ).length
            });


            if (
                modal.classList.contains(
                    "active"
                )
            ) {

                document.getElementById(
                    "medication-modal-title"
                ).textContent =
                    fields.id
                        ? traducir(
                            "edit_medication",
                            "Editar Medicamento"
                        )
                        : traducir(
                            "register_medication",
                            "Registrar Medicamento"
                        );
            }
        }
    );


    load();

});