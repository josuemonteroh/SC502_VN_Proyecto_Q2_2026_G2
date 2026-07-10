"use strict";

/* Dashboard */

document.addEventListener("DOMContentLoaded", () => {

    /* Elementos del DOM */

    const searchBox = document.querySelector(".panel .search-box");
    const btnRegistrar = document.querySelector(".panel .btn-primary");
    const tablaPacientes = document.querySelectorAll(".dashboard-grid .panel table")[0];
    const tbodyPacientes = tablaPacientes.querySelector("tbody");
    const tablaAlertas = document.querySelectorAll(".dashboard-grid .panel table")[1];
    const tbodyAlertas = tablaAlertas.querySelector("tbody");
    const kpiCards = document.querySelectorAll(".kpi-cards .card");

    /* Función para normalizar texto */

    function normalizar(texto) {

        return String(texto)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    }

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

    /* Información de prioridad de alerta */

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

        const ultima = nyvoraGetLatestMetric(paciente.id);
        const estado = estadoInfo(paciente.status);
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>
                <i class="fa-solid fa-user"></i>
                ${nyvoraEscapeHtml(paciente.fullName)}
            </td>
            <td>${paciente.age ?? "N/D"}</td>
            <td>${ultima ? nyvoraFormatDate(ultima.measurementDate) : "Sin controles"}</td>
            <td>
                <span class="badge ${estado.clase}">
                    ${estado.texto}
                </span>
            </td>
            <td>
                <a href="pacientes.html" class="action-link">
                    <i class="fa-solid fa-eye"></i>
                    Abrir
                </a>
            </td>
        `;

        return fila;

    }

    /* Crear fila de alerta */

    function crearFilaAlerta(alerta) {

        const paciente = nyvoraGetPatientById(alerta.patientId);
        const prioridad = prioridadInfo(alerta.priority);
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>
                ${paciente ? nyvoraEscapeHtml(paciente.fullName) : "Paciente desconocido"}
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

        const pacientes = nyvoraGetPatients();
        const metricas = nyvoraGetMetrics();
        const alertas = nyvoraGetAlerts().filter((a) => a.status === "ACTIVE");

        const kpiDatos = [
            pacientes.length,
            metricas.length,
            alertas.length,
            pacientes.length > 0
                ? Math.round(
                    (pacientes.filter((p) => p.status === "ACTIVO").length /
                        pacientes.length) *
                    100
                )
                : 0
        ];

        kpiCards.forEach((card, index) => {

            const h2 = card.querySelector("h2");

            if (h2) {

                h2.textContent = index === 3 ? kpiDatos[index] + "%" : kpiDatos[index];

            }

        });

    }

    /* Cargar pacientes recientes */

    function cargarPacientes(filtro = "") {

        tbodyPacientes.innerHTML = "";

        const pacientes = nyvoraGetPatients();
        const filtrados = filtro
            ? pacientes.filter((p) =>
                normalizar(p.fullName).includes(normalizar(filtro))
            )
            : pacientes;

        const recientes = filtrados.slice(0, 5);

        if (recientes.length === 0) {

            const fila = document.createElement("tr");
            fila.innerHTML = `<td colspan="5" style="text-align: center; color: #999;">No hay pacientes</td>`;
            tbodyPacientes.appendChild(fila);
            return;

        }

        recientes.forEach((paciente) => {

            tbodyPacientes.appendChild(crearFilaPaciente(paciente));

        });

    }

    /* Cargar alertas recientes */

    function cargarAlertas() {

        tbodyAlertas.innerHTML = "";

        const alertas = nyvoraGetAlerts()
            .filter((a) => a.status === "ACTIVE")
            .slice(0, 5);

        if (alertas.length === 0) {

            const fila = document.createElement("tr");
            fila.innerHTML = `<td colspan="3" style="text-align: center; color: #999;">No hay alertas</td>`;
            tbodyAlertas.appendChild(fila);
            return;

        }

        alertas.forEach((alerta) => {

            tbodyAlertas.appendChild(crearFilaAlerta(alerta));

        });

    }

    /* Cargar datos iniciales */

    function cargarDatos() {

        actualizarKPIs();
        cargarPacientes();
        cargarAlertas();

    }

    /* Event listeners */

    if (searchBox) {

        searchBox.addEventListener("input", (e) => {

            cargarPacientes(e.target.value);

        });

    }

    if (btnRegistrar) {

        btnRegistrar.addEventListener("click", () => {

            window.location.href = "pacientes.html";

        });

    }

    /* Escuchar cambios de datos */

    window.addEventListener("nyvora:data-changed", (e) => {

        if (e.detail.type === "patients" || e.detail.type === "metrics" || e.detail.type === "alerts") {

            cargarDatos();

        }

    });

    /* Cargar datos al iniciar */

    cargarDatos();

});
