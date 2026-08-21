"use strict";

/* Pacientes */

document.addEventListener("DOMContentLoaded", () => {

    /* Controles */

    const inputBuscar =
        document.getElementById("patient-search");

    const searchResults =
        document.getElementById("patient-search-results");

    const selectEstado =
        document.getElementById("patient-status-filter");

    const selectOrden =
        document.getElementById("patient-order-filter");

    const btnRegistrar =
        document.getElementById("open-patient-modal");

    /* Tabla */

    const tabla =
        document.getElementById("patients-table");

    const tbody =
        tabla.querySelector("tbody");

    /* KPIs */

    const kpiTotal =
        document.getElementById("kpi-patients-total");

    const kpiActivos =
        document.getElementById("kpi-patients-active");

    const kpiSeguimiento =
        document.getElementById("kpi-patients-followup");

    const kpiAlertas =
        document.getElementById("kpi-patients-alerts");

    /* Resumen */

    const resumenPacientes =
        document.getElementById("summary-patients");

    const resumenActivos =
        document.getElementById("summary-active");

    const resumenSeguimiento =
        document.getElementById("summary-followup");

    const resumenAlertas =
        document.getElementById("summary-alerts");

    /* Modal */

    const modal =
        document.getElementById("patient-modal");

    const modalBackdrop =
        modal.querySelector(".patient-modal-backdrop");

    const btnCerrarModal =
        document.getElementById("close-patient-modal");

    const btnCancelarModal =
        document.getElementById("cancel-patient-modal");

    const formulario =
        document.getElementById("patient-form");

    /* Campos */

    const inputNombre =
        document.getElementById("patient-full-name");

    const inputIdentificacion =
        document.getElementById("patient-identification");

    const inputEdad =
        document.getElementById("patient-age");

    const inputTelefono =
        document.getElementById("patient-phone");

    const inputEstatura =
        document.getElementById("patient-height");

    const selectEstadoPaciente =
        document.getElementById("patient-status");

    const inputCondicion =
        document.getElementById("patient-condition");

    const inputObservaciones =
        document.getElementById("patient-observations");

    /* Utilidades */

    function normalizar(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

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
            texto: status || "Sin estado",
            clase: "warning"
        };
    }

    /* Modal */

    function abrirModal() {
        limpiarErrores();

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add(
            "patient-modal-open"
        );

        setTimeout(() => {
            inputNombre.focus();
        }, 100);
    }

    function cerrarModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove(
            "patient-modal-open"
        );

        formulario.reset();

        selectEstadoPaciente.value = "ACTIVO";

        limpiarErrores();
    }

    /* Validación */

    function mostrarError(campo, mensaje) {
        const contenedor =
            campo.closest(".patient-field");

        if (!contenedor) {
            return;
        }

        contenedor.classList.add("has-error");

        const error =
            contenedor.querySelector(".field-error");

        if (error) {
            error.textContent = mensaje;
        }
    }

    function limpiarError(campo) {
        const contenedor =
            campo.closest(".patient-field");

        if (!contenedor) {
            return;
        }

        contenedor.classList.remove("has-error");

        const error =
            contenedor.querySelector(".field-error");

        if (error) {
            error.textContent = "";
        }
    }

    function limpiarErrores() {
        formulario
            .querySelectorAll(".patient-field")
            .forEach((campo) => {
                campo.classList.remove("has-error");
            });

        formulario
            .querySelectorAll(".field-error")
            .forEach((error) => {
                error.textContent = "";
            });
    }

    function validarFormulario() {
        limpiarErrores();

        let valido = true;

        const nombre =
            inputNombre.value.trim();

        const edad =
            Number(inputEdad.value);

        const estatura =
            Number(inputEstatura.value);

        if (!nombre) {
            mostrarError(
                inputNombre,
                "Ingrese el nombre completo."
            );

            valido = false;
        }

        if (
            inputEdad.value === "" ||
            !Number.isFinite(edad) ||
            edad < 0 ||
            edad > 120
        ) {
            mostrarError(
                inputEdad,
                "Ingrese una edad válida."
            );

            valido = false;
        }

        if (
            inputEstatura.value === "" ||
            !Number.isFinite(estatura) ||
            estatura < 0.5 ||
            estatura > 2.5
        ) {
            mostrarError(
                inputEstatura,
                "Ingrese una estatura válida."
            );

            valido = false;
        }

        if (!selectEstadoPaciente.value) {
            mostrarError(
                selectEstadoPaciente,
                "Seleccione un estado."
            );

            valido = false;
        }

        return valido;
    }

    /* Crear fila */

    function crearFilaPaciente(paciente) {
        const inicial =
            nyvoraGetInitialMetric(paciente.id);

        const ultima =
            nyvoraGetLatestMetric(paciente.id);

        const estado =
            estadoInfo(paciente.status);

        const fila =
            document.createElement("tr");

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
                ${
                    inicial && inicial.weightKg
                        ? `${inicial.weightKg} kg`
                        : "Sin registro"
                }
            </td>

            <td>
                ${
                    ultima
                        ? nyvoraFormatDate(
                            ultima.measurementDate
                        )
                        : "Sin controles"
                }
            </td>

            <td>
                <span class="badge ${estado.clase}">
                    ${estado.texto}
                </span>
            </td>

            <td>
                <a
                    href="historial.html?id=${paciente.id}"
                    class="action-link">
                    <i class="fa-solid fa-eye"></i>
                    Abrir Expediente
                </a>
            </td>
        `;

        return fila;
    }

    /* Búsqueda inteligente */

    function obtenerCoincidencias() {
        const termino =
            normalizar(inputBuscar.value);

        if (!termino) {
            return [];
        }

        return nyvoraGetPatients()
            .filter((paciente) => {

                const nombre =
                    normalizar(paciente.fullName);

                const identificacion =
                    normalizar(paciente.identification);

                const telefono =
                    normalizar(paciente.phone);

                const estado =
                    normalizar(
                        estadoInfo(
                            paciente.status
                        ).texto
                    );

                return (
                    nombre.includes(termino) ||
                    identificacion.includes(termino) ||
                    telefono.includes(termino) ||
                    estado.includes(termino)
                );
            })
            .slice(0, 8);
    }

    function cerrarResultadosBusqueda() {
        searchResults.classList.remove("open");

        inputBuscar.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    function mostrarResultadosBusqueda() {
        const termino =
            inputBuscar.value.trim();

        searchResults.innerHTML = "";

        if (!termino) {
            cerrarResultadosBusqueda();
            return;
        }

        const coincidencias =
            obtenerCoincidencias();

        if (!coincidencias.length) {
            searchResults.innerHTML = `
                <div class="patient-search-empty">
                    No se encontraron pacientes.
                </div>
            `;
        } else {

            coincidencias.forEach((paciente) => {

                const option =
                    document.createElement("button");

                option.type = "button";
                option.className =
                    "patient-search-option";

                const detalle = [
                    paciente.identification,
                    paciente.phone
                ]
                    .filter(Boolean)
                    .join(" · ");

                option.innerHTML = `
                    <div class="patient-search-option-icon">
                        <i class="fa-regular fa-user"></i>
                    </div>

                    <div class="patient-search-option-info">
                        <strong>
                            ${nyvoraEscapeHtml(
                                paciente.fullName
                            )}
                        </strong>

                        <span>
                            ${
                                detalle
                                    ? nyvoraEscapeHtml(detalle)
                                    : "Sin identificación o teléfono"
                            }
                        </span>
                    </div>
                `;

                option.addEventListener(
                    "click",
                    () => {

                        inputBuscar.value =
                            paciente.fullName;

                        cerrarResultadosBusqueda();

                        renderTabla();

                        const fila =
                            tbody.querySelector(
                                `tr[data-id="${paciente.id}"]`
                            );

                        if (fila) {
                            fila.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });
                        }
                    }
                );

                searchResults.appendChild(
                    option
                );
            });
        }

        searchResults.classList.add("open");

        inputBuscar.setAttribute(
            "aria-expanded",
            "true"
        );
    }

    /* Renderizar tabla */

    function renderTabla() {
        let pacientes =
            [...nyvoraGetPatients()];

        const busqueda =
            normalizar(inputBuscar.value);

        if (busqueda) {
            pacientes =
                pacientes.filter((paciente) => {

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

                    const estado =
                        normalizar(
                            estadoInfo(
                                paciente.status
                            ).texto
                        );

                    return (
                        nombre.includes(busqueda) ||
                        identificacion.includes(busqueda) ||
                        telefono.includes(busqueda) ||
                        estado.includes(busqueda)
                    );
                });
        }

        const estadoSeleccionado =
            selectEstado.value;

        if (
            estadoSeleccionado &&
            estadoSeleccionado !== "Estado"
        ) {
            pacientes =
                pacientes.filter((paciente) =>
                    normalizar(
                        estadoInfo(
                            paciente.status
                        ).texto
                    ) ===
                    normalizar(
                        estadoSeleccionado
                    )
                );
        }

        const criterio =
            selectOrden.value;

        if (criterio === "Nombre") {
            pacientes.sort((a, b) =>
                String(a.fullName || "")
                    .localeCompare(
                        String(b.fullName || ""),
                        "es"
                    )
            );
        }

        if (criterio === "Edad") {
            pacientes.sort(
                (a, b) =>
                    (Number(a.age) || 0) -
                    (Number(b.age) || 0)
            );
        }

        if (criterio === "Último control") {
            pacientes.sort((a, b) => {

                const fechaA =
                    nyvoraGetLatestMetric(a.id)
                        ?.measurementDate;

                const fechaB =
                    nyvoraGetLatestMetric(b.id)
                        ?.measurementDate;

                if (!fechaA && !fechaB) {
                    return 0;
                }

                if (!fechaA) {
                    return 1;
                }

                if (!fechaB) {
                    return -1;
                }

                return (
                    nyvoraBuildDate(fechaB) -
                    nyvoraBuildDate(fechaA)
                );
            });
        }

        tbody.innerHTML = "";

        if (pacientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        class="patients-empty-row">
                        No se encontraron pacientes
                        con los filtros seleccionados.
                    </td>
                </tr>
            `;

            return;
        }

        pacientes.forEach((paciente) => {
            tbody.appendChild(
                crearFilaPaciente(paciente)
            );
        });
    }

    /* KPIs */

    function renderKpis() {
        const pacientes =
            nyvoraGetPatients();

        const activos =
            pacientes.filter(
                (paciente) =>
                    paciente.status === "ACTIVO"
            ).length;

        const seguimiento =
            pacientes.filter(
                (paciente) =>
                    paciente.status === "SEGUIMIENTO"
            ).length;

        const alertasActivas =
            nyvoraGetAlerts().filter(
                (alerta) =>
                    alerta.status === "ACTIVE"
            ).length;

        kpiTotal.textContent =
            pacientes.length;

        kpiActivos.textContent =
            activos;

        kpiSeguimiento.textContent =
            seguimiento;

        kpiAlertas.textContent =
            alertasActivas;

        resumenPacientes.textContent =
            pacientes.length;

        resumenActivos.textContent =
            activos;

        resumenSeguimiento.textContent =
            seguimiento;

        resumenAlertas.textContent =
            alertasActivas;
    }

    /* Guardar paciente */

    function guardarPaciente() {
        if (!validarFormulario()) {
            return;
        }

        const nuevoPaciente = {
            fullName:
                inputNombre.value.trim(),

            identification:
                inputIdentificacion.value.trim(),

            age:
                Number(inputEdad.value),

            phone:
                inputTelefono.value.trim(),

            heightM:
                Number(inputEstatura.value),

            conditionGeneral:
                inputCondicion.value.trim(),

            observations:
                inputObservaciones.value.trim(),

            status:
                selectEstadoPaciente.value,

            isActive:
                selectEstadoPaciente.value !==
                "INACTIVO"
        };

        nyvoraAddPatient(nuevoPaciente);

        cerrarModal();
        renderTodo();
    }

    /* Actualizar interfaz */

    function renderTodo() {
        renderTabla();
        renderKpis();
    }

    /* Eventos */

    inputBuscar.addEventListener(
        "input",
        () => {
            renderTabla();
            mostrarResultadosBusqueda();
        }
    );

    inputBuscar.addEventListener(
        "focus",
        mostrarResultadosBusqueda
    );

    selectEstado.addEventListener(
        "change",
        renderTabla
    );

    selectOrden.addEventListener(
        "change",
        renderTabla
    );

    document.addEventListener(
        "click",
        (event) => {
            if (
                !event.target.closest(
                    ".patients-search-wrapper"
                )
            ) {
                cerrarResultadosBusqueda();
            }
        }
    );

    /* Modal */

    btnRegistrar.addEventListener(
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
                modal.classList.contains("is-open")
            ) {
                cerrarModal();
                return;
            }

            if (
                event.key === "Escape"
            ) {
                cerrarResultadosBusqueda();
            }
        }
    );

    /* Limpiar errores */

    [
        inputNombre,
        inputEdad,
        inputEstatura,
        selectEstadoPaciente
    ].forEach((campo) => {

        campo.addEventListener(
            "input",
            () => limpiarError(campo)
        );

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
            guardarPaciente();
        }
    );

    /* Cambios de datos */

    window.addEventListener(
        "nyvora:data-changed",
        renderTodo
    );

    /* Inicialización */

    renderTodo();
});