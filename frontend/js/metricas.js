"use strict";

/* Métricas */

document.addEventListener("DOMContentLoaded", () => {

    /* Controles principales */

    const inputBuscarPaciente =
        document.getElementById("buscar-paciente");

    const resultadosFiltro =
        document.getElementById(
            "resultados-pacientes-filtro"
        );

    const inputDesde =
        document.getElementById("fecha-desde");

    const inputHasta =
        document.getElementById("fecha-hasta");

    const btnLimpiarFiltros =
        document.getElementById(
            "btn-limpiar-filtros"
        );

    const btnNuevaMetrica =
        document.getElementById(
            "btn-nueva-metrica"
        );

    /* KPIs */

    const kpiMediciones =
        document.getElementById(
            "kpi-mediciones"
        );

    const kpiPacientes =
        document.getElementById(
            "kpi-pacientes"
        );

    const kpiHoy =
        document.getElementById(
            "kpi-hoy"
        );

    const kpiUltima =
        document.getElementById(
            "kpi-ultima"
        );

    /* Tabla */

    const tablaMetricas =
        document.getElementById(
            "tabla-metricas"
        );

    /* Modal */

    const modal =
        document.getElementById(
            "modal-metricas"
        );

    const btnCerrarModal =
        document.getElementById(
            "btn-cerrar-modal"
        );

    const btnCancelarModal =
        document.getElementById(
            "btn-cancelar-modal"
        );

    const modalBackdrop =
        modal.querySelector(
            "[data-close-modal]"
        );

    const formMetricas =
        document.getElementById(
            "form-metricas"
        );

    /* Paciente del modal */

    const inputPacienteModal =
        document.getElementById(
            "paciente-busqueda"
        );

    const inputPacienteId =
        document.getElementById(
            "paciente"
        );

    const resultadosModal =
        document.getElementById(
            "resultados-pacientes"
        );

    const ultimaMetricaPaciente =
        document.getElementById(
            "ultima-metrica-paciente"
        );

    /* Campos métricos */

    const inputPeso =
        document.getElementById("peso");

    const inputImc =
        document.getElementById("imc");

    const inputGrasa =
        document.getElementById("grasa");

    const inputFc =
        document.getElementById("fc");

    const inputSueno =
        document.getElementById("sueno");

    const inputPasos =
        document.getElementById("pasos");

    /* Estado */

    let pacienteFiltroId = null;

    /* Utilidades */

    function normalizar(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();
    }

    function fechaLocalActual() {
        const fecha = new Date();
        const offset =
            fecha.getTimezoneOffset();

        return new Date(
            fecha.getTime() -
            offset * 60000
        )
            .toISOString()
            .slice(0, 10);
    }

    function pacientesActivos() {
        return nyvoraGetPatients()
            .filter(
                (paciente) =>
                    paciente.isActive !== false &&
                    paciente.status !==
                    "INACTIVO"
            );
    }

    /* Búsqueda de pacientes */

    function filtrarPacientes(
        termino
    ) {
        const busqueda =
            normalizar(termino);

        let pacientes =
            pacientesActivos();

        if (busqueda) {
            pacientes =
                pacientes.filter(
                    (paciente) => {

                        return (
                            normalizar(
                                paciente.fullName
                            ).includes(
                                busqueda
                            ) ||

                            normalizar(
                                paciente.identification
                            ).includes(
                                busqueda
                            ) ||

                            normalizar(
                                paciente.phone
                            ).includes(
                                busqueda
                            )
                        );
                    }
                );
        }

        return pacientes
            .sort(
                (a, b) =>
                    String(
                        a.fullName || ""
                    ).localeCompare(
                        String(
                            b.fullName || ""
                        ),
                        "es"
                    )
            )
            .slice(0, 8);
    }

    function crearResultadoPaciente(
        paciente,
        onSelect
    ) {
        const boton =
            document.createElement(
                "button"
            );

        boton.type =
            "button";

        boton.className =
            "smart-result";

        const detalle = [
            paciente.identification,
            paciente.phone
        ]
            .filter(Boolean)
            .join(" · ");

        boton.innerHTML = `
            <div class="smart-result-icon">
                <i class="fa-regular fa-user"></i>
            </div>

            <div class="smart-result-info">
                <strong>
                    ${nyvoraEscapeHtml(
                        paciente.fullName
                    )}
                </strong>

                <span>
                    ${
                        detalle
                            ? nyvoraEscapeHtml(
                                detalle
                            )
                            : "Paciente registrado"
                    }
                </span>
            </div>
        `;

        boton.addEventListener(
            "click",
            () => {
                onSelect(paciente);
            }
        );

        return boton;
    }

    function mostrarResultadosFiltro() {
        const termino =
            inputBuscarPaciente.value;

        const pacientes =
            filtrarPacientes(
                termino
            );

        resultadosFiltro.innerHTML = "";

        if (!pacientes.length) {
            resultadosFiltro.innerHTML = `
                <div class="smart-result-empty">
                    No se encontraron pacientes.
                </div>
            `;

            resultadosFiltro.classList.add(
                "active"
            );

            return;
        }

        pacientes.forEach(
            (paciente) => {

                resultadosFiltro.appendChild(
                    crearResultadoPaciente(
                        paciente,
                        () => {
                            pacienteFiltroId =
                                Number(
                                    paciente.id
                                );

                            inputBuscarPaciente.value =
                                paciente.fullName;

                            resultadosFiltro
                                .classList.remove(
                                    "active"
                                );

                            renderMetricas();
                        }
                    )
                );
            }
        );

        resultadosFiltro.classList.add(
            "active"
        );
    }

    function mostrarResultadosModal() {
        const termino =
            inputPacienteModal.value;

        const pacientes =
            filtrarPacientes(
                termino
            );

        resultadosModal.innerHTML = "";

        if (!pacientes.length) {
            resultadosModal.innerHTML = `
                <div class="smart-result-empty">
                    No se encontraron pacientes.
                </div>
            `;

            resultadosModal.classList.add(
                "active"
            );

            return;
        }

        pacientes.forEach(
            (paciente) => {

                resultadosModal.appendChild(
                    crearResultadoPaciente(
                        paciente,
                        () => {
                            inputPacienteModal.value =
                                paciente.fullName;

                            inputPacienteId.value =
                                paciente.id;

                            resultadosModal
                                .classList.remove(
                                    "active"
                                );

                            calcularIMC();

                            mostrarUltimaMetrica(
                                paciente.id
                            );
                        }
                    )
                );
            }
        );

        resultadosModal.classList.add(
            "active"
        );
    }

    function cerrarResultados() {
        resultadosFiltro.classList.remove(
            "active"
        );

        resultadosModal.classList.remove(
            "active"
        );
    }

    /* Última medición */

    function mostrarUltimaMetrica(
        patientId
    ) {
        const metrica =
            nyvoraGetLatestMetric(
                patientId
            );

        const strong =
            ultimaMetricaPaciente
                .querySelector(
                    "strong"
                );

        if (!metrica) {
            strong.textContent =
                "Este paciente aún no tiene mediciones registradas.";

            return;
        }

        const datos = [];

        if (
            metrica.weightKg != null
        ) {
            datos.push(
                `${metrica.weightKg} kg`
            );
        }

        if (
            metrica.bmi != null
        ) {
            datos.push(
                `IMC ${metrica.bmi}`
            );
        }

        if (
            metrica.bodyFatPercentage != null
        ) {
            datos.push(
                `Grasa ${metrica.bodyFatPercentage}%`
            );
        }

        if (
            metrica.heartRate != null
        ) {
            datos.push(
                `${metrica.heartRate} bpm`
            );
        }

        const fecha =
            nyvoraFormatDate(
                metrica.measurementDate
            );

        strong.textContent =
            `${
                datos.join(" · ") ||
                "Medición registrada"
            } · ${fecha}`;
    }

    /* IMC */

    function calcularIMC() {
        const pacienteId =
            inputPacienteId.value;

        const peso =
            parseFloat(
                inputPeso.value
            );

        const paciente =
            nyvoraGetPatientById(
                pacienteId
            );

        if (
            !paciente ||
            !peso ||
            !paciente.heightM
        ) {
            inputImc.value = "";
            return;
        }

        const imc =
            nyvoraCalculateBMI(
                peso,
                paciente.heightM
            );

        inputImc.value =
            imc ?? "";
    }

    /* Modal */

    function abrirModal() {
        formMetricas.reset();

        inputPacienteId.value = "";
        inputImc.value = "";

        ultimaMetricaPaciente
            .querySelector(
                "strong"
            )
            .textContent =
            "Seleccione un paciente para consultar su última medición.";

        modal.classList.add(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "metrics-modal-open"
        );

        setTimeout(
            () => {
                inputPacienteModal.focus();
            },
            100
        );
    }

    function cerrarModal() {
        modal.classList.remove(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "metrics-modal-open"
        );

        formMetricas.reset();

        inputPacienteId.value = "";
        inputImc.value = "";

        cerrarResultados();
    }

    /* Guardar métricas */

    function guardarMetricas() {
        const pacienteId =
            inputPacienteId.value;

        const peso =
            parseFloat(
                inputPeso.value
            );

        if (!pacienteId) {
            inputPacienteModal.focus();
            return;
        }

        if (
            Number.isNaN(peso) ||
            peso <= 0
        ) {
            inputPeso.focus();
            return;
        }

        nyvoraAddMetric({
            patientId:
                Number(
                    pacienteId
                ),

            measurementDate:
                new Date()
                    .toISOString(),

            weightKg:
                peso,

            bmi:
                inputImc.value
                    ? Number(
                        inputImc.value
                    )
                    : null,

            bodyFatPercentage:
                inputGrasa.value
                    ? Number(
                        inputGrasa.value
                    )
                    : null,

            heartRate:
                inputFc.value
                    ? Number(
                        inputFc.value
                    )
                    : null,

            sleepHours:
                inputSueno.value
                    ? Number(
                        inputSueno.value
                    )
                    : null,

            steps:
                inputPasos.value
                    ? Number(
                        inputPasos.value
                    )
                    : null
        });

        cerrarModal();

        renderTodo();
    }

    /* Filtros */

    function obtenerMetricasFiltradas() {
        let metricas =
            [...nyvoraGetMetrics()];

        const busqueda =
            normalizar(
                inputBuscarPaciente.value
            );

        if (
            pacienteFiltroId
        ) {
            metricas =
                metricas.filter(
                    (metrica) =>
                        Number(
                            metrica.patientId
                        ) ===
                        Number(
                            pacienteFiltroId
                        )
                );

        } else if (
            busqueda
        ) {
            metricas =
                metricas.filter(
                    (metrica) => {

                        const paciente =
                            nyvoraGetPatientById(
                                metrica.patientId
                            );

                        return (
                            normalizar(
                                paciente?.fullName
                            ).includes(
                                busqueda
                            ) ||

                            normalizar(
                                paciente?.identification
                            ).includes(
                                busqueda
                            )
                        );
                    }
                );
        }

        if (
            inputDesde.value
        ) {
            metricas =
                metricas.filter(
                    (metrica) =>
                        nyvoraDatePart(
                            metrica.measurementDate
                        ) >=
                        inputDesde.value
                );
        }

        if (
            inputHasta.value
        ) {
            metricas =
                metricas.filter(
                    (metrica) =>
                        nyvoraDatePart(
                            metrica.measurementDate
                        ) <=
                        inputHasta.value
                );
        }

        return metricas;
    }

    /* Tabla */

    function renderMetricas() {
        const metricas =
            obtenerMetricasFiltradas();

        tablaMetricas.innerHTML = "";

        if (!metricas.length) {
            tablaMetricas.innerHTML = `
                <tr class="metrics-empty-row">
                    <td colspan="8">
                        No hay métricas registradas
                        con los filtros seleccionados.
                    </td>
                </tr>
            `;

            return;
        }

        metricas.forEach(
            (metrica) => {

                const paciente =
                    nyvoraGetPatientById(
                        metrica.patientId
                    );

                const fila =
                    document.createElement(
                        "tr"
                    );

                fila.innerHTML = `
                    <td>
                        ${nyvoraFormatDate(
                            metrica.measurementDate
                        )}
                    </td>

                    <td>
                        ${
                            paciente
                                ? nyvoraEscapeHtml(
                                    paciente.fullName
                                )
                                : "Paciente no encontrado"
                        }
                    </td>

                    <td>
                        ${
                            metrica.weightKg ??
                            "—"
                        }
                        ${
                            metrica.weightKg != null
                                ? "kg"
                                : ""
                        }
                    </td>

                    <td>
                        ${
                            metrica.bmi ??
                            "—"
                        }
                    </td>

                    <td>
                        ${
                            metrica.bodyFatPercentage ??
                            "—"
                        }
                        ${
                            metrica.bodyFatPercentage != null
                                ? "%"
                                : ""
                        }
                    </td>

                    <td>
                        ${
                            metrica.heartRate ??
                            "—"
                        }
                        ${
                            metrica.heartRate != null
                                ? "bpm"
                                : ""
                        }
                    </td>

                    <td>
                        ${
                            metrica.sleepHours ??
                            "—"
                        }
                        ${
                            metrica.sleepHours != null
                                ? "h"
                                : ""
                        }
                    </td>

                    <td>
                        ${
                            metrica.steps != null
                                ? Number(
                                    metrica.steps
                                ).toLocaleString(
                                    "es-CR"
                                )
                                : "—"
                        }
                    </td>
                `;

                tablaMetricas.appendChild(
                    fila
                );
            }
        );
    }

    /* KPIs */

    function renderKpis() {
        const metricas =
            nyvoraGetMetrics();

        const pacientes =
            new Set(
                metricas.map(
                    (metrica) =>
                        Number(
                            metrica.patientId
                        )
                )
            );

        const hoy =
            fechaLocalActual();

        const registrosHoy =
            metricas.filter(
                (metrica) =>
                    nyvoraDatePart(
                        metrica.measurementDate
                    ) ===
                    hoy
            ).length;

        kpiMediciones.textContent =
            metricas.length;

        kpiPacientes.textContent =
            pacientes.size;

        kpiHoy.textContent =
            registrosHoy;

        kpiUltima.textContent =
            metricas.length
                ? nyvoraFormatDate(
                    metricas[0]
                        .measurementDate
                )
                : "—";
    }

    /* Limpiar filtros */

    function limpiarFiltros() {
        inputBuscarPaciente.value = "";
        inputDesde.value = "";
        inputHasta.value = "";

        pacienteFiltroId = null;

        cerrarResultados();

        renderMetricas();
    }

    /* Render general */

    function renderTodo() {
        renderMetricas();
        renderKpis();
    }

    /* Eventos */

    inputBuscarPaciente
        .addEventListener(
            "input",
            () => {

                pacienteFiltroId = null;

                renderMetricas();

                mostrarResultadosFiltro();
            }
        );

    inputBuscarPaciente
        .addEventListener(
            "focus",
            mostrarResultadosFiltro
        );

    inputDesde.addEventListener(
        "change",
        renderMetricas
    );

    inputHasta.addEventListener(
        "change",
        renderMetricas
    );

    btnLimpiarFiltros.addEventListener(
        "click",
        limpiarFiltros
    );

    btnNuevaMetrica.addEventListener(
        "click",
        abrirModal
    );

    btnCerrarModal.addEventListener(
        "click",
        cerrarModal
    );

    btnCancelarModal.addEventListener(
        "click",
        cerrarModal
    );

    modalBackdrop.addEventListener(
        "click",
        cerrarModal
    );

    /* Paciente modal */

    inputPacienteModal
        .addEventListener(
            "focus",
            mostrarResultadosModal
        );

    inputPacienteModal
        .addEventListener(
            "input",
            () => {

                inputPacienteId.value = "";

                inputImc.value = "";

                mostrarResultadosModal();
            }
        );

    /* IMC */

    inputPeso.addEventListener(
        "input",
        calcularIMC
    );

    /* Formulario */

    formMetricas.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            guardarMetricas();
        }
    );

    /* Cerrar búsquedas */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !event.target.closest(
                    ".smart-search"
                )
            ) {
                cerrarResultados();
            }
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }

            cerrarResultados();

            if (
                modal.classList.contains(
                    "active"
                )
            ) {
                cerrarModal();
            }
        }
    );

    /* Cambios globales */

    window.addEventListener(
        "nyvora:data-changed",
        (event) => {

            if (
                [
                    "patients",
                    "metrics"
                ].includes(
                    event.detail?.type
                )
            ) {
                renderTodo();
            }
        }
    );

    /* Inicialización */

    renderTodo();
});