document.addEventListener("DOMContentLoaded", () => {
 
    // Controles del panel de filtros
    const inputPaciente = document.getElementById("buscarPaciente");
    const selectPrioridad = document.getElementById("prioridad");
    const selectEstado = document.getElementById("estado");
    const btnBuscar = document.querySelector(".btn-primary");
 
    // Tabla de alertas y paneles del resumen
    const tabla = document.querySelectorAll(".panel table")[0];
    const tbody = tabla.querySelector("tbody");
    const resumenValores = document.querySelectorAll(".dashboard-grid .panel")[0]?.querySelectorAll("td");
    const actividadReciente = document.querySelectorAll(".dashboard-grid .panel")[1]?.querySelector("tbody");
 
    // Quita acentos y pasa a minúsculas para comparar textos
    function normalizar(texto) {
        return String(texto)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }
 
    // Traduce la prioridad de data.js a texto y color de badge
    function prioridadInfo(priority) {
        const mapa = {
            ALTA: { texto: "Alta", clase: "danger" },
            MEDIA: { texto: "Media", clase: "warning" },
            BAJA: { texto: "Baja", clase: "success" }
        };
        return mapa[priority] || { texto: priority, clase: "warning" };
    }
 
   
    function estadoInfo(status) {
        return status === "RESOLVED"
            ? { texto: "Resuelta", clase: "success" }
            : { texto: "Pendiente", clase: "warning" };
    }
 
  
    function crearFilaAlerta(alerta) {
        const paciente = nyvoraGetPatientById(alerta.patientId);
        const prioridad = prioridadInfo(alerta.priority);
        const estado = estadoInfo(alerta.status);
 
        const fila = document.createElement("tr");
        fila.dataset.patientId = alerta.patientId;
 
        fila.innerHTML = `
            <td>${paciente ? nyvoraEscapeHtml(paciente.fullName) : "Paciente no encontrado"}</td>
            <td>${nyvoraEscapeHtml(alerta.message)}</td>
            <td><span class="badge ${prioridad.clase}">${prioridad.texto}</span></td>
            <td>${nyvoraFormatDate(alerta.createdAt)}</td>
            <td><span class="badge ${estado.clase}">${estado.texto}</span></td>
            <td>
                <a href="#" class="action-link">
                    <i class="fa-solid fa-eye"></i>
                    Ver Detalle
                </a>
            </td>
        `;
 
        fila.querySelector(".action-link").addEventListener("click", (e) => {
            e.preventDefault();
            if (paciente) window.location.href = `historial.html?id=${paciente.id}`;
        });
 
        return fila;
    }
 
    // Dibuja la tabla completa según los filtros actuales
    function renderTabla() {
        let alertas = nyvoraGetAlerts();
 
        // Filtro por nombre de paciente
        const busqueda = normalizar(inputPaciente.value);
        if (busqueda) {
            alertas = alertas.filter((a) => {
                const paciente = nyvoraGetPatientById(a.patientId);
                return paciente && normalizar(paciente.fullName).includes(busqueda);
            });
        }
 
        // Filtro por prioridad
        if (selectPrioridad.value) {
            alertas = alertas.filter((a) => prioridadInfo(a.priority).texto === selectPrioridad.value);
        }
 
        // Filtro por estado
        if (selectEstado.value) {
            const buscado = normalizar(selectEstado.value);
            alertas = alertas.filter((a) => {
                const texto = normalizar(estadoInfo(a.status).texto);
               
                if (buscado === "en seguimiento") return texto === "pendiente";
                return texto === buscado;
            });
        }
 
        tbody.innerHTML = "";
 
        if (alertas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding:1rem; color:#888;">
                        No se encontraron alertas con los filtros seleccionados.
                    </td>
                </tr>`;
            return;
        }
 
        alertas.forEach((alerta) => tbody.appendChild(crearFilaAlerta(alerta)));
    }
 

    function renderResumen() {
        if (!resumenValores) return;
 
        const todas = nyvoraGetAlerts();
        const pendientes = todas.filter((a) => a.status !== "RESOLVED").length;
        const resueltas = todas.filter((a) => a.status === "RESOLVED").length;
 
        resumenValores[0].textContent = todas.length;
        resumenValores[1].querySelector(".badge").textContent = pendientes;
        resumenValores[2].querySelector(".badge").textContent = 0; 
        resumenValores[3].querySelector(".badge").textContent = resueltas;
    }
 
    // Actualiza el panel "Actividad Reciente" con las últimas 5 alertas
    function renderActividadReciente() {
        if (!actividadReciente) return;
 
        const recientes = nyvoraGetAlerts().slice(0, 5);
        actividadReciente.innerHTML = "";
 
        recientes.forEach((alerta) => {
            const paciente = nyvoraGetPatientById(alerta.patientId);
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><strong>${nyvoraFormatDate(alerta.createdAt)}</strong></td>
                <td>${nyvoraEscapeHtml(alerta.type)} — ${paciente ? nyvoraEscapeHtml(paciente.fullName) : ""}</td>
            `;
            actividadReciente.appendChild(fila);
        });
    }
 
    function renderTodo() {
        renderTabla();
        renderResumen();
        renderActividadReciente();
    }

    btnBuscar.addEventListener("click", (e) => {
        e.preventDefault();
        renderTabla();
    });
 
    inputPaciente.addEventListener("input", renderTabla);
    selectPrioridad.addEventListener("change", renderTabla);
    selectEstado.addEventListener("change", renderTabla);

    window.addEventListener("nyvora:data-changed", renderTodo);
 
    renderTodo();
 
});