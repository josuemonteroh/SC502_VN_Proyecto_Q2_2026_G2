"use strict";

/* Medicamentos */

document.addEventListener("DOMContentLoaded", () => {

    /* Configuración */

    const MEDICATIONS_KEY = "nyvora_medications";

    /* Controles */

    const inputBuscar =
        document.getElementById("medication-search");

    const sugerencias =
        document.getElementById("medication-suggestions");

    const filtroEstado =
        document.getElementById("medication-status-filter");

    const filtroPresentacion =
        document.getElementById("medication-presentation-filter");

    const btnAbrirModal =
        document.getElementById("open-medication-modal");

    const contadorResultados =
        document.getElementById("medication-results-count");

    /* Tabla */

    const tbody =
        document.getElementById("medications-table-body");

    /* KPIs */

    const kpiTotal =
        document.getElementById("kpi-medications-total");

    const kpiActivos =
        document.getElementById("kpi-medications-active");

    const kpiEnUso =
        document.getElementById("kpi-medications-used");

    const kpiInactivos =
        document.getElementById("kpi-medications-inactive");

    /* Modal */

    const modal =
        document.getElementById("medication-modal");

    const backdrop =
        modal.querySelector(".medication-modal-backdrop");

    const btnCerrarModal =
        document.getElementById("close-medication-modal");

    const btnCancelar =
        document.getElementById("cancel-medication");

    const formulario =
        document.getElementById("medication-form");

    /* Campos */

    const inputNombre =
        document.getElementById("medication-name");

    const selectPresentacion =
        document.getElementById("medication-presentation");

    const inputConcentracion =
        document.getElementById("medication-concentration");

    const inputDosis =
        document.getElementById("medication-dose");

    const inputFrecuencia =
        document.getElementById("medication-frequency");

    const selectEstado =
        document.getElementById("medication-status");

    const inputObservaciones =
        document.getElementById("medication-observations");

    /* Estado */

    let medicationIdEditing = null;

    /* Utilidades */

    function normalizar(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function estadoInfo(status) {
        const estados = {
            ACTIVO: {
                texto: "Activo",
                clase: "active"
            },

            EN_USO: {
                texto: "En uso",
                clase: "in-use"
            },

            INACTIVO: {
                texto: "Inactivo",
                clase: "inactive"
            }
        };

        return estados[status] || {
            texto: status || "Sin estado",
            clase: "inactive"
        };
    }

    function obtenerMedicamentos() {
        try {
            const datos =
                localStorage.getItem(
                    MEDICATIONS_KEY
                );

            if (!datos) {
                return [];
            }

            const medicamentos =
                JSON.parse(datos);

            return Array.isArray(medicamentos)
                ? medicamentos
                : [];

        } catch (error) {
            console.error(
                "Error leyendo medicamentos:",
                error
            );

            return [];
        }
    }

    function guardarMedicamentos(medicamentos) {
        localStorage.setItem(
            MEDICATIONS_KEY,
            JSON.stringify(medicamentos)
        );

        window.dispatchEvent(
            new CustomEvent(
                "nyvora:data-changed",
                {
                    detail: {
                        type: "medications"
                    }
                }
            )
        );
    }

    function obtenerMedicamentoPorId(id) {
        return obtenerMedicamentos()
            .find(
                (medicamento) =>
                    Number(medicamento.id) ===
                    Number(id)
            );
    }

    /* Modal */

    function abrirModal(medicamento = null) {
        formulario.reset();

        medicationIdEditing =
            medicamento?.id || null;

        selectEstado.value =
            "ACTIVO";

        if (medicamento) {
            document.getElementById(
                "medication-modal-title"
            ).textContent =
                "Editar Medicamento";

            inputNombre.value =
                medicamento.name || "";

            selectPresentacion.value =
                medicamento.presentation || "";

            inputConcentracion.value =
                medicamento.concentration || "";

            inputDosis.value =
                medicamento.dose || "";

            inputFrecuencia.value =
                medicamento.frequency || "";

            selectEstado.value =
                medicamento.status || "ACTIVO";

            inputObservaciones.value =
                medicamento.observations || "";

        } else {
            document.getElementById(
                "medication-modal-title"
            ).textContent =
                "Registrar Medicamento";
        }

        modal.classList.add("active");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

        setTimeout(() => {
            inputNombre.focus();
        }, 100);
    }

    function cerrarModal() {
        modal.classList.remove("active");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );

        formulario.reset();

        medicationIdEditing = null;

        document.getElementById(
            "medication-modal-title"
        ).textContent =
            "Registrar Medicamento";
    }

    /* Guardar */

    function guardarMedicamento() {
        const nombre =
            inputNombre.value.trim();

        const presentacion =
            selectPresentacion.value;

        const concentracion =
            inputConcentracion.value.trim();

        if (
            !nombre ||
            !presentacion ||
            !concentracion
        ) {
            return;
        }

        const medicamentos =
            obtenerMedicamentos();

        if (medicationIdEditing) {
            const index =
                medicamentos.findIndex(
                    (medicamento) =>
                        Number(medicamento.id) ===
                        Number(medicationIdEditing)
                );

            if (index !== -1) {
                medicamentos[index] = {
                    ...medicamentos[index],

                    name: nombre,

                    presentation:
                        presentacion,

                    concentration:
                        concentracion,

                    dose:
                        inputDosis.value.trim(),

                    frequency:
                        inputFrecuencia.value.trim(),

                    status:
                        selectEstado.value,

                    observations:
                        inputObservaciones.value.trim()
                };
            }

        } else {
            medicamentos.push({
                id:
                    nyvoraNextId(
                        medicamentos
                    ),

                name:
                    nombre,

                presentation:
                    presentacion,

                concentration:
                    concentracion,

                dose:
                    inputDosis.value.trim(),

                frequency:
                    inputFrecuencia.value.trim(),

                status:
                    selectEstado.value,

                observations:
                    inputObservaciones.value.trim(),

                associatedPatients:
                    0,

                createdAt:
                    nyvoraNow()
            });
        }

        guardarMedicamentos(
            medicamentos
        );

        cerrarModal();

        renderTodo();
    }

    /* Búsqueda inteligente */

    function obtenerCoincidencias() {
        const termino =
            normalizar(
                inputBuscar.value
            );

        if (!termino) {
            return [];
        }

        return obtenerMedicamentos()
            .filter((medicamento) => {

                const estado =
                    estadoInfo(
                        medicamento.status
                    );

                return (
                    normalizar(
                        medicamento.name
                    ).includes(termino) ||

                    normalizar(
                        medicamento.presentation
                    ).includes(termino) ||

                    normalizar(
                        medicamento.concentration
                    ).includes(termino) ||

                    normalizar(
                        medicamento.dose
                    ).includes(termino) ||

                    normalizar(
                        medicamento.frequency
                    ).includes(termino) ||

                    normalizar(
                        estado.texto
                    ).includes(termino)
                );
            })
            .slice(0, 8);
    }

    function cerrarSugerencias() {
        sugerencias.hidden = true;
        sugerencias.innerHTML = "";
    }

    function mostrarSugerencias() {
        const termino =
            inputBuscar.value.trim();

        if (!termino) {
            cerrarSugerencias();
            return;
        }

        const coincidencias =
            obtenerCoincidencias();

        sugerencias.innerHTML = "";

        if (!coincidencias.length) {
            sugerencias.innerHTML = `
                <div class="medication-suggestion-empty">
                    No se encontraron medicamentos.
                </div>
            `;

            sugerencias.hidden = false;

            return;
        }

        coincidencias.forEach(
            (medicamento) => {

                const boton =
                    document.createElement(
                        "button"
                    );

                boton.type =
                    "button";

                boton.className =
                    "medication-suggestion";

                boton.innerHTML = `
                    <div class="medication-suggestion-icon">
                        <i class="fa-solid fa-capsules"></i>
                    </div>

                    <div class="medication-suggestion-info">
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

                        inputBuscar.value =
                            medicamento.name;

                        cerrarSugerencias();

                        renderTabla();

                        const fila =
                            tbody.querySelector(
                                `tr[data-id="${medicamento.id}"]`
                            );

                        if (fila) {
                            fila.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });
                        }
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

    function obtenerMedicamentosFiltrados() {
        let medicamentos =
            [...obtenerMedicamentos()];

        const termino =
            normalizar(
                inputBuscar.value
            );

        if (termino) {
            medicamentos =
                medicamentos.filter(
                    (medicamento) => {

                        const estado =
                            estadoInfo(
                                medicamento.status
                            );

                        return (
                            normalizar(
                                medicamento.name
                            ).includes(termino) ||

                            normalizar(
                                medicamento.presentation
                            ).includes(termino) ||

                            normalizar(
                                medicamento.concentration
                            ).includes(termino) ||

                            normalizar(
                                medicamento.dose
                            ).includes(termino) ||

                            normalizar(
                                medicamento.frequency
                            ).includes(termino) ||

                            normalizar(
                                estado.texto
                            ).includes(termino)
                        );
                    }
                );
        }

        if (filtroEstado.value) {
            medicamentos =
                medicamentos.filter(
                    (medicamento) =>
                        medicamento.status ===
                        filtroEstado.value
                );
        }

        if (
            filtroPresentacion.value
        ) {
            medicamentos =
                medicamentos.filter(
                    (medicamento) =>
                        medicamento.presentation ===
                        filtroPresentacion.value
                );
        }

        return medicamentos.sort(
            (a, b) =>
                String(a.name || "")
                    .localeCompare(
                        String(b.name || ""),
                        "es"
                    )
        );
    }

    /* Tabla */

    function crearFila(
        medicamento
    ) {
        const estado =
            estadoInfo(
                medicamento.status
            );

        const fila =
            document.createElement(
                "tr"
            );

        fila.dataset.id =
            medicamento.id;

        fila.innerHTML = `
            <td>
                <div class="medication-name-cell">

                    <div class="medication-table-icon">
                        <i class="fa-solid fa-capsules"></i>
                    </div>

                    <div class="medication-name-info">
                        <strong>
                            ${nyvoraEscapeHtml(
                                medicamento.name
                            )}
                        </strong>

                        <span>
                            ${nyvoraEscapeHtml(
                                medicamento.frequency ||
                                "Sin frecuencia definida"
                            )}
                        </span>
                    </div>

                </div>
            </td>

            <td>
                ${nyvoraEscapeHtml(
                    medicamento.presentation
                )}
            </td>

            <td>
                ${nyvoraEscapeHtml(
                    medicamento.concentration
                )}
            </td>

            <td>
                ${nyvoraEscapeHtml(
                    medicamento.dose ||
                    "Sin definir"
                )}
            </td>

            <td>
                <span
                    class="medication-badge ${estado.clase}">
                    ${estado.texto}
                </span>
            </td>

            <td>
                ${
                    Number(
                        medicamento.associatedPatients
                    ) || 0
                }
            </td>

            <td>
                <div class="medication-row-actions">

                    <button
                        type="button"
                        class="medication-action-button edit-medication"
                        title="Editar medicamento">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        type="button"
                        class="medication-action-button toggle-medication"
                        title="${
                            medicamento.status ===
                            "INACTIVO"
                                ? "Activar medicamento"
                                : "Desactivar medicamento"
                        }">

                        <i class="fa-solid ${
                            medicamento.status ===
                            "INACTIVO"
                                ? "fa-circle-check"
                                : "fa-ban"
                        }"></i>

                    </button>

                </div>
            </td>
        `;

        fila.querySelector(
            ".edit-medication"
        ).addEventListener(
            "click",
            () => {
                abrirModal(
                    medicamento
                );
            }
        );

        fila.querySelector(
            ".toggle-medication"
        ).addEventListener(
            "click",
            () => {

                cambiarEstadoMedicamento(
                    medicamento.id
                );
            }
        );

        return fila;
    }

    function renderTabla() {
        const medicamentos =
            obtenerMedicamentosFiltrados();

        tbody.innerHTML = "";

        contadorResultados.textContent =
            `${medicamentos.length} ${
                medicamentos.length === 1
                    ? "resultado"
                    : "resultados"
            }`;

        if (!medicamentos.length) {
            tbody.innerHTML = `
                <tr class="empty-medications">
                    <td colspan="7">

                        <div class="empty-state">

                            <div class="empty-state-icon">
                                <i class="fa-solid fa-capsules"></i>
                            </div>

                            <strong>
                                No se encontraron medicamentos
                            </strong>

                            <p>
                                Registre un medicamento o cambie
                                los criterios de búsqueda.
                            </p>

                        </div>

                    </td>
                </tr>
            `;

            return;
        }

        medicamentos.forEach(
            (medicamento) => {
                tbody.appendChild(
                    crearFila(
                        medicamento
                    )
                );
            }
        );
    }

    /* Estado */

    function cambiarEstadoMedicamento(
        medicationId
    ) {
        const medicamentos =
            obtenerMedicamentos();

        const index =
            medicamentos.findIndex(
                (medicamento) =>
                    Number(medicamento.id) ===
                    Number(medicationId)
            );

        if (index === -1) {
            return;
        }

        medicamentos[index].status =
            medicamentos[index].status ===
            "INACTIVO"
                ? "ACTIVO"
                : "INACTIVO";

        guardarMedicamentos(
            medicamentos
        );

        renderTodo();
    }

    /* KPIs */

    function renderKpis() {
        const medicamentos =
            obtenerMedicamentos();

        const activos =
            medicamentos.filter(
                (medicamento) =>
                    medicamento.status ===
                    "ACTIVO"
            ).length;

        const enUso =
            medicamentos.filter(
                (medicamento) =>
                    medicamento.status ===
                    "EN_USO" ||
                    Number(
                        medicamento.associatedPatients
                    ) > 0
            ).length;

        const inactivos =
            medicamentos.filter(
                (medicamento) =>
                    medicamento.status ===
                    "INACTIVO"
            ).length;

        kpiTotal.textContent =
            medicamentos.length;

        kpiActivos.textContent =
            activos;

        kpiEnUso.textContent =
            enUso;

        kpiInactivos.textContent =
            inactivos;
    }

    /* Render */

    function renderTodo() {
        renderTabla();
        renderKpis();
    }

    /* Eventos búsqueda */

    inputBuscar.addEventListener(
        "input",
        () => {
            mostrarSugerencias();
            renderTabla();
        }
    );

    inputBuscar.addEventListener(
        "focus",
        () => {
            if (
                inputBuscar.value.trim()
            ) {
                mostrarSugerencias();
            }
        }
    );

    document.addEventListener(
        "click",
        (event) => {

            if (
                !event.target.closest(
                    ".medication-search-wrapper"
                )
            ) {
                cerrarSugerencias();
            }
        }
    );

    /* Filtros */

    filtroEstado.addEventListener(
        "change",
        renderTabla
    );

    filtroPresentacion.addEventListener(
        "change",
        renderTabla
    );

    /* Modal */

    btnAbrirModal.addEventListener(
        "click",
        () => abrirModal()
    );

    btnCerrarModal.addEventListener(
        "click",
        cerrarModal
    );

    btnCancelar.addEventListener(
        "click",
        cerrarModal
    );

    backdrop.addEventListener(
        "click",
        cerrarModal
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

                cerrarSugerencias();
            }
        }
    );

    /* Formulario */

    formulario.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            guardarMedicamento();
        }
    );

    /* Cambios globales */

    window.addEventListener(
        "nyvora:data-changed",
        (event) => {

            if (
                event.detail?.type ===
                "medications"
            ) {
                renderTodo();
            }
        }
    );

    /* Inicialización */

    renderTodo();
});