"use strict";

/* Citas */

document.addEventListener("DOMContentLoaded", () => {

    /* Configuración */

    const APPOINTMENTS_KEY = "nyvora_appointments";

    /* Controles */

    const inputBuscar =
        document.getElementById("appointment-search");

    const inputFechaFiltro =
        document.getElementById("appointment-date-filter");

    const selectEstadoFiltro =
        document.getElementById("appointment-status-filter");

    const btnNuevaCita =
        document.getElementById("open-appointment-modal");

    /* Tabla */

    const tabla =
        document.getElementById("appointments-table");

    const tbody =
        tabla.querySelector("tbody");

    /* Agenda */

    const listaHoy =
        document.getElementById("appointments-today-list");

    const listaProximas =
        document.getElementById("appointments-upcoming-list");

    /* KPIs */

    const kpiHoy =
        document.getElementById("kpi-appointments-today");

    const kpiProximas =
        document.getElementById("kpi-appointments-upcoming");

    const kpiCompletadas =
        document.getElementById("kpi-appointments-completed");

    const kpiPendientes =
        document.getElementById("kpi-appointments-pending");

    /* Modal */

    const modal =
        document.getElementById("appointment-modal");

    const modalBackdrop =
        modal.querySelector(".appointment-modal-backdrop");

    const btnCerrarModal =
        document.getElementById("close-appointment-modal");

    const btnCancelarModal =
        document.getElementById("cancel-appointment-modal");

    const formulario =
        document.getElementById("appointment-form");

    /* Campos */

    const selectPaciente =
        document.getElementById("appointment-patient");

    const inputFecha =
        document.getElementById("appointment-date");

    const inputHora =
        document.getElementById("appointment-time");

    const selectTipo =
        document.getElementById("appointment-type");

    const selectEstado =
        document.getElementById("appointment-status");

    const inputMotivo =
        document.getElementById("appointment-reason");

    const inputObservaciones =
        document.getElementById("appointment-notes");

    /* Utilidades */

    function normalizar(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function fechaLocalActual() {
        const fecha = new Date();
        const offset = fecha.getTimezoneOffset();

        return new Date(
            fecha.getTime() - offset * 60000
        )
            .toISOString()
            .slice(0, 10);
    }

    function obtenerFechaCita(cita) {
        return nyvoraBuildDate(cita.date);
    }

    function formatearFecha(fecha) {
        if (!fecha) {
            return "Sin fecha";
        }

        return nyvoraFormatDate(fecha);
    }

    function formatearHora(hora) {
        if (!hora) {
            return "Sin hora";
        }

        const partes = String(hora)
            .split(":");

        const horas =
            Number(partes[0]);

        const minutos =
            partes[1] || "00";

        const periodo =
            horas >= 12 ? "p. m." : "a. m.";

        const hora12 =
            horas % 12 || 12;

        return `${hora12}:${minutos} ${periodo}`;
    }

    function tipoInfo(tipo) {
        const tipos = {
            VALORACION_INICIAL:
                "Valoración inicial",

            CONTROL_NUTRICIONAL:
                "Control nutricional",

            SEGUIMIENTO_BIOMETRICO:
                "Seguimiento biométrico",

            REVISION_CLINICA:
                "Revisión clínica",

            OTRO:
                "Otro"
        };

        return tipos[tipo] || tipo || "Sin tipo";
    }

    function estadoInfo(estado) {
        const estados = {
            PROGRAMADA: {
                texto: "Programada",
                clase: "programada"
            },

            CONFIRMADA: {
                texto: "Confirmada",
                clase: "confirmada"
            },

            COMPLETADA: {
                texto: "Completada",
                clase: "completada"
            },

            CANCELADA: {
                texto: "Cancelada",
                clase: "cancelada"
            }
        };

        return estados[estado] || {
            texto: estado || "Sin estado",
            clase: "programada"
        };
    }

    /* Almacenamiento temporal */

    function obtenerCitas() {
        try {
            const datos =
                localStorage.getItem(
                    APPOINTMENTS_KEY
                );

            if (!datos) {
                return [];
            }

            const citas =
                JSON.parse(datos);

            return Array.isArray(citas)
                ? citas
                : [];

        } catch (error) {
            console.error(
                "Error leyendo citas:",
                error
            );

            return [];
        }
    }

    function guardarCitas(citas) {
        localStorage.setItem(
            APPOINTMENTS_KEY,
            JSON.stringify(citas)
        );

        window.dispatchEvent(
            new CustomEvent(
                "nyvora:data-changed",
                {
                    detail: {
                        type: "appointments"
                    }
                }
            )
        );
    }

    function agregarCita(datos) {
        const citas =
            obtenerCitas();

        const cita = {
            id: nyvoraNextId(citas),
            patientId:
                Number(datos.patientId),

            date:
                datos.date,

            time:
                datos.time,

            type:
                datos.type,

            status:
                datos.status ||
                "PROGRAMADA",

            reason:
                String(
                    datos.reason || ""
                ).trim(),

            notes:
                String(
                    datos.notes || ""
                ).trim(),

            professional:
                datos.professional ||
                "Profesional Nyvora",

            createdAt:
                nyvoraNow()
        };

        citas.push(cita);

        guardarCitas(citas);

        return cita;
    }

    /* Pacientes */

    function cargarPacientes() {
        const pacientes =
            nyvoraGetPatients()
                .filter((paciente) =>
                    paciente.status !==
                    "INACTIVO"
                )
                .sort((a, b) =>
                    String(a.fullName || "")
                        .localeCompare(
                            String(
                                b.fullName || ""
                            ),
                            "es"
                        )
                );

        selectPaciente.innerHTML = `
            <option
                value=""
                selected
                disabled>
                Seleccione un paciente
            </option>
        `;

        pacientes.forEach((paciente) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                paciente.id;

            option.textContent =
                paciente.fullName;

            selectPaciente.appendChild(
                option
            );
        });
    }

    /* Modal */

    function abrirModal() {
        cargarPacientes();
        limpiarErrores();

        formulario.reset();

        selectEstado.value =
            "PROGRAMADA";

        inputFecha.min =
            fechaLocalActual();

        modal.classList.add(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "appointment-modal-open"
        );

        setTimeout(() => {
            selectPaciente.focus();
        }, 100);
    }

    function cerrarModal() {
        modal.classList.remove(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "appointment-modal-open"
        );

        formulario.reset();

        selectEstado.value =
            "PROGRAMADA";

        limpiarErrores();
    }

    /* Validación */

    function mostrarError(
        campo,
        mensaje
    ) {
        const contenedor =
            campo.closest(
                ".appointment-field"
            );

        if (!contenedor) {
            return;
        }

        contenedor.classList.add(
            "has-error"
        );

        const error =
            contenedor.querySelector(
                ".field-error"
            );

        if (error) {
            error.textContent =
                mensaje;
        }
    }

    function limpiarError(campo) {
        const contenedor =
            campo.closest(
                ".appointment-field"
            );

        if (!contenedor) {
            return;
        }

        contenedor.classList.remove(
            "has-error"
        );

        const error =
            contenedor.querySelector(
                ".field-error"
            );

        if (error) {
            error.textContent = "";
        }
    }

    function limpiarErrores() {
        formulario
            .querySelectorAll(
                ".appointment-field"
            )
            .forEach((campo) => {
                campo.classList.remove(
                    "has-error"
                );
            });

        formulario
            .querySelectorAll(
                ".field-error"
            )
            .forEach((error) => {
                error.textContent = "";
            });
    }

    function validarFormulario() {
        limpiarErrores();

        let valido = true;

        if (!selectPaciente.value) {
            mostrarError(
                selectPaciente,
                "Seleccione un paciente."
            );

            valido = false;
        }

        if (!inputFecha.value) {
            mostrarError(
                inputFecha,
                "Seleccione una fecha."
            );

            valido = false;
        }

        if (!inputHora.value) {
            mostrarError(
                inputHora,
                "Seleccione una hora."
            );

            valido = false;
        }

        if (!selectTipo.value) {
            mostrarError(
                selectTipo,
                "Seleccione un tipo de cita."
            );

            valido = false;
        }

        return valido;
    }

    /* Tabla */

    function crearFila(cita) {
        const paciente =
            nyvoraGetPatientById(
                cita.patientId
            );

        const estado =
            estadoInfo(
                cita.status
            );

        const fila =
            document.createElement(
                "tr"
            );

        fila.dataset.id =
            cita.id;

        fila.innerHTML = `
            <td>
                ${formatearFecha(
                    cita.date
                )}
            </td>

            <td>
                ${formatearHora(
                    cita.time
                )}
            </td>

            <td>
                ${
                    paciente
                        ? nyvoraEscapeHtml(
                            paciente.fullName
                        )
                        : "Paciente no disponible"
                }
            </td>

            <td>
                ${nyvoraEscapeHtml(
                    tipoInfo(cita.type)
                )}
            </td>

            <td>
                <span
                    class="appointment-status
                    ${estado.clase}">
                    ${estado.texto}
                </span>
            </td>

            <td>
                ${nyvoraEscapeHtml(
                    cita.professional ||
                    "Profesional Nyvora"
                )}
            </td>

            <td>
                ${
                    paciente
                        ? `
                            <a
                                href="historial.html?id=${paciente.id}"
                                class="appointment-action-link">

                                <i class="fa-solid fa-folder-open"></i>
                                Expediente

                            </a>
                        `
                        : "—"
                }
            </td>
        `;

        return fila;
    }

    function obtenerCitasFiltradas() {
        let citas =
            [...obtenerCitas()];

        const busqueda =
            normalizar(
                inputBuscar.value
            );

        if (busqueda) {
            citas =
                citas.filter((cita) => {

                    const paciente =
                        nyvoraGetPatientById(
                            cita.patientId
                        );

                    const citaId =
                        normalizar(cita.id);

                    const pacienteId =
                        normalizar(cita.patientId);

                    const nombre =
                        normalizar(
                            paciente?.fullName
                        );

                    const identificacion =
                        normalizar(
                            paciente?.identification
                        );

                    const tipo =
                        normalizar(
                            tipoInfo(
                                cita.type
                            )
                        );

                    const fecha =
                        normalizar(cita.date);

                    const estado =
                        normalizar(
                            estadoInfo(
                                cita.status
                            ).texto
                        );

                    return (
                        citaId.includes(busqueda) ||
                        pacienteId.includes(busqueda) ||
                        nombre.includes(busqueda) ||
                        identificacion.includes(busqueda) ||
                        tipo.includes(busqueda) ||
                        fecha.includes(busqueda) ||
                        estado.includes(busqueda)
                    );
                });
        }

        if (
            inputFechaFiltro.value
        ) {
            citas =
                citas.filter(
                    (cita) =>
                        cita.date ===
                        inputFechaFiltro.value
                );
        }

        if (
            selectEstadoFiltro.value
        ) {
            citas =
                citas.filter(
                    (cita) =>
                        cita.status ===
                        selectEstadoFiltro.value
                );
        }

        return citas.sort(
            (a, b) => {

                const fechaA =
                    new Date(
                        `${a.date}T${a.time || "00:00"}`
                    );

                const fechaB =
                    new Date(
                        `${b.date}T${b.time || "00:00"}`
                    );

                return fechaA - fechaB;
            }
        );
    }
    
    function renderTabla() {
        const citas =
            obtenerCitasFiltradas();

        tbody.innerHTML = "";

        if (!citas.length) {
            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="appointments-empty-row">
                        No se encontraron citas
                        con los filtros seleccionados.
                    </td>
                </tr>
            `;

            return;
        }

        citas.forEach((cita) => {
            tbody.appendChild(
                crearFila(cita)
            );
        });
    }

    /* Tarjetas de agenda */

    function crearTarjetaCita(
        cita,
        mostrarFecha = false
    ) {
        const paciente =
            nyvoraGetPatientById(
                cita.patientId
            );

        const estado =
            estadoInfo(
                cita.status
            );

        const elemento =
            document.createElement(
                "div"
            );

        elemento.className =
            "appointment-item";

        elemento.innerHTML = `
            <div class="appointment-time">
                ${
                    mostrarFecha
                        ? formatearFecha(
                            cita.date
                        )
                        : formatearHora(
                            cita.time
                        )
                }
            </div>

            <div class="appointment-info">
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
                    ${nyvoraEscapeHtml(
                        tipoInfo(
                            cita.type
                        )
                    )}
                    ${
                        mostrarFecha
                            ? ` · ${formatearHora(
                                cita.time
                            )}`
                            : ""
                    }
                </span>
            </div>

            <div class="appointment-actions">

                <span
                    class="appointment-status
                    ${estado.clase}">
                    ${estado.texto}
                </span>

                ${
                    paciente
                        ? `
                            <a
                                href="historial.html?id=${paciente.id}"
                                class="appointment-action-link"
                                title="Abrir expediente">

                                <i class="fa-solid fa-arrow-right"></i>

                            </a>
                        `
                        : ""
                }

            </div>
        `;

        return elemento;
    }

    /* Agenda de hoy */

    function renderAgendaHoy() {
        const hoy =
            fechaLocalActual();

        const citasHoy =
            obtenerCitas()
                .filter(
                    (cita) =>
                        cita.date === hoy &&
                        cita.status !==
                        "CANCELADA"
                )
                .sort(
                    (a, b) =>
                        String(a.time)
                            .localeCompare(
                                String(b.time)
                            )
                );

        listaHoy.innerHTML = "";

        if (!citasHoy.length) {
            listaHoy.innerHTML = `
                <div class="appointments-empty-state">

                    <div class="appointments-empty-icon">
                        <i class="fa-regular fa-calendar"></i>
                    </div>

                    <div>
                        <strong>
                            No hay citas programadas para hoy.
                        </strong>

                        <span>
                            Las citas del día aparecerán aquí.
                        </span>
                    </div>

                </div>
            `;

            return;
        }

        citasHoy.forEach((cita) => {
            listaHoy.appendChild(
                crearTarjetaCita(cita)
            );
        });
    }

    /* Próximas citas */

    function renderProximas() {
        const hoy =
            nyvoraBuildDate(
                fechaLocalActual()
            );

        const proximas =
            obtenerCitas()
                .filter((cita) => {

                    const fecha =
                        obtenerFechaCita(
                            cita
                        );

                    return (
                        fecha > hoy &&
                        cita.status !==
                        "CANCELADA" &&
                        cita.status !==
                        "COMPLETADA"
                    );
                })
                .sort(
                    (a, b) =>
                        obtenerFechaCita(a) -
                        obtenerFechaCita(b)
                )
                .slice(0, 6);

        listaProximas.innerHTML = "";

        if (!proximas.length) {
            listaProximas.innerHTML = `
                <div class="appointments-empty-state">

                    <div class="appointments-empty-icon">
                        <i class="fa-regular fa-calendar-check"></i>
                    </div>

                    <div>
                        <strong>
                            No hay próximas citas registradas.
                        </strong>

                        <span>
                            Las próximas citas aparecerán aquí
                            cuando se programen.
                        </span>
                    </div>

                </div>
            `;

            return;
        }

        proximas.forEach((cita) => {
            listaProximas.appendChild(
                crearTarjetaCita(
                    cita,
                    true
                )
            );
        });
    }

    /* KPIs */

    function renderKpis() {
        const citas =
            obtenerCitas();

        const hoy =
            fechaLocalActual();

        const fechaHoy =
            nyvoraBuildDate(hoy);

        const citasHoy =
            citas.filter(
                (cita) =>
                    cita.date === hoy &&
                    cita.status !==
                    "CANCELADA"
            ).length;

        const proximas =
            citas.filter((cita) => {

                const fecha =
                    obtenerFechaCita(
                        cita
                    );

                return (
                    fecha > fechaHoy &&
                    cita.status !==
                    "CANCELADA" &&
                    cita.status !==
                    "COMPLETADA"
                );
            }).length;

        const completadas =
            citas.filter(
                (cita) =>
                    cita.status ===
                    "COMPLETADA"
            ).length;

        const pendientes =
            citas.filter(
                (cita) =>
                    cita.status ===
                    "PROGRAMADA" ||
                    cita.status ===
                    "CONFIRMADA"
            ).length;

        kpiHoy.textContent =
            citasHoy;

        kpiProximas.textContent =
            proximas;

        kpiCompletadas.textContent =
            completadas;

        kpiPendientes.textContent =
            pendientes;
    }

    /* Guardar */

    function guardarCita() {
        if (!validarFormulario()) {
            return;
        }

        agregarCita({
            patientId:
                selectPaciente.value,

            date:
                inputFecha.value,

            time:
                inputHora.value,

            type:
                selectTipo.value,

            status:
                selectEstado.value,

            reason:
                inputMotivo.value,

            notes:
                inputObservaciones.value
        });

        cerrarModal();

        renderTodo();
    }

    /* Render general */

    function renderTodo() {
        renderTabla();
        renderAgendaHoy();
        renderProximas();
        renderKpis();
    }

    /* Filtros */

    inputBuscar.addEventListener(
        "input",
        renderTabla
    );

    inputFechaFiltro.addEventListener(
        "change",
        renderTabla
    );

    selectEstadoFiltro.addEventListener(
        "change",
        renderTabla
    );

    /* Modal */

    btnNuevaCita.addEventListener(
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

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "is-open"
                )
            ) {
                cerrarModal();
            }
        }
    );

    /* Limpiar validación */

    [
        selectPaciente,
        inputFecha,
        inputHora,
        selectTipo
    ].forEach((campo) => {

        campo.addEventListener(
            "change",
            () => limpiarError(campo)
        );
    });

    /* Formulario */

    formulario.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();
            guardarCita();
        }
    );

    /* Cambios globales */

    window.addEventListener(
        "nyvora:data-changed",
        (event) => {

            if (
                event.detail?.type ===
                "patients"
            ) {
                cargarPacientes();
            }

            renderTodo();
        }
    );

    /* Inicialización */

    cargarPacientes();
    renderTodo();
});