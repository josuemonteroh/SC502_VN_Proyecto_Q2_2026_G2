"use strict";

/* Dashboard */

document.addEventListener("DOMContentLoaded", () => {

    /* Elementos */

    const kpiPatients = document.getElementById("kpi-patients");
    const kpiAlerts = document.getElementById("kpi-alerts");
    const kpiAppointments = document.getElementById("kpi-appointments");
    const kpiMeasurements = document.getElementById("kpi-measurements");

    const recentPatients = document.getElementById("recent-patients");
    const recentAlerts = document.getElementById("recent-alerts");
    const appointmentsList = document.getElementById("appointments-list");

    const patientSearch = document.getElementById("weight-patient-search");
    const patientIdInput = document.getElementById("weight-patient");
    const patientSearchResults = document.getElementById("weight-patient-results");

    const weightCurrent = document.getElementById("weight-current");
    const weightChange = document.getElementById("weight-change");
    const weightLastControl = document.getElementById("weight-last-control");

    const userName = document.getElementById("dashboard-user-name");
    const userRole = document.getElementById("dashboard-user-role");
    const greeting = document.getElementById("dashboard-greeting");

    let weightChart = null;
    let statusChart = null;
    let alertChart = null;

    let dashboardData = null;
    let availablePatients = [];

    /* Formatear fecha */

    function formatearFecha(valor) {
        if (!valor) {
            return "Sin controles";
        }

        const fecha = new Date(
            String(valor).replace(" ", "T")
        );

        if (Number.isNaN(fecha.getTime())) {
            return "Sin fecha";
        }

        return fecha.toLocaleDateString("es-CR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    /* Escapar texto */

    function escaparTexto(valor) {
        return String(valor ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    /* Normalizar texto */

    function normalizarTexto(valor) {
        return String(valor ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    /* Cargar dashboard */

    async function cargarDashboard() {
        try {
            const response = await fetch(
                "http://localhost:8081/dashboard.php",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (response.status === 401) {
                window.location.href = "../login.html";
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "No se pudo cargar el dashboard."
                );
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "No se pudo cargar el dashboard."
                );
            }

            dashboardData = result.data;

            availablePatients =
                dashboardData.recentPatients || [];

            actualizarKPIs(
                dashboardData.kpis || {}
            );

            cargarPacientes(
                dashboardData.recentPatients || []
            );

            cargarAlertas(
                dashboardData.recentAlerts || []
            );

            cargarAgenda();

            configurarBuscadorPacientes();

            prepararGraficoPeso();

            cargarGraficoEstados(
                dashboardData.patientStatus || {}
            );

            cargarGraficoAlertas(
                dashboardData.alertsByType || []
            );

            cargarUsuario();

        } catch (error) {
            console.error(
                "Error cargando dashboard:",
                error
            );
        }
    }

    /* Usuario */

    async function cargarUsuario() {
        try {
            const response = await fetch(
                "http://localhost:8081/session_user.php",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                return;
            }

            const result = await response.json();

            if (!result.success || !result.data) {
                return;
            }

            const usuario = result.data;

            if (userName) {
                userName.textContent =
                    usuario.fullName ||
                    "Usuario Nyvora";
            }

            if (userRole) {
                userRole.textContent =
                    usuario.role ||
                    "Usuario";
            }

            if (
                greeting &&
                usuario.fullName
            ) {
                const primerNombre =
                    usuario.fullName
                        .split(" ")[0];

                greeting.textContent =
                    `Bienvenido, ${primerNombre}`;
            }

        } catch (error) {
            console.error(
                "Error cargando usuario:",
                error
            );
        }
    }

    /* KPIs */

    function actualizarKPIs(kpis) {
        const pacientesActivos =
            dashboardData?.patientStatus?.activos;

        if (kpiPatients) {
            kpiPatients.textContent =
                pacientesActivos ??
                kpis.patients ??
                0;
        }

        if (kpiAlerts) {
            kpiAlerts.textContent =
                kpis.activeAlerts ?? 0;
        }

        if (kpiAppointments) {
            /*
             * Pendiente del módulo Citas.
             */
            kpiAppointments.textContent = "0";
        }

        if (kpiMeasurements) {
            kpiMeasurements.textContent =
                kpis.measurements ?? 0;
        }
    }

    /* Agenda */

    function cargarAgenda() {
        if (!appointmentsList) {
            return;
        }

        /*
         * Se conectará cuando exista
         * el módulo de Citas.
         */

        appointmentsList.innerHTML = `
            <div class="empty-dashboard-state">
                <i class="fa-regular fa-calendar"></i>

                <p>
                    No hay controles programados para hoy.
                </p>
            </div>
        `;
    }

    /* Pacientes recientes */

    function cargarPacientes(pacientes) {
        if (!recentPatients) {
            return;
        }

        recentPatients.innerHTML = "";

        if (!pacientes.length) {
            recentPatients.innerHTML = `
                <div class="empty-dashboard-state">
                    <i class="fa-regular fa-user"></i>

                    <p>
                        No hay pacientes registrados.
                    </p>
                </div>
            `;

            return;
        }

        pacientes.forEach((paciente) => {
            const activo =
                Number(paciente.is_active) === 1;

            const item =
                document.createElement("a");

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
                        ${paciente.age ?? "N/D"} años ·
                        ${formatearFecha(
                            paciente.last_control
                        )}
                    </span>
                </div>

                <span
                    class="dashboard-status
                    ${activo ? "active" : "inactive"}">

                    ${activo ? "Activo" : "Inactivo"}
                </span>

                <i class="fa-solid fa-arrow-right"></i>
            `;

            recentPatients.appendChild(
                item
            );
        });
    }

    /* Alertas clínicas */

    function cargarAlertas(alertas) {
        if (!recentAlerts) {
            return;
        }

        recentAlerts.innerHTML = "";

        if (!alertas.length) {
            recentAlerts.innerHTML = `
                <div class="empty-dashboard-state">
                    <i class="fa-regular fa-circle-check"></i>

                    <p>
                        No hay alertas activas.
                    </p>
                </div>
            `;

            return;
        }

        alertas.forEach((alerta) => {
            const item =
                document.createElement("a");

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
                            alerta.alert_type
                        )}
                    </strong>

                    <span>
                        ${escaparTexto(
                            alerta.patient_name
                        )}
                    </span>

                    <small>
                        ${escaparTexto(
                            alerta.message
                        )}
                    </small>
                </div>

                <span class="dashboard-status warning">
                    Activa
                </span>

                <i class="fa-solid fa-arrow-right"></i>
            `;

            recentAlerts.appendChild(
                item
            );
        });
    }

    /* Buscador de pacientes */

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
                .remove("open");

            patientSearch.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        function mostrarResultados(
            consulta = ""
        ) {
            const termino =
                normalizarTexto(consulta);

            const coincidencias =
                availablePatients
                    .filter((paciente) =>
                        normalizarTexto(
                            paciente.full_name
                        ).includes(termino)
                    )
                    .slice(0, 8);

            patientSearchResults.innerHTML = "";

            if (!coincidencias.length) {
                patientSearchResults.innerHTML = `
                    <div class="patient-search-empty">
                        No se encontraron pacientes.
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

                        patientSearchResults
                            .appendChild(
                                opcion
                            );
                    }
                );
            }

            patientSearchResults
                .classList
                .add("open");

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
                patientIdInput.value = "";

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
                    event.key === "Escape"
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

    /* Selección de paciente */

    function seleccionarPacientePeso(
        paciente
    ) {
        if (!paciente) {
            return;
        }

        /*
         * dashboard.php todavía entrega
         * evolución general de peso.
         *
         * Hasta tener el endpoint individual,
         * no se muestra información falsa.
         */

        if (weightCurrent) {
            weightCurrent.textContent =
                "N/D";
        }

        if (weightChange) {
            weightChange.textContent =
                "N/D";
        }

        if (weightLastControl) {
            weightLastControl.textContent =
                formatearFecha(
                    paciente.last_control
                );
        }

        prepararGraficoPeso();
    }

    /* Limpiar resumen */

    function limpiarResumenPeso() {
        if (weightCurrent) {
            weightCurrent.textContent =
                "N/D";
        }

        if (weightChange) {
            weightChange.textContent =
                "N/D";
        }

        if (weightLastControl) {
            weightLastControl.textContent =
                "N/D";
        }
    }

    /* Gráfico inicial */

    function prepararGraficoPeso() {
        const canvas =
            document.getElementById(
                "weightChart"
            );

        if (!canvas) {
            return;
        }

        if (weightChart) {
            weightChart.destroy();
        }

        weightChart =
            new Chart(
                canvas,
                {
                    type: "line",

                    data: {
                        labels: [],

                        datasets: [
                            {
                                label:
                                    "Peso (kg)",

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
                                display: false
                            }
                        },

                        scales: {
                            x: {
                                grid: {
                                    display: false
                                },

                                ticks: {
                                    color: "#667085"
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
                                    color: "#667085"
                                }
                            }
                        }
                    }
                }
            );
    }

    /* Pacientes por estado */

    function cargarGraficoEstados(
        estados
    ) {
        const canvas =
            document.getElementById(
                "statusChart"
            );

        if (!canvas) {
            return;
        }

        if (statusChart) {
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
                            "Activos",
                            "Inactivos"
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
                                    label(context) {
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

    /* Alertas por tipo */

    function cargarGraficoAlertas(
        alertas
    ) {
        const canvas =
            document.getElementById(
                "alertChart"
            );

        if (!canvas) {
            return;
        }

        const labels =
            alertas.map(
                (alerta) =>
                    alerta.alert_type
            );

        const valores =
            alertas.map(
                (alerta) =>
                    Number(
                        alerta.total
                    )
            );

        if (alertChart) {
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
                                    "Alertas",

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
                                    label(context) {
                                        const cantidad =
                                            context
                                                .parsed
                                                .y;

                                        return `${cantidad} alerta${cantidad === 1 ? "" : "s"}`;
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

    /* Inicialización */

    cargarDashboard();
});