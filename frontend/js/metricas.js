// FORMULARIO DE REGISTRO
const formMetricas = document.getElementById("form-metricas");

const selectPaciente = document.getElementById("paciente");

const inputPeso = document.getElementById("peso");
const inputImc = document.getElementById("imc");

const tablaMetricas = document.getElementById("tabla-metricas");


// CARGAR PACIENTES EN EL SELECT
function cargarPacientes() {
    const pacientes = nyvoraGetPatients();

    selectPaciente.innerHTML = `
        <option value="" selected disabled>
            Seleccione un paciente
        </option>
    `;

    pacientes.forEach(paciente => {
        if (paciente.isActive) {
            selectPaciente.innerHTML += `
                <option value="${paciente.id}">
                    ${paciente.fullName}
                </option>
            `;
        }
    });
}


// CALCULAR IMC
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


// GUARDAR MÉTRICAS
formMetricas.addEventListener("submit", function (e) {
    e.preventDefault();

    const pacienteId = selectPaciente.value;
    const peso = parseFloat(inputPeso.value);

    if (!pacienteId) {
        alert("Seleccione un paciente.");
        return;
    }

    if (!peso || peso <= 0) {
        alert("Ingrese un peso válido.");
        return;
    }

    nyvoraAddMetric({
        patientId: pacienteId,
        measurementDate: new Date().toISOString(),

        weightKg: peso,
        bmi: parseFloat(document.getElementById("imc").value),

        bodyFatPercentage: parseFloat(
            document.getElementById("grasa").value
        ) || null,

        heartRate: parseInt(
            document.getElementById("fc").value
        ) || null,

        sleepHours: parseFloat(
            document.getElementById("sueno").value
        ) || null,

        steps: parseInt(
            document.getElementById("pasos").value
        ) || null
    });

    alert("Métricas registradas correctamente.");

    formMetricas.reset();

    renderMetricas();
});


// MOSTRAR TABLA DE MÉTRICAS
function renderMetricas(lista = nyvoraGetMetrics()) {
    tablaMetricas.innerHTML = "";

    if (lista.length === 0) {
        tablaMetricas.innerHTML = `
            <tr>
                <td colspan="8">
                    No hay métricas registradas.
                </td>
            </tr>
        `;

        return;
    }

    lista.forEach(metrica => {
        const paciente = nyvoraGetPatientById(metrica.patientId);

        const fecha = new Date(metrica.measurementDate)
            .toLocaleDateString("es-CR");

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${fecha}</td>
            <td>${paciente ? paciente.fullName : "Paciente no encontrado"}</td>
            <td>${metrica.weightKg ?? "—"} kg</td>
            <td>${metrica.bmi ?? "—"}</td>
            <td>${metrica.bodyFatPercentage ?? "—"} %</td>
            <td>${metrica.heartRate ?? "—"} bpm</td>
            <td>${metrica.sleepHours ?? "—"} h</td>
            <td>${metrica.steps ?? "—"}</td>
        `;

        tablaMetricas.appendChild(fila);
    });
}


// FILTRO POR FECHA
document.getElementById("btn-filtrar").addEventListener("click", () => {
    const desde = document.getElementById("fecha-desde").value;
    const hasta = document.getElementById("fecha-hasta").value;

    let metricas = nyvoraGetMetrics();

    if (desde) {
        metricas = metricas.filter(metrica => {
            return metrica.measurementDate.slice(0, 10) >= desde;
        });
    }

    if (hasta) {
        metricas = metricas.filter(metrica => {
            return metrica.measurementDate.slice(0, 10) <= hasta;
        });
    }

    renderMetricas(metricas);
});


// EVENTOS PARA EL IMC
inputPeso.addEventListener("input", calcularIMC);

selectPaciente.addEventListener("change", calcularIMC);


// CARGA INICIAL
cargarPacientes();

renderMetricas();