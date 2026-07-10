"use strict";

/* Dashboard */

document.addEventListener("DOMContentLoaded", () => {

    /* Elementos del DOM */

    const tablaPacientes =
        document.querySelectorAll(".dashboard-grid .panel table")[0];

    const tbodyPacientes =
        tablaPacientes.querySelector("tbody");

    const tablaAlertas =
        document.querySelectorAll(".dashboard-grid .panel table")[1];

    const tbodyAlertas =
        tablaAlertas.querySelector("tbody");

    const kpiCards =
        document.querySelectorAll(".kpi-cards .card");

    /* Gráficos */

    let weightChart = null;

    let statusChart = null;

    let alertChart = null;

    /* Información de estados */

    function estadoInfo(status) {

        const mapa = {

            ACTIVO: {

                texto: "Activo",

                clase: "success"

            },

            SEGUIMIENTO: {

                texto: "Seguimiento",

                clase: "warning"

            },

            INACTIVO: {

                texto: "Inactivo",

                clase: "danger"

            }

        };

        return mapa[status] || {

            texto: status,

            clase: "warning"

        };

    }

    /* Información de prioridad */

    function prioridadInfo(priority) {

        const mapa = {

            ALTA: {

                texto: "Alta",

                clase: "danger"

            },

            MEDIA: {

                texto: "Media",

                clase: "warning"

            },

            BAJA: {

                texto: "Baja",

                clase: "success"

            }

        };

        return mapa[priority] || {

            texto: priority,

            clase: "warning"

        };

    }

    /* Crear fila de paciente */

    function crearFilaPaciente(paciente) {

        const ultima =
            nyvoraGetLatestMetric(paciente.id);

        const estado =
            estadoInfo(paciente.status);

        const fila =
            document.createElement("tr");

        fila.innerHTML = `

            <td>

                <i class="fa-solid fa-user"></i>

                ${nyvoraEscapeHtml(paciente.fullName)}

            </td>

            <td>

                ${paciente.age ?? "N/D"}

            </td>

            <td>

                ${ultima
                    ? nyvoraFormatDate(ultima.measurementDate)
                    : "Sin controles"}

            </td>

            <td>

                <span class="badge ${estado.clase}">

                    ${estado.texto}

                </span>

            </td>

            <td>

                <a
                    href="metricas.html"
                    class="action-link">

                    <i class="fa-solid fa-chart-line"></i>

                    Ver

                </a>

            </td>

        `;

        return fila;

    }

    /* Crear fila de alerta */

    function crearFilaAlerta(alerta) {

        const paciente =
            nyvoraGetPatientById(alerta.patientId);

        const prioridad =
            prioridadInfo(alerta.priority);

        const fila =
            document.createElement("tr");

        fila.innerHTML = `

            <td>

                ${paciente
                    ? nyvoraEscapeHtml(paciente.fullName)
                    : "Paciente desconocido"}

            </td>

            <td>

                ${nyvoraEscapeHtml(alerta.message)}

            </td>

            <td>

                <span class="badge ${prioridad.clase}">

                    ${prioridad.texto}

                </span>

            </td>

        `;

        return fila;

    }

    /* Actualizar KPIs */

    function actualizarKPIs() {

        const pacientes =
            nyvoraGetPatients();

        const metricas =
            nyvoraGetMetrics();

        const alertas =
            nyvoraGetAlerts().filter(

                alerta => alerta.status === "ACTIVE"

            );

        const pacientesActivos =
            pacientes.filter(

                paciente => paciente.status === "ACTIVO"

            ).length;

        const datos = [

            pacientes.length,

            metricas.length,

            alertas.length,

            pacientes.length
                ? Math.round(
                    (pacientesActivos / pacientes.length) * 100
                )
                : 0

        ];

        kpiCards.forEach((card, index) => {

            const value =
                card.querySelector("h2");

            if (!value) return;

            value.textContent =
                index === 3
                    ? `${datos[index]}%`
                    : datos[index];

        });

    }

        /* Cargar pacientes */

    function cargarPacientes() {

        tbodyPacientes.innerHTML = "";

        const pacientes =
            nyvoraGetPatients();

        const recientes =
            pacientes.slice(0, 5);

        if (!recientes.length) {

            tbodyPacientes.innerHTML = `

                <tr>

                    <td colspan="5" style="text-align:center;color:#999;">

                        No hay pacientes registrados.

                    </td>

                </tr>

            `;

            return;

        }

        recientes.forEach((paciente) => {

            tbodyPacientes.appendChild(

                crearFilaPaciente(paciente)

            );

        });

    }

    /* Cargar alertas recientes */

    function cargarAlertas() {

        tbodyAlertas.innerHTML = "";

        const alertas =

            nyvoraGetAlerts()

                .filter((alerta) =>

                    alerta.status === "ACTIVE"

                )

                .slice(0, 5);

        if (!alertas.length) {

            tbodyAlertas.innerHTML = `

                <tr>

                    <td colspan="3" style="text-align:center;color:#999;">

                        No hay alertas activas.

                    </td>

                </tr>

            `;

            return;

        }

        alertas.forEach((alerta) => {

            tbodyAlertas.appendChild(

                crearFilaAlerta(alerta)

            );

        });

    }

    /* Cargar datos */

    function cargarDatos() {

        actualizarKPIs();

        cargarPacientes();

        cargarAlertas();

        cargarGraficos();

    }

    /* Cargar gráficos */

    function cargarGraficos() {

        const pacientes =
            nyvoraGetPatients();

        const metricas =
            nyvoraGetMetrics();

        const alertas =
            nyvoraGetAlerts();

        /* Evolución del peso */

        const historialPeso =

            [...metricas]

                .sort((a, b) =>

                    nyvoraBuildDate(a.measurementDate) -

                    nyvoraBuildDate(b.measurementDate)

                )

                .slice(-10);

        const pesoLabels =

            historialPeso.map((m) =>

                nyvoraFormatDate(m.measurementDate)

            );

        const pesoData =

            historialPeso.map((m) =>

                m.weightKg

            );

        if (weightChart) {

            weightChart.destroy();

        }

        weightChart = new Chart(

            document.getElementById("weightChart"),

            {

                type: "line",

                data: {

                    labels: pesoLabels,

                    datasets: [

                        {

                            label: "Peso (kg)",

                            data: pesoData,

                            borderWidth: 2,

                            tension: .35,

                            fill: false

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    }

                }

            }

        );

        /* Pacientes por estado */

        const activos =

            pacientes.filter(

                p => p.status === "ACTIVO"

            ).length;

        const seguimiento =

            pacientes.filter(

                p => p.status === "SEGUIMIENTO"

            ).length;

        const inactivos =

            pacientes.filter(

                p => p.status === "INACTIVO"

            ).length;

                    if (statusChart) {

            statusChart.destroy();

        }

        statusChart = new Chart(

            document.getElementById("statusChart"),

            {

                type: "doughnut",

                data: {

                    labels: [

                        "Activos",

                        "Seguimiento",

                        "Inactivos"

                    ],

                    datasets: [

                        {

                            data: [

                                activos,

                                seguimiento,

                                inactivos

                            ]

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: true,

                            position: "bottom"

                        }

                    }

                }

            }

        );

        /* Alertas por prioridad */

        const altas =

            alertas.filter(

                a => a.priority === "ALTA"

            ).length;

        const medias =

            alertas.filter(

                a => a.priority === "MEDIA"

            ).length;

        const bajas =

            alertas.filter(

                a => a.priority === "BAJA"

            ).length;

        if (alertChart) {

            alertChart.destroy();

        }

        alertChart = new Chart(

            document.getElementById("alertChart"),

            {

                type: "bar",

                data: {

                    labels: [

                        "Alta",

                        "Media",

                        "Baja"

                    ],

                    datasets: [

                        {

                            label: "Alertas",

                            data: [

                                altas,

                                medias,

                                bajas

                            ],

                            borderWidth: 1

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0

                            }

                        }

                    }

                }

            }

        );

    }

    /* Escuchar cambios */

    window.addEventListener(

        "nyvora:data-changed",

        (e) => {

            if (

                e.detail.type === "patients" ||

                e.detail.type === "metrics" ||

                e.detail.type === "alerts"

            ) {

                cargarDatos();

            }

        }

    );

    /* Inicializar Dashboard */

    cargarDatos();

});

