"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:8081/historial.php";

    const selectPaciente =
        document.getElementById("paciente");

    const inputDesde =
        document.getElementById("desde");

    const inputHasta =
        document.getElementById("hasta");

    const btnConsultar =
        document.querySelector(".panel .btn-primary");


    const resumen =
        document.querySelector(".patient-summary");

    const tablas =
        document.querySelectorAll(".panel table");

    const tbodyEvolucion =
        tablas[0]?.querySelector("tbody");

    const notasContenedor =
        document.querySelector(".clinical-notes");

    const actividadReciente =
        document
            .querySelectorAll(".dashboard-grid .panel")[1]
            ?.querySelector("tbody");


    let pacienteActual = null;
    let medicionesActuales = [];


    function formatearFecha(fecha) {

        if (!fecha) {
            return "N/D";
        }

        const fechaConvertida =
            new Date(fecha.replace(" ", "T"));

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


    async function cargarPacientes() {

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
                    "No se pudieron cargar los pacientes."
                );
            }


            selectPaciente.innerHTML = "";

            const opcionInicial =
                document.createElement("option");

            opcionInicial.value = "";

            opcionInicial.textContent =
                "Seleccione un paciente";

            opcionInicial.disabled = true;
            opcionInicial.selected = true;

            selectPaciente.appendChild(
                opcionInicial
            );


            datos.data.forEach((paciente) => {

                const opcion =
                    document.createElement("option");

                opcion.value =
                    String(paciente.id);

                opcion.textContent =
                    paciente.fullName;

                selectPaciente.appendChild(
                    opcion
                );
            });


            // Si viene desde Alertas, obtiene el paciente de la URL
            const parametros =
                new URLSearchParams(
                    window.location.search
                );

            const patientId =
                parametros.get("patient_id");


            if (patientId) {

                const pacienteEncontrado =
                    datos.data.find(
                        (paciente) =>
                            String(paciente.id) ===
                            String(patientId)
                    );


                if (pacienteEncontrado) {

                    selectPaciente.value =
                        String(patientId);

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

            selectPaciente.innerHTML = `
                <option value="">
                    Error al cargar pacientes
                </option>
            `;
        }
    }


    async function cargarHistorial(patientId) {

        if (!patientId) {
            return;
        }

        try {

            const respuesta =
                await fetch(
                    `${API_URL}?patient_id=${encodeURIComponent(
                        patientId
                    )}`
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
                datos.measurements || [];


            mostrarResumen();
            mostrarMediciones();
            mostrarNotas(
                datos.notes || []
            );
            mostrarActividad();

        } catch (error) {

            console.error(
                "Error cargando historial:",
                error
            );
        }
    }


    function mostrarResumen() {

        if (
            !resumen ||
            !pacienteActual
        ) {
            return;
        }

        const elementos =
            resumen.querySelectorAll(
                ".summary-item strong"
            );


        if (elementos[0]) {

            elementos[0].textContent =
                pacienteActual.fullName;
        }

        if (elementos[1]) {

            elementos[1].textContent =
                pacienteActual.age
                    ? `${pacienteActual.age} años`
                    : "N/D";
        }

        if (elementos[2]) {

            elementos[2].textContent =
                "Dr. Hernández C.";
        }

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


        if (elementos[5]) {

            elementos[5].textContent =
                medicionesActuales.length > 0
                    ? formatearFecha(
                        medicionesActuales[0]
                            .measurementDate
                    )
                    : "Sin controles";
        }
    }


    function mostrarMediciones() {

        if (!tbodyEvolucion) {
            return;
        }

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
                                registro.measurementDate
                                    .replace(
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
                                registro.measurementDate
                                    .replace(
                                        " ",
                                        "T"
                                    )
                            );

                        return fecha <= hasta;
                    }
                );
        }


        tbodyEvolucion.innerHTML = "";


        if (registros.length === 0) {

            tbodyEvolucion.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        style="
                            text-align:center;
                            padding:1rem;
                        "
                    >
                        No hay registros para
                        este paciente.
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
                    document.createElement("tr");


                fila.innerHTML = `
                    <td>
                        ${formatearFecha(
                            registro.measurementDate
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            registro.weightKg
                        )} kg
                    </td>

                    <td>
                        ${escaparHTML(
                            registro.bmi
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            registro.bodyFatPercentage
                        )} %
                    </td>

                    <td>
                        ${escaparHTML(
                            registro.heartRate
                        )} bpm
                    </td>

                    <td>
                        ${escaparHTML(
                            registro.sleepHours
                        )} h
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
                    document.createElement("div");

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


    function mostrarActividad() {

        if (!actividadReciente) {
            return;
        }

        actividadReciente.innerHTML = "";

        const recientes =
            medicionesActuales.slice(0, 5);


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
                    document.createElement("tr");

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


    selectPaciente.addEventListener(
        "change",
        () => {

            const patientId =
                selectPaciente.value;

            if (!patientId) {
                return;
            }

            cargarHistorial(
                patientId
            );
        }
    );


    btnConsultar.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            const patientId =
                selectPaciente.value;

            if (!patientId) {

                alert(
                    "Por favor seleccione un paciente."
                );

                return;
            }

            cargarHistorial(
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


    cargarPacientes();

});