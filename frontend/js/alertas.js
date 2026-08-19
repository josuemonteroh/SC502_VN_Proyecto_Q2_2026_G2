"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const API_URL =
        "http://localhost:8081/alertas.php";


    const inputPaciente =
        document.getElementById("buscarPaciente");

    const selectPrioridad =
        document.getElementById("prioridad");

    const selectEstado =
        document.getElementById("estado");

    const btnBuscar =
        document.querySelector(".btn-primary");


    const tabla =
        document.querySelectorAll(".panel table")[0];

    const tbody =
        tabla.querySelector("tbody");


    const resumenValores =
        document
            .querySelectorAll(".dashboard-grid .panel")[0]
            ?.querySelectorAll("td");


    const actividadReciente =
        document
            .querySelectorAll(".dashboard-grid .panel")[1]
            ?.querySelector("tbody");


    let alertas = [];


    function normalizar(texto) {

        return String(texto ?? "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
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
                fecha.replace(" ", "T")
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


    function prioridadInfo(alerta) {

        const tipo =
            normalizar(alerta.alertType);


        if (
            tipo.includes("frecuencia") ||
            tipo.includes("cardiaca")
        ) {

            return {
                texto: "Alta",
                clase: "danger"
            };
        }


        if (
            tipo.includes("sueno") ||
            tipo.includes("peso") ||
            tipo.includes("seguimiento")
        ) {

            return {
                texto: "Media",
                clase: "warning"
            };
        }


        return {
            texto: "Baja",
            clase: "success"
        };
    }


    function estadoInfo(status) {

        if (
            normalizar(status) === "resolved"
        ) {

            return {
                texto: "Resuelta",
                clase: "success"
            };
        }


        return {
            texto: "Pendiente",
            clase: "warning"
        };
    }


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
                datos.data || [];


            renderTodo();

        } catch (error) {

            console.error(
                "Error cargando alertas:",
                error
            );


            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:1rem;
                            color:#c0392b;
                        "
                    >
                        Error al cargar las alertas.
                    </td>
                </tr>
            `;
        }
    }


    function crearFilaAlerta(alerta) {

        const prioridad =
            prioridadInfo(alerta);

        const estado =
            estadoInfo(alerta.status);


        const fila =
            document.createElement("tr");


        fila.dataset.patientId =
            alerta.patientId;


        fila.innerHTML = `
            <td>
                ${escaparHTML(
                    alerta.patientName
                )}
            </td>

            <td>
                ${escaparHTML(
                    alerta.message
                )}
            </td>

            <td>
                <span class="badge ${prioridad.clase}">
                    ${prioridad.texto}
                </span>
            </td>

            <td>
                ${formatearFecha(
                    alerta.createdAt
                )}
            </td>

            <td>
                <span class="badge ${estado.clase}">
                    ${estado.texto}
                </span>
            </td>

            <td>
                <a
                    href="#"
                    class="action-link"
                >
                    <i class="fa-solid fa-eye"></i>
                    Ver Detalle
                </a>
            </td>
        `;


        const enlace =
            fila.querySelector(
                ".action-link"
            );


        enlace.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                // Enviamos el ID del paciente para abrir su historial
                const patientId =
                    alerta.patientId;


                window.location.href =
                    `historial.html?patient_id=${patientId}`;
            }
        );


        return fila;
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

                        return normalizar(
                            alerta.patientName
                        ).includes(
                            busqueda
                        );
                    }
                );
        }


        if (
            selectPrioridad.value
        ) {

            resultado =
                resultado.filter(
                    (alerta) => {

                        const prioridad =
                            prioridadInfo(
                                alerta
                            );

                        return (
                            prioridad.texto ===
                            selectPrioridad.value
                        );
                    }
                );
        }


        if (
            selectEstado.value
        ) {

            const estadoBuscado =
                normalizar(
                    selectEstado.value
                );


            resultado =
                resultado.filter(
                    (alerta) => {

                        const estado =
                            estadoInfo(
                                alerta.status
                            );


                        return (
                            normalizar(
                                estado.texto
                            ) ===
                            estadoBuscado
                        );
                    }
                );
        }


        return resultado;
    }


    function renderTabla() {

        const filtradas =
            obtenerAlertasFiltradas();


        tbody.innerHTML = "";


        if (
            filtradas.length === 0
        ) {

            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="6"
                        style="
                            text-align:center;
                            padding:1rem;
                            color:#888;
                        "
                    >
                        No se encontraron alertas
                        con los filtros seleccionados.
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


    function renderResumen() {

        if (!resumenValores) {
            return;
        }


        const total =
            alertas.length;


        const pendientes =
            alertas.filter(
                (alerta) =>
                    normalizar(
                        alerta.status
                    ) !== "resolved"
            ).length;


        const resueltas =
            alertas.filter(
                (alerta) =>
                    normalizar(
                        alerta.status
                    ) === "resolved"
            ).length;


        resumenValores[0].textContent =
            total;


        resumenValores[1]
            .querySelector(".badge")
            .textContent =
            pendientes;


        resumenValores[2]
            .querySelector(".badge")
            .textContent =
            0;


        resumenValores[3]
            .querySelector(".badge")
            .textContent =
            resueltas;
    }


    function renderActividadReciente() {

        if (!actividadReciente) {
            return;
        }


        actividadReciente.innerHTML =
            "";


        alertas
            .slice(0, 5)
            .forEach(
                (alerta) => {

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
                            ${escaparHTML(
                                alerta.alertType
                            )}
                            —
                            ${escaparHTML(
                                alerta.patientName
                            )}
                        </td>
                    `;


                    actividadReciente.appendChild(
                        fila
                    );
                }
            );
    }


    function renderTodo() {

        renderTabla();

        renderResumen();

        renderActividadReciente();
    }


    btnBuscar.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            renderTabla();
        }
    );


    inputPaciente.addEventListener(
        "input",
        renderTabla
    );


    selectPrioridad.addEventListener(
        "change",
        renderTabla
    );


    selectEstado.addEventListener(
        "change",
        renderTabla
    );


    cargarAlertas();

});