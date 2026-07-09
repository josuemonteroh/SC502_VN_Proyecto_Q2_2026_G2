document.addEventListener("DOMContentLoaded", () => {
 
    // Controles del panel "Consultar Historial"
    const selectPaciente = document.getElementById("paciente");
    const inputDesde = document.getElementById("desde");
    const inputHasta = document.getElementById("hasta");
    const btnConsultar = document.querySelector(".panel .btn-primary");
 
    // Contenedores que se actualizan
    const resumen = document.querySelector(".patient-summary");
    const tablaEvolucion = document.querySelectorAll(".panel table")[0];
    const tbodyEvolucion = tablaEvolucion.querySelector("tbody");
    const notasContenedor = document.querySelector(".clinical-notes");
    const actividadReciente = document.querySelectorAll(".dashboard-grid .panel")[1]?.querySelector("tbody");
 

    function estadoInfo(status) {
        const mapa = {
            ACTIVO: { texto: "Activo", clase: "success" },
            SEGUIMIENTO: { texto: "Seguimiento", clase: "warning" },
            INACTIVO: { texto: "Inactivo", clase: "danger" }
        };
        return mapa[status] || { texto: status, clase: "warning" };
    }
 
    function poblarSelectPacientes() {
        const pacientes = nyvoraGetPatients();
 
        selectPaciente.innerHTML = `<option value="" selected disabled>Seleccione un paciente</option>`;
 
        pacientes.forEach((paciente) => {
            const opcion = document.createElement("option");
            opcion.value = paciente.id;
            opcion.textContent = paciente.fullName;
            selectPaciente.appendChild(opcion);
        });
    }
 
    function renderResumen(paciente) {
        const ultima = nyvoraGetLatestMetric(paciente.id);
        const estado = estadoInfo(paciente.status);
 
        resumen.querySelector(".summary-item:nth-child(1) strong").textContent = paciente.fullName;
        resumen.querySelector(".summary-item:nth-child(2) strong").textContent = paciente.age ? `${paciente.age} años` : "N/D";
        resumen.querySelector(".summary-item:nth-child(3) strong").textContent = "Dr. Hernández C.";
        resumen.querySelector(".summary-item:nth-child(4) strong").textContent = paciente.conditionGeneral || "Sin definir";
 
        const badgeEstado = resumen.querySelector(".summary-item:nth-child(5) .badge");
        badgeEstado.textContent = estado.texto;
        badgeEstado.className = `badge ${estado.clase}`;
 
        resumen.querySelector(".summary-item:nth-child(6) strong").textContent =
            ultima ? nyvoraFormatDate(ultima.measurementDate) : "Sin controles";
    }
 
    function observacionAutomatica(actual, anterior) {
        if (!anterior) return { texto: "Primer Registro", clase: "success" };
        if (actual.weightKg < anterior.weightKg) return { texto: "Evolución Positiva", clase: "success" };
        if (actual.weightKg > anterior.weightKg) return { texto: "Requiere Atención", clase: "danger" };
        return { texto: "Estable", clase: "success" };
    }
 
    function renderTabla(paciente) {
        const desde = inputDesde.value ? new Date(inputDesde.value) : null;
        const hasta = inputHasta.value ? new Date(inputHasta.value) : null;
 
        const registros = nyvoraGetMetrics(paciente.id).filter((registro) => {
            const fecha = nyvoraBuildDate(registro.measurementDate);
            if (desde && fecha < desde) return false;
            if (hasta && fecha > hasta) return false;
            return true;
        });
 
        tbodyEvolucion.innerHTML = "";
 
        if (registros.length === 0) {
            tbodyEvolucion.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center; padding:1rem; color:#888;">
                        No hay registros para el rango de fechas seleccionado.
                    </td>
                </tr>`;
            return;
        }
 
        registros.forEach((registro, indice) => {
            const anterior = registros[indice + 1];
            const obs = observacionAutomatica(registro, anterior);
 
            const bmi = registro.bmi ?? nyvoraCalculateBMI(registro.weightKg, paciente.heightM) ?? "N/D";
 
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${nyvoraFormatDate(registro.measurementDate)}</td>
                <td>${registro.weightKg ?? "N/D"} kg</td>
                <td>${bmi}</td>
                <td>${registro.bodyFatPercentage ?? "N/D"} %</td>
                <td>${registro.heartRate ?? "N/D"} bpm</td>
                <td>${registro.sleepHours ?? "N/D"} h</td>
                <td>${registro.steps?.toLocaleString() ?? "N/D"}</td>
                <td><span class="badge ${obs.clase}">${obs.texto}</span></td>
            `;
            tbodyEvolucion.appendChild(fila);
        });
    }
 

    function renderNotas(paciente) {
        if (!notasContenedor) return;
 
        notasContenedor.innerHTML = `
            <div class="note-item">
                <i class="fa-solid fa-notes-medical"></i>
                <p>${paciente.observations ? nyvoraEscapeHtml(paciente.observations) : "Sin observaciones registradas."}</p>
            </div>
        `;
    }
 
    function renderActividad(paciente) {
        if (!actividadReciente) return;
 
        const registros = nyvoraGetMetrics(paciente.id).slice(0, 5);
        actividadReciente.innerHTML = "";
 
        if (registros.length === 0) {
            actividadReciente.innerHTML = `<tr><td colspan="2">Sin actividad registrada.</td></tr>`;
            return;
        }
 
        registros.forEach((registro) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${nyvoraFormatDate(registro.measurementDate)}</td>
                <td>Se registró un control biométrico.</td>
            `;
            actividadReciente.appendChild(fila);
        });
    }
 
    function cargarPaciente(id) {
        const paciente = nyvoraGetPatientById(id);
 
        if (!paciente) {
            console.warn(`No se encontró un paciente con id "${id}".`);
            return;
        }
 
        renderResumen(paciente);
        renderTabla(paciente);
        renderNotas(paciente);
        renderActividad(paciente);
    }
 
   
    btnConsultar.addEventListener("click", (e) => {
        e.preventDefault();
 
        if (!selectPaciente.value) {
            alert("Por favor seleccione un paciente para consultar su historial.");
            return;
        }
 
        cargarPaciente(selectPaciente.value);
    });
 
    selectPaciente.addEventListener("change", () => {
        if (selectPaciente.value) cargarPaciente(selectPaciente.value);
    });
 
    poblarSelectPacientes();
 
    const parametros = new URLSearchParams(window.location.search);
    const idDesdeURL = parametros.get("id");
 
    if (idDesdeURL && nyvoraGetPatientById(idDesdeURL)) {
        selectPaciente.value = idDesdeURL;
        cargarPaciente(idDesdeURL);
    }
 
    window.addEventListener("nyvora:data-changed", () => {
        if (selectPaciente.value) cargarPaciente(selectPaciente.value);
    });
 
});
 