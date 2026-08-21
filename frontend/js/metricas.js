"use strict";

/* Métricas */

document.addEventListener("DOMContentLoaded", () => {

    const API_URL =
        "http://localhost:8081/measurements.php";

    const PATIENTS_API_URL =
        "http://localhost:8081/patients.php";

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
    let pacientes = [];
    let metricas = [];
    let metricasKpis = {};

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

    async function solicitar(url, options = {}) {
        const response = await fetch(url, {
            credentials: "include",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });

        const result = await response.json();

        if (response.status === 401) {
            window.location.href = "../login.html";
            return null;
        }

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                "No se pudo completar la solicitud."
            );
        }

        return result;
    }

    async function cargarPacientes() {
        const result = await solicitar(PATIENTS_API_URL);
        pacientes = result?.data || [];
    }

    async function cargarMetricas() {
        const query = new URLSearchParams();

        if (pacienteFiltroId) {
            query.set("patientId", pacienteFiltroId);
        }

        if (inputDesde.value) {
            query.set("dateFrom", inputDesde.value);
        }

        if (inputHasta.value) {
            query.set("dateTo", inputHasta.value);
        }

        try {
            const result = await solicitar(`${API_URL}?${query}`);
            metricas = result?.data || [];
            metricasKpis = result?.kpis || {};
            renderTodo();
        } catch (error) {
            tablaMetricas.innerHTML = `
                <tr class="metrics-empty-row">
                    <td colspan="8">
                        ${nyvoraEscapeHtml(error.message)}
                    </td>
                </tr>
            `;
        }
    }

    function pacientesActivos() {
        return pacientes
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

                            cargarMetricas();
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

    async function mostrarUltimaMetrica(
        patientId
    ) {
        const strong =
            ultimaMetricaPaciente
                .querySelector(
                    "strong"
                );

        try {
            const result = await solicitar(
                `${API_URL}?patientId=${encodeURIComponent(patientId)}`
            );
            const metrica = result?.data?.[0];

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
        } catch (error) {
            strong.textContent = error.message;
        }
    }

    /* IMC */

    function calcularIMC() {
        const pacienteId =
            inputPacienteId.value;

        const peso =
            parseFloat(
                inputPeso.value
            );

        const paciente = pacientes.find(
            (item) => Number(item.id) === Number(pacienteId)
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

    async function guardarMetricas() {
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

        try {
            await solicitar(API_URL, {
                method: "POST",
                body: JSON.stringify({
            patientId:
                Number(
                    pacienteId
                ),

            weightKg:
                peso,

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
                })
            });

            cerrarModal();
            window.dispatchEvent(
                new CustomEvent("nyvora:data-changed", {
                    detail: { type: "metrics" }
                })
            );
            await cargarMetricas();
        } catch (error) {
            console.error("Error guardando métricas:", error);
        }
    }

    /* Filtros */

    function obtenerMetricasFiltradas() {
        const busqueda = normalizar(
            inputBuscarPaciente.value
        );

        if (!busqueda || pacienteFiltroId) {
            return metricas;
        }

        return metricas.filter((metrica) => {
            const paciente = pacientes.find(
                (item) =>
                    Number(item.id) === Number(metrica.patientId)
            );

            return [
                metrica.patientName,
                metrica.patientIdentification,
                paciente?.fullName,
                paciente?.identification
            ].some((value) =>
                normalizar(value).includes(busqueda)
            );
        });
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

                const paciente = pacientes.find(
                    (item) =>
                        Number(item.id) === Number(metrica.patientId)
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
                            metrica.patientName || paciente
                                ? nyvoraEscapeHtml(
                                    metrica.patientName ||
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
        kpiMediciones.textContent =
            metricasKpis.total ?? 0;

        kpiPacientes.textContent =
            metricasKpis.patients ?? 0;

        kpiHoy.textContent =
            metricasKpis.today ?? 0;

        kpiUltima.textContent =
            metricasKpis.latest
                ? nyvoraFormatDate(
                    metricasKpis.latest
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

        cargarMetricas();
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

                cargarMetricas();

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
        cargarMetricas
    );

    inputHasta.addEventListener(
        "change",
        cargarMetricas
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
                if (event.detail?.type === "metrics") {
                    cargarMetricas();
                } else {
                    cargarPacientes()
                        .then(cargarMetricas)
                        .catch((error) =>
                            console.error(error)
                        );
                }
            }
        }
    );

    /* Inicialización */

    Promise.all([
        cargarPacientes(),
        cargarMetricas()
    ]).catch((error) => {
        console.error("Error cargando métricas:", error);
    });
});