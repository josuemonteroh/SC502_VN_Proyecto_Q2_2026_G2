"use strict";

/* Pacientes */

document.addEventListener("DOMContentLoaded", () => {

    /* Controles */

    const inputBuscar = document.querySelector(".panel .search-box[type='text']");
    const selectEstado = document.querySelectorAll(".panel select.search-box")[0];
    const selectOrden = document.querySelectorAll(".panel select.search-box")[1];
    const btnRegistrar = document.querySelector(".panel .btn-primary");

    /* Tabla */

    const tabla = document.querySelectorAll(".panel table")[0];
    const tbody = tabla.querySelector("tbody");

    /* KPIs */

    const kpis = document.querySelectorAll(".kpi-cards .card h2");

    /* Normalizar texto */

    function normalizar(texto) {

        return String(texto)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    }

    /* Estado */

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

    /* Crear fila */

    function crearFilaPaciente(paciente) {

        const inicial = nyvoraGetInitialMetric(paciente.id);
        const ultima = nyvoraGetLatestMetric(paciente.id);

        const estado = estadoInfo(paciente.status);

        const fila = document.createElement("tr");

        fila.dataset.id = paciente.id;

        fila.innerHTML = `
            <td>
                <i class="fa-solid fa-user"></i>
                ${nyvoraEscapeHtml(paciente.fullName)}
            </td>

            <td>
                ${paciente.age ?? "N/D"}
            </td>

            <td>
                ${inicial ? inicial.weightKg + " kg" : "Sin registro"}
            </td>

            <td>
                ${ultima ? nyvoraFormatDate(ultima.measurementDate) : "Sin controles"}
            </td>

            <td>
                <span class="badge ${estado.clase}">
                    ${estado.texto}
                </span>
            </td>

            <td>

                <a href="#" class="action-link">

                    <i class="fa-solid fa-eye"></i>

                    Abrir Expediente

                </a>

            </td>

        `;

        fila.querySelector(".action-link").addEventListener("click", (e) => {

            e.preventDefault();

            window.location.href = `historial.html?id=${paciente.id}`;

        });

        return fila;

    }

    /* Renderizar tabla */

    function renderTabla() {

        let pacientes = nyvoraGetPatients();

        /* Buscar por nombre */

        const busqueda = normalizar(inputBuscar.value);

        if (busqueda) {

            pacientes = pacientes.filter((paciente) =>
                normalizar(paciente.fullName).includes(busqueda)
            );

        }

        /* Filtrar por estado */

        const estadoSeleccionado = selectEstado.value;

        if (estadoSeleccionado && estadoSeleccionado !== "Estado") {

            pacientes = pacientes.filter((paciente) =>
                normalizar(estadoInfo(paciente.status).texto) ===
                normalizar(estadoSeleccionado)
            );

        }

        /* Ordenar */

        const criterio = selectOrden.value;

        if (criterio === "Nombre") {

            pacientes.sort((a, b) =>
                a.fullName.localeCompare(b.fullName)
            );

        }

        else if (criterio === "Edad") {

            pacientes.sort((a, b) =>
                (a.age || 0) - (b.age || 0)
            );

        }

        else if (criterio === "Último control") {

            pacientes.sort((a, b) => {

                const fechaA =
                    nyvoraGetLatestMetric(a.id)?.measurementDate || "";

                const fechaB =
                    nyvoraGetLatestMetric(b.id)?.measurementDate || "";

                return nyvoraBuildDate(fechaB) -
                    nyvoraBuildDate(fechaA);

            });

        }

        /* Limpiar tabla */

        tbody.innerHTML = "";

        if (pacientes.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="6"
                        style="text-align:center; padding:1rem; color:#888;">

                        No se encontraron pacientes con los filtros seleccionados.

                    </td>

                </tr>

            `;

            return;

        }

        /* Dibujar filas */

        pacientes.forEach((paciente) => {

            tbody.appendChild(
                crearFilaPaciente(paciente)
            );

        });

    }

     /* Actualizar KPIs */

    function renderKpis() {

        const pacientes = nyvoraGetPatients();

        const activos = pacientes.filter((paciente) =>
            paciente.status === "ACTIVO"
        ).length;

        const seguimiento = pacientes.filter((paciente) =>
            paciente.status === "SEGUIMIENTO"
        ).length;

        const alertasActivas = nyvoraGetAlerts().filter((alerta) =>
            alerta.status === "ACTIVE"
        ).length;

        kpis[0].textContent = pacientes.length;
        kpis[1].textContent = activos;
        kpis[2].textContent = seguimiento;
        kpis[3].textContent = alertasActivas;

    }

    /* Registro rápido */

    function registrarPacienteRapido() {

        const fullName = window.prompt(
            "Nombre completo del paciente:"
        );

        if (!fullName) {
            return;
        }

        const age = parseInt(
            window.prompt("Edad:"),
            10
        );
        const heightM = parseFloat(
            window.prompt("Estatura en metros (ej: 1.70):")
        );

        const conditionGeneral = window.prompt(
            "Condición general / objetivo:"
        );

        nyvoraAddPatient({

            fullName: nyvoraEscapeHtml(fullName),

            age,

            heightM,

            conditionGeneral: conditionGeneral
                ? nyvoraEscapeHtml(conditionGeneral)
                : "",

            status: "ACTIVO"

        });

    }

    /* Actualizar interfaz */

    function renderTodo() {

        renderTabla();

        renderKpis();

    }

        /* Eventos */

    inputBuscar.addEventListener("input", renderTabla);

    selectEstado.addEventListener("change", renderTabla);

    selectOrden.addEventListener("change", renderTabla);

    btnRegistrar.addEventListener("click", (e) => {

        e.preventDefault();

        registrarPacienteRapido();

        renderTodo();

    });

    /* Actualización */

    window.addEventListener(
        "nyvora:data-changed",
        renderTodo
    );

    /* Inicialización */

    renderTodo();

});

