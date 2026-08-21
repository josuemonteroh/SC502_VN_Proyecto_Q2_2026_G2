"use strict";

/* Tratamientos */

document.addEventListener("DOMContentLoaded", () => {

    /* Configuración */

    const API_URL =
        "http://localhost:8081/treatments.php";

    const PATIENTS_API_URL =
        "http://localhost:8081/patients.php";

    const MEDICATIONS_API_URL =
        "http://localhost:8081/medications.php";

    /* Controles */

    const inputBuscar =
        document.getElementById("treatment-search");

    const filtroEstado =
        document.getElementById("treatment-status");

    const filtroOrden =
        document.getElementById("treatment-order");

    const btnNuevoTratamiento =
        document.getElementById("btn-new-treatment");

    /* Tabla */

    const tbody =
        document.getElementById("treatments-body");

    /* KPIs */

    const kpiActivos =
        document.getElementById("kpi-active");

    const kpiProximos =
        document.getElementById("kpi-ending");

    const kpiCompletados =
        document.getElementById("kpi-completed");

    const kpiSuspendidos =
        document.getElementById("kpi-suspended");

    /* Modal */

    const modal =
        document.getElementById("treatment-modal");

    const btnCerrarModal =
        modal.querySelectorAll(
            "[data-close-treatment]"
        );

    const formulario =
        document.getElementById("treatment-form");

    /* Paciente */

    const inputPaciente =
        document.getElementById("treatment-patient");

    const inputPacienteId =
        document.getElementById("treatment-patient-id");

    const resultadosPaciente =
        document.getElementById("patient-results");

    /* Medicamento */

    const inputMedicamento =
        document.getElementById("treatment-medication");

    const inputMedicamentoId =
        document.getElementById("treatment-medication-id");

    const resultadosMedicamento =
        document.getElementById("medication-results");

    /* Campos */

    const inputNombre =
        document.getElementById("treatment-name");

    const inputDosis =
        document.getElementById("treatment-dose");

    const inputFrecuencia =
        document.getElementById("treatment-frequency");

    const selectEstado =
        document.getElementById("treatment-status-modal");

    const inputInicio =
        document.getElementById("treatment-start");

    const inputFin =
        document.getElementById("treatment-end");

    const inputIndicaciones =
        document.getElementById("treatment-indications");

    const inputObservaciones =
        document.getElementById("treatment-observations");

    /* Estado */

    let treatmentIdEditing = null;
    let tratamientos = [];
    let pacientes = [];
    let medicamentos = [];
    let treatmentKpis = {};

    /* Utilidades */

    function normalizar(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
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

    async function cargarCatalogos() {
        const [patientsResult, medicationsResult] =
            await Promise.all([
                solicitar(PATIENTS_API_URL),
                solicitar(MEDICATIONS_API_URL)
            ]);

        pacientes = patientsResult?.data || [];
        medicamentos = medicationsResult?.data || [];
    }

    async function cargarTratamientos() {
        const query = new URLSearchParams();

        if (inputBuscar.value.trim()) {
            query.set("search", inputBuscar.value.trim());
        }

        if (filtroEstado.value) {
            query.set("status", filtroEstado.value);
        }

        try {
            const result = await solicitar(
                `${API_URL}?${query}`
            );

            tratamientos = result?.data || [];
            treatmentKpis = result?.kpis || {};
            renderTodo();
        } catch (error) {
            tbody.innerHTML = `
                <tr class="empty-treatment-row">
                    <td colspan="9">
                        ${nyvoraEscapeHtml(error.message)}
                    </td>
                </tr>
            `;
        }
    }

    function obtenerTratamientos() {
        return tratamientos;
    }

    function obtenerMedicamentos() {
        return medicamentos;
    }

    function obtenerPacientePorId(id) {
        return pacientes.find(
            (paciente) =>
                Number(paciente.id) === Number(id)
        );
    }

    function obtenerMedicamentoPorId(id) {
        return medicamentos.find(
            (medicamento) =>
                Number(medicamento.id) === Number(id)
        );
    }

    function estadoInfo(status) {
        const estados = {
            ACTIVO: {
                texto: "Activo",
                clase: "active"
            },

            PENDIENTE: {
                texto: "Pendiente",
                clase: "pending"
            },

            COMPLETADO: {
                texto: "Completado",
                clase: "completed"
            },

            SUSPENDIDO: {
                texto: "Suspendido",
                clase: "suspended"
            }
        };

        return estados[status] || {
            texto: status || "Sin estado",
            clase: "pending"
        };
    }

    function formatearFecha(fecha) {
        if (!fecha) {
            return "Sin definir";
        }

        return nyvoraFormatDate(fecha);
    }

    function fechaActual() {
        const fecha =
            new Date();

        const offset =
            fecha.getTimezoneOffset();

        return new Date(
            fecha.getTime() -
            offset * 60000
        )
            .toISOString()
            .slice(0, 10);
    }

    /* Modal */

    function abrirModal(
        tratamiento = null
    ) {
        formulario.reset();

        treatmentIdEditing =
            tratamiento?.id || null;

        limpiarSeleccionPaciente();
        limpiarSeleccionMedicamento();

        selectEstado.value =
            "ACTIVO";

        inputInicio.value =
            fechaActual();

        if (tratamiento) {
            const paciente =
                obtenerPacientePorId(
                    tratamiento.patientId
                );

            const medicamento =
                obtenerMedicamentoPorId(
                    tratamiento.medicationId
                );

            inputPaciente.value =
                paciente?.fullName || "";

            inputPacienteId.value =
                tratamiento.patientId || "";

            inputNombre.value =
                tratamiento.name || "";

            inputMedicamento.value =
                medicamento?.name || "";

            inputMedicamentoId.value =
                tratamiento.medicationId || "";

            inputDosis.value =
                tratamiento.dose || "";

            inputFrecuencia.value =
                tratamiento.frequency || "";

            selectEstado.value =
                tratamiento.status || "ACTIVO";

            inputInicio.value =
                tratamiento.startDate || "";

            inputFin.value =
                tratamiento.endDate || "";

            inputIndicaciones.value =
                tratamiento.indications || "";

            inputObservaciones.value =
                tratamiento.observations || "";

            modal.querySelector(
                ".modal-title-group h2"
            ).textContent =
                "Editar Tratamiento";

        } else {
            modal.querySelector(
                ".modal-title-group h2"
            ).textContent =
                "Nuevo Tratamiento";
        }

        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "treatment-modal-open"
        );

        setTimeout(() => {
            inputPaciente.focus();
        }, 100);
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
            "treatment-modal-open"
        );

        formulario.reset();

        treatmentIdEditing = null;

        limpiarSeleccionPaciente();
        limpiarSeleccionMedicamento();

        cerrarResultados();
    }

    /* Selección inteligente */

    function limpiarSeleccionPaciente() {
        inputPacienteId.value = "";
    }

    function limpiarSeleccionMedicamento() {
        inputMedicamentoId.value = "";
    }

    function cerrarResultados() {
        resultadosPaciente.classList.remove(
            "active"
        );

        resultadosMedicamento.classList.remove(
            "active"
        );

        resultadosPaciente.innerHTML = "";
        resultadosMedicamento.innerHTML = "";
    }

    /* Pacientes inteligentes */

    function mostrarPacientes() {
        const termino =
            normalizar(
                inputPaciente.value
            );

        let pacientesFiltrados =
            pacientes
                .filter(
                    (paciente) =>
                        paciente.status !==
                        "INACTIVO"
                );

        if (termino) {
            pacientesFiltrados =
                pacientesFiltrados.filter(
                    (paciente) => {

                        return (
                            normalizar(
                                paciente.fullName
                            ).includes(termino) ||

                            normalizar(
                                paciente.identification
                            ).includes(termino) ||

                            normalizar(
                                paciente.phone
                            ).includes(termino)
                        );
                    }
                );
        }

        pacientesFiltrados =
            pacientesFiltrados.slice(0, 8);

        resultadosPaciente.innerHTML = "";

        if (!pacientesFiltrados.length) {
            resultadosPaciente.innerHTML = `
                <div class="smart-result-empty">
                    No se encontraron pacientes.
                </div>
            `;

            resultadosPaciente.classList.add(
                "active"
            );

            return;
        }

        pacientesFiltrados.forEach(
            (paciente) => {

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

                        inputPaciente.value =
                            paciente.fullName;

                        inputPacienteId.value =
                            paciente.id;

                        resultadosPaciente
                            .classList.remove(
                                "active"
                            );
                    }
                );

                resultadosPaciente
                    .appendChild(
                        boton
                    );
            }
        );

        resultadosPaciente.classList.add(
            "active"
        );
    }

    /* Medicamentos inteligentes */

    function mostrarMedicamentos() {
        const termino =
            normalizar(
                inputMedicamento.value
            );

        let medicamentos =
            obtenerMedicamentos()
                .filter(
                    (medicamento) =>
                        medicamento.status !==
                        "INACTIVO"
                );

        if (termino) {
            medicamentos =
                medicamentos.filter(
                    (medicamento) => {

                        return (
                            normalizar(
                                medicamento.name
                            ).includes(termino) ||

                            normalizar(
                                medicamento.presentation
                            ).includes(termino) ||

                            normalizar(
                                medicamento.concentration
                            ).includes(termino)
                        );
                    }
                );
        }

        medicamentos =
            medicamentos.slice(0, 8);

        resultadosMedicamento.innerHTML = "";

        if (!medicamentos.length) {
            resultadosMedicamento.innerHTML = `
                <div class="smart-result-empty">
                    No se encontraron medicamentos.
                </div>
            `;

            resultadosMedicamento
                .classList.add(
                    "active"
                );

            return;
        }

        medicamentos.forEach(
            (medicamento) => {

                const boton =
                    document.createElement(
                        "button"
                    );

                boton.type =
                    "button";

                boton.className =
                    "smart-result";

                boton.innerHTML = `
                    <div class="smart-result-icon">
                        <i class="fa-solid fa-pills"></i>
                    </div>

                    <div class="smart-result-info">
                        <strong>
                            ${nyvoraEscapeHtml(
                                medicamento.name
                            )}
                        </strong>

                        <span>
                            ${nyvoraEscapeHtml(
                                medicamento.presentation
                            )}
                            ·
                            ${nyvoraEscapeHtml(
                                medicamento.concentration
                            )}
                        </span>
                    </div>
                `;

                boton.addEventListener(
                    "click",
                    () => {

                        inputMedicamento.value =
                            medicamento.name;

                        inputMedicamentoId.value =
                            medicamento.id;

                        if (
                            !inputDosis.value &&
                            medicamento.dose
                        ) {
                            inputDosis.value =
                                medicamento.dose;
                        }

                        if (
                            !inputFrecuencia.value &&
                            medicamento.frequency
                        ) {
                            inputFrecuencia.value =
                                medicamento.frequency;
                        }

                        resultadosMedicamento
                            .classList.remove(
                                "active"
                            );
                    }
                );

                resultadosMedicamento
                    .appendChild(
                        boton
                    );
            }
        );

        resultadosMedicamento
            .classList.add(
                "active"
            );
    }

    /* Guardar tratamiento */

    async function guardarTratamiento() {
        const patientId =
            Number(
                inputPacienteId.value
            );

        const nombre =
            inputNombre.value.trim();

        const medicationId =
            inputMedicamentoId.value
                ? Number(
                    inputMedicamentoId.value
                )
                : null;

        const inicio =
            inputInicio.value;

        if (
            !patientId ||
            !nombre ||
            !inicio
        ) {
            return;
        }

        const datos = {
            patientId,
            name: nombre,
            medicationId,
            dose:
                inputDosis.value.trim(),

            frequency:
                inputFrecuencia.value.trim(),

            startDate:
                inicio,

            endDate:
                inputFin.value || null,

            status:
                selectEstado.value,

            indications:
                inputIndicaciones.value.trim(),

            observations:
                inputObservaciones.value.trim()
        };

        if (treatmentIdEditing) {
            datos.id = treatmentIdEditing;
        }

        try {
            await solicitar(API_URL, {
                method: treatmentIdEditing ? "PUT" : "POST",
                body: JSON.stringify(datos)
            });

            cerrarModal();
            window.dispatchEvent(
                new CustomEvent("nyvora:data-changed", {
                    detail: { type: "treatments" }
                })
            );
            await cargarTratamientos();
        } catch (error) {
            console.error("Error guardando tratamiento:", error);
        }
    }

    /* Búsqueda principal */

    function obtenerFiltrados() {
        let tratamientosFiltrados =
            [...obtenerTratamientos()];

        const termino =
            normalizar(
                inputBuscar.value
            );

        if (termino) {
            tratamientosFiltrados =
                tratamientosFiltrados.filter(
                    (tratamiento) => {

                        const paciente =
                            obtenerPacientePorId(
                                tratamiento.patientId
                            );

                        const medicamento =
                            obtenerMedicamentoPorId(
                                tratamiento.medicationId
                            );

                        const estado =
                            estadoInfo(
                                tratamiento.status
                            );

                        return (
                            normalizar(
                                tratamiento.name
                            ).includes(termino) ||

                            normalizar(
                                paciente?.fullName
                            ).includes(termino) ||

                            normalizar(
                                paciente?.identification
                            ).includes(termino) ||

                            normalizar(
                                medicamento?.name
                            ).includes(termino) ||

                            normalizar(
                                medicamento?.presentation
                            ).includes(termino) ||

                            normalizar(
                                medicamento?.concentration
                            ).includes(termino) ||

                            normalizar(
                                estado.texto
                            ).includes(termino)
                        );
                    }
                );
        }

        if (filtroEstado.value) {
            tratamientosFiltrados =
                tratamientosFiltrados.filter(
                    (tratamiento) =>
                        tratamiento.status ===
                        filtroEstado.value
                );
        }

        const orden =
            filtroOrden.value;

        if (orden === "patient") {
            tratamientosFiltrados.sort(
                (a, b) => {

                    const pacienteA =
                        obtenerPacientePorId(
                            a.patientId
                        );

                    const pacienteB =
                        obtenerPacientePorId(
                            b.patientId
                        );

                    return String(
                        pacienteA?.fullName || ""
                    )
                        .localeCompare(
                            String(
                                pacienteB?.fullName ||
                                ""
                            ),
                            "es"
                        );
                }
            );
        }

        if (orden === "startDate") {
            tratamientosFiltrados.sort(
                (a, b) =>
                    nyvoraBuildDate(
                        b.startDate
                    ) -
                    nyvoraBuildDate(
                        a.startDate
                    )
            );
        }

        if (orden === "endDate") {
            tratamientosFiltrados.sort(
                (a, b) => {

                    if (
                        !a.endDate &&
                        !b.endDate
                    ) {
                        return 0;
                    }

                    if (!a.endDate) {
                        return 1;
                    }

                    if (!b.endDate) {
                        return -1;
                    }

                    return (
                        nyvoraBuildDate(
                            a.endDate
                        ) -
                        nyvoraBuildDate(
                            b.endDate
                        )
                    );
                }
            );
        }

        if (orden === "status") {
            tratamientosFiltrados.sort(
                (a, b) =>
                    estadoInfo(
                        a.status
                    ).texto.localeCompare(
                        estadoInfo(
                            b.status
                        ).texto,
                        "es"
                    )
            );
        }

        return tratamientosFiltrados;
    }

    /* Tabla */

    function crearFila(
        tratamiento
    ) {
        const paciente =
            obtenerPacientePorId(
                tratamiento.patientId
            );

        const medicamento =
            obtenerMedicamentoPorId(
                tratamiento.medicationId
            );

        const estado =
            estadoInfo(
                tratamiento.status
            );

        const fila =
            document.createElement(
                "tr"
            );

        fila.dataset.id =
            tratamiento.id;

        fila.innerHTML = `
            <td>
                <div class="treatment-patient-cell">

                    <div class="treatment-patient-icon">
                        <i class="fa-regular fa-user"></i>
                    </div>

                    <div class="treatment-patient-info">
                        <strong>
                            ${
                                paciente
                                    ? nyvoraEscapeHtml(
                                        paciente.fullName
                                    )
                                    : "Paciente no disponible"
                            }
                        </strong>

                        <span>
                            ${
                                paciente?.identification
                                    ? nyvoraEscapeHtml(
                                        paciente.identification
                                    )
                                    : "Sin identificación"
                            }
                        </span>
                    </div>

                </div>
            </td>

            <td>
                ${nyvoraEscapeHtml(
                    tratamiento.name
                )}
            </td>

            <td>
                ${
                    medicamento
                        ? nyvoraEscapeHtml(
                            medicamento.name
                        )
                        : "Sin medicamento"
                }
            </td>

            <td>
                ${nyvoraEscapeHtml(
                    tratamiento.dose ||
                    "Sin definir"
                )}
            </td>

            <td>
                ${nyvoraEscapeHtml(
                    tratamiento.frequency ||
                    "Sin definir"
                )}
            </td>

            <td>
                ${formatearFecha(
                    tratamiento.startDate
                )}
            </td>

            <td>
                ${formatearFecha(
                    tratamiento.endDate
                )}
            </td>

            <td>
                <span
                    class="treatment-badge ${estado.clase}">
                    ${estado.texto}
                </span>
            </td>

            <td>
                <div class="treatment-row-actions">

                    ${
                        paciente
                            ? `
                                <a
                                    href="historial.html?id=${paciente.id}"
                                    class="treatment-action-button"
                                    title="Abrir expediente">

                                    <i class="fa-solid fa-folder-open"></i>

                                </a>
                            `
                            : ""
                    }

                    <button
                        type="button"
                        class="treatment-action-button edit-treatment"
                        title="Editar tratamiento">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        type="button"
                        class="treatment-action-button delete-treatment"
                        title="Suspender tratamiento">

                        <i class="fa-solid fa-ban"></i>

                    </button>

                </div>
            </td>
        `;

        fila.querySelector(
            ".edit-treatment"
        ).addEventListener(
            "click",
            () => {
                abrirModal(
                    tratamiento
                );
            }
        );

        fila.querySelector(
            ".delete-treatment"
        ).addEventListener(
            "click",
            () => eliminarTratamiento(tratamiento)
        );

        return fila;
    }

    async function eliminarTratamiento(tratamiento) {
        if (!confirm(
            `¿Suspender el tratamiento ${tratamiento.name}?`
        )) {
            return;
        }

        try {
            await solicitar(API_URL, {
                method: "DELETE",
                body: JSON.stringify({ id: tratamiento.id })
            });
            window.dispatchEvent(
                new CustomEvent("nyvora:data-changed", {
                    detail: { type: "treatments" }
                })
            );
            await cargarTratamientos();
        } catch (error) {
            console.error("Error suspendiendo tratamiento:", error);
        }
    }

    function renderTabla() {
        const tratamientos =
            obtenerFiltrados();

        tbody.innerHTML = "";

        if (!tratamientos.length) {
            tbody.innerHTML = `
                <tr class="empty-treatment-row">
                    <td colspan="9">
                        No se encontraron tratamientos.
                    </td>
                </tr>
            `;

            return;
        }

        tratamientos.forEach(
            (tratamiento) => {
                tbody.appendChild(
                    crearFila(
                        tratamiento
                    )
                );
            }
        );
    }

    /* KPIs */

    function renderKpis() {
        kpiActivos.textContent =
            treatmentKpis.active ?? 0;

        kpiProximos.textContent =
            treatmentKpis.ending ?? 0;

        kpiCompletados.textContent =
            treatmentKpis.completed ?? 0;

        kpiSuspendidos.textContent =
            treatmentKpis.suspended ?? 0;
    }

    /* Render */

    function renderTodo() {
        renderTabla();
        renderKpis();
    }

    /* Eventos búsqueda principal */

    inputBuscar.addEventListener(
        "input",
        cargarTratamientos
    );

    filtroEstado.addEventListener(
        "change",
        cargarTratamientos
    );

    filtroOrden.addEventListener(
        "change",
        renderTabla
    );

    /* Paciente */

    inputPaciente.addEventListener(
        "focus",
        mostrarPacientes
    );

    inputPaciente.addEventListener(
        "input",
        () => {
            limpiarSeleccionPaciente();
            mostrarPacientes();
        }
    );

    /* Medicamento */

    inputMedicamento.addEventListener(
        "focus",
        mostrarMedicamentos
    );

    inputMedicamento.addEventListener(
        "input",
        () => {
            limpiarSeleccionMedicamento();
            mostrarMedicamentos();
        }
    );

    /* Cerrar dropdowns */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !event.target.closest(
                    ".treatment-smart-field"
                )
            ) {
                cerrarResultados();
            }
        }
    );

    /* Modal */

    btnNuevoTratamiento.addEventListener(
        "click",
        () => abrirModal()
    );

    btnCerrarModal.forEach(
        (boton) => {
            boton.addEventListener(
                "click",
                cerrarModal
            );
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {
                if (
                    modal.classList.contains(
                        "active"
                    )
                ) {
                    cerrarModal();
                }

                cerrarResultados();
            }
        }
    );

    /* Formulario */

    formulario.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            guardarTratamiento();
        }
    );

    /* Cambios globales */

    window.addEventListener(
        "nyvora:data-changed",
        (event) => {

            if (
                [
                    "patients",
                    "medications",
                    "treatments"
                ].includes(
                    event.detail?.type
                )
            ) {
                if (event.detail?.type === "treatments") {
                    cargarTratamientos();
                } else {
                    cargarCatalogos()
                        .then(renderTodo)
                        .catch((error) =>
                            console.error(error)
                        );
                }
            }
        }
    );

    /* Inicialización */

    cargarCatalogos()
        .then(cargarTratamientos)
        .catch((error) => {
            console.error("Error cargando tratamientos:", error);
        });
});