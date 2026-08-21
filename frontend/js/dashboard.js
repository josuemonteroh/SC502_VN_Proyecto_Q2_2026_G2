"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const kpiPatients =
        document.getElementById("kpi-patients");

    const kpiAlerts =
        document.getElementById("kpi-alerts");

    const kpiAppointments =
        document.getElementById("kpi-appointments");

    const kpiMeasurements =
        document.getElementById("kpi-measurements");


    const recentPatients =
        document.getElementById("recent-patients");

    const recentAlerts =
        document.getElementById("recent-alerts");

    const appointmentsList =
        document.getElementById("appointments-list");


    const patientSearch =
        document.getElementById("weight-patient-search");

    const patientIdInput =
        document.getElementById("weight-patient");

    const patientSearchResults =
        document.getElementById("weight-patient-results");


    const weightCurrent =
        document.getElementById("weight-current");

    const weightChange =
        document.getElementById("weight-change");

    const weightLastControl =
        document.getElementById("weight-last-control");


    const userName =
        document.getElementById("dashboard-user-name");

    const userRole =
        document.getElementById("dashboard-user-role");

    const greeting =
        document.getElementById("dashboard-greeting");


    let weightChart = null;
    let statusChart = null;
    let alertChart = null;

    let dashboardData = null;
    let availablePatients = [];


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


    function formatearFecha(
        valor
    ) {

        if (!valor) {

            return traducir(
                "no_checkups",
                "Sin controles"
            );
        }


        const fecha =
            new Date(
                String(
                    valor
                ).replace(
                    " ",
                    "T"
                )
            );


        if (
            Number.isNaN(
                fecha.getTime()
            )
        ) {

            return traducir(
                "no_date",
                "Sin fecha"
            );
        }


        return fecha.toLocaleDateString(
            currentLanguage === "en"
                ? "en-US"
                : "es-CR",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"
            }
        );
    }


    function escaparTexto(
        valor
    ) {

        return String(
            valor ?? ""
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );
    }


    function normalizarTexto(
        valor
    ) {

        return String(
            valor ?? ""
        )
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim();
    }


    function traducirEstadoPaciente(
        activo
    ) {

        return activo
            ? traducir(
                "active_label",
                "Activo"
            )
            : traducir(
                "inactive_label",
                "Inactivo"
            );
    }


    function traducirTipoAlerta(
        tipo
    ) {

        const valor =
            normalizarTexto(
                tipo
            );


        if (
            valor === "peso"
        ) {

            return traducir(
                "alert_weight",
                "Peso"
            );
        }


        if (
            valor === "sueno"
        ) {

            return traducir(
                "alert_sleep",
                "Sueño"
            );
        }


        if (
            valor === "frecuencia cardiaca" ||
            valor === "frecuencia cardíaca"
        ) {

            return traducir(
                "alert_heart_rate",
                "Frecuencia cardíaca"
            );
        }


        if (
            valor === "seguimiento"
        ) {

            return traducir(
                "alert_follow_up_type",
                "Seguimiento"
            );
        }


        if (
            valor === "actividad fisica"
        ) {

            return traducir(
                "alert_physical_activity",
                "Actividad física"
            );
        }


        return tipo ||
            traducir(
                "alert_clinical",
                "Alerta clínica"
            );
    }


    function traducirMensajeAlerta(
        mensaje
    ) {

        const valor =
            normalizarTexto(
                mensaje
            );


        if (
            valor ===
            "se detecto una disminucion de peso durante los ultimos controles."
        ) {

            return currentLanguage === "en"
                ? "A decrease in weight was detected during the latest checkups."
                : mensaje;
        }


        if (
            valor ===
            "se registraron pocas horas de sueno durante el ultimo control."
        ) {

            return currentLanguage === "en"
                ? "Few hours of sleep were recorded during the latest checkup."
                : mensaje;
        }


        if (
            valor ===
            "la frecuencia cardiaca registrada requiere seguimiento."
        ) {

            return currentLanguage === "en"
                ? "The recorded heart rate requires follow-up."
                : mensaje;
        }


        return mensaje ||
            traducir(
                "no_description_available",
                "Sin información disponible."
            );
    }


    async function cargarDashboard() {

        try {

            const response =
                await fetch(
                    "http://localhost:8081/dashboard.php",
                    {
                        method:
                            "GET",

                        credentials:
                            "include"
                    }
                );


            if (
                response.status ===
                401
            ) {

                window.location.href =
                    "../login.html";

                return;
            }


            if (
                !response.ok
            ) {

                throw new Error(
                    traducir(
                        "dashboard_load_error",
                        "No se pudo cargar el dashboard."
                    )
                );
            }


            const result =
                await response.json();


            if (
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    traducir(
                        "dashboard_load_error",
                        "No se pudo cargar el dashboard."
                    )
                );
            }


            dashboardData =
                result.data;


            availablePatients =
                dashboardData.recentPatients ||
                [];


            actualizarKPIs(
                dashboardData.kpis ||
                {}
            );


            cargarPacientes(
                dashboardData.recentPatients ||
                []
            );


            cargarAlertas(
                dashboardData.recentAlerts ||
                []
            );


            cargarAgenda();

            configurarBuscadorPacientes();

            prepararGraficoPeso();

            cargarGraficoEstados(
                dashboardData.patientStatus ||
                {}
            );

            cargarGraficoAlertas(
                dashboardData.alertsByType ||
                []
            );

            cargarUsuario();


        } catch (error) {

            console.error(
                "Error cargando dashboard:",
                error
            );
        }
    }


    async function cargarUsuario() {

        try {

            const response =
                await fetch(
                    "http://localhost:8081/session_user.php",
                    {
                        method:
                            "GET",

                        credentials:
                            "include"
                    }
                );


            if (
                !response.ok
            ) {

                return;
            }


            const result =
                await response.json();


            if (
                !result.success ||
                !result.data
            ) {

                return;
            }


            const usuario =
                result.data;


            if (
                userName
            ) {

                userName.textContent =
                    usuario.fullName ||
                    traducir(
                        "registered_patient",
                        "Usuario Nyvora"
                    );
            }


            if (
                userRole
            ) {

                userRole.textContent =
                    usuario.role ||
                    traducir(
                        "responsible",
                        "Usuario"
                    );
            }


            if (
                greeting &&
                usuario.fullName
            ) {

                const primerNombre =
                    usuario.fullName
                        .split(" ")[0];


                greeting.textContent =
                    `${traducir(
                        "welcome",
                        "Bienvenido"
                    )}, ${primerNombre}`;
            }


        } catch (error) {

            console.error(
                "Error cargando usuario:",
                error
            );
        }
    }


    function actualizarKPIs(
        kpis
    ) {

        const pacientesActivos =
            dashboardData
                ?.patientStatus
                ?.activos;


        if (
            kpiPatients
        ) {

            kpiPatients.textContent =
                pacientesActivos ??
                kpis.patients ??
                0;
        }


        if (
            kpiAlerts
        ) {

            kpiAlerts.textContent =
                kpis.activeAlerts ??
                0;
        }


        if (
            kpiAppointments
        ) {

            kpiAppointments.textContent =
                kpis.appointments ??
                0;
        }


        if (
            kpiMeasurements
        ) {

            kpiMeasurements.textContent =
                kpis.measurements ??
                0;
        }
    }


    function cargarAgenda() {

        if (
            !appointmentsList
        ) {

            return;
        }


        appointmentsList.innerHTML = `
            <div class="empty-dashboard-state">

                <i class="fa-regular fa-calendar"></i>

                <p>
                    ${traducir(
                        "no_today_appointments",
                        "No hay controles programados para hoy."
                    )}
                </p>

            </div>
        `;
    }


    function cargarPacientes(
        pacientes
    ) {

        if (
            !recentPatients
        ) {

            return;
        }


        recentPatients.innerHTML =
            "";


        if (
            !pacientes.length
        ) {

            recentPatients.innerHTML = `
                <div class="empty-dashboard-state">

                    <i class="fa-regular fa-user"></i>

                    <p>
                        ${traducir(
                            "no_registered_patients",
                            "No hay pacientes registrados."
                        )}
                    </p>

                </div>
            `;

            return;
        }


        pacientes.forEach(
            (paciente) => {

                const activo =
                    Number(
                        paciente.is_active
                    ) === 1;


                const item =
                    document.createElement(
                        "a"
                    );


                item.className =
                    "dashboard-list-item";


                item.href =
                    `historial.html?id=${paciente.id}`;


                item.innerHTML = `

                    <div class="dashboard-list-icon">

                        <i class="fa-regular fa-user"></i>

                    </div>


                    <div class="dashboard-list-content">

                        <strong>

                            ${escaparTexto(
                                paciente.full_name
                            )}

                        </strong>


                        <span>

                            ${paciente.age ??
                                traducir(
                                    "no_data",
                                    "N/D"
                                )}

                            ${traducir(
                                "years",
                                "años"
                            )}

                            ·

                            ${formatearFecha(
                                paciente.last_control
                            )}

                        </span>

                    </div>


                    <span
                        class="dashboard-status
                        ${activo ? "active" : "inactive"}">

                        ${traducirEstadoPaciente(
                            activo
                        )}

                    </span>


                    <i class="fa-solid fa-arrow-right"></i>
                `;


                recentPatients.appendChild(
                    item
                );
            }
        );
    }


    function cargarAlertas(
        alertas
    ) {

        if (
            !recentAlerts
        ) {

            return;
        }


        recentAlerts.innerHTML =
            "";


        if (
            !alertas.length
        ) {

            recentAlerts.innerHTML = `
                <div class="empty-dashboard-state">

                    <i class="fa-regular fa-circle-check"></i>

                    <p>
                        ${traducir(
                            "no_active_alerts",
                            "No hay alertas activas."
                        )}
                    </p>

                </div>
            `;

            return;
        }


        alertas.forEach(
            (alerta) => {

                const item =
                    document.createElement(
                        "a"
                    );


                item.className =
                    "dashboard-list-item dashboard-alert-item";


                item.href =
                    "alertas.html";


                item.innerHTML = `

                    <div class="dashboard-list-icon alert">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                    </div>


                    <div class="dashboard-list-content">

                        <strong>

                            ${escaparTexto(
                                traducirTipoAlerta(
                                    alerta.alert_type
                                )
                            )}

                        </strong>


                        <span>

                            ${escaparTexto(
                                alerta.patient_name
                            )}

                        </span>


                        <small>

                            ${escaparTexto(
                                traducirMensajeAlerta(
                                    alerta.message
                                )
                            )}

                        </small>

                    </div>


                    <span class="dashboard-status warning">

                        ${traducir(
                            "active",
                            "Activa"
                        )}

                    </span>


                    <i class="fa-solid fa-arrow-right"></i>
                `;


                recentAlerts.appendChild(
                    item
                );
            }
        );
    }


    function configurarBuscadorPacientes() {

        if (
            !patientSearch ||
            !patientIdInput ||
            !patientSearchResults
        ) {

            return;
        }


        function cerrarResultados() {

            patientSearchResults
                .classList
                .remove(
                    "open"
                );


            patientSearch.setAttribute(
                "aria-expanded",
                "false"
            );
        }


        function mostrarResultados(
            consulta = ""
        ) {

            const termino =
                normalizarTexto(
                    consulta
                );


            const coincidencias =
                availablePatients
                    .filter(
                        (paciente) =>
                            normalizarTexto(
                                paciente.full_name
                            ).includes(
                                termino
                            )
                    )
                    .slice(
                        0,
                        8
                    );


            patientSearchResults.innerHTML =
                "";


            if (
                !coincidencias.length
            ) {

                patientSearchResults.innerHTML = `
                    <div class="patient-search-empty">

                        ${traducir(
                            "no_patients_found",
                            "No se encontraron pacientes."
                        )}

                    </div>
                `;

            } else {

                coincidencias.forEach(
                    (paciente) => {

                        const opcion =
                            document.createElement(
                                "button"
                            );


                        opcion.type =
                            "button";


                        opcion.className =
                            "patient-search-option";


                        opcion.innerHTML = `

                            <i class="fa-regular fa-user"></i>

                            <span>

                                ${escaparTexto(
                                    paciente.full_name
                                )}

                            </span>
                        `;


                        opcion.addEventListener(
                            "click",
                            () => {

                                patientIdInput.value =
                                    paciente.id;


                                patientSearch.value =
                                    paciente.full_name;


                                cerrarResultados();


                                seleccionarPacientePeso(
                                    paciente
                                );
                            }
                        );


                        patientSearchResults.appendChild(
                            opcion
                        );
                    }
                );
            }


            patientSearchResults
                .classList
                .add(
                    "open"
                );


            patientSearch.setAttribute(
                "aria-expanded",
                "true"
            );
        }


        patientSearch.addEventListener(
            "focus",
            () => {

                mostrarResultados(
                    patientSearch.value
                );
            }
        );


        patientSearch.addEventListener(
            "input",
            () => {

                patientIdInput.value =
                    "";

                limpiarResumenPeso();

                prepararGraficoPeso();

                mostrarResultados(
                    patientSearch.value
                );
            }
        );


        patientSearch.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    cerrarResultados();

                    patientSearch.blur();
                }
            }
        );


        document.addEventListener(
            "click",
            (event) => {

                if (
                    !event.target.closest(
                        ".dashboard-patient-selector"
                    )
                ) {

                    cerrarResultados();
                }
            }
        );
    }


    function seleccionarPacientePeso(
        paciente
    ) {

        if (
            !paciente
        ) {

            return;
        }


        if (
            weightCurrent
        ) {

            weightCurrent.textContent =
                traducir(
                    "no_data",
                    "N/D"
                );
        }


        if (
            weightChange
        ) {

            weightChange.textContent =
                traducir(
                    "no_data",
                    "N/D"
                );
        }


        if (
            weightLastControl
        ) {

            weightLastControl.textContent =
                formatearFecha(
                    paciente.last_control
                );
        }


        prepararGraficoPeso();
    }


    function limpiarResumenPeso() {

        if (
            weightCurrent
        ) {

            weightCurrent.textContent =
                traducir(
                    "no_data",
                    "N/D"
                );
        }


        if (
            weightChange
        ) {

            weightChange.textContent =
                traducir(
                    "no_data",
                    "N/D"
                );
        }


        if (
            weightLastControl
        ) {

            weightLastControl.textContent =
                traducir(
                    "no_data",
                    "N/D"
                );
        }
    }


    function prepararGraficoPeso() {

        const canvas =
            document.getElementById(
                "weightChart"
            );


        if (
            !canvas
        ) {

            return;
        }


        if (
            weightChart
        ) {

            weightChart.destroy();
        }


        weightChart =
            new Chart(
                canvas,
                {
                    type:
                        "line",

                    data: {

                        labels: [],

                        datasets: [
                            {

                                label:
                                    traducir(
                                        "weight_kg_chart",
                                        "Peso (kg)"
                                    ),

                                data: [],

                                borderColor:
                                    "#0E7A6E",

                                backgroundColor:
                                    "rgba(14, 122, 110, 0.10)",

                                pointBackgroundColor:
                                    "#0E7A6E",

                                pointBorderColor:
                                    "#FFFFFF",

                                pointBorderWidth:
                                    2,

                                pointRadius:
                                    4,

                                borderWidth:
                                    2,

                                tension:
                                    0.35,

                                fill:
                                    true
                            }
                        ]
                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,

                        plugins: {

                            legend: {

                                display:
                                    false
                            }
                        },

                        scales: {

                            x: {

                                grid: {
                                    display:
                                        false
                                },

                                ticks: {
                                    color:
                                        "#667085"
                                }
                            },

                            y: {

                                beginAtZero:
                                    false,

                                grid: {

                                    color:
                                        "rgba(148, 163, 184, 0.16)"
                                },

                                ticks: {
                                    color:
                                        "#667085"
                                }
                            }
                        }
                    }
                }
            );
    }


    function cargarGraficoEstados(
        estados
    ) {

        const canvas =
            document.getElementById(
                "statusChart"
            );


        if (
            !canvas
        ) {

            return;
        }


        if (
            statusChart
        ) {

            statusChart.destroy();
        }


        statusChart =
            new Chart(
                canvas,
                {

                    type:
                        "doughnut",

                    data: {

                        labels: [

                            traducir(
                                "active_plural",
                                "Activos"
                            ),

                            traducir(
                                "inactive_plural",
                                "Inactivos"
                            )
                        ],

                        datasets: [
                            {

                                data: [

                                    Number(
                                        estados.activos ||
                                        0
                                    ),

                                    Number(
                                        estados.inactivos ||
                                        0
                                    )
                                ],

                                backgroundColor: [
                                    "#0E7A6E",
                                    "#B8D8D3"
                                ],

                                borderColor:
                                    "#FFFFFF",

                                borderWidth:
                                    3,

                                hoverOffset:
                                    5
                            }
                        ]
                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,

                        cutout:
                            "68%",

                        plugins: {

                            legend: {

                                display:
                                    true,

                                position:
                                    "bottom",

                                labels: {

                                    color:
                                        "#667085",

                                    usePointStyle:
                                        true,

                                    padding:
                                        18
                                }
                            },

                            tooltip: {

                                callbacks: {

                                    label(
                                        context
                                    ) {

                                        const valores =
                                            context
                                                .dataset
                                                .data;


                                        const total =
                                            valores.reduce(
                                                (
                                                    suma,
                                                    valor
                                                ) =>
                                                    suma +
                                                    Number(
                                                        valor
                                                    ),
                                                0
                                            );


                                        const valor =
                                            Number(
                                                context.raw
                                            );


                                        const porcentaje =
                                            total
                                                ? (
                                                    (
                                                        valor /
                                                        total
                                                    ) *
                                                    100
                                                ).toFixed(
                                                    1
                                                )
                                                : 0;


                                        return `${context.label}: ${valor} (${porcentaje}%)`;
                                    }
                                }
                            }
                        }
                    }
                }
            );
    }


    function cargarGraficoAlertas(
        alertas
    ) {

        const canvas =
            document.getElementById(
                "alertChart"
            );


        if (
            !canvas
        ) {

            return;
        }


        const labels =
            alertas.map(
                (alerta) =>
                    traducirTipoAlerta(
                        alerta.alert_type
                    )
            );


        const valores =
            alertas.map(
                (alerta) =>
                    Number(
                        alerta.total
                    )
            );


        if (
            alertChart
        ) {

            alertChart.destroy();
        }


        alertChart =
            new Chart(
                canvas,
                {

                    type:
                        "bar",

                    data: {

                        labels:
                            labels,

                        datasets: [
                            {

                                label:
                                    traducir(
                                        "alert_plural",
                                        "Alertas"
                                    ),

                                data:
                                    valores,

                                backgroundColor:
                                    "rgba(14, 122, 110, 0.72)",

                                borderColor:
                                    "#0E7A6E",

                                hoverBackgroundColor:
                                    "#0E7A6E",

                                borderWidth:
                                    1,

                                borderRadius:
                                    7,

                                borderSkipped:
                                    false
                            }
                        ]
                    },

                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,

                        interaction: {

                            intersect:
                                false,

                            mode:
                                "index"
                        },

                        plugins: {

                            legend: {

                                display:
                                    false
                            },

                            tooltip: {

                                callbacks: {

                                    label(
                                        context
                                    ) {

                                        const cantidad =
                                            context
                                                .parsed
                                                .y;


                                        const palabra =
                                            cantidad === 1
                                                ? traducir(
                                                    "alert_singular",
                                                    "alerta"
                                                )
                                                : traducir(
                                                    "alert_plural",
                                                    "alertas"
                                                );


                                        return `${cantidad} ${palabra}`;
                                    }
                                }
                            }
                        },

                        scales: {

                            x: {

                                grid: {

                                    display:
                                        false
                                },

                                ticks: {

                                    color:
                                        "#667085",

                                    maxRotation:
                                        25,

                                    minRotation:
                                        0
                                }
                            },

                            y: {

                                beginAtZero:
                                    true,

                                grid: {

                                    color:
                                        "rgba(148, 163, 184, 0.16)"
                                },

                                ticks: {

                                    color:
                                        "#667085",

                                    precision:
                                        0
                                }
                            }
                        }
                    }
                }
            );
    }


    document.addEventListener(
        "languageChanged",
        () => {

            if (
                dashboardData
            ) {

                actualizarKPIs(
                    dashboardData.kpis ||
                    {}
                );


                cargarPacientes(
                    dashboardData.recentPatients ||
                    []
                );


                cargarAlertas(
                    dashboardData.recentAlerts ||
                    []
                );


                cargarGraficoEstados(
                    dashboardData.patientStatus ||
                    {}
                );


                cargarGraficoAlertas(
                    dashboardData.alertsByType ||
                    []
                );


                prepararGraficoPeso();
            }


            cargarUsuario();
        }
    );


    cargarDashboard();

});