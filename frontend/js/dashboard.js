"use strict";
/* Dashboard */
document.addEventListener("DOMContentLoaded", () => {
    /* Elementos */
    const kpiPatients = document.getElementById("kpi-patients");
    const kpiAlerts = document.getElementById("kpi-alerts");
    const kpiAppointments = document.getElementById("kpi-appointments");
    const kpiMeasurements = document.getElementById("kpi-measurements");
    const recentPatients = document.getElementById("recent-patients");
    const recentAlerts = document.getElementById("recent-alerts");
    const appointmentsList = document.getElementById("appointments-list");
    const patientSearch = document.getElementById("weight-patient-search");
    const patientIdInput = document.getElementById("weight-patient");
    const patientSearchResults = document.getElementById("weight-patient-results");
    const weightCurrent = document.getElementById("weight-current");
    const weightChange = document.getElementById("weight-change");
    const weightLastControl = document.getElementById("weight-last-control");
    const userName = document.getElementById("dashboard-user-name");
    const userRole = document.getElementById("dashboard-user-role");
    const greeting = document.getElementById("dashboard-greeting");
    let weightChart = null;
    let statusChart = null;
    let alertChart = null;
    let dashboardData = null;
    let availablePatients = [];
    /* Traducciones */
    function traducir(clave, valorDefault = "") {
        if (
            typeof translations !== "undefined" &&
            typeof currentLanguage !== "undefined" &&
            translations[currentLanguage] &&
            translations[currentLanguage][clave] !== undefined
        ) {
            return translations[currentLanguage][clave];
        }
        return valorDefault;
    }
    /* Traducir rol de usuario (ADMIN / DOCTOR / USER -> etiqueta amigable) */
    function traducirRol(rol) {
        const valor = normalizarTexto(rol);
        if (
            valor === "admin" ||
            valor === "administrador" ||
            valor === "administrator"
        ) {
            return traducir("administrator", "Administrador");
        }
        if (valor === "doctor") {
            return traducir("doctor", "Doctor");
        }
        if (valor === "user" || valor === "usuario") {
            return traducir("user", "Usuario");
        }
        return rol || traducir("user", "Usuario");
    }
    /* Fecha */
    function formatearFecha(valor) {
        if (!valor) {
            return traducir("no_checkups", "Sin controles");
        }
        const fecha = new Date(
            String(valor).replace(" ", "T")
        );
        if (Number.isNaN(fecha.getTime())) {
            return traducir("no_date", "Sin fecha");
        }
        return fecha.toLocaleDateString(
            typeof currentLanguage !== "undefined" &&
            currentLanguage === "en"
                ? "en-US"
                : "es-CR",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }
    /* Seguridad */
    function escaparTexto(valor) {
        return String(valor ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
    function normalizarTexto(valor) {
        return String(valor ?? "")
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .toLowerCase()
            .trim();
    }
    /* Estados */
    function traducirEstadoPaciente(activo) {
        return activo
            ? traducir("active_label", "Activo")
            : traducir("inactive_label", "Inactivo");
    }
    function traducirTipoAlerta(tipo) {
        const valor = normalizarTexto(tipo);
        if (valor === "peso" || valor === "weight") {
            return traducir("alert_weight", "Peso");
        }
        if (valor === "sueno" || valor === "sleep") {
            return traducir("alert_sleep", "Sueño");
        }
        if (
            valor === "frecuencia cardiaca" ||
            valor === "frecuencia cardíaca" ||
            valor === "heart rate"
        ) {
            return traducir("alert_heart_rate", "Frecuencia cardíaca");
        }
        if (valor === "seguimiento" || valor === "follow-up") {
            return traducir("alert_follow_up_type", "Seguimiento");
        }
        if (
            valor === "actividad fisica" ||
            valor === "physical activity"
        ) {
            return traducir("alert_physical_activity", "Actividad física");
        }
        return tipo || traducir("alert_clinical", "Alerta clínica");
    }
    /* Traduce mensajes de alerta conocidos (texto libre de BD); si no se
       reconoce el mensaje, se muestra tal cual viene de la base de datos. */
    function traducirMensajeAlerta(mensaje) {
        const valor = normalizarTexto(mensaje);
        if (
            valor ===
            "se detecto una disminucion de peso durante los ultimos controles."
        ) {
            return currentLanguage === "en"
                ? "A decrease in weight was detected during the latest checkups."
                : mensaje;
        }
        if (
            valor ===
            "se registraron pocas horas de sueno durante el ultimo control."
        ) {
            return currentLanguage === "en"
                ? "Few hours of sleep were recorded during the latest checkup."
                : mensaje;
        }
        if (
            valor ===
            "la frecuencia cardiaca registrada requiere seguimiento."
        ) {
            return currentLanguage === "en"
                ? "The recorded heart rate requires follow-up."
                : mensaje;
        }
        return mensaje || traducir("no_description_available", "Sin información disponible.");
    }
    /* Formato genérico de respaldo: MI_VALOR -> Mi Valor (se usa solo
       cuando el tipo/estado de la cita no está en nuestro diccionario). */
    function formatearTitulo(valor) {
        return String(valor || "")
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, letra => letra.toUpperCase());
    }
    function traducirTipoCita(tipo) {
        const valor = normalizarTexto(tipo).replaceAll("_", " ");
        const mapa = {
            "valoracion inicial": "initial_assessment",
            "control nutricional": "nutritional_control",
            "seguimiento biometrico": "biometric_followup",
            "revision clinica": "clinical_review",
            otro: "other"
        };
        const clave = mapa[valor];
        return clave
            ? traducir(clave, formatearTitulo(tipo))
            : formatearTitulo(tipo);
    }
    function traducirEstadoCita(estado) {
        const valor = normalizarTexto(estado);
        const mapa = {
            programada: "scheduled",
            confirmada: "confirmed",
            completada: "completed",
            cancelada: "cancelled"
        };
        const clave = mapa[valor];
        return clave
            ? traducir(clave, formatearTitulo(estado))
            : formatearTitulo(estado);
    }
    /* Cargar dashboard */
    async function cargarDashboard() {
        try {
            const response = await fetch(
                "http://localhost:8081/dashboard.php",
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (response.status === 401) {
                window.location.href = "../login.html";
                return;
            }
            if (!response.ok) {
                throw new Error(
                    traducir("dashboard_load_error", "No se pudo cargar el dashboard.")
                );
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(
                    result.message ||
                    traducir("dashboard_load_error", "No se pudo cargar el dashboard.")
                );
            }
            dashboardData = result.data;
            availablePatients =
                dashboardData.recentPatients || [];
            actualizarKPIs(
                dashboardData.kpis || {}
            );
            cargarAgenda(
                dashboardData.todayAppointments || []
            );
            cargarPacientes(
                dashboardData.recentPatients || []
            );
            cargarAlertas(
                dashboardData.recentAlerts || []
            );
            configurarBuscadorPacientes();
            prepararGraficoPeso();
            cargarGraficoEstados(
                dashboardData.patientStatus || {}
            );
            cargarGraficoAlertas(
                dashboardData.alertsByType || []
            );
            cargarUsuario();
        } catch (error) {
            console.error(
                "Error cargando dashboard:",
                error
            );
        }
    }
    /* Usuario */
    async function cargarUsuario() {
        try {
            const response = await fetch(
                "http://localhost:8081/session_user.php",
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (!response.ok) {
                return;
            }
            const result = await response.json();
            if (!result.success || !result.data) {
                return;
            }
            const usuario = result.data;
            if (userName) {
                userName.textContent =
                    usuario.fullName || traducir("registered_patient", "Usuario Nyvora");
            }
            if (userRole) {
                userRole.textContent =
                    traducirRol(usuario.role);
            }
            if (greeting) {
                greeting.textContent =
                    `${traducir("welcome", "Bienvenido")}, ${traducirRol(usuario.role)}`;
            }
        } catch (error) {
            console.error(
                "Error cargando usuario:",
                error
            );
        }
    }
    /* KPIs */
    function actualizarKPIs(kpis) {
        const pacientesActivos =
            dashboardData?.patientStatus?.activos;
        if (kpiPatients) {
            kpiPatients.textContent =
                pacientesActivos ??
                kpis.patients ??
                0;
        }
        if (kpiAlerts) {
            kpiAlerts.textContent =
                kpis.activeAlerts ?? 0;
        }
        if (kpiAppointments) {
            kpiAppointments.textContent =
                kpis.todayAppointments ??
                kpis.appointments ??
                0;
        }
        if (kpiMeasurements) {
            kpiMeasurements.textContent =
                kpis.measurements ?? 0;
        }
    }
    /* Agenda */
    function cargarAgenda(citas = []) {
        if (!appointmentsList) {
            return;
        }
        appointmentsList.innerHTML = "";
        if (!citas.length) {
            appointmentsList.innerHTML = `
                <div class="empty-dashboard-state">
                    <i class="fa-regular fa-calendar"></i>
                    <p>
                        ${traducir("no_today_appointments", "No hay controles programados para hoy.")}
                    </p>
                </div>
            `;
            return;
        }
        citas.forEach(cita => {
            const item =
                document.createElement("a");
            item.className =
                "dashboard-list-item";
            item.href =
                "citas.html";
            const hora =
                String(cita.appointment_time || "")
                    .slice(0, 5);
            const tipo =
                traducirTipoCita(
                    cita.appointment_type
                );
            const estado =
                traducirEstadoCita(
                    cita.status
                );
            item.innerHTML = `
                <div class="dashboard-list-icon">
                    <i class="fa-regular fa-calendar-check"></i>
                </div>
                <div class="dashboard-list-content">
                    <strong>
                        ${escaparTexto(cita.patient_name)}
                    </strong>
                    <span>
                        ${escaparTexto(tipo)}
                        ·
                        ${escaparTexto(hora)}
                    </span>
                    <small>
                        ${escaparTexto(
                            cita.reason ||
                            (currentLanguage === "en"
                                ? "Scheduled checkup"
                                : "Control programado")
                        )}
                    </small>
                </div>
                <span class="dashboard-status active">
                    ${escaparTexto(estado)}
                </span>
                <i class="fa-solid fa-arrow-right"></i>
            `;
            appointmentsList.appendChild(item);
        });
    }
    /* Pacientes recientes */
    function cargarPacientes(pacientes) {
        if (!recentPatients) {
            return;
        }
        recentPatients.innerHTML = "";
        if (!pacientes.length) {
            recentPatients.innerHTML = `
                <div class="empty-dashboard-state">
                    <i class="fa-regular fa-user"></i>
                    <p>
                        ${traducir("no_registered_patients", "No hay pacientes registrados.")}
                    </p>
                </div>
            `;
            return;
        }
        pacientes.forEach(paciente => {
            const activo =
                Number(paciente.is_active) === 1;
            const item =
                document.createElement("a");
            item.className =
                "dashboard-list-item";
            item.href =
                `historial.html?id=${paciente.id}`;
            item.innerHTML = `
                <div class="dashboard-list-icon">
                    <i class="fa-regular fa-user"></i>
                </div>
                <div class="dashboard-list-content">
                    <strong>
                        ${escaparTexto(
                            paciente.full_name
                        )}
                    </strong>
                    <span>
                        ${paciente.age ?? traducir("no_data", "N/D")} ${traducir("years", "años")}
                        ·
                        ${formatearFecha(
                            paciente.last_control
                        )}
                    </span>
                </div>
                <span
                    class="dashboard-status
                    ${activo ? "active" : "inactive"}">
                    ${traducirEstadoPaciente(activo)}
                </span>
                <i class="fa-solid fa-arrow-right"></i>
            `;
            recentPatients.appendChild(item);
        });
    }
    /* Alertas */
    function cargarAlertas(alertas) {
        if (!recentAlerts) {
            return;
        }
        recentAlerts.innerHTML = "";
        if (!alertas.length) {
            recentAlerts.innerHTML = `
                <div class="empty-dashboard-state">
                    <i class="fa-regular fa-circle-check"></i>
                    <p>
                        ${traducir("no_active_alerts", "No hay alertas activas.")}
                    </p>
                </div>
            `;
            return;
        }
        alertas.forEach(alerta => {
            const item =
                document.createElement("a");
            item.className =
                "dashboard-list-item dashboard-alert-item";
            item.href =
                "alertas.html";
            item.innerHTML = `
                <div class="dashboard-list-icon alert">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div class="dashboard-list-content">
                    <strong>
                        ${escaparTexto(
                            traducirTipoAlerta(
                                alerta.alert_type
                            )
                        )}
                    </strong>
                    <span>
                        ${escaparTexto(
                            alerta.patient_name
                        )}
                    </span>
                    <small>
                        ${escaparTexto(
                            traducirMensajeAlerta(
                                alerta.message
                            )
                        )}
                    </small>
                </div>
                <span class="dashboard-status warning">
                    ${currentLanguage === "en" ? "Active" : "Activa"}
                </span>
                <i class="fa-solid fa-arrow-right"></i>
            `;
            recentAlerts.appendChild(item);
        });
    }
    /* Buscador de pacientes */
    function configurarBuscadorPacientes() {
        if (
            !patientSearch ||
            !patientIdInput ||
            !patientSearchResults
        ) {
            return;
        }
        function cerrarResultados() {
            patientSearchResults
                .classList
                .remove("open");
            patientSearch.setAttribute(
                "aria-expanded",
                "false"
            );
        }
        function mostrarResultados(
            consulta = ""
        ) {
            const termino =
                normalizarTexto(consulta);
            const coincidencias =
                availablePatients
                    .filter(paciente =>
                        normalizarTexto(
                            paciente.full_name
                        ).includes(termino)
                    )
                    .slice(0, 8);
            patientSearchResults.innerHTML = "";
            if (!coincidencias.length) {
                patientSearchResults.innerHTML = `
                    <div class="patient-search-empty">
                        ${traducir("no_patients_found", "No se encontraron pacientes.")}
                    </div>
                `;
            } else {
                coincidencias.forEach(paciente => {
                    const opcion =
                        document.createElement("button");
                    opcion.type = "button";
                    opcion.className =
                        "patient-search-option";
                    opcion.innerHTML = `
                        <i class="fa-regular fa-user"></i>
                        <span>
                            ${escaparTexto(
                                paciente.full_name
                            )}
                        </span>
                    `;
                    opcion.addEventListener(
                        "click",
                        () => {
                            patientIdInput.value =
                                paciente.id;
                            patientSearch.value =
                                paciente.full_name;
                            cerrarResultados();
                            seleccionarPacientePeso(
                                paciente
                            );
                        }
                    );
                    patientSearchResults
                        .appendChild(opcion);
                });
            }
            patientSearchResults
                .classList
                .add("open");
            patientSearch.setAttribute(
                "aria-expanded",
                "true"
            );
        }
        patientSearch.addEventListener(
            "focus",
            () => {
                mostrarResultados(
                    patientSearch.value
                );
            }
        );
        patientSearch.addEventListener(
            "input",
            () => {
                patientIdInput.value = "";
                limpiarResumenPeso();
                prepararGraficoPeso();
                mostrarResultados(
                    patientSearch.value
                );
            }
        );
        patientSearch.addEventListener(
            "keydown",
            event => {
                if (event.key === "Escape") {
                    cerrarResultados();
                    patientSearch.blur();
                }
            }
        );
        document.addEventListener(
            "click",
            event => {
                if (
                    !event.target.closest(
                        ".dashboard-patient-selector"
                    )
                ) {
                    cerrarResultados();
                }
            }
        );
    }
    /* Evolución del paciente */
    function seleccionarPacientePeso(paciente) {
        if (!paciente) {
            return;
        }
        const mediciones =
            (dashboardData?.weightEvolution || [])
                .filter(
                    medicion =>
                        Number(medicion.patient_id) ===
                        Number(paciente.id)
                )
                .sort(
                    (a, b) =>
                        new Date(a.measurement_date) -
                        new Date(b.measurement_date)
                );
        if (!mediciones.length) {
            limpiarResumenPeso();
            prepararGraficoPeso();
            return;
        }
        const primera =
            mediciones[0];
        const ultima =
            mediciones[mediciones.length - 1];
        const pesoInicial =
            Number(primera.weight_kg);
        const pesoActual =
            Number(ultima.weight_kg);
        const variacion =
            pesoActual - pesoInicial;
        if (weightCurrent) {
            weightCurrent.textContent =
                `${pesoActual.toFixed(1)} kg`;
        }
        if (weightChange) {
            const signo =
                variacion > 0 ? "+" : "";
            weightChange.textContent =
                `${signo}${variacion.toFixed(1)} kg`;
            weightChange.classList.remove(
                "positive",
                "negative"
            );
            if (variacion < 0) {
                weightChange.classList.add("positive");
            }
            if (variacion > 0) {
                weightChange.classList.add("negative");
            }
        }
        if (weightLastControl) {
            weightLastControl.textContent =
                formatearFecha(
                    ultima.measurement_date
                );
        }
        cargarGraficoPesoPaciente(
            mediciones
        );
    }
    function limpiarResumenPeso() {
        if (weightCurrent) {
            weightCurrent.textContent = traducir("no_data", "N/D");
        }
        if (weightChange) {
            weightChange.textContent = traducir("no_data", "N/D");
            weightChange.classList.remove(
                "positive",
                "negative"
            );
        }
        if (weightLastControl) {
            weightLastControl.textContent = traducir("no_data", "N/D");
        }
    }
    /* Gráfico de peso vacío */
    function prepararGraficoPeso() {
        const canvas =
            document.getElementById("weightChart");
        if (!canvas) {
            return;
        }
        if (weightChart) {
            weightChart.destroy();
        }
        weightChart = new Chart(
            canvas,
            {
                type: "line",
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: traducir("weight_kg_chart", "Peso (kg)"),
                            data: [],
                            borderColor: "#0E7A6E",
                            backgroundColor:
                                "rgba(14, 122, 110, 0.10)",
                            pointBackgroundColor:
                                "#0E7A6E",
                            pointBorderColor:
                                "#FFFFFF",
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            borderWidth: 2,
                            tension: 0.35,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: "#667085"
                            }
                        },
                        y: {
                            beginAtZero: false,
                            grid: {
                                color:
                                    "rgba(148, 163, 184, 0.16)"
                            },
                            ticks: {
                                color: "#667085"
                            }
                        }
                    }
                }
            }
        );
    }
    /* Gráfico de peso del paciente */
    function cargarGraficoPesoPaciente(
        mediciones
    ) {
        const canvas =
            document.getElementById("weightChart");
        if (!canvas) {
            return;
        }
        if (weightChart) {
            weightChart.destroy();
        }
        const labels =
            mediciones.map(
                medicion =>
                    formatearFecha(
                        medicion.measurement_date
                    )
            );
        const valores =
            mediciones.map(
                medicion =>
                    Number(medicion.weight_kg)
            );
        weightChart = new Chart(
            canvas,
            {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: traducir("weight_kg_chart", "Peso (kg)"),
                            data: valores,
                            borderColor: "#0E7A6E",
                            backgroundColor:
                                "rgba(14, 122, 110, 0.10)",
                            pointBackgroundColor:
                                "#0E7A6E",
                            pointBorderColor:
                                "#FFFFFF",
                            pointBorderWidth: 2,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            borderWidth: 2,
                            tension: 0.35,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: "index"
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label(context) {
                                    return `${Number(
                                        context.parsed.y
                                    ).toFixed(1)} kg`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: "#667085"
                            }
                        },
                        y: {
                            beginAtZero: false,
                            grid: {
                                color:
                                    "rgba(148, 163, 184, 0.16)"
                            },
                            ticks: {
                                color: "#667085",
                                callback(value) {
                                    return `${value} kg`;
                                }
                            }
                        }
                    }
                }
            }
        );
    }
    /* Gráfico pacientes por estado */
    function cargarGraficoEstados(estados) {
        const canvas =
            document.getElementById("statusChart");
        if (!canvas) {
            return;
        }
        if (statusChart) {
            statusChart.destroy();
        }
        statusChart = new Chart(
            canvas,
            {
                type: "doughnut",
                data: {
                    labels: [
                        traducir("active_plural", "Activos"),
                        traducir("inactive_plural", "Inactivos")
                    ],
                    datasets: [
                        {
                            data: [
                                Number(
                                    estados.activos || 0
                                ),
                                Number(
                                    estados.inactivos || 0
                                )
                            ],
                            backgroundColor: [
                                "#0E7A6E",
                                "#B8D8D3"
                            ],
                            borderColor: "#FFFFFF",
                            borderWidth: 3,
                            hoverOffset: 5
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "68%",
                    plugins: {
                        legend: {
                            display: true,
                            position: "bottom",
                            labels: {
                                color: "#667085",
                                usePointStyle: true,
                                padding: 18
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label(context) {
                                    const valores =
                                        context.dataset.data;
                                    const total =
                                        valores.reduce(
                                            (suma, valor) =>
                                                suma +
                                                Number(valor),
                                            0
                                        );
                                    const valor =
                                        Number(context.raw);
                                    const porcentaje =
                                        total
                                            ? (
                                                (valor / total) *
                                                100
                                            ).toFixed(1)
                                            : 0;
                                    return `${context.label}: ${valor} (${porcentaje}%)`;
                                }
                            }
                        }
                    }
                }
            }
        );
    }
    /* Gráfico alertas */
    function cargarGraficoAlertas(alertas) {
        const canvas =
            document.getElementById("alertChart");
        if (!canvas) {
            return;
        }
        const labels =
            alertas.map(
                alerta =>
                    traducirTipoAlerta(
                        alerta.alert_type
                    )
            );
        const valores =
            alertas.map(
                alerta =>
                    Number(alerta.total)
            );
        if (alertChart) {
            alertChart.destroy();
        }
        alertChart = new Chart(
            canvas,
            {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: traducir("alert_plural", "Alertas"),
                            data: valores,
                            backgroundColor:
                                "rgba(14, 122, 110, 0.72)",
                            borderColor: "#0E7A6E",
                            hoverBackgroundColor:
                                "#0E7A6E",
                            borderWidth: 1,
                            borderRadius: 7,
                            borderSkipped: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: "index"
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label(context) {
                                    const cantidad =
                                        context.parsed.y;
                                    const palabra =
                                        cantidad === 1
                                            ? traducir("alert_singular", "alerta")
                                            : traducir("alert_plural", "alertas");
                                    return `${cantidad} ${palabra}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: "#667085",
                                maxRotation: 25,
                                minRotation: 0
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color:
                                    "rgba(148, 163, 184, 0.16)"
                            },
                            ticks: {
                                color: "#667085",
                                precision: 0
                            }
                        }
                    }
                }
            }
        );
    }
    /* Cambio de idioma */
    document.addEventListener(
        "languageChanged",
        () => {
            if (!dashboardData) {
                return;
            }
            actualizarKPIs(
                dashboardData.kpis || {}
            );
            cargarAgenda(
                dashboardData.todayAppointments || []
            );
            cargarPacientes(
                dashboardData.recentPatients || []
            );
            cargarAlertas(
                dashboardData.recentAlerts || []
            );
            cargarGraficoEstados(
                dashboardData.patientStatus || {}
            );
            cargarGraficoAlertas(
                dashboardData.alertsByType || []
            );
            const pacienteId =
                Number(patientIdInput?.value);
            if (pacienteId) {
                const paciente =
                    availablePatients.find(
                        item =>
                            Number(item.id) ===
                            pacienteId
                    );
                seleccionarPacientePeso(
                    paciente
                );
            } else {
                prepararGraficoPeso();
            }
            cargarUsuario();
        }
    );
    /* Inicialización */
    cargarDashboard();
});