"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const API_URL =
        "http://localhost:8081/alertas.php";

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

    const tbody =
        document.getElementById(
            "alerts-table-body"
        );

    const actividadReciente =
        document.getElementById(
            "alert-activity-body"
        );

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

    const modal =
        document.getElementById(
            "alert-modal"
        );

    const botonesCerrarModal =
        modal
            ? modal.querySelectorAll(
                "[data-close-alert-modal]"
            )
            : [];

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

    let alertas = [];
    let alertaActual = null;


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
            document.createElement(
                "div"
            );

        div.textContent =
            texto ?? "";

        return div.innerHTML;
    }


    function formatearFecha(fecha) {

        if (!fecha) {

            return traducir(
                "no_data",
                "N/D"
            );
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


    function traducirTipoAlerta(tipo) {

        const valor =
            normalizar(tipo);


        if (valor === "peso") {

            return traducir(
                "alert_weight",
                currentLanguage === "en"
                    ? "Weight"
                    : "Peso"
            );
        }


        if (valor === "sueno") {

            return traducir(
                "alert_sleep",
                currentLanguage === "en"
                    ? "Sleep"
                    : "Sueño"
            );
        }


        if (
            valor === "frecuencia cardiaca" ||
            valor === "frecuencia cardíaca"
        ) {

            return traducir(
                "alert_heart_rate",
                currentLanguage === "en"
                    ? "Heart Rate"
                    : "Frecuencia cardíaca"
            );
        }


        if (valor === "seguimiento") {

            return traducir(
                "alert_follow_up_type",
                currentLanguage === "en"
                    ? "Follow-up"
                    : "Seguimiento"
            );
        }


        if (valor === "actividad fisica") {

            return traducir(
                "alert_physical_activity",
                currentLanguage === "en"
                    ? "Physical Activity"
                    : "Actividad física"
            );
        }


        return tipo ||
            traducir(
                "alert_clinical",
                "Alerta clínica"
            );
    }


    function traducirMensaje(mensaje) {

        const valor =
            normalizar(mensaje);


        if (
            valor ===
            "se detecto una disminucion de peso durante los ultimos controles."
        ) {

            return currentLanguage === "en"
                ? "A decrease in weight was detected during the latest checkups."
                : mensaje;
        }


        if (
            valor ===
            "se registraron pocas horas de sueno durante el ultimo control."
        ) {

            return currentLanguage === "en"
                ? "Few hours of sleep were recorded during the latest checkup."
                : mensaje;
        }


        if (
            valor ===
            "la frecuencia cardiaca registrada requiere seguimiento."
        ) {

            return currentLanguage === "en"
                ? "The recorded heart rate requires follow-up."
                : mensaje;
        }


        if (
            valor ===
            "el paciente presenta evolucion favorable en sus ultimos controles."
        ) {

            return currentLanguage === "en"
                ? "The patient shows favorable progress in recent checkups."
                : mensaje;
        }


        if (
            valor ===
            "el paciente presenta un nivel adecuado de actividad fisica."
        ) {

            return currentLanguage === "en"
                ? "The patient has an adequate level of physical activity."
                : mensaje;
        }


        return mensaje ||
            traducir(
                "no_description_available",
                "Sin información disponible."
            );
    }


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
                key: "high",
                clase: "high",
                texto: traducir(
                    "high",
                    "Alta"
                )
            };
        }


        if (
            tipo.includes("sueno") ||
            tipo.includes("peso") ||
            tipo.includes("seguimiento") ||
            tipo.includes("imc")
        ) {

            return {
                key: "medium",
                clase: "medium",
                texto: traducir(
                    "medium",
                    "Media"
                )
            };
        }


        return {
            key: "low",
            clase: "low",
            texto: traducir(
                "low",
                "Baja"
            )
        };
    }


    function estadoInfo(status) {

        const estado =
            normalizar(status);


        if (
            estado === "resolved" ||
            estado === "resuelta" ||
            estado === "resuelto" ||
            estado === "closed" ||
            estado === "cerrada"
        ) {

            return {
                key: "resolved",
                clase: "resolved",
                texto: traducir(
                    "resolved",
                    "Resuelta"
                )
            };
        }


        if (
            estado === "follow_up" ||
            estado === "follow-up" ||
            estado === "in_progress" ||
            estado === "in progress" ||
            estado === "seguimiento" ||
            estado === "en seguimiento" ||
            estado === "en_seguimiento"
        ) {

            return {
                key: "follow_up",
                clase: "follow-up",
                texto: traducir(
                    "follow_up",
                    "En Seguimiento"
                )
            };
        }


        return {
            key: "pending",
            clase: "pending",
            texto: traducir(
                "pending",
                "Pendiente"
            )
        };
    }


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
                    (alerta) => {

                        const prioridad =
                            prioridadInfo(
                                alerta
                            );

                        const estado =
                            estadoInfo(
                                alerta.status
                            );

                        const campos = [

                            alerta.patientName,

                            alerta.alertType,

                            traducirTipoAlerta(
                                alerta.alertType
                            ),

                            alerta.message,

                            traducirMensaje(
                                alerta.message
                            ),

                            prioridad.texto,

                            estado.texto

                        ];


                        return campos.some(
                            (campo) =>
                                normalizar(
                                    campo
                                ).includes(
                                    busqueda
                                )
                        );
                    }
                );
        }


        if (
            selectPrioridad.value
        ) {

            const prioridadSeleccionada =
                normalizar(
                    selectPrioridad.value
                );


            resultado =
                resultado.filter(
                    (alerta) => {

                        const prioridad =
                            prioridadInfo(
                                alerta
                            ).key;


                        if (
                            prioridadSeleccionada ===
                            "alta"
                        ) {
                            return prioridad === "high";
                        }


                        if (
                            prioridadSeleccionada ===
                            "media"
                        ) {
                            return prioridad === "medium";
                        }


                        if (
                            prioridadSeleccionada ===
                            "baja"
                        ) {
                            return prioridad === "low";
                        }


                        if (
                            prioridadSeleccionada ===
                            "high"
                        ) {
                            return prioridad === "high";
                        }


                        if (
                            prioridadSeleccionada ===
                            "medium"
                        ) {
                            return prioridad === "medium";
                        }


                        if (
                            prioridadSeleccionada ===
                            "low"
                        ) {
                            return prioridad === "low";
                        }


                        return true;
                    }
                );
        }


        if (
            selectEstado.value
        ) {

            const estadoSeleccionado =
                normalizar(
                    selectEstado.value
                );


            resultado =
                resultado.filter(
                    (alerta) => {

                        const estado =
                            estadoInfo(
                                alerta.status
                            ).key;


                        if (
                            estadoSeleccionado ===
                            "pendiente" ||
                            estadoSeleccionado ===
                            "pending"
                        ) {

                            return estado === "pending";
                        }


                        if (
                            estadoSeleccionado ===
                            "en seguimiento" ||
                            estadoSeleccionado ===
                            "en_seguimiento" ||
                            estadoSeleccionado ===
                            "follow_up" ||
                            estadoSeleccionado ===
                            "follow-up"
                        ) {

                            return estado === "follow_up";
                        }


                        if (
                            estadoSeleccionado ===
                            "resuelta" ||
                            estadoSeleccionado ===
                            "resolved"
                        ) {

                            return estado === "resolved";
                        }


                        return true;
                    }
                );
        }


        return resultado;
    }


    async function cargarAlertas() {

        try {

            const respuesta =
                await fetch(
                    API_URL
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
                    traducir(
                        "cannot_get_alerts",
                        "No fue posible obtener la información desde el servidor."
                    )
                );
            }


            alertas =
                Array.isArray(
                    datos.data
                )
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
                                ${traducir(
                                    "cannot_load_alerts",
                                    "No se pudieron cargar las alertas"
                                )}
                            </strong>

                            <p>
                                ${traducir(
                                    "cannot_get_alerts",
                                    "No fue posible obtener la información desde el servidor."
                                )}
                            </p>

                        </div>

                    </td>

                </tr>
            `;

            renderKpis([]);
            renderActividadReciente([]);
        }
    }


    function mostrarSugerencias() {

        if (!sugerencias) {
            return;
        }


        const termino =
            normalizar(
                inputPaciente.value
            );


        if (!termino) {

            cerrarSugerencias();

            return;
        }


        const resultados =
            alertas
                .filter(
                    (alerta) => {

                        return (
                            normalizar(
                                alerta.patientName
                            ).includes(
                                termino
                            ) ||
                            normalizar(
                                alerta.alertType
                            ).includes(
                                termino
                            ) ||
                            normalizar(
                                traducirTipoAlerta(
                                    alerta.alertType
                                )
                            ).includes(
                                termino
                            ) ||
                            normalizar(
                                alerta.message
                            ).includes(
                                termino
                            ) ||
                            normalizar(
                                traducirMensaje(
                                    alerta.message
                                )
                            ).includes(
                                termino
                            )
                        );
                    }
                )
                .slice(
                    0,
                    8
                );


        sugerencias.innerHTML =
            "";


        if (
            resultados.length === 0
        ) {

            sugerencias.innerHTML = `
                <div class="alert-search-empty">
                    ${traducir(
                        "no_alert_matches",
                        "No se encontraron coincidencias."
                    )}
                </div>
            `;

            sugerencias.hidden =
                false;

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
                                traducir(
                                    "patient",
                                    "Paciente"
                                )
                            )}
                        </strong>

                        <span>
                            ${escaparHTML(
                                traducirTipoAlerta(
                                    alerta.alertType
                                )
                            )}
                        </span>

                    </div>
                `;


                boton.addEventListener(
                    "click",
                    () => {

                        inputPaciente.value =
                            alerta.patientName ||
                            "";

                        cerrarSugerencias();

                        renderTodo();
                    }
                );


                sugerencias.appendChild(
                    boton
                );
            }
        );


        sugerencias.hidden =
            false;
    }


    function cerrarSugerencias() {

        if (!sugerencias) {
            return;
        }


        sugerencias.hidden =
            true;

        sugerencias.innerHTML =
            "";
    }


    function abrirDetalle(
        alerta
    ) {

        alertaActual =
            alerta;


        const prioridad =
            prioridadInfo(
                alerta
            );


        const estado =
            estadoInfo(
                alerta.status
            );


        detallePaciente.textContent =
            alerta.patientName ||
            traducir(
                "patient",
                "Paciente"
            );


        detallePacienteInfo.textContent =
            alerta.patientIdentification ||
            alerta.identification ||
            traducir(
                "registered_patient_ny",
                "Paciente registrado en Nyvora"
            );


        detalleTipo.textContent =
            traducirTipoAlerta(
                alerta.alertType
            );


        detalleFecha.textContent =
            formatearFecha(
                alerta.createdAt
            );


        detalleMensaje.textContent =
            traducirMensaje(
                alerta.message
            );


        detallePrioridad.textContent =
            prioridad.texto;


        detallePrioridad.className =
            `alert-priority ${prioridad.clase}`;


        detalleEstado.textContent =
            estado.texto;


        detalleEstado.className =
            `alert-status ${estado.clase}`;


        actualizarBotonesEstado(
            alerta.status
        );


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


    function actualizarBotonesEstado(
        status
    ) {

        const estado =
            estadoInfo(
                status
            );


        const resuelta =
            estado.key ===
            "resolved";


        const seguimiento =
            estado.key ===
            "follow_up";


        btnSeguimiento.disabled =
            resuelta ||
            seguimiento;


        btnResolver.disabled =
            resuelta;


        if (seguimiento) {

            btnSeguimiento.innerHTML = `
                <i class="fa-solid fa-stethoscope"></i>
                ${traducir(
                    "follow_up_active",
                    "En Seguimiento"
                )}
            `;

        } else {

            btnSeguimiento.innerHTML = `
                <i class="fa-solid fa-stethoscope"></i>
                ${traducir(
                    "start_follow_up",
                    "Iniciar Seguimiento"
                )}
            `;
        }


        if (resuelta) {

            btnResolver.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                ${traducir(
                    "resolved_state",
                    "Resuelta"
                )}
            `;

        } else {

            btnResolver.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                ${traducir(
                    "mark_resolved",
                    "Marcar como Resuelta"
                )}
            `;
        }
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


        alertaActual =
            null;
    }


    async function actualizarEstadoAlerta(
        accion
    ) {

        if (!alertaActual) {
            return;
        }


        const alertaId =
            alertaActual.id;


        try {

            btnSeguimiento.disabled =
                true;

            btnResolver.disabled =
                true;


            const datos =
                new URLSearchParams();


            datos.append(
                "alert_id",
                alertaId
            );


            datos.append(
                "action",
                accion
            );


            const respuesta =
                await fetch(
                    API_URL,
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded;charset=UTF-8"
                        },

                        body:
                            datos.toString()
                    }
                );


            if (!respuesta.ok) {

                throw new Error(
                    `Error HTTP: ${respuesta.status}`
                );
            }


            const resultado =
                await respuesta.json();


            if (!resultado.success) {

                throw new Error(
                    resultado.message ||
                    traducir(
                        "alert_update_error",
                        "No se pudo actualizar la alerta."
                    )
                );
            }


            await cargarAlertas();


            const alertaActualizada =
                alertas.find(
                    (alerta) =>
                        String(
                            alerta.id
                        ) ===
                        String(
                            alertaId
                        )
                );


            if (alertaActualizada) {

                abrirDetalle(
                    alertaActualizada
                );

            } else {

                cerrarDetalle();
            }


        } catch (error) {

            console.error(
                "Error actualizando alerta:",
                error
            );


            alert(
                traducir(
                    "alert_update_error",
                    "No se pudo actualizar la alerta."
                )
            );


            if (alertaActual) {

                actualizarBotonesEstado(
                    alertaActual.status
                );
            }
        }
    }


    function crearFilaAlerta(
        alerta
    ) {

        const prioridad =
            prioridadInfo(
                alerta
            );


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
                                traducir(
                                    "patient",
                                    "Paciente"
                                )
                            )}
                        </strong>

                        <span>
                            ${escaparHTML(
                                alerta.patientIdentification ||
                                alerta.identification ||
                                traducir(
                                    "registered_patient",
                                    "Paciente registrado"
                                )
                            )}
                        </span>

                    </div>

                </div>

            </td>


            <td>

                <div class="alert-message-cell">

                    <strong>
                        ${escaparHTML(
                            traducirTipoAlerta(
                                alerta.alertType
                            )
                        )}
                    </strong>

                    <span>
                        ${escaparHTML(
                            traducirMensaje(
                                alerta.message
                            )
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

                    ${traducir(
                        "details",
                        "Ver Detalle"
                    )}

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

                    abrirDetalle(
                        alerta
                    );
                }
            );


        return fila;
    }


    function renderTabla() {

        const filtradas =
            obtenerAlertasFiltradas();


        tbody.innerHTML =
            "";


        if (
            contadorResultados
        ) {

            const cantidad =
                filtradas.length;


            const palabra =
                cantidad === 1
                    ? traducir(
                        "results_one",
                        "resultado"
                    )
                    : traducir(
                        "results_many",
                        "resultados"
                    );


            contadorResultados.textContent =
                `${cantidad} ${palabra}`;
        }


        if (
            filtradas.length === 0
        ) {

            tbody.innerHTML = `
                <tr class="empty-alert-row">

                    <td colspan="6">

                        <div class="alert-empty-state">

                            <div class="alert-empty-icon">
                                <i class="fa-regular fa-bell"></i>
                            </div>

                            <strong>
                                ${traducir(
                                    "no_alert_results",
                                    "No se encontraron alertas"
                                )}
                            </strong>

                            <p>
                                ${traducir(
                                    "change_alert_filters",
                                    "Cambie los filtros o consulte otro paciente."
                                )}
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


    function renderKpis(
        alertasFiltradas
    ) {

        const activas =
            alertasFiltradas.filter(
                (alerta) =>
                    estadoInfo(
                        alerta.status
                    ).key !==
                    "resolved"
            ).length;


        const altas =
            alertasFiltradas.filter(
                (alerta) =>
                    prioridadInfo(
                        alerta
                    ).key ===
                    "high" &&
                    estadoInfo(
                        alerta.status
                    ).key !==
                    "resolved"
            ).length;


        const seguimiento =
            alertasFiltradas.filter(
                (alerta) =>
                    estadoInfo(
                        alerta.status
                    ).key ===
                    "follow_up"
            ).length;


        const resueltas =
            alertasFiltradas.filter(
                (alerta) =>
                    estadoInfo(
                        alerta.status
                    ).key ===
                    "resolved"
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


    function renderActividadReciente(
        alertasFiltradas
    ) {

        if (!actividadReciente) {
            return;
        }


        actividadReciente.innerHTML =
            "";


        const recientes =
            [...alertasFiltradas]
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


                        return fechaB - fechaA;
                    }
                )
                .slice(
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
                                        traducirTipoAlerta(
                                            alerta.alertType
                                        )
                                    )}
                                </strong>

                                <span>
                                    ${escaparHTML(
                                        alerta.patientName ||
                                        traducir(
                                            "patient",
                                            "Paciente"
                                        )
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


    function renderTodo() {

        const filtradas =
            obtenerAlertasFiltradas();


        renderTabla();

        renderKpis(
            filtradas
        );

        renderActividadReciente(
            filtradas
        );
    }


    inputPaciente.addEventListener(
        "input",
        () => {

            renderTodo();

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

            renderTodo();
        }
    );


    selectPrioridad.addEventListener(
        "change",
        renderTodo
    );


    selectEstado.addEventListener(
        "change",
        renderTodo
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
                !alertaActual ||
                !alertaActual.patientId
            ) {

                return;
            }


            window.location.href =
                `historial.html?patient_id=${alertaActual.patientId}`;
        }
    );


    btnSeguimiento.addEventListener(
        "click",
        () => {

            actualizarEstadoAlerta(
                "follow_up"
            );
        }
    );


    btnResolver.addEventListener(
        "click",
        () => {

            actualizarEstadoAlerta(
                "resolve"
            );
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
                    modal &&
                    modal.classList.contains(
                        "active"
                    )
                ) {

                    cerrarDetalle();
                }
            }
        }
    );


    document.addEventListener(
        "languageChanged",
        () => {

            renderTodo();


            if (
                alertaActual &&
                modal &&
                modal.classList.contains(
                    "active"
                )
            ) {

                abrirDetalle(
                    alertaActual
                );
            }
        }
    );


    cargarAlertas();

});