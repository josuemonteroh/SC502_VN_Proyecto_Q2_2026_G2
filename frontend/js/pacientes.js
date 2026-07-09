document.addEventListener("DOMContentLoaded", () => {
 
    // Controles de la barra de acciones
    const inputBuscar = document.querySelector(".panel .search-box[type='text']");
    const selectEstado = document.querySelectorAll(".panel select.search-box")[0];
    const selectOrden = document.querySelectorAll(".panel select.search-box")[1];
    const btnRegistrar = document.querySelector(".panel .btn-primary");
 
    // Tabla y KPIs
    const tabla = document.querySelectorAll(".panel table")[0];
    const tbody = tabla.querySelector("tbody");
    const kpis = document.querySelectorAll(".kpi-cards .card h2");
 
    // Quita acentos y pasa a minúsculas para comparar textos
    function normalizar(texto) {
        return String(texto)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }
 
    // Traduce el status de data.js a texto y color de badge
    function estadoInfo(status) {
        const mapa = {
            ACTIVO: { texto: "Activo", clase: "success" },
            SEGUIMIENTO: { texto: "Seguimiento", clase: "warning" },
            INACTIVO: { texto: "Inactivo", clase: "danger" }
        };
        return mapa[status] || { texto: status, clase: "warning" };
    }
 
    
    function crearFilaPaciente(paciente) {
        const inicial = nyvoraGetInitialMetric(paciente.id);
        const ultima = nyvoraGetLatestMetric(paciente.id);
        const estado = estadoInfo(paciente.status);
 
        const fila = document.createElement("tr");
        fila.dataset.id = paciente.id;
 
        fila.innerHTML = `
            <td><i class="fa-solid fa-user"></i> ${nyvoraEscapeHtml(paciente.fullName)}</td>
            <td>${paciente.age ?? "N/D"}</td>
            <td>${inicial ? inicial.weightKg + " kg" : "Sin registro"}</td>
            <td>${ultima ? nyvoraFormatDate(ultima.measurementDate) : "Sin controles"}</td>
            <td><span class="badge ${estado.clase}">${estado.texto}</span></td>
            <td>
                <a href="#" class="action-link">
                    <i class="fa-solid fa-eye"></i>
                    Abrir Expediente
                </a>
            </td>
        `;
 
        //va al historial de ese paciente
        fila.querySelector(".action-link").addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = `historial.html?id=${paciente.id}`;
        });
 
        return fila;
    }
 
    // Dibuja la tabla completa según los filtros y el orden actuales
    function renderTabla() {
        let pacientes = nyvoraGetPatients();
 
        // Filtro por nombre
        const busqueda = normalizar(inputBuscar.value);
        if (busqueda) {
            pacientes = pacientes.filter((p) => normalizar(p.fullName).includes(busqueda));
        }
 
        // Filtro por estado
        const estadoSeleccionado = selectEstado.value;
        if (estadoSeleccionado && estadoSeleccionado !== "Estado") {
            pacientes = pacientes.filter(
                (p) => normalizar(estadoInfo(p.status).texto) === normalizar(estadoSeleccionado)
            );
        }
 
        // Orden
        const criterio = selectOrden.value;
        if (criterio === "Nombre") {
            pacientes.sort((a, b) => a.fullName.localeCompare(b.fullName));
        } else if (criterio === "Edad") {
            pacientes.sort((a, b) => (a.age || 0) - (b.age || 0));
        } else if (criterio === "Último control") {
            pacientes.sort((a, b) => {
                const fechaA = nyvoraGetLatestMetric(a.id)?.measurementDate || "";
                const fechaB = nyvoraGetLatestMetric(b.id)?.measurementDate || "";
                return nyvoraBuildDate(fechaB) - nyvoraBuildDate(fechaA);
            });
        }
 
        // Repinta la tabla
        tbody.innerHTML = "";
 
        if (pacientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding:1rem; color:#888;">
                        No se encontraron pacientes con los filtros seleccionados.
                    </td>
                </tr>`;
            return;
        }
 
        pacientes.forEach((paciente) => tbody.appendChild(crearFilaPaciente(paciente)));
    }
 
    // Actualiza las tarjetas KPI del encabezado
    function renderKpis() {
        const pacientes = nyvoraGetPatients();
        const activos = pacientes.filter((p) => p.status === "ACTIVO").length;
        const alertasActivas = nyvoraGetAlerts().filter((a) => a.status === "ACTIVE").length;
 
        kpis[0].textContent = pacientes.length;
        kpis[1].textContent = activos;
        kpis[2].textContent = "0"; 
        kpis[3].textContent = alertasActivas;
    }
 
    // Registro rápido de paciente
    function registrarPacienteRapido() {
        const fullName = window.prompt("Nombre completo del paciente:");
        if (!fullName) return;
 
        const age = window.prompt("Edad:");
        const heightM = window.prompt("Estatura en metros (ej: 1.70):");
        const conditionGeneral = window.prompt("Condición general / objetivo:");
 
        nyvoraAddPatient({
            fullName,
            age,
            heightM,
            conditionGeneral,
            status: "ACTIVO"
        });
    }
 
    function renderTodo() {
        renderTabla();
        renderKpis();
    }
 
    // Eventos
    inputBuscar.addEventListener("input", renderTabla);
    selectEstado.addEventListener("change", renderTabla);
    selectOrden.addEventListener("change", renderTabla);
    btnRegistrar.addEventListener("click", (e) => {
        e.preventDefault();
        registrarPacienteRapido();
        renderTodo();
    });
 
    
    window.addEventListener("nyvora:data-changed", renderTodo);
 
    renderTodo();
 
});


