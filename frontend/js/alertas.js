"use strict";

/* Alertas */

document.addEventListener("DOMContentLoaded", () => {

    const API_URL =
        "http://localhost:8081/alertas.php";

    /* Controles */

    const inputPaciente =
        document.getElementById("buscarPaciente");

    const sugerencias =
        document.getElementById(
            "alert-search-suggestions"
        );

    const selectPrioridad =
        document.getElementById("prioridad");

    const selectEstado =
        document.getElementById("estado");

    const btnBuscar =
        document.getElementById(
            "btn-search-alerts"
        );

    const contadorResultados =
        document.getElementById(
            "alert-results-count"
        );

    /* Tabla */

    const tbody =
        document.getElementById(
            "alerts-table-body"
        );

    /* Actividad */

    const actividadReciente =
        document.getElementById(
            "alert-activity-body"
        );

    /* KPIs */

    const kpiActivas =
        document.getElementById(
            "kpi-alerts-active"
        );

    const kpiAltas =
        document.getElementById(
            "kpi-alerts-high"
        );

    const kpiSeguimiento =
        document.getElementById(
            "kpi-alerts-following"
        );

    const kpiResueltas =
        document.getElementById(
            "kpi-alerts-resolved"
        );

    /* Modal */

    const modal =
        document.getElementById(
            "alert-modal"
        );

    const botonesCerrarModal =
        modal.querySelectorAll(
            "[data-close-alert-modal]"
        );

    const detallePaciente =
        document.getElementById(
            "alert-detail-patient"
        );

    const detallePacienteInfo =
        document.getElementById(
            "alert-detail-patient-info"
        );

    const detalleTipo =
        document.getElementById(
            "alert-detail-type"
        );

    const detalleFecha =
        document.getElementById(
            "alert-detail-date"
        );

    const detallePrioridad =
        document.getElementById(
            "alert-detail-priority"
        );

    const detalleEstado =
        document.getElementById(
            "alert-detail-status"
        );

    const detalleMensaje =
        document.getElementById(
            "alert-detail-message"
        );

    const btnAbrirPaciente =
        document.getElementById(
            "alert-open-patient"
        );

    const btnSeguimiento =
        document.getElementById(
            "alert-follow-up"
        );

    const btnResolver =
        document.getElementById(
            "alert-resolve"
        );

    /* Estado */

    let alertas = [];
    let alertaActual = null;

    /* Utilidades */

    function normalizar(texto) {
        return String(texto ?? "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();
    }

    function escaparHTML(texto) {
        const div =
            document.createElement("div");

        div.textContent =
            texto ?? "";

        return div.innerHTML;
    }

    function formatearFecha(fecha) {
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

        return fechaConvertida
            .toLocaleDateString(
                "es-CR"
            );
    }

    /* Prioridad */

    function prioridadInfo(alerta) {
        const tipo =
            normalizar(
                alerta.alertType
            );

        if (
            tipo.includes("frecuencia") ||
            tipo.includes("cardiaca") ||
            tipo.includes("critica") ||
            tipo.includes("urgente")
        ) {
            return {
                texto: "Alta",
                clase: "high"
            };
        }

        if (
            tipo.includes("sueno") ||
            tipo.includes("peso") ||
            tipo.includes("seguimiento") ||
            tipo.includes("imc")
        ) {
            return {
                texto: "Media",
                clase: "medium"
            };
        }

        return {
            texto: "Baja",
            clase: "low"
        };
    }

    /* Estado */

    function estadoInfo(status) {
        const estado =
            normalizar(status);

        if (
            [
                "resolved",
                "resuelta",
                "resuelto",
                "closed",
                "cerrada"
            ].includes(estado)
        ) {
            return {
                texto: "Resuelta",
                clase: "resolved"
            };
        }

        if (
            [
                "follow_up",
                "follow-up",
                "in_progress",
                "in progress",
                "seguimiento",
                "en seguimiento",
                "en_seguimiento"
            ].includes(estado)
        ) {
            return {
                texto: "En Seguimiento",
                clase: "follow-up"
            };
        }

        return {
            texto: "Pendiente",
            clase: "pending"
        };
    }

    /* Backend */

    async function cargarAlertas() {
        try {
            const respuesta =
                await fetch(API_URL);

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
                    "Error al consultar las alertas."
                );
            }

            alertas =
                Array.isArray(datos.data)
                    ? datos.data
                    : [];

            renderTodo();

        } catch (error) {
            console.error(
                "Error cargando alertas:",
                error
            );

            tbody.innerHTML = `
                <tr class="empty-alert-row">
                    <td colspan="6">

                        <div class="alert-empty-state">

                            <div class="alert-empty-icon">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </div>

                            <strong>
                                No se pudieron cargar las alertas
                            </strong>

                            <p>
                                No fue posible obtener la información
                                desde el servidor.
                            </p>

                        </div>

                    </td>
                </tr>
            `;

            contadorResultados.textContent =
                "0 resultados";

            renderKpis();
            renderActividadReciente();
        }
    }

    /* Búsqueda inteligente */

    function coincideBusqueda(
        alerta,
        termino
    ) {
        if (!termino) {
            return true;
        }

        const prioridad =
            prioridadInfo(alerta);

        const estado =
            estadoInfo(alerta.status);

        const campos = [
            alerta.patientName,
            alerta.patientIdentification,
            alerta.identification,
            alerta.alertType,
            alerta.message,
            prioridad.texto,
            estado.texto
        ];

        return campos.some(
            (campo) =>
                normalizar(campo)
                    .includes(termino)
        );
    }

    function obtenerSugerencias() {
        const termino =
            normalizar(
                inputPaciente.value
            );

        if (!termino) {
            return [];
        }

        return alertas
            .filter(
                (alerta) =>
                    coincideBusqueda(
                        alerta,
                        termino
                    )
            )
            .slice(0, 8);
    }

    function cerrarSugerencias() {
        sugerencias.hidden = true;
        sugerencias.innerHTML = "";
    }

    function mostrarSugerencias() {
        const termino =
            inputPaciente.value.trim();

        if (!termino) {
            cerrarSugerencias();
            return;
        }

        const resultados =
            obtenerSugerencias();

        sugerencias.innerHTML = "";

        if (!resultados.length) {
            sugerencias.innerHTML = `
                <div class="alert-search-empty">
                    No se encontraron coincidencias.
                </div>
            `;

            sugerencias.hidden = false;

            return;
        }

        resultados.forEach(
            (alerta) => {

                const boton =
                    document.createElement(
                        "button"
                    );

                boton.type =
                    "button";

                boton.className =
                    "alert-search-suggestion";

                boton.innerHTML = `
                    <div class="alert-search-suggestion-icon">
                        <i class="fa-regular fa-user"></i>
                    </div>

                    <div class="alert-search-suggestion-info">

                        <strong>
                            ${escaparHTML(
                                alerta.patientName ||
                                "Paciente"
                            )}
                        </strong>

                        <span>
                            ${escaparHTML(
                                alerta.alertType ||
                                alerta.message ||
                                "Alerta clínica"
                            )}
                        </span>

                    </div>
                `;

                boton.addEventListener(
                    "click",
                    () => {

                        inputPaciente.value =
                            alerta.patientName || "";

                        cerrarSugerencias();

                        renderTabla();
                    }
                );

                sugerencias.appendChild(
                    boton
                );
            }
        );

        sugerencias.hidden = false;
    }

    /* Filtros */

    function obtenerAlertasFiltradas() {
        let resultado =
            [...alertas];

        const busqueda =
            normalizar(
                inputPaciente.value
            );

        if (busqueda) {
            resultado =
                resultado.filter(
                    (alerta) =>
                        coincideBusqueda(
                            alerta,
                            busqueda
                        )
                );
        }

        if (
            selectPrioridad.value
        ) {
            resultado =
                resultado.filter(
                    (alerta) =>
                        prioridadInfo(
                            alerta
                        ).texto ===
                        selectPrioridad.value
                );
        }

        if (
            selectEstado.value
        ) {
            resultado =
                resultado.filter(
                    (alerta) =>
                        estadoInfo(
                            alerta.status
                        ).texto ===
                        selectEstado.value
                );
        }

        return resultado;
    }

    /* Modal */

    function abrirDetalle(alerta) {
        alertaActual =
            alerta;

        const prioridad =
            prioridadInfo(alerta);

        const estado =
            estadoInfo(
                alerta.status
            );

        detallePaciente.textContent =
            alerta.patientName ||
            "Paciente";

        detallePacienteInfo.textContent =
            alerta.patientIdentification ||
            alerta.identification ||
            "Paciente registrado en Nyvora";

        detalleTipo.textContent =
            alerta.alertType ||
            "Alerta clínica";

        detalleFecha.textContent =
            formatearFecha(
                alerta.createdAt
            );

        detalleMensaje.textContent =
            alerta.message ||
            "Sin descripción disponible.";

        detallePrioridad.textContent =
            prioridad.texto;

        detallePrioridad.className =
            `alert-priority ${prioridad.clase}`;

        detalleEstado.textContent =
            estado.texto;

        detalleEstado.className =
            `alert-status ${estado.clase}`;

        /* Acciones que requieren backend */

        btnSeguimiento.disabled = true;
        btnResolver.disabled = true;

        btnSeguimiento.title =
            "Pendiente de integración con backend";

        btnResolver.title =
            "Pendiente de integración con backend";

        modal.classList.add(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "alert-modal-open"
        );
    }

    function cerrarDetalle() {
        modal.classList.remove(
            "active"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "alert-modal-open"
        );

        alertaActual = null;
    }

    /* Tabla */

    function crearFilaAlerta(alerta) {
        const prioridad =
            prioridadInfo(alerta);

        const estado =
            estadoInfo(
                alerta.status
            );

        const fila =
            document.createElement(
                "tr"
            );

        fila.dataset.patientId =
            alerta.patientId;

        fila.innerHTML = `
            <td>

                <div class="alert-patient-cell">

                    <div class="alert-patient-table-icon">
                        <i class="fa-regular fa-user"></i>
                    </div>

                    <div class="alert-patient-table-info">

                        <strong>
                            ${escaparHTML(
                                alerta.patientName ||
                                "Paciente"
                            )}
                        </strong>

                        <span>
                            ${
                                escaparHTML(
                                    alerta.patientIdentification ||
                                    alerta.identification ||
                                    "Paciente registrado"
                                )
                            }
                        </span>

                    </div>

                </div>

            </td>

            <td>

                <div class="alert-message-cell">

                    <strong>
                        ${escaparHTML(
                            alerta.alertType ||
                            "Alerta clínica"
                        )}
                    </strong>

                    <span>
                        ${escaparHTML(
                            alerta.message ||
                            "Sin descripción"
                        )}
                    </span>

                </div>

            </td>

            <td>

                <span
                    class="alert-priority ${prioridad.clase}">
                    ${prioridad.texto}
                </span>

            </td>

            <td>
                ${formatearFecha(
                    alerta.createdAt
                )}
            </td>

            <td>

                <span
                    class="alert-status ${estado.clase}">
                    ${estado.texto}
                </span>

            </td>

            <td>

                <button
                    type="button"
                    class="alert-detail-button">

                    <i class="fa-solid fa-eye"></i>
                    Ver Detalle

                </button>

            </td>
        `;

        fila
            .querySelector(
                ".alert-detail-button"
            )
            .addEventListener(
                "click",
                () => {
                    abrirDetalle(alerta);
                }
            );

        return fila;
    }

    function renderTabla() {
        const filtradas =
            obtenerAlertasFiltradas();

        tbody.innerHTML = "";

        contadorResultados.textContent =
            `${filtradas.length} ${
                filtradas.length === 1
                    ? "resultado"
                    : "resultados"
            }`;

        if (!filtradas.length) {
            tbody.innerHTML = `
                <tr class="empty-alert-row">

                    <td colspan="6">

                        <div class="alert-empty-state">

                            <div class="alert-empty-icon">
                                <i class="fa-regular fa-bell"></i>
                            </div>

                            <strong>
                                No se encontraron alertas
                            </strong>

                            <p>
                                Cambie los filtros o consulte
                                otro paciente.
                            </p>

                        </div>

                    </td>

                </tr>
            `;

            return;
        }

        filtradas.forEach(
            (alerta) => {
                tbody.appendChild(
                    crearFilaAlerta(
                        alerta
                    )
                );
            }
        );
    }

    /* KPIs */

    function renderKpis() {
        const activas =
            alertas.filter(
                (alerta) =>
                    estadoInfo(
                        alerta.status
                    ).texto !==
                    "Resuelta"
            ).length;

        const altas =
            alertas.filter(
                (alerta) =>
                    prioridadInfo(
                        alerta
                    ).texto ===
                    "Alta" &&
                    estadoInfo(
                        alerta.status
                    ).texto !==
                    "Resuelta"
            ).length;

        const seguimiento =
            alertas.filter(
                (alerta) =>
                    estadoInfo(
                        alerta.status
                    ).texto ===
                    "En Seguimiento"
            ).length;

        const resueltas =
            alertas.filter(
                (alerta) =>
                    estadoInfo(
                        alerta.status
                    ).texto ===
                    "Resuelta"
            ).length;

        kpiActivas.textContent =
            activas;

        kpiAltas.textContent =
            altas;

        kpiSeguimiento.textContent =
            seguimiento;

        kpiResueltas.textContent =
            resueltas;
    }

    /* Actividad reciente */

    function renderActividadReciente() {
        actividadReciente.innerHTML = "";

        const recientes =
            [...alertas]
                .sort(
                    (a, b) => {

                        const fechaA =
                            new Date(
                                String(
                                    a.createdAt ||
                                    ""
                                ).replace(
                                    " ",
                                    "T"
                                )
                            );

                        const fechaB =
                            new Date(
                                String(
                                    b.createdAt ||
                                    ""
                                ).replace(
                                    " ",
                                    "T"
                                )
                            );

                        return (
                            fechaB -
                            fechaA
                        );
                    }
                )
                .slice(0, 5);

        if (!recientes.length) {
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
            (alerta) => {

                const estado =
                    estadoInfo(
                        alerta.status
                    );

                const fila =
                    document.createElement(
                        "tr"
                    );

                fila.innerHTML = `
                    <td>
                        ${formatearFecha(
                            alerta.createdAt
                        )}
                    </td>

                    <td>

                        <div class="alert-activity-cell">

                            <div class="alert-activity-icon">
                                <i class="fa-solid fa-bell"></i>
                            </div>

                            <div class="alert-activity-info">

                                <strong>
                                    ${escaparHTML(
                                        alerta.alertType ||
                                        "Alerta clínica"
                                    )}
                                </strong>

                                <span>
                                    ${escaparHTML(
                                        alerta.patientName ||
                                        "Paciente"
                                    )}
                                    ·
                                    ${estado.texto}
                                </span>

                            </div>

                        </div>

                    </td>
                `;

                actividadReciente.appendChild(
                    fila
                );
            }
        );
    }

    /* Render */

    function renderTodo() {
        renderTabla();
        renderKpis();
        renderActividadReciente();
    }

    /* Eventos de búsqueda */

    inputPaciente.addEventListener(
        "input",
        () => {
            renderTabla();
            mostrarSugerencias();
        }
    );

    inputPaciente.addEventListener(
        "focus",
        () => {
            if (
                inputPaciente.value.trim()
            ) {
                mostrarSugerencias();
            }
        }
    );

    btnBuscar.addEventListener(
        "click",
        (event) => {
            event.preventDefault();

            cerrarSugerencias();

            renderTabla();
        }
    );

    selectPrioridad.addEventListener(
        "change",
        renderTabla
    );

    selectEstado.addEventListener(
        "change",
        renderTabla
    );

    document.addEventListener(
        "click",
        (event) => {

            if (
                !event.target.closest(
                    ".alert-search-field"
                )
            ) {
                cerrarSugerencias();
            }
        }
    );

    /* Modal */

    botonesCerrarModal.forEach(
        (boton) => {
            boton.addEventListener(
                "click",
                cerrarDetalle
            );
        }
    );

    btnAbrirPaciente.addEventListener(
        "click",
        () => {

            if (
                !alertaActual?.patientId
            ) {
                return;
            }

            window.location.href =
                `historial.html?patient_id=${alertaActual.patientId}`;
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {
                cerrarSugerencias();

                if (
                    modal.classList.contains(
                        "active"
                    )
                ) {
                    cerrarDetalle();
                }
            }
        }
    );

    /* Inicialización */

    cargarAlertas();
});