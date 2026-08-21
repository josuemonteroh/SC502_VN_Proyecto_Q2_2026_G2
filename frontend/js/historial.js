"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:8081/historial.php";

    /* Controles */

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

    /* Contenido */

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

    /* Estado */

    let pacientes = [];
    let pacienteActual = null;
    let medicionesActuales = [];
    let notasActuales = [];

    /* Utilidades */

    function formatearFecha(fecha) {

        if (!fecha) {
            return "N/D";
        }

        const fechaConvertida =
            new Date(
                String(fecha).replace(" ", "T")
            );

        if (
            Number.isNaN(
                fechaConvertida.getTime()
            )
        ) {
            return fecha;
        }

        return fechaConvertida.toLocaleDateString(
            "es-CR"
        );
    }

    function escaparHTML(texto) {

        const div =
            document.createElement("div");

        div.textContent =
            texto ?? "";

        return div.innerHTML;
    }

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

    /* Pacientes */

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
                Array.isArray(datos.data)
                    ? datos.data
                    : [];

            /* Paciente recibido por URL */

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
                            String(paciente.id) ===
                            String(patientId)
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
                "Error al cargar pacientes";
        }
    }

    /* Búsqueda inteligente */

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
            coincidencias.slice(0, 8);

        resultadosPaciente.innerHTML = "";

        if (coincidencias.length === 0) {

            resultadosPaciente.innerHTML = `
                <div class="patient-search-empty">
                    No se encontraron pacientes.
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
                        : "Sin identificación";

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
            paciente.fullName || "";

        inputPacienteId.value =
            paciente.id;

        if (cerrarResultados) {

            resultadosPaciente.classList.remove(
                "active"
            );
        }
    }

    function limpiarPacienteSeleccionado() {

        inputPacienteId.value = "";

        pacienteActual = null;
        medicionesActuales = [];
        notasActuales = [];

        actualizarExportacion();
    }

    /* Historial */

    async function cargarHistorial(patientId) {

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
                Array.isArray(datos.notes)
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

    /* Resumen */

    function mostrarResumen() {

        if (
            !resumen ||
            !pacienteActual
        ) {
            return;
        }

        const elementos =
            resumen.querySelectorAll(
                ".summary-content strong"
            );

        if (elementos[0]) {

            elementos[0].textContent =
                pacienteActual.fullName ||
                "N/D";
        }

        if (elementos[1]) {

            elementos[1].textContent =
                pacienteActual.age
                    ? `${pacienteActual.age} años`
                    : "N/D";
        }

        /*
         * elementos[2] corresponde al responsable.
         * common.js coloca automáticamente el usuario
         * real de la sesión mediante data-current-user-name.
         */

        if (elementos[3]) {

            elementos[3].textContent =
                pacienteActual.conditionGeneral ||
                "Sin definir";
        }

        const badgeEstado =
            resumen.querySelector(
                ".summary-item:nth-child(5) .badge"
            );

        if (badgeEstado) {

            if (
                Number(
                    pacienteActual.isActive
                ) === 1
            ) {

                badgeEstado.textContent =
                    "Activo";

                badgeEstado.className =
                    "badge success";

            } else {

                badgeEstado.textContent =
                    "Inactivo";

                badgeEstado.className =
                    "badge danger";
            }
        }

        if (elementos[4]) {

            elementos[4].textContent =
                medicionesActuales.length > 0
                    ? formatearFecha(
                        medicionesActuales[0]
                            .measurementDate
                    )
                    : "Sin controles";
        }
    }

    /* Mediciones */

    function mostrarMediciones() {

        if (!tbodyEvolucion) {
            return;
        }

        const registros =
            obtenerMedicionesFiltradas();

        tbodyEvolucion.innerHTML = "";

        if (registros.length === 0) {

            tbodyEvolucion.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        class="history-empty"
                    >
                        No hay registros para
                        este paciente en el período
                        seleccionado.
                    </td>
                </tr>
            `;

            return;
        }

        registros.forEach(
            (registro, indice) => {

                const anterior =
                    registros[indice + 1];

                let observacion =
                    "Estable";

                let clase =
                    "success";

                if (!anterior) {

                    observacion =
                        "Primer Registro";

                } else if (
                    Number(
                        registro.weightKg
                    ) <
                    Number(
                        anterior.weightKg
                    )
                ) {

                    observacion =
                        "Evolución Positiva";

                } else if (
                    Number(
                        registro.weightKg
                    ) >
                    Number(
                        anterior.weightKg
                    )
                ) {

                    observacion =
                        "Requiere Atención";

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
                                : "N/D"
                        }
                    </td>

                    <td>
                        ${
                            registro.bmi != null
                                ? escaparHTML(
                                    registro.bmi
                                )
                                : "N/D"
                        }
                    </td>

                    <td>
                        ${
                            registro.bodyFatPercentage != null
                                ? `${escaparHTML(
                                    registro.bodyFatPercentage
                                )} %`
                                : "N/D"
                        }
                    </td>

                    <td>
                        ${
                            registro.heartRate != null
                                ? `${escaparHTML(
                                    registro.heartRate
                                )} bpm`
                                : "N/D"
                        }
                    </td>

                    <td>
                        ${
                            registro.sleepHours != null
                                ? `${escaparHTML(
                                    registro.sleepHours
                                )} h`
                                : "N/D"
                        }
                    </td>

                    <td>
                        ${
                            registro.steps != null
                                ? Number(
                                    registro.steps
                                ).toLocaleString(
                                    "es-CR"
                                )
                                : "N/D"
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

    /* Notas */

    function mostrarNotas(notas) {

        if (!notasContenedor) {
            return;
        }

        notasContenedor.innerHTML = "";

        if (notas.length === 0) {

            notasContenedor.innerHTML = `
                <div class="note-item">

                    <i class="fa-solid fa-notes-medical"></i>

                    <p>
                        Sin observaciones registradas.
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
                            nota.note
                        )}
                    </p>
                `;

                notasContenedor.appendChild(
                    div
                );
            }
        );
    }

    /* Actividad */

    function mostrarActividad() {

        if (!actividadReciente) {
            return;
        }

        actividadReciente.innerHTML = "";

        const recientes =
            medicionesActuales.slice(
                0,
                5
            );

        if (recientes.length === 0) {

            actividadReciente.innerHTML = `
                <tr>
                    <td colspan="2">
                        Sin actividad registrada.
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
                        Se registró un
                        control biométrico.
                    </td>
                `;

                actividadReciente.appendChild(
                    fila
                );
            }
        );
    }

    /* Exportación */

    function actualizarExportacion() {

        const disponible =
            Boolean(pacienteActual);

        btnExportPdf.disabled =
            !disponible;

        btnExportExcel.disabled =
            !disponible;
    }

    function obtenerNombreArchivo(
        extension
    ) {

        const nombre =
            normalizar(
                pacienteActual?.fullName ||
                "paciente"
            )
                .replace(/\s+/g, "_");

        return `historial_${nombre}.${extension}`;
    }

    /* PDF */

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
                "El navegador bloqueó la ventana de impresión."
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
                                    registro.weightKg ?? "N/D"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    registro.bmi ?? "N/D"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    registro.bodyFatPercentage ?? "N/D"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    registro.heartRate ?? "N/D"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    registro.sleepHours ?? "N/D"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    registro.steps ?? "N/D"
                                )}
                            </td>
                        </tr>
                    `
                ).join("")
                : `
                    <tr>
                        <td colspan="7">
                            Sin registros en el período seleccionado.
                        </td>
                    </tr>
                `;

        ventana.document.write(`
            <!DOCTYPE html>

            <html lang="es">

            <head>

                <meta charset="UTF-8">

                <title>
                    Historial Clínico
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

                    @media print {

                        body {
                            margin: 20px;
                        }

                    }

                </style>

            </head>

            <body>

                <h1>
                    Nyvora | Historial Clínico
                </h1>

                <div class="subtitle">
                    Reporte de seguimiento biométrico
                </div>

                <div class="summary">

                    <div>
                        <span>Paciente</span>
                        <strong>
                            ${escaparHTML(
                                pacienteActual.fullName
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Edad</span>
                        <strong>
                            ${
                                pacienteActual.age
                                    ? `${pacienteActual.age} años`
                                    : "N/D"
                            }
                        </strong>
                    </div>

                    <div>
                        <span>Condición general</span>
                        <strong>
                            ${escaparHTML(
                                pacienteActual.conditionGeneral ||
                                "Sin definir"
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Período</span>
                        <strong>
                            ${
                                inputDesde.value ||
                                "Inicio"
                            }
                            —
                            ${
                                inputHasta.value ||
                                "Actualidad"
                            }
                        </strong>
                    </div>

                </div>

                <table>

                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Peso</th>
                            <th>IMC</th>
                            <th>Grasa %</th>
                            <th>FC</th>
                            <th>Sueño</th>
                            <th>Pasos</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${filas}
                    </tbody>

                </table>

                <div class="footer">
                    Generado desde Nyvora.
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

    /* Excel */

    function exportarExcel() {

        if (!pacienteActual) {
            return;
        }

        const registros =
            obtenerMedicionesFiltradas();

        const encabezados = [
            "Fecha",
            "Peso (kg)",
            "IMC",
            "Grasa Corporal (%)",
            "Frecuencia Cardíaca (bpm)",
            "Horas de Sueño",
            "Pasos"
        ];

        const filas =
            registros.map(
                (registro) => [

                    formatearFecha(
                        registro.measurementDate
                    ),

                    registro.weightKg ?? "",

                    registro.bmi ?? "",

                    registro.bodyFatPercentage ?? "",

                    registro.heartRate ?? "",

                    registro.sleepHours ?? "",

                    registro.steps ?? ""
                ]
            );

        const contenido = [
            [
                `Paciente: ${pacienteActual.fullName}`
            ],
            [
                `Edad: ${
                    pacienteActual.age
                        ? `${pacienteActual.age} años`
                        : "N/D"
                }`
            ],
            [
                `Condición: ${
                    pacienteActual.conditionGeneral ||
                    "Sin definir"
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

        /*
         * Excel abre este CSV directamente.
         * Se usa CSV porque no requiere librerías
         * externas en el frontend.
         */
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

    /* Eventos de búsqueda */

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

                resultadosPaciente
                    .classList.remove(
                        "active"
                    );
            }
        }
    );

    /* Consultar */

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

    /* Fechas */

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

    /* Exportación */

    btnExportPdf.addEventListener(
        "click",
        exportarPDF
    );

    btnExportExcel.addEventListener(
        "click",
        exportarExcel
    );

    /* Inicialización */

    actualizarExportacion();

    cargarPacientes();
});