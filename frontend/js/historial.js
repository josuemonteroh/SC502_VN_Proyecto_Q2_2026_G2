"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const API_URL =
        "http://localhost:8081/historial.php";

    const inputPaciente =
        document.getElementById("paciente-search");

    const inputPacienteId =
        document.getElementById("paciente");

    const resultadosPaciente =
        document.getElementById("patient-search-results");

    const inputDesde =
        document.getElementById("desde");

    const inputHasta =
        document.getElementById("hasta");

    const btnConsultar =
        document.getElementById("btn-consultar");

    const btnExportPdf =
        document.getElementById("btn-export-pdf");

    const btnExportExcel =
        document.getElementById("btn-export-excel");

    const resumen =
        document.querySelector(".patient-summary");

    const tablaEvolucion =
        document.querySelector(
            ".history-table-wrapper table"
        );

    const tbodyEvolucion =
        tablaEvolucion?.querySelector("tbody");

    const notasContenedor =
        document.querySelector(".clinical-notes");

    const actividadReciente =
        document
            .querySelectorAll(
                ".history-bottom-grid .panel"
            )[1]
            ?.querySelector("tbody");

    let pacientes = [];
    let pacienteActual = null;
    let medicionesActuales = [];
    let notasActuales = [];

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

    function traducirCondicion(
        condicion
    ) {

        if (!condicion) {
            return traducir(
                "undefined_condition",
                "Sin definir"
            );
        }

        const valor =
            normalizar(condicion);

        if (valor === "condicion estable") {

            return currentLanguage === "en"
                ? "Stable condition"
                : "Condición estable";
        }

        if (valor === "requiere seguimiento") {

            return currentLanguage === "en"
                ? "Requires follow-up"
                : "Requiere seguimiento";
        }

        if (valor === "condicion inestable") {

            return currentLanguage === "en"
                ? "Unstable condition"
                : "Condición inestable";
        }

        if (valor === "en seguimiento") {

            return currentLanguage === "en"
                ? "Under follow-up"
                : "En seguimiento";
        }

        return condicion;
    }

    function traducirNota(nota) {

        const texto =
            normalizar(nota);

        const traducciones = {

            "se recomienda seguimiento de frecuencia cardiaca y habitos de sueno.":
                "Heart rate and sleep habits follow-up is recommended.",

            "el paciente muestra una evolucion favorable en peso y actividad fisica.":
                "The patient shows positive progress in weight and physical activity.",

            "se recomienda controlar peso y frecuencia cardiaca.":
                "Weight and heart rate monitoring is recommended.",

            "paciente con seguimiento de peso y habitos de sueno.":
                "Patient under follow-up for weight and sleep habits.",

            "paciente en seguimiento preventivo.":
                "Patient under preventive follow-up.",

            "seguimiento de habitos de sueno y actividad.":
                "Follow-up of sleep habits and physical activity."
        };

        if (
            currentLanguage === "en" &&
            traducciones[texto]
        ) {
            return traducciones[texto];
        }

        return nota;
    }

    function actualizarResumenInicial() {

        if (!resumen) {
            return;
        }

        const elementos =
            resumen.querySelectorAll(
                ".summary-content strong"
            );

        if (
            elementos[0] &&
            !pacienteActual
        ) {
            elementos[0].textContent =
                traducir(
                    "no_data",
                    "N/D"
                );
        }

        if (
            elementos[1] &&
            !pacienteActual
        ) {
            elementos[1].textContent =
                traducir(
                    "no_data",
                    "N/D"
                );
        }

        if (
            elementos[3] &&
            !pacienteActual
        ) {
            elementos[3].textContent =
                traducir(
                    "undefined_condition",
                    "Sin definir"
                );
        }

        const badgeEstado =
            resumen.querySelector(
                ".summary-item:nth-child(5) .badge"
            );

        if (
            badgeEstado &&
            !pacienteActual
        ) {
            badgeEstado.textContent =
                traducir(
                    "no_data",
                    "N/D"
                );

            badgeEstado.className =
                "badge warning";
        }

        if (
            elementos[4] &&
            !pacienteActual
        ) {
            elementos[4].textContent =
                traducir(
                    "no_checkups",
                    "Sin controles"
                );
        }
    }

    function formatearFecha(
        fecha
    ) {

        if (!fecha) {
            return "N/D";
        }

        const fechaConvertida =
            new Date(
                String(fecha).replace(
                    " ",
                    "T"
                )
            );

        if (
            Number.isNaN(
                fechaConvertida.getTime()
            )
        ) {
            return fecha;
        }

        return fechaConvertida.toLocaleDateString(
            currentLanguage === "en"
                ? "en-US"
                : "es-CR"
        );
    }

    function escaparHTML(
        texto
    ) {

        const div =
            document.createElement("div");

        div.textContent =
            texto ?? "";

        return div.innerHTML;
    }

    function normalizar(
        texto
    ) {

        return String(
            texto || ""
        )
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();
    }

    function obtenerMedicionesFiltradas() {

        let registros =
            [...medicionesActuales];

        if (inputDesde.value) {

            const desde =
                new Date(
                    `${inputDesde.value}T00:00:00`
                );

            registros =
                registros.filter(
                    (registro) => {

                        const fecha =
                            new Date(
                                String(
                                    registro.measurementDate
                                ).replace(
                                    " ",
                                    "T"
                                )
                            );

                        return fecha >= desde;
                    }
                );
        }

        if (inputHasta.value) {

            const hasta =
                new Date(
                    `${inputHasta.value}T23:59:59`
                );

            registros =
                registros.filter(
                    (registro) => {

                        const fecha =
                            new Date(
                                String(
                                    registro.measurementDate
                                ).replace(
                                    " ",
                                    "T"
                                )
                            );

                        return fecha <= hasta;
                    }
                );
        }

        return registros;
    }

    async function cargarPacientes() {

        try {

            const respuesta =
                await fetch(
                    API_URL,
                    {
                        credentials: "include"
                    }
                );

            if (!respuesta.ok) {

                throw new Error(
                    `Error HTTP: ${respuesta.status}`
                );
            }

            const datos =
                await respuesta.json();

            if (!datos.success) {

                throw new Error(
                    datos.message ||
                    "No se pudieron cargar los pacientes."
                );
            }

            pacientes =
                Array.isArray(
                    datos.data
                )
                    ? datos.data
                    : [];

            const parametros =
                new URLSearchParams(
                    window.location.search
                );

            const patientId =
                parametros.get("patient_id") ||
                parametros.get("id");

            if (patientId) {

                const pacienteEncontrado =
                    pacientes.find(
                        (paciente) =>
                            String(
                                paciente.id
                            ) ===
                            String(
                                patientId
                            )
                    );

                if (pacienteEncontrado) {

                    seleccionarPaciente(
                        pacienteEncontrado,
                        false
                    );

                    await cargarHistorial(
                        patientId
                    );
                }
            }

        } catch (error) {

            console.error(
                "Error cargando pacientes:",
                error
            );

            inputPaciente.placeholder =
                traducir(
                    "no_results",
                    "Error al cargar pacientes"
                );
        }
    }

    function mostrarResultadosPacientes(
        termino = ""
    ) {

        const busqueda =
            normalizar(termino);

        let coincidencias =
            pacientes;

        if (busqueda) {

            coincidencias =
                pacientes.filter(
                    (paciente) => {

                        const nombre =
                            normalizar(
                                paciente.fullName
                            );

                        const identificacion =
                            normalizar(
                                paciente.identification
                            );

                        const telefono =
                            normalizar(
                                paciente.phone
                            );

                        return (
                            nombre.includes(busqueda) ||
                            identificacion.includes(busqueda) ||
                            telefono.includes(busqueda)
                        );
                    }
                );
        }

        coincidencias =
            coincidencias.slice(
                0,
                8
            );

        resultadosPaciente.innerHTML =
            "";

        if (
            coincidencias.length === 0
        ) {

            resultadosPaciente.innerHTML = `
                <div class="patient-search-empty">
                    ${traducir(
                        "no_results",
                        "No se encontraron pacientes."
                    )}
                </div>
            `;

            resultadosPaciente.classList.add(
                "active"
            );

            return;
        }

        coincidencias.forEach(
            (paciente) => {

                const boton =
                    document.createElement(
                        "button"
                    );

                boton.type =
                    "button";

                boton.className =
                    "patient-search-result";

                const identificacion =
                    paciente.identification
                        ? escaparHTML(
                            paciente.identification
                        )
                        : traducir(
                            "no_data",
                            "N/D"
                        );

                boton.innerHTML = `
                    <div
                        class="patient-search-result-icon"
                    >
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div
                        class="patient-search-result-info"
                    >

                        <strong>
                            ${escaparHTML(
                                paciente.fullName
                            )}
                        </strong>

                        <span>
                            ${identificacion}
                        </span>

                    </div>
                `;

                boton.addEventListener(
                    "click",
                    async () => {

                        seleccionarPaciente(
                            paciente
                        );

                        await cargarHistorial(
                            paciente.id
                        );
                    }
                );

                resultadosPaciente.appendChild(
                    boton
                );
            }
        );

        resultadosPaciente.classList.add(
            "active"
        );
    }

    function seleccionarPaciente(
        paciente,
        cerrarResultados = true
    ) {

        inputPaciente.value =
            paciente.fullName ||
            "";

        inputPacienteId.value =
            paciente.id;

        if (
            cerrarResultados
        ) {

            resultadosPaciente.classList.remove(
                "active"
            );
        }
    }

    function limpiarPacienteSeleccionado() {

        inputPacienteId.value =
            "";

        pacienteActual =
            null;

        medicionesActuales =
            [];

        notasActuales =
            [];

        mostrarResumen();
        mostrarMediciones();
        mostrarNotas(
            notasActuales
        );
        mostrarActividad();

        actualizarExportacion();
    }

    async function cargarHistorial(
        patientId
    ) {

        if (!patientId) {
            return;
        }

        try {

            const respuesta =
                await fetch(
                    `${API_URL}?patient_id=${encodeURIComponent(
                        patientId
                    )}`,
                    {
                        credentials: "include"
                    }
                );

            if (!respuesta.ok) {

                throw new Error(
                    `Error HTTP: ${respuesta.status}`
                );
            }

            const datos =
                await respuesta.json();

            if (!datos.success) {

                throw new Error(
                    datos.message ||
                    "No se pudo cargar el historial."
                );
            }

            pacienteActual =
                datos.patient;

            medicionesActuales =
                Array.isArray(
                    datos.measurements
                )
                    ? datos.measurements
                    : [];

            notasActuales =
                Array.isArray(
                    datos.notes
                )
                    ? datos.notes
                    : [];

            mostrarResumen();
            mostrarMediciones();
            mostrarNotas(
                notasActuales
            );
            mostrarActividad();
            actualizarExportacion();

        } catch (error) {

            console.error(
                "Error cargando historial:",
                error
            );
        }
    }

    function mostrarResumen() {

        if (!resumen) {
            return;
        }

        const elementos =
            resumen.querySelectorAll(
                ".summary-content strong"
            );

        if (elementos[0]) {

            elementos[0].textContent =
                pacienteActual
                    ? (
                        pacienteActual.fullName ||
                        traducir(
                            "no_data",
                            "N/D"
                        )
                    )
                    : traducir(
                        "no_data",
                        "N/D"
                    );
        }

        if (elementos[1]) {

            if (
                pacienteActual &&
                pacienteActual.age
            ) {

                elementos[1].textContent =
                    `${pacienteActual.age} ${
                        traducir(
                            "years",
                            "años"
                        )
                    }`;

            } else {

                elementos[1].textContent =
                    traducir(
                        "no_data",
                        "N/D"
                    );
            }
        }

        if (elementos[3]) {

            if (pacienteActual) {

                elementos[3].textContent =
                    traducirCondicion(
                        pacienteActual.conditionGeneral
                    );

            } else {

                elementos[3].textContent =
                    traducir(
                        "undefined_condition",
                        "Sin definir"
                    );
            }
        }

        const badgeEstado =
            resumen.querySelector(
                ".summary-item:nth-child(5) .badge"
            );

        if (badgeEstado) {

            if (!pacienteActual) {

                badgeEstado.textContent =
                    traducir(
                        "no_data",
                        "N/D"
                    );

                badgeEstado.className =
                    "badge warning";

            } else if (
                Number(
                    pacienteActual.isActive
                ) === 1
            ) {

                badgeEstado.textContent =
                    traducir(
                        "active",
                        "Activo"
                    );

                badgeEstado.className =
                    "badge success";

            } else {

                badgeEstado.textContent =
                    traducir(
                        "inactive",
                        "Inactivo"
                    );

                badgeEstado.className =
                    "badge danger";
            }
        }

        if (elementos[4]) {

            if (
                pacienteActual &&
                medicionesActuales.length > 0
            ) {

                elementos[4].textContent =
                    formatearFecha(
                        medicionesActuales[0]
                            .measurementDate
                    );

            } else {

                elementos[4].textContent =
                    traducir(
                        "no_checkups",
                        "Sin controles"
                    );
            }
        }
    }

    function mostrarMediciones() {

        if (!tbodyEvolucion) {
            return;
        }

        const registros =
            obtenerMedicionesFiltradas();

        tbodyEvolucion.innerHTML =
            "";

        if (
            registros.length === 0
        ) {

            tbodyEvolucion.innerHTML = `
                <tr>

                    <td
                        colspan="8"
                        class="history-empty"
                    >
                        ${traducir(
                            "no_records_period",
                            "No hay registros para este paciente en el período seleccionado."
                        )}
                    </td>

                </tr>
            `;

            return;
        }

        registros.forEach(
            (registro, indice) => {

                const anterior =
                    registros[
                        indice + 1
                    ];

                let observacion =
                    traducir(
                        "stable",
                        "Estable"
                    );

                let clase =
                    "success";

                if (!anterior) {

                    observacion =
                        traducir(
                            "first_record",
                            "Primer Registro"
                        );

                } else if (
                    Number(
                        registro.weightKg
                    ) <
                    Number(
                        anterior.weightKg
                    )
                ) {

                    observacion =
                        traducir(
                            "positive_evolution",
                            "Evolución Positiva"
                        );

                } else if (
                    Number(
                        registro.weightKg
                    ) >
                    Number(
                        anterior.weightKg
                    )
                ) {

                    observacion =
                        traducir(
                            "needs_attention",
                            "Requiere Atención"
                        );

                    clase =
                        "danger";
                }

                const fila =
                    document.createElement(
                        "tr"
                    );

                fila.innerHTML = `
                    <td>
                        ${formatearFecha(
                            registro.measurementDate
                        )}
                    </td>

                    <td>
                        ${
                            registro.weightKg != null
                                ? `${escaparHTML(
                                    registro.weightKg
                                )} kg`
                                : traducir(
                                    "no_data",
                                    "N/D"
                                )
                        }
                    </td>

                    <td>
                        ${
                            registro.bmi != null
                                ? escaparHTML(
                                    registro.bmi
                                )
                                : traducir(
                                    "no_data",
                                    "N/D"
                                )
                        }
                    </td>

                    <td>
                        ${
                            registro.bodyFatPercentage != null
                                ? `${escaparHTML(
                                    registro.bodyFatPercentage
                                )} %`
                                : traducir(
                                    "no_data",
                                    "N/D"
                                )
                        }
                    </td>

                    <td>
                        ${
                            registro.heartRate != null
                                ? `${escaparHTML(
                                    registro.heartRate
                                )} bpm`
                                : traducir(
                                    "no_data",
                                    "N/D"
                                )
                        }
                    </td>

                    <td>
                        ${
                            registro.sleepHours != null
                                ? `${escaparHTML(
                                    registro.sleepHours
                                )} h`
                                : traducir(
                                    "no_data",
                                    "N/D"
                                )
                        }
                    </td>

                    <td>
                        ${
                            registro.steps != null
                                ? Number(
                                    registro.steps
                                ).toLocaleString(
                                    currentLanguage === "en"
                                        ? "en-US"
                                        : "es-CR"
                                )
                                : traducir(
                                    "no_data",
                                    "N/D"
                                )
                        }
                    </td>

                    <td>
                        <span
                            class="badge ${clase}"
                        >
                            ${observacion}
                        </span>
                    </td>
                `;

                tbodyEvolucion.appendChild(
                    fila
                );
            }
        );
    }

    function mostrarNotas(
        notas
    ) {

        if (!notasContenedor) {
            return;
        }

        notasContenedor.innerHTML =
            "";

        if (
            notas.length === 0
        ) {

            notasContenedor.innerHTML = `
                <div class="note-item">

                    <i class="fa-solid fa-notes-medical"></i>

                    <p>
                        ${traducir(
                            "no_observations",
                            "Sin observaciones registradas."
                        )}
                    </p>

                </div>
            `;

            return;
        }

        notas.forEach(
            (nota) => {

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "note-item";

                div.innerHTML = `
                    <i class="fa-solid fa-notes-medical"></i>

                    <p>
                        ${escaparHTML(
                            traducirNota(
                                nota.note
                            )
                        )}
                    </p>
                `;

                notasContenedor.appendChild(
                    div
                );
            }
        );
    }

    function mostrarActividad() {

        if (!actividadReciente) {
            return;
        }

        actividadReciente.innerHTML =
            "";

        const recientes =
            medicionesActuales.slice(
                0,
                5
            );

        if (
            recientes.length === 0
        ) {

            actividadReciente.innerHTML = `
                <tr>

                    <td colspan="2">
                        ${traducir(
                            "no_activity",
                            "Sin actividad registrada."
                        )}
                    </td>

                </tr>
            `;

            return;
        }

        recientes.forEach(
            (registro) => {

                const fila =
                    document.createElement(
                        "tr"
                    );

                fila.innerHTML = `
                    <td>
                        ${formatearFecha(
                            registro.measurementDate
                        )}
                    </td>

                    <td>
                        ${traducir(
                            "measurement_activity",
                            "Se registró un control biométrico."
                        )}
                    </td>
                `;

                actividadReciente.appendChild(
                    fila
                );
            }
        );
    }

    function actualizarExportacion() {

        const disponible =
            Boolean(
                pacienteActual
            );

        if (btnExportPdf) {
            btnExportPdf.disabled =
                !disponible;
        }

        if (btnExportExcel) {
            btnExportExcel.disabled =
                !disponible;
        }
    }

    function obtenerNombreArchivo(
        extension
    ) {

        const nombre =
            normalizar(
                pacienteActual?.fullName ||
                "paciente"
            )
                .replace(
                    /\s+/g,
                    "_"
                );

        return `historial_${nombre}.${extension}`;
    }

    function exportarPDF() {

        if (!pacienteActual) {
            return;
        }

        const registros =
            obtenerMedicionesFiltradas();

        const ventana =
            window.open(
                "",
                "_blank"
            );

        if (!ventana) {

            alert(
                currentLanguage === "en"
                    ? "The browser blocked the print window."
                    : "El navegador bloqueó la ventana de impresión."
            );

            return;
        }

        const filas =
            registros.length
                ? registros.map(
                    (registro) => `
                        <tr>

                            <td>
                                ${formatearFecha(
                                    registro.measurementDate
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    registro.weightKg ??
                                    traducir(
                                        "no_data",
                                        "N/D"
                                    )
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    registro.bmi ??
                                    traducir(
                                        "no_data",
                                        "N/D"
                                    )
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    registro.bodyFatPercentage ??
                                    traducir(
                                        "no_data",
                                        "N/D"
                                    )
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    registro.heartRate ??
                                    traducir(
                                        "no_data",
                                        "N/D"
                                    )
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    registro.sleepHours ??
                                    traducir(
                                        "no_data",
                                        "N/D"
                                    )
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    registro.steps ??
                                    traducir(
                                        "no_data",
                                        "N/D"
                                    )
                                )}
                            </td>

                        </tr>
                    `
                ).join("")
                : `
                    <tr>

                        <td colspan="7">
                            ${traducir(
                                "no_records_period",
                                "No hay registros para este paciente en el período seleccionado."
                            )}
                        </td>

                    </tr>
                `;

        ventana.document.write(`
            <!DOCTYPE html>

            <html lang="${currentLanguage}">

            <head>

                <meta charset="UTF-8">

                <title>
                    Nyvora |
                    ${traducir(
                        "history_title",
                        "Historial Clínico"
                    )}
                </title>

                <style>

                    body {
                        margin: 40px;
                        color: #1F2937;
                        font-family: Arial, sans-serif;
                    }

                    h1 {
                        margin-bottom: 6px;
                        color: #0E7A6E;
                    }

                    .subtitle {
                        margin-bottom: 30px;
                        color: #64748B;
                    }

                    .summary {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 12px;
                        margin-bottom: 30px;
                    }

                    .summary div {
                        padding: 12px;
                        border: 1px solid #E2E8F0;
                        border-radius: 8px;
                    }

                    .summary span {
                        display: block;
                        margin-bottom: 5px;
                        color: #64748B;
                        font-size: 12px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 12px;
                    }

                    th,
                    td {
                        padding: 9px;
                        border: 1px solid #D6DCE5;
                        text-align: left;
                    }

                    th {
                        background: #F4F7FB;
                    }

                    .footer {
                        margin-top: 25px;
                        color: #64748B;
                        font-size: 11px;
                    }

                </style>

            </head>

            <body>

                <h1>
                    Nyvora |
                    ${traducir(
                        "history_title",
                        "Historial Clínico"
                    )}
                </h1>

                <div class="subtitle">
                    ${traducir(
                        "history_subtitle",
                        "Consulta del historial y evolución del paciente."
                    )}
                </div>

                <div class="summary">

                    <div>

                        <span>
                            ${traducir(
                                "patient",
                                "Paciente"
                            )}
                        </span>

                        <strong>
                            ${escaparHTML(
                                pacienteActual.fullName
                            )}
                        </strong>

                    </div>

                    <div>

                        <span>
                            ${traducir(
                                "age",
                                "Edad"
                            )}
                        </span>

                        <strong>
                            ${
                                pacienteActual.age
                                    ? `${pacienteActual.age} ${traducir(
                                        "years",
                                        "años"
                                    )}`
                                    : traducir(
                                        "no_data",
                                        "N/D"
                                    )
                            }
                        </strong>

                    </div>

                    <div>

                        <span>
                            ${traducir(
                                "general_condition",
                                "Condición General"
                            )}
                        </span>

                        <strong>
                            ${escaparHTML(
                                traducirCondicion(
                                    pacienteActual.conditionGeneral
                                )
                            )}
                        </strong>

                    </div>

                    <div>

                        <span>
                            ${traducir(
                                "period",
                                "Período"
                            )}
                        </span>

                        <strong>
                            ${
                                inputDesde.value ||
                                traducir(
                                    "start",
                                    "Inicio"
                                )
                            }
                            —
                            ${
                                inputHasta.value ||
                                traducir(
                                    "current",
                                    "Actualidad"
                                )
                            }
                        </strong>

                    </div>

                </div>

                <table>

                    <thead>

                        <tr>

                            <th>
                                ${traducir(
                                    "date",
                                    "Fecha"
                                )}
                            </th>

                            <th>
                                ${traducir(
                                    "weight",
                                    "Peso"
                                )}
                            </th>

                            <th>
                                ${traducir(
                                    "bmi",
                                    "IMC"
                                )}
                            </th>

                            <th>
                                ${traducir(
                                    "body_fat",
                                    "Grasa Corporal"
                                )}
                            </th>

                            <th>
                                ${traducir(
                                    "heart_rate",
                                    "Frecuencia Cardíaca"
                                )}
                            </th>

                            <th>
                                ${traducir(
                                    "sleep_hours",
                                    "Horas de Sueño"
                                )}
                            </th>

                            <th>
                                ${traducir(
                                    "steps",
                                    "Pasos"
                                )}
                            </th>

                        </tr>

                    </thead>

                    <tbody>
                        ${filas}
                    </tbody>

                </table>

                <div class="footer">
                    ${traducir(
                        "generated_by",
                        "Generado desde Nyvora."
                    )}
                </div>

                <script>

                    window.onload = function () {
                        window.print();
                    };

                <\/script>

            </body>

            </html>
        `);

        ventana.document.close();
    }

    function exportarExcel() {

        if (!pacienteActual) {
            return;
        }

        const registros =
            obtenerMedicionesFiltradas();

        const encabezados = [

            traducir(
                "date",
                "Fecha"
            ),

            traducir(
                "weight_kg",
                "Peso (kg)"
            ),

            traducir(
                "bmi",
                "IMC"
            ),

            traducir(
                "body_fat",
                "Grasa Corporal (%)"
            ),

            traducir(
                "heart_rate_bpm",
                "Frecuencia Cardíaca (bpm)"
            ),

            traducir(
                "sleep_hours",
                "Horas de Sueño"
            ),

            traducir(
                "steps",
                "Pasos"
            )
        ];

        const filas =
            registros.map(
                (registro) => [

                    formatearFecha(
                        registro.measurementDate
                    ),

                    registro.weightKg ??
                    "",

                    registro.bmi ??
                    "",

                    registro.bodyFatPercentage ??
                    "",

                    registro.heartRate ??
                    "",

                    registro.sleepHours ??
                    "",

                    registro.steps ??
                    ""
                ]
            );

        const contenido = [

            [
                `${traducir(
                    "patient",
                    "Paciente"
                )}: ${pacienteActual.fullName}`
            ],

            [
                `${traducir(
                    "age",
                    "Edad"
                )}: ${
                    pacienteActual.age
                        ? `${pacienteActual.age} ${traducir(
                            "years",
                            "años"
                        )}`
                        : traducir(
                            "no_data",
                            "N/D"
                        )
                }`
            ],

            [
                `${traducir(
                    "general_condition",
                    "Condición General"
                )}: ${
                    traducirCondicion(
                        pacienteActual.conditionGeneral
                    )
                }`
            ],

            [],

            encabezados,

            ...filas
        ];

        const csv =
            contenido
                .map(
                    (fila) =>
                        fila
                            .map(
                                (valor) => {

                                    const texto =
                                        String(
                                            valor ?? ""
                                        )
                                            .replaceAll(
                                                '"',
                                                '""'
                                            );

                                    return `"${texto}"`;
                                }
                            )
                            .join(";")
                )
                .join("\n");

        const blob =
            new Blob(
                [
                    "\uFEFF",
                    csv
                ],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const enlace =
            document.createElement(
                "a"
            );

        enlace.href =
            url;

        enlace.download =
            obtenerNombreArchivo(
                "csv"
            );

        document.body.appendChild(
            enlace
        );

        enlace.click();

        enlace.remove();

        URL.revokeObjectURL(
            url
        );
    }

    inputPaciente.addEventListener(
        "focus",
        () => {

            mostrarResultadosPacientes(
                inputPaciente.value
            );
        }
    );

    inputPaciente.addEventListener(
        "input",
        () => {

            limpiarPacienteSeleccionado();

            mostrarResultadosPacientes(
                inputPaciente.value
            );
        }
    );

    document.addEventListener(
        "click",
        (event) => {

            if (
                !event.target.closest(
                    ".patient-search-wrapper"
                )
            ) {

                resultadosPaciente.classList.remove(
                    "active"
                );
            }
        }
    );

    btnConsultar.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();

            const patientId =
                inputPacienteId.value;

            if (!patientId) {

                inputPaciente.focus();

                mostrarResultadosPacientes(
                    inputPaciente.value
                );

                return;
            }

            await cargarHistorial(
                patientId
            );
        }
    );

    inputDesde.addEventListener(
        "change",
        () => {

            if (pacienteActual) {
                mostrarMediciones();
            }
        }
    );

    inputHasta.addEventListener(
        "change",
        () => {

            if (pacienteActual) {
                mostrarMediciones();
            }
        }
    );

    btnExportPdf.addEventListener(
        "click",
        exportarPDF
    );

    btnExportExcel.addEventListener(
        "click",
        exportarExcel
    );

    document.addEventListener(
        "languageChanged",
        () => {

            if (pacienteActual) {

                mostrarResumen();
                mostrarMediciones();
                mostrarNotas(
                    notasActuales
                );
                mostrarActividad();

            } else {

                actualizarResumenInicial();
                mostrarMediciones();
                mostrarNotas(
                    notasActuales
                );
                mostrarActividad();
            }
        }
    );

    actualizarExportacion();

    actualizarResumenInicial();

    mostrarMediciones();

    mostrarNotas(
        notasActuales
    );

    mostrarActividad();

    cargarPacientes();

});