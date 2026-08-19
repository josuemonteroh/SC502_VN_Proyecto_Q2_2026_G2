"use strict";

let currentLanguage = "es";

const translations = {

    /* Español
       */

    es: {

        /* Login */

        platform_title:
            "Plataforma Inteligente<br>de Seguimiento Nutricional",

        platform_description:
            "Gestiona pacientes, registra métricas biométricas y administra el seguimiento nutricional desde una única plataforma.",

        feature_1:
            "Seguimiento integral de pacientes",

        feature_2:
            "Registro de métricas nutricionales",

        feature_3:
            "Historial clínico organizado",

        feature_4:
            "Información protegida y segura",

        login_title:
            "Bienvenido",

        login_subtitle:
            "Inicie sesión para acceder a la plataforma Nyvora.",

        email_label:
            "Correo electrónico",

        email_placeholder:
            "Ingrese su correo electrónico",

        password_label:
            "Contraseña",

        password_placeholder:
            "Ingrese su contraseña",

        remember_me:
            "Mantener mi sesión iniciada",

        forgot_password:
            "¿Olvidó su contraseña?",

        login_button:
            "Iniciar Sesión",

        need_access:
            "¿Necesita acceso?",

        request_access:
            "Solicitar acceso",

        version:
            "Versión 1.0.0",

        footer:
            "© 2026 Nyvora | Universidad Fidélitas",


        /* Menú */

        dashboard:
            "Dashboard",

        patients:
            "Pacientes",

        metrics:
            "Métricas",

        history:
            "Historial",

        alerts:
            "Alertas",

        settings:
            "Configuración",

        logout:
            "Cerrar Sesión",

        change_language:
            "Cambiar idioma",


        /* Generales */

        welcome:
            "Bienvenido",

        search:
            "Buscar",

        filter:
            "Filtrar",

        consult:
            "Consultar",

        save:
            "Guardar",

        cancel:
            "Cancelar",

        edit:
            "Editar",

        delete:
            "Eliminar",

        close:
            "Cerrar",

        details:
            "Ver Detalle",

        select_patient:
            "Seleccione un paciente",

        patient:
            "Paciente",

        patients_plural:
            "Pacientes",

        date:
            "Fecha",

        status:
            "Estado",

        priority:
            "Prioridad",

        actions:
            "Acciones",

        active:
            "Activo",

        inactive:
            "Inactivo",

        pending:
            "Pendiente",

        resolved:
            "Resuelta",

        no_data:
            "No hay información disponible.",

        no_results:
            "No se encontraron resultados.",


        /* Dashboard */

        dashboard_title:
            "Dashboard",

        dashboard_subtitle:
            "Resumen general del seguimiento nutricional de los pacientes.",

        total_patients:
            "Total de Pacientes",

        active_patients:
            "Pacientes Activos",

        pending_alerts:
            "Alertas Pendientes",

        recent_activity:
            "Actividad Reciente",

        latest_measurements:
            "Últimas Mediciones",


        /* Pacientes */

        patients_title:
            "Pacientes",

        patients_subtitle:
            "Gestión y seguimiento de los pacientes registrados.",

        register_patient:
            "Registrar Paciente",

        patient_name:
            "Nombre Completo",

        identification:
            "Identificación",

        age:
            "Edad",

        phone:
            "Teléfono",

        general_condition:
            "Condición General",

        observations:
            "Observaciones",

        patient_information:
            "Información del Paciente",

        patient_registered:
            "Paciente registrado correctamente.",

        patient_updated:
            "Paciente actualizado correctamente.",

        patient_deleted:
            "Paciente eliminado correctamente.",


        /* Métricas */

        metrics_title:
            "Métricas Biométricas",

        metrics_subtitle:
            "Registro y consulta de métricas biométricas de los pacientes.",

        register_metrics:
            "Registrar Métricas",

        save_metrics:
            "Guardar Métricas",

        historical_metrics:
            "Histórico de Métricas",

        weight:
            "Peso",

        weight_kg:
            "Peso (kg)",

        bmi:
            "IMC",

        body_fat:
            "Grasa Corporal (%)",

        heart_rate:
            "Frecuencia Cardíaca",

        heart_rate_bpm:
            "Frecuencia Cardíaca (bpm)",

        sleep:
            "Horas de Sueño",

        sleep_hours:
            "Horas de Sueño",

        steps:
            "Pasos Diarios",

        measurement_date:
            "Fecha de Medición",

        from:
            "Desde",

        to:
            "Hasta",


        /* Historial */

        history_title:
            "Historial Clínico",

        history_subtitle:
            "Consulta del historial y evolución del paciente.",

        patient_history:
            "Historial del Paciente",

        clinical_history:
            "Historial Clínico",

        patient_summary:
            "Resumen del Paciente",

        last_control:
            "Último Control",

        evolution:
            "Evolución",

        clinical_notes:
            "Notas Clínicas",

        recent_records:
            "Registros Recientes",

        first_record:
            "Primer Registro",

        positive_evolution:
            "Evolución Positiva",

        needs_attention:
            "Requiere Atención",

        stable:
            "Estable",

        no_records:
            "No hay registros para este paciente.",

        no_notes:
            "Sin observaciones registradas.",


        /* Alertas */

        alerts_title:
            "Alertas",

        alerts_subtitle:
            "Supervisión y seguimiento de alertas preventivas.",

        search_patient:
            "Buscar paciente",

        all_priorities:
            "Todas las prioridades",

        all_status:
            "Todos los estados",

        high:
            "Alta",

        medium:
            "Media",

        low:
            "Baja",

        alert_type:
            "Tipo de Alerta",

        alert_message:
            "Mensaje",

        created_at:
            "Fecha de Creación",

        alert_pending:
            "Pendiente",

        alert_resolved:
            "Resuelta",

        no_alerts:
            "No se encontraron alertas con los filtros seleccionados.",


        /* Configuración */

        settings_title:
            "Configuración",

        settings_subtitle:
            "Administra las preferencias de la plataforma.",

        account:
            "Cuenta",

        profile:
            "Perfil",

        notifications:
            "Notificaciones",

        security:
            "Seguridad",

        language:
            "Idioma",

        spanish:
            "Español",

        english:
            "Inglés",

        save_changes:
            "Guardar Cambios",

        settings_saved:
            "Configuración guardada correctamente."
    },


    /*
       INGLÉS */

    en: {

        /* Login */

        platform_title:
            "Intelligent Nutrition<br>Monitoring Platform",

        platform_description:
            "Manage patients, record biometric metrics and monitor nutritional progress from a single platform.",

        feature_1:
            "Comprehensive patient monitoring",

        feature_2:
            "Nutritional metrics tracking",

        feature_3:
            "Organized clinical history",

        feature_4:
            "Protected and secure information",

        login_title:
            "Welcome",

        login_subtitle:
            "Sign in to access the Nyvora platform.",

        email_label:
            "Email",

        email_placeholder:
            "Enter your email",

        password_label:
            "Password",

        password_placeholder:
            "Enter your password",

        remember_me:
            "Keep me signed in",

        forgot_password:
            "Forgot your password?",

        login_button:
            "Sign In",

        need_access:
            "Need access?",

        request_access:
            "Request access",

        version:
            "Version 1.0.0",

        footer:
            "© 2026 Nyvora | Fidélitas University",


        /* Menu */

        dashboard:
            "Dashboard",

        patients:
            "Patients",

        metrics:
            "Metrics",

        history:
            "History",

        alerts:
            "Alerts",

        settings:
            "Settings",

        logout:
            "Log Out",

        change_language:
            "Change Language",


        /* General */

        welcome:
            "Welcome",

        search:
            "Search",

        filter:
            "Filter",

        consult:
            "Search",

        save:
            "Save",

        cancel:
            "Cancel",

        edit:
            "Edit",

        delete:
            "Delete",

        close:
            "Close",

        details:
            "View Details",

        select_patient:
            "Select a patient",

        patient:
            "Patient",

        patients_plural:
            "Patients",

        date:
            "Date",

        status:
            "Status",

        priority:
            "Priority",

        actions:
            "Actions",

        active:
            "Active",

        inactive:
            "Inactive",

        pending:
            "Pending",

        resolved:
            "Resolved",

        no_data:
            "No information available.",

        no_results:
            "No results found.",


        /* Dashboard */

        dashboard_title:
            "Dashboard",

        dashboard_subtitle:
            "General overview of patient nutritional monitoring.",

        total_patients:
            "Total Patients",

        active_patients:
            "Active Patients",

        pending_alerts:
            "Pending Alerts",

        recent_activity:
            "Recent Activity",

        latest_measurements:
            "Latest Measurements",


        /* Patients */

        patients_title:
            "Patients",

        patients_subtitle:
            "Management and monitoring of registered patients.",

        register_patient:
            "Register Patient",

        patient_name:
            "Full Name",

        identification:
            "Identification",

        age:
            "Age",

        phone:
            "Phone",

        general_condition:
            "General Condition",

        observations:
            "Observations",

        patient_information:
            "Patient Information",

        patient_registered:
            "Patient registered successfully.",

        patient_updated:
            "Patient updated successfully.",

        patient_deleted:
            "Patient deleted successfully.",


        /* Metrics */

        metrics_title:
            "Biometric Metrics",

        metrics_subtitle:
            "Record and consult patient biometric metrics.",

        register_metrics:
            "Register Metrics",

        save_metrics:
            "Save Metrics",

        historical_metrics:
            "Metrics History",

        weight:
            "Weight",

        weight_kg:
            "Weight (kg)",

        bmi:
            "BMI",

        body_fat:
            "Body Fat (%)",

        heart_rate:
            "Heart Rate",

        heart_rate_bpm:
            "Heart Rate (bpm)",

        sleep:
            "Sleep Hours",

        sleep_hours:
            "Sleep Hours",

        steps:
            "Daily Steps",

        measurement_date:
            "Measurement Date",

        from:
            "From",

        to:
            "To",


        /* History */

        history_title:
            "Clinical History",

        history_subtitle:
            "View the patient's history and progress.",

        patient_history:
            "Patient History",

        clinical_history:
            "Clinical History",

        patient_summary:
            "Patient Summary",

        last_control:
            "Last Checkup",

        evolution:
            "Progress",

        clinical_notes:
            "Clinical Notes",

        recent_records:
            "Recent Records",

        first_record:
            "First Record",

        positive_evolution:
            "Positive Progress",

        needs_attention:
            "Needs Attention",

        stable:
            "Stable",

        no_records:
            "There are no records for this patient.",

        no_notes:
            "No observations recorded.",


        /* Alerts */

        alerts_title:
            "Alerts",

        alerts_subtitle:
            "Monitoring and management of preventive alerts.",

        search_patient:
            "Search patient",

        all_priorities:
            "All priorities",

        all_status:
            "All statuses",

        high:
            "High",

        medium:
            "Medium",

        low:
            "Low",

        alert_type:
            "Alert Type",

        alert_message:
            "Message",

        created_at:
            "Created Date",

        alert_pending:
            "Pending",

        alert_resolved:
            "Resolved",

        no_alerts:
            "No alerts found with the selected filters.",


        /* Settings */

        settings_title:
            "Settings",

        settings_subtitle:
            "Manage platform preferences.",

        account:
            "Account",

        profile:
            "Profile",

        notifications:
            "Notifications",

        security:
            "Security",

        language:
            "Language",

        spanish:
            "Spanish",

        english:
            "English",

        save_changes:
            "Save Changes",

        settings_saved:
            "Settings saved successfully."
    }
};


/* Cambia los textos de la página */

function changeLanguage(language) {

    if (!translations[language]) {
        return;
    }

    currentLanguage = language;

    document
        .querySelectorAll("[data-lang]")
        .forEach((element) => {

            const key =
                element.dataset.lang;

            if (
                translations[language][key]
            ) {

                const value =
                    translations[language][key];

                if (
                    value.includes("<br>")
                ) {

                    element.innerHTML =
                        value;

                } else {

                    element.textContent =
                        value;
                }
            }
        });


    document
        .querySelectorAll("[data-placeholder]")
        .forEach((element) => {

            const key =
                element.dataset.placeholder;

            if (
                translations[language][key]
            ) {

                element.placeholder =
                    translations[language][key];
            }
        });


    document
        .querySelectorAll("[data-title]")
        .forEach((element) => {

            const key =
                element.dataset.title;

            if (
                translations[language][key]
            ) {

                element.title =
                    translations[language][key];
            }
        });
}


/* Guarda el idioma seleccionado */

function setLanguage(language) {

    if (!translations[language]) {
        return;
    }

    currentLanguage =
        language;

    localStorage.setItem(
        "nyvora-language",
        language
    );

    const selector =
        document.getElementById(
            "language-select"
        );

    if (selector) {
        selector.value =
            language;
    }

    changeLanguage(language);
}


/* Cuando se cambia el selector */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const savedLanguage =
            localStorage.getItem(
                "nyvora-language"
            ) || "es";


        const selector =
            document.getElementById(
                "language-select"
            );


        if (selector) {

            selector.value =
                savedLanguage;


            selector.addEventListener(
                "change",
                () => {

                    setLanguage(
                        selector.value
                    );
                }
            );
        }


        changeLanguage(
            savedLanguage
        );
    }
);