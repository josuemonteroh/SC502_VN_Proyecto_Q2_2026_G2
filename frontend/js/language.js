"use strict";

let currentLanguage = "es";

const translations = {

    es: {

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

        request_access_title:
            "Acceso restringido",

        request_access_message:
            "Las cuentas de acceso a Nyvora son gestionadas por el administrador. Para solicitar una cuenta o modificar sus permisos, contacte al administrador del sistema.",

        demo_admin:
            "Administrador",

        demo_doctor:
            "Doctor",

        version:
            "Versión 1.0.0",

        footer:
            "© 2026 Nyvora | Universidad Fidélitas",


        dashboard:
            "Dashboard",

        patients:
            "Pacientes",

        appointments:
            "Citas",

        medications:
            "Medicamentos",

        treatments:
            "Tratamientos",

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
            "N/D",

        no_results:
            "No se encontraron resultados.",

        years:
            "años",

        undefined_condition:
            "Sin definir",

        no_checkups:
            "Sin controles",

        responsible:
            "Responsable",


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


        history_title:
            "Historial Clínico",

        history_subtitle:
            "Consulta del historial y evolución del paciente.",

        patient_history:
            "Consultar Historial",

        history_query_description:
            "Seleccione un paciente y consulte su información clínica.",

        clinical_history:
            "Historial Clínico",

        patient_summary:
            "Resumen del Paciente",

        patient_summary_description:
            "Información general y estado actual del seguimiento.",

        last_control:
            "Último Control",

        evolution:
            "Evolución Biométrica",

        evolution_description:
            "Registro histórico de métricas y controles del paciente.",

        clinical_notes:
            "Observaciones Clínicas",

        clinical_notes_description:
            "Notas asociadas al seguimiento del paciente.",

        recent_records:
            "Registros Recientes",

        recent_activity:
            "Actividad Reciente",

        recent_activity_description:
            "Últimos controles registrados.",

        activity:
            "Actividad",

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

        no_records_period:
            "No hay registros para este paciente en el período seleccionado.",

        no_notes:
            "Sin observaciones registradas.",

        no_observations:
            "Sin observaciones registradas.",

        no_activity:
            "Sin actividad registrada.",

        select_patient_history:
            "Seleccione un paciente para consultar su historial.",

        select_patient_notes:
            "Seleccione un paciente para consultar sus observaciones.",

        measurement_activity:
            "Se registró un control biométrico.",

        period:
            "Período",

        start:
            "Inicio",

        current:
            "Actualidad",

        generated_by:
            "Generado desde Nyvora.",


        activity_positive:
            "Paciente mantiene buenos niveles de actividad física.",

        activity_follow_up:
            "Paciente en seguimiento preventivo.",

        weight_follow_up:
            "Paciente con seguimiento de peso y hábitos de sueño.",

        favorable_progress:
            "El paciente muestra una evolución favorable en peso y actividad física.",

        heart_rate_follow_up:
            "Se recomienda seguimiento de frecuencia cardíaca y hábitos de sueño.",

        weight_heart_rate:
            "Se recomienda controlar peso y frecuencia cardíaca.",

        sleep_activity_follow_up:
            "Seguimiento de hábitos de sueño y actividad.",


        alerts_title:
            "Alertas Clínicas",

        alerts_subtitle:
            "Monitoreo y seguimiento de alertas clínicas de los pacientes.",

        search_alert:
            "Buscar paciente, tipo de alerta o condición...",

        search_patient:
            "Buscar paciente...",

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
            "Tipo de alerta",

        alert_message:
            "Alerta",

        created_at:
            "Fecha de detección",

        alert_pending:
            "Pendiente",

        alert_resolved:
            "Resuelta",

        registered_alerts:
            "Alertas Registradas",

        registered_alerts_description:
            "Alertas generadas a partir del seguimiento clínico de los pacientes.",

        alert_summary:
            "Resumen de Alertas",

        total_alerts:
            "Total de Alertas",

        pending_alerts_summary:
            "Alertas Pendientes",

        follow_up:
            "En Seguimiento",

        follow_up_description:
            "Actualmente bajo revisión",

        resolved_alerts:
            "Resueltas",

        resolved_alerts_description:
            "Alertas cerradas",

        active_alerts:
            "Alertas Activas",

        active_alerts_description:
            "Requieren atención o seguimiento",

        high_priority:
            "Alta Prioridad",

        high_priority_description:
            "Requieren revisión prioritaria",

        no_alerts:
            "No se encontraron alertas con los filtros seleccionados.",

        no_alert_results:
            "No se encontraron alertas",

        no_alerts_description:
            "Las alertas clínicas aparecerán aquí cuando sean detectadas por el sistema.",

        change_alert_filters:
            "Cambie los filtros o consulte otro paciente.",

        no_alert_matches:
            "No se encontraron coincidencias.",

        alert_clinical:
            "Alerta clínica",

        no_description:
            "Sin descripción",

        no_description_available:
            "Sin información disponible.",

        registered_patient:
            "Paciente registrado",

        registered_patient_ny:
            "Paciente registrado en Nyvora",

        results_one:
            "resultado",

        results_many:
            "resultados",

        cannot_load_alerts:
            "No se pudieron cargar las alertas",

        cannot_get_alerts:
            "No fue posible obtener la información desde el servidor.",

        alert_detail:
            "Detalle de la Alerta",

        alert_detail_description:
            "Información clínica y estado de seguimiento.",

        patient_alert_description:
            "Paciente asociado a esta alerta.",

        alert_information:
            "Información de la alerta",

        alert_condition_description:
            "Condición detectada durante el seguimiento.",

        clinical_description:
            "Descripción clínica",

        alert_description_information:
            "Información asociada a la condición detectada.",

        open_record:
            "Abrir Expediente",

        start_follow_up:
            "Iniciar Seguimiento",

        follow_up_active:
            "En Seguimiento",

        mark_resolved:
            "Marcar como Resuelta",

        resolved_state:
            "Resuelta",

        alert_updated:
            "Alerta actualizada correctamente.",

        alert_update_error:
            "No se pudo actualizar la alerta.",

        follow_up_success:
            "La alerta ahora está en seguimiento.",

        resolve_success:
            "La alerta fue marcada como resuelta.",

        alert_weight:
            "Peso",

        alert_sleep:
            "Sueño",

        alert_heart_rate:
            "Frecuencia cardíaca",

        alert_follow_up_type:
            "Seguimiento",

        alert_physical_activity:
            "Actividad física",

        alert_activity_description:
            "Últimos eventos relacionados con las alertas clínicas.",


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


    en: {

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

        request_access_title:
            "Restricted access",

        request_access_message:
            "Nyvora accounts are managed by the administrator. To request an account or modify your permissions, please contact the system administrator.",

        demo_admin:
            "Administrator",

        demo_doctor:
            "Doctor",

        version:
            "Version 1.0.0",

        footer:
            "© 2026 Nyvora | Fidélitas University",


        dashboard:
            "Dashboard",

        patients:
            "Patients",

        appointments:
            "Appointments",

        medications:
            "Medications",

        treatments:
            "Treatments",

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
            "N/A",

        no_results:
            "No results found.",

        years:
            "years",

        undefined_condition:
            "Not defined",

        no_checkups:
            "No checkups",

        responsible:
            "Responsible",


        history_title:
            "Clinical History",

        history_subtitle:
            "View the patient's history and progress.",

        patient_history:
            "Patient History",

        patient_summary:
            "Patient Summary",

        patient_summary_description:
            "General information and current follow-up status.",

        last_control:
            "Last Checkup",

        evolution:
            "Biometric Progress",

        evolution_description:
            "Historical record of patient metrics and checkups.",

        clinical_notes:
            "Clinical Notes",

        clinical_notes_description:
            "Notes associated with the patient's follow-up.",

        recent_activity:
            "Recent Activity",

        recent_activity_description:
            "Latest recorded checkups.",

        activity:
            "Activity",

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

        no_records_period:
            "There are no records for this patient in the selected period.",

        no_observations:
            "No observations recorded.",

        no_activity:
            "No activity recorded.",

        select_patient_history:
            "Select a patient to view their history.",

        select_patient_notes:
            "Select a patient to view their observations.",

        measurement_activity:
            "A biometric checkup was recorded.",

        period:
            "Period",

        start:
            "Start",

        current:
            "Current",

        generated_by:
            "Generated from Nyvora.",

        activity_positive:
            "Patient maintains good levels of physical activity.",

        activity_follow_up:
            "Patient under preventive follow-up.",

        weight_follow_up:
            "Patient under follow-up for weight and sleep habits.",

        favorable_progress:
            "The patient shows positive progress in weight and physical activity.",

        heart_rate_follow_up:
            "Heart rate and sleep habits follow-up is recommended.",

        weight_heart_rate:
            "Weight and heart rate monitoring is recommended.",

        sleep_activity_follow_up:
            "Follow-up of sleep habits and physical activity.",


        alerts_title:
            "Clinical Alerts",

        alerts_subtitle:
            "Monitor patients with clinical indicators that require attention or follow-up.",

        search_alert:
            "Search patient, alert type or condition...",

        search_patient:
            "Search patient...",

        all_priorities:
            "All Priorities",

        all_status:
            "All Statuses",

        high:
            "High",

        medium:
            "Medium",

        low:
            "Low",

        alert_type:
            "Alert Type",

        alert_message:
            "Alert",

        created_at:
            "Detection Date",

        alert_pending:
            "Pending",

        alert_resolved:
            "Resolved",

        registered_alerts:
            "Registered Alerts",

        registered_alerts_description:
            "Alerts generated from patient clinical follow-up.",

        alert_summary:
            "Alert Summary",

        total_alerts:
            "Total Alerts",

        pending_alerts_summary:
            "Pending Alerts",

        follow_up:
            "Under Follow-up",

        follow_up_description:
            "Currently under review",

        resolved_alerts:
            "Resolved",

        resolved_alerts_description:
            "Closed alerts",

        active_alerts:
            "Active Alerts",

        active_alerts_description:
            "Require attention or follow-up",

        high_priority:
            "High Priority",

        high_priority_description:
            "Require priority review",

        no_alerts:
            "No alerts found with the selected filters.",

        no_alert_results:
            "No alerts found",

        no_alerts_description:
            "Clinical alerts will appear here when detected by the system.",

        change_alert_filters:
            "Change the filters or search for another patient.",

        no_alert_matches:
            "No matches found.",

        alert_clinical:
            "Clinical alert",

        no_description:
            "No description",

        no_description_available:
            "No information available.",

        registered_patient:
            "Registered patient",

        registered_patient_ny:
            "Patient registered in Nyvora",

        results_one:
            "result",

        results_many:
            "results",

        cannot_load_alerts:
            "Alerts could not be loaded",

        cannot_get_alerts:
            "The information could not be retrieved from the server.",

        alert_detail:
            "Alert Details",

        alert_detail_description:
            "Clinical information and follow-up status.",

        patient_alert_description:
            "Patient associated with this alert.",

        alert_information:
            "Alert Information",

        alert_condition_description:
            "Condition detected during follow-up.",

        clinical_description:
            "Clinical Description",

        alert_description_information:
            "Information associated with the detected condition.",

        open_record:
            "Open Record",

        start_follow_up:
            "Start Follow-up",

        follow_up_active:
            "Under Follow-up",

        mark_resolved:
            "Mark as Resolved",

        resolved_state:
            "Resolved",

        alert_updated:
            "Alert updated successfully.",

        alert_update_error:
            "The alert could not be updated.",

        follow_up_success:
            "The alert is now under follow-up.",

        resolve_success:
            "The alert was marked as resolved.",

        alert_weight:
            "Weight",

        alert_sleep:
            "Sleep",

        alert_heart_rate:
            "Heart Rate",

        alert_follow_up_type:
            "Follow-up",

        alert_physical_activity:
            "Physical Activity",

        alert_activity_description:
            "Latest events related to clinical alerts.",


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


function applyTranslations(
    root = document
) {

    root
        .querySelectorAll("[data-lang]")
        .forEach(
            (element) => {

                const key =
                    element.dataset.lang;

                if (
                    Object.prototype.hasOwnProperty.call(
                        translations[currentLanguage],
                        key
                    )
                ) {

                    const value =
                        translations[currentLanguage][key];

                    if (
                        typeof value === "string" &&
                        value.includes("<br>")
                    ) {

                        element.innerHTML =
                            value;

                    } else {

                        element.textContent =
                            value;
                    }
                }
            }
        );


    root
        .querySelectorAll("[data-placeholder]")
        .forEach(
            (element) => {

                const key =
                    element.dataset.placeholder;

                if (
                    Object.prototype.hasOwnProperty.call(
                        translations[currentLanguage],
                        key
                    )
                ) {

                    element.placeholder =
                        translations[currentLanguage][key];
                }
            }
        );


    root
        .querySelectorAll("[data-title]")
        .forEach(
            (element) => {

                const key =
                    element.dataset.title;

                if (
                    Object.prototype.hasOwnProperty.call(
                        translations[currentLanguage],
                        key
                    )
                ) {

                    element.title =
                        translations[currentLanguage][key];
                }
            }
        );
}


function changeLanguage(
    language
) {

    if (
        !translations[language]
    ) {
        return;
    }


    currentLanguage =
        language;


    applyTranslations(
        document
    );


    document.documentElement.lang =
        language;


    document.dispatchEvent(
        new CustomEvent(
            "languageChanged",
            {
                detail: {
                    language:
                        language
                }
            }
        )
    );
}


function setLanguage(
    language
) {

    if (
        !translations[language]
    ) {
        return;
    }


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


    changeLanguage(
        language
    );
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        currentLanguage =
            localStorage.getItem(
                "nyvora-language"
            ) || "es";


        const selector =
            document.getElementById(
                "language-select"
            );


        if (selector) {

            selector.value =
                currentLanguage;


            selector.addEventListener(
                "change",
                () => {

                    setLanguage(
                        selector.value
                    );
                }
            );
        }


        applyTranslations(
            document
        );
    }
);


const observer =
    new MutationObserver(
        (mutations) => {

            mutations.forEach(
                (mutation) => {

                    mutation.addedNodes.forEach(
                        (node) => {

                            if (
                                node.nodeType ===
                                Node.ELEMENT_NODE
                            ) {

                                applyTranslations(
                                    node
                                );
                            }
                        }
                    );
                }
            );
        }
    );


document.addEventListener(
    "DOMContentLoaded",
    () => {

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }
);