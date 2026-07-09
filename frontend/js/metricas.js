"use strict";

/* Métricas */

document.addEventListener("DOMContentLoaded", () => {

    /* Controles */

    const formMetricas = document.getElementById("form-metricas");

    const selectPaciente = document.getElementById("paciente");

    const inputPeso = document.getElementById("peso");

    const inputImc = document.getElementById("imc");

    const tablaMetricas = document.getElementById("tabla-metricas");

    /* Cargar pacientes */

    function cargarPacientes() {

        const pacientes = nyvoraGetPatients();

        selectPaciente.innerHTML = `

            <option value="" selected disabled>

                Seleccione un paciente

            </option>

        `;

        pacientes.forEach((paciente) => {

            if (paciente.isActive) {

                selectPaciente.innerHTML += `

                    <option value="${paciente.id}">

                        ${nyvoraEscapeHtml(paciente.fullName)}

                    </option>

                `;

            }

        });

    }

    /* Calcular IMC */

    function calcularIMC() {

        const pacienteId = selectPaciente.value;

        const peso = parseFloat(inputPeso.value);

        const paciente = nyvoraGetPatientById(pacienteId);

        if (!paciente || !peso || !paciente.heightM) {

            inputImc.value = "";

            return;

        }

        const imc = peso / (paciente.heightM * paciente.heightM);

        inputImc.value = imc.toFixed(1);

    }

        /* Guardar métricas */

    formMetricas.addEventListener("submit", (e) => {

        e.preventDefault();

        const pacienteId = selectPaciente.value;

        const peso = parseFloat(inputPeso.value);

        if (!pacienteId) {

            alert("Seleccione un paciente.");

            return;

        }

        if (isNaN(peso) || peso <= 0) {

            alert("Ingrese un peso válido.");

            inputPeso.focus();

            return;

        }

        nyvoraAddMetric({

            patientId: pacienteId,

            measurementDate: new Date().toISOString(),

            weightKg: peso,

            bmi: parseFloat(inputImc.value),

            bodyFatPercentage: parseFloat(
                document.getElementById("grasa").value
            ) || null,

            heartRate: parseInt(
                document.getElementById("fc").value,
                10
            ) || null,

            sleepHours: parseFloat(
                document.getElementById("sueno").value
            ) || null,

            steps: parseInt(
                document.getElementById("pasos").value,
                10
            ) || null

        });

        alert("Métricas registradas correctamente.");

        formMetricas.reset();

        inputImc.value = "";

        renderMetricas();

    });

        /* Mostrar métricas */

    function renderMetricas(lista = nyvoraGetMetrics()) {

        tablaMetricas.innerHTML = "";

        if (lista.length === 0) {

            tablaMetricas.innerHTML = `

                <tr>

                    <td colspan="8"
                        style="text-align:center; padding:1rem; color:#888;">

                        No hay métricas registradas.

                    </td>

                </tr>

            `;

            return;

        }

        lista.forEach((metrica) => {

            const paciente = nyvoraGetPatientById(
                metrica.patientId
            );

            const fila = document.createElement("tr");

            fila.innerHTML = `

                <td>

                    ${nyvoraFormatDate(metrica.measurementDate)}

                </td>

                <td>

                    ${paciente
                        ? nyvoraEscapeHtml(paciente.fullName)
                        : "Paciente no encontrado"}

                </td>

                <td>

                    ${metrica.weightKg ?? "—"} kg

                </td>

                <td>

                    ${metrica.bmi ?? "—"}

                </td>

                <td>

                    ${metrica.bodyFatPercentage ?? "—"} %

                </td>

                <td>

                    ${metrica.heartRate ?? "—"} bpm

                </td>

                <td>

                    ${metrica.sleepHours ?? "—"} h

                </td>

                <td>

                    ${metrica.steps?.toLocaleString() ?? "—"}

                </td>

            `;

            tablaMetricas.appendChild(fila);

        });

    }

        /* Filtrar por fecha */

    document.getElementById("btn-filtrar").addEventListener("click", () => {

        const desde = document.getElementById("fecha-desde").value;

        const hasta = document.getElementById("fecha-hasta").value;

        let metricas = nyvoraGetMetrics();

        if (desde) {

            metricas = metricas.filter((metrica) =>
                metrica.measurementDate.slice(0, 10) >= desde
            );

        }

        if (hasta) {

            metricas = metricas.filter((metrica) =>
                metrica.measurementDate.slice(0, 10) <= hasta
            );

        }

        renderMetricas(metricas);

    });

    /* Eventos */

    inputPeso.addEventListener("input", calcularIMC);

    selectPaciente.addEventListener("change", calcularIMC);

    /* Actualización */

    window.addEventListener(
        "nyvora:data-changed",
        () => renderMetricas()
    );

    /* Inicialización */

    cargarPacientes();

    renderMetricas();

});

