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

        patient:
            "Paciente",

        patients_plural:
            "Pacientes",

        date:
            "Fecha",

        time:
            "Hora",

        status:
            "Estado",

        priority:
            "Prioridad",

        actions:
            "Acciones",

        action:
            "Acción",

        active:
            "Activo",

        inactive:
            "Inactivo",

        pending:
            "Pendiente",

        resolved:
            "Resuelta",

        completed:
            "Completado",

        suspended:
            "Suspendido",

        follow_up:
            "En Seguimiento",

        responsible:
            "Responsable",

        no_data:
            "N/D",

        no_results:
            "No se encontraron resultados.",

        no_checkups:
            "Sin controles",

        no_record:
            "Sin registro",

        no_records:
            "No hay registros.",

        undefined_condition:
            "Sin definir",

        undefined_status:
            "Sin estado",

        no_date:
            "Sin fecha",

        years:
            "años",

        name:
            "Nombre",

        sort:
            "Ordenar",

        required_fields:
            "Campos obligatorios",

        results_one:
            "resultado",

        results_many:
            "resultados",

        results_count:
            "0 resultados",

        request_error:
            "No fue posible completar la operación.",


        /* DASHBOARD */

        dashboard_title:
            "Dashboard Clínico",

        dashboard_subtitle:
            "Seguimiento general de pacientes y actividad clínica.",

        clinical_followup:
            "Seguimiento clínico",

        dashboard_welcome:
            "Bienvenido a Nyvora",

        dashboard_description:
            "Consulte la evolución de sus pacientes, controles programados, métricas recientes y alertas clínicas desde una única vista.",

        view_patients:
            "Ver pacientes",

        active_patients_dashboard:
            "Pacientes activos",

        clinical_followup_dashboard:
            "Bajo seguimiento clínico",

        active_alerts_dashboard:
            "Alertas activas",

        appointments_today:
            "Controles de hoy",

        clinical_schedule:
            "Agenda clínica",

        registered_measurements:
            "Mediciones registradas",

        biometric_history:
            "Historial biométrico",

        today_schedule:
            "Agenda de hoy",

        today_schedule_description:
            "Controles y citas programadas para el día.",

        view_schedule:
            "Ver agenda",

        no_today_appointments:
            "No hay controles programados para hoy.",

        recent_patients:
            "Pacientes recientes",

        recent_patients_description:
            "Últimos pacientes registrados.",

        view_all:
            "Ver todos",

        clinical_alerts:
            "Alertas clínicas",

        patients_require_review:
            "Pacientes que requieren revisión.",

        view_all_alerts:
            "Ver todas",

        weight_evolution:
            "Evolución de peso",

        weight_evolution_description:
            "Consulte la evolución biométrica de un paciente.",

        search_patient:
            "Buscar paciente...",

        last_weight:
            "Último peso",

        variation:
            "Variación",

        last_control:
            "Último control",

        patients_by_status:
            "Pacientes por Estado",

        alerts_by_type:
            "Alertas por Tipo",

        active_label:
            "Activo",

        inactive_label:
            "Inactivo",

        active_plural:
            "Activos",

        inactive_plural:
            "Inactivos",

        no_registered_patients:
            "No hay pacientes registrados.",

        no_active_alerts:
            "No hay alertas activas.",

        no_patients_found:
            "No se encontraron pacientes.",

        no_registered_appointments:
            "No hay citas registradas.",

        no_scheduled_today:
            "No hay controles programados para hoy.",

        alert_singular:
            "alerta",

        alert_plural:
            "alertas",

        weight_kg_chart:
            "Peso (kg)",

        dashboard_load_error:
            "No se pudo cargar el dashboard.",


        /* PACIENTES */

        patients_title:
            "Gestión de Pacientes",

        patients_subtitle:
            "Administración y seguimiento clínico de pacientes registrados.",

        patient_search:
            "Buscar por ID de cita, ID de paciente, nombre o identificación...",

        registered_patients:
            "Pacientes Registrados",

        system_total:
            "Total del sistema",

        current_follow_up:
            "Seguimiento vigente",

        patients_followup:
            "En Seguimiento",

        patients_under_control:
            "Pacientes bajo control",

        require_review:
            "Requieren revisión",

        patient_list:
            "Listado General de Pacientes",

        patients_registered_now:
            "Pacientes registrados actualmente en Nyvora.",

        initial_weight:
            "Peso Inicial",

        record:
            "Expediente",

        upcoming_appointments:
            "Próximas Citas",

        appointments_description:
            "Controles y citas programadas para los pacientes.",

        no_appointments:
            "No hay citas programadas.",

        appointments_empty_description:
            "Las próximas citas aparecerán aquí cuando se programen.",

        system_activity:
            "Actividad del sistema",

        system_activity_description:
            "La actividad se mostrará conforme se registren acciones sobre los pacientes.",

        clinical_summary:
            "Resumen Clínico",

        active_alerts_summary:
            "Alertas activas",

        patient_initial_information:
            "Ingrese la información inicial del paciente.",

        personal_information:
            "Información personal",

        main_patient_data:
            "Datos principales del paciente.",

        full_name:
            "Nombre completo",

        full_name_placeholder:
            "Ej. María Rodríguez Vargas",

        identification:
            "Identificación",

        identification_placeholder:
            "Ej. 1-1234-5678",

        age:
            "Edad",

        age_placeholder:
            "Ej. 35",

        phone:
            "Teléfono",

        phone_placeholder:
            "Ej. 8888-8888",

        height:
            "Estatura",

        height_placeholder:
            "1.70",

        clinical_followup_description:
            "Información inicial para el seguimiento dentro de Nyvora.",

        general_condition_goal:
            "Condición general / objetivo",

        general_condition_placeholder:
            "Ej. Control de peso y seguimiento nutricional",

        observations:
            "Observaciones",

        observations_patient_placeholder:
            "Información adicional relevante para el seguimiento...",

        save_patient:
            "Guardar Paciente",

        edit_patient:
            "Editar Paciente",

        open_record:
            "Abrir Expediente",

        name_required:
            "Ingrese el nombre completo.",

        age_invalid:
            "Ingrese una edad válida.",

        height_invalid:
            "Ingrese una estatura válida.",

        patient_unavailable:
            "Paciente no disponible",

        registered_patient:
            "Paciente registrado",

        no_identification:
            "Sin identificación",

        no_patients:
            "No se encontraron pacientes.",

        no_patients_filter:
            "No se encontraron pacientes con los filtros seleccionados.",


        /* CITAS */

        appointments_title:
            "Gestión de Citas",

        appointments_subtitle:
            "Organice controles, seguimientos y citas clínicas de los pacientes.",

        search_patient_appointment:
            "Buscar por paciente...",

        all_status:
            "Todos los estados",

        scheduled:
            "Programada",

        confirmed:
            "Confirmada",

        cancelled:
            "Cancelada",

        new_appointment:
            "Nueva Cita",

        appointments_today:
            "Citas de Hoy",

        day_schedule:
            "Agenda del día",

        upcoming_appointments_kpi:
            "Próximas Citas",

        scheduled_upcoming:
            "Programadas próximamente",

        completed_appointments:
            "Completadas",

        completed_checkups:
            "Controles realizados",

        pending_appointments:
            "Pendientes",

        pending_followup:
            "Requieren seguimiento",

        today_schedule_title:
            "Agenda de Hoy",

        today_schedule_text:
            "Citas y controles programados para el día actual.",

        no_appointments_today:
            "No hay citas programadas para hoy.",

        today_appointments_text:
            "Las citas del día aparecerán aquí.",

        general_appointment_list:
            "Listado General de Citas",

        appointments_current_status:
            "Consulte las citas programadas y su estado actual.",

        appointment_type:
            "Tipo",

        professional:
            "Profesional",

        upcoming_appointments_title:
            "Próximas Citas",

        upcoming_checkups:
            "Próximos controles agendados para los pacientes.",

        no_upcoming_appointments:
            "No hay próximas citas registradas.",

        upcoming_appointments_text:
            "Las próximas citas aparecerán aquí cuando se programen.",

        schedule_new_appointment:
            "Programe un nuevo control clínico para un paciente.",

        select_patient:
            "Seleccione un paciente",

        appointment_date:
            "Fecha",

        appointment_time:
            "Hora",

        appointment_type_label:
            "Tipo de cita",

        select_type:
            "Seleccione un tipo",

        initial_assessment:
            "Valoración inicial",

        nutritional_control:
            "Control nutricional",

        biometric_followup:
            "Seguimiento biométrico",

        clinical_review:
            "Revisión clínica",

        other:
            "Otro",

        reason:
            "Motivo",

        reason_placeholder:
            "Ej. Control mensual de seguimiento",

        notes:
            "Observaciones",

        appointment_notes_placeholder:
            "Información adicional sobre la cita...",

        reprogram_appointment:
            "Reprogramar Cita",

        cancel_appointment:
            "Cancelar",

        reschedule:
            "Reprogramar",

        confirm_cancel_appointment:
            "¿Cancelar la cita?",

        no_appointments_filters:
            "No se encontraron citas con los filtros seleccionados.",

        appointments_will_appear:
            "Las citas aparecerán aquí cuando se programen.",

        save_appointment:
            "Guardar Cita",


        /* MEDICAMENTOS */

        medications_title:
            "Gestión de Medicamentos",

        medications_subtitle:
            "Consulta y administración de medicamentos registrados en Nyvora.",

        medication_search:
            "Buscar medicamento, presentación o concentración...",

        registered_medications:
            "Medicamentos Registrados",

        active_medications:
            "Medicamentos Activos",

        available_currently:
            "Disponibles actualmente",

        in_use:
            "En uso",

        medications_in_use:
            "En Uso",

        associated_treatments:
            "Asociados a tratamientos",

        inactive_medications:
            "Inactivos",

        inactive_out_of_use:
            "Fuera de uso",

        all_presentations:
            "Todas las presentaciones",

        tablets:
            "Tabletas",

        capsules:
            "Cápsulas",

        syrup:
            "Jarabe",

        suspension:
            "Suspensión",

        solution:
            "Solución",

        injectable:
            "Inyectable",

        cream:
            "Crema",

        register_medication:
            "Registrar Medicamento",

        medication_list:
            "Listado de Medicamentos",

        medications_currently_registered:
            "Medicamentos registrados actualmente en Nyvora.",

        medication:
            "Medicamento",

        presentation:
            "Presentación",

        concentration:
            "Concentración",

        concentration_placeholder:
            "Ej. 500 mg",

        reference_dose:
            "Dosis de referencia",

        reference_dose_label:
            "Dosis de referencia",

        associated_patients:
            "Pacientes asociados",

        no_medications:
            "No se encontraron medicamentos.",

        no_medications_registered:
            "No hay medicamentos registrados",

        medications_will_appear:
            "Los medicamentos aparecerán aquí conforme sean registrados.",

        medication_general_information:
            "Ingrese la información general del medicamento.",

        medication_information:
            "Información del medicamento",

        medication_identification:
            "Datos principales para su identificación.",

        medication_name:
            "Nombre del medicamento",

        medication_name_placeholder:
            "Ej. Metformina",

        presentation_select:
            "Seleccione una presentación",

        medication_usage_information:
            "Información de uso",

        medication_usage_description:
            "Información de referencia para el seguimiento.",

        dose:
            "Dosis",

        dose_example:
            "Ej. 1 tableta",

        frequency:
            "Frecuencia",

        frequency_example:
            "Ej. Cada 12 horas",

        undefined_frequency:
            "Sin frecuencia definida",

        deactivate_medication:
            "Dar de baja",

        confirm_deactivate_medication:
            "¿Dar de baja este medicamento?",

        edit_medication:
            "Editar Medicamento",

        medication_observations_placeholder:
            "Información adicional sobre el medicamento...",

        save_medication:
            "Guardar Medicamento",


        /* TRATAMIENTOS */

        treatments_title:
            "Gestión de Tratamientos",

        treatments_subtitle:
            "Administración y seguimiento de tratamientos clínicos de los pacientes.",

        treatment_search:
            "Buscar paciente, medicamento o tratamiento...",

        new_treatment:
            "Nuevo Tratamiento",

        active_treatments:
            "Tratamientos Activos",

        active_treatments_description:
            "Actualmente en seguimiento",

        ending_soon:
            "Próximos a Finalizar",

        ending_soon_description:
            "Durante los próximos días",

        completed_treatments:
            "Completados",

        completed_treatments_description:
            "Tratamientos finalizados",

        suspended_treatments:
            "Suspendidos",

        suspended_treatments_description:
            "Requieren seguimiento",

        treatment:
            "Tratamiento",

        treatment_start:
            "Inicio",

        treatment_end:
            "Finalización",

        start_date:
            "Fecha de inicio",

        end_date:
            "Fecha de finalización",

        treatments_registered_description:
            "Tratamientos registrados actualmente en Nyvora.",

        no_treatments:
            "No hay tratamientos registrados.",

        no_treatments_found:
            "No se encontraron tratamientos.",

        new_treatment_description:
            "Registre un tratamiento clínico para el paciente.",

        patient_treatment_description:
            "Seleccione el paciente asociado al tratamiento.",

        search_patient_label:
            "Buscar paciente",

        search_name_id:
            "Buscar por nombre o identificación...",

        treatment_information:
            "Información del tratamiento",

        treatment_information_description:
            "Defina el seguimiento clínico indicado.",

        treatment_name:
            "Nombre del tratamiento",

        treatment_name_placeholder:
            "Ej. Control metabólico",

        search_medication:
            "Buscar medicamento...",

        dose_placeholder:
            "Ej. 500 mg",

        frequency_placeholder:
            "Ej. Cada 12 horas",

        start_date_required:
            "Fecha de inicio",

        status_required:
            "Estado",

        clinical_instructions:
            "Indicaciones clínicas",

        clinical_instructions_description:
            "Información adicional para el seguimiento.",

        indications:
            "Indicaciones",

        indications_placeholder:
            "Indicaciones generales del tratamiento...",

        observations_placeholder:
            "Información adicional sobre el seguimiento...",

        save_treatment:
            "Guardar Tratamiento",

        edit_treatment:
            "Editar Tratamiento",

        no_medication:
            "Sin medicamento",

        suspend_treatment:
            "Suspender tratamiento",

        suspend_question:
            "¿Suspender el tratamiento?",

        open_treatment_record:
            "Abrir expediente",


        /* MÉTRICAS */

        metrics_title:
            "Métricas Biométricas",

        metrics_subtitle:
            "Registro y consulta de métricas biométricas de los pacientes.",

        historical_metrics:
            "Histórico de Métricas",

        metrics_history_description:
            "Consulte y filtre los registros biométricos de los pacientes.",

        register_metrics:
            "Registrar Métricas",

        patient_label:
            "Paciente",

        from:
            "Desde",

        to:
            "Hasta",

        clear:
            "Limpiar",

        registered_measurements_kpi:
            "Mediciones Registradas",

        total_biometric_records:
            "Total de registros biométricos",

        measured_patients:
            "Pacientes Medidos",

        patients_with_records:
            "Pacientes con registros",

        today_records:
            "Registros de Hoy",

        measurements_today:
            "Mediciones realizadas hoy",

        last_measurement:
            "Última Medición",

        latest_record:
            "Registro más reciente",

        biometric_records:
            "Registros Biométricos",

        measurement_history:
            "Historial de mediciones registradas en Nyvora.",

        body_fat:
            "Grasa Corporal",

        sleep_hours:
            "Horas de Sueño",

        steps:
            "Pasos",

        measurement_modal_title:
            "Registrar Métricas",

        measurement_modal_description:
            "Ingrese las mediciones biométricas del paciente.",

        measurement_values_description:
            "Registre los valores obtenidos durante el control.",

        select_patient_measurement:
            "Seleccione el paciente asociado a la medición.",

        last_record:
            "Último registro",

        select_patient_latest:
            "Seleccione un paciente para consultar su última medición.",

        no_patient_measurements:
            "Este paciente aún no tiene mediciones registradas.",

        measurement_registered:
            "Medición registrada",

        automatic:
            "Automático",

        weight:
            "Peso",

        weight_kg:
            "Peso (kg)",

        weight_placeholder:
            "Ej. 72.5",

        bmi:
            "IMC",

        body_fat_placeholder:
            "Ej. 24.5",

        heart_rate:
            "Frecuencia Cardíaca",

        heart_rate_placeholder:
            "Ej. 75",

        sleep:
            "Horas de Sueño",

        sleep_placeholder:
            "Ej. 7.5",

        steps_placeholder:
            "Ej. 8000",

        save_measurement:
            "Guardar Métricas",


        /* HISTORIAL */

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


        /* ALERTAS */

        alerts_title:
            "Alertas Clínicas",

        alerts_subtitle:
            "Monitoreo y seguimiento de alertas clínicas de los pacientes.",

        search_alert:
            "Buscar paciente, tipo de alerta o condición...",

        search_patient_alert:
            "Buscar paciente...",

        all_priorities:
            "Todas las prioridades",

        all_status_alerts:
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

        registered_patient_ny:
            "Paciente registrado en Nyvora",

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


        /* CONFIGURACIÓN */

        settings_title:
            "Configuración",

        settings_subtitle:
            "Administre la información del perfil y las preferencias generales de la plataforma.",

        user_profile:
            "Perfil de Usuario",

        role:
            "Rol",

        join_date:
            "Fecha de ingreso",

        system_preferences:
            "Preferencias del Sistema",

        date_format:
            "Formato de fecha",

        enable_notifications:
            "Activar notificaciones",

        save_changes:
            "Guardar Cambios",

        system_information:
            "Información del Sistema",

        system_information_subtitle:
            "Información general de la plataforma Nyvora.",

        system_name:
            "Nyvora",

        system_description:
            "Nyvora es una plataforma web desarrollada para el monitoreo preventivo y seguimiento biométrico de pacientes con sobrepeso.",

        version_label:
            "Versión",

        university_label:
            "Universidad",

        course_label:
            "Curso",

        user_nyvora:
            "Usuario Nyvora",

        user_load_error:
            "No fue posible cargar la información del usuario.",

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

        patient:
            "Patient",

        patients_plural:
            "Patients",

        date:
            "Date",

        time:
            "Time",

        status:
            "Status",

        priority:
            "Priority",

        actions:
            "Actions",

        action:
            "Action",

        active:
            "Active",

        inactive:
            "Inactive",

        pending:
            "Pending",

        resolved:
            "Resolved",

        completed:
            "Completed",

        suspended:
            "Suspended",

        follow_up:
            "Under Follow-up",

        responsible:
            "Responsible",

        no_data:
            "N/A",

        no_results:
            "No results found.",

        no_checkups:
            "No checkups",

        no_record:
            "No record",

        no_records:
            "No records.",

        undefined_condition:
            "Not defined",

        undefined_status:
            "No status",

        no_date:
            "No date",

        years:
            "years",

        name:
            "Name",

        sort:
            "Sort",

        required_fields:
            "Required fields",

        results_one:
            "result",

        results_many:
            "results",

        results_count:
            "0 results",

        request_error:
            "The operation could not be completed.",


        /* DASHBOARD */

        dashboard_title:
            "Clinical Dashboard",

        dashboard_subtitle:
            "General patient monitoring and clinical activity.",

        clinical_followup:
            "Clinical Follow-up",

        dashboard_welcome:
            "Welcome to Nyvora",

        dashboard_description:
            "View patient progress, scheduled checkups, recent metrics and clinical alerts from a single view.",

        view_patients:
            "View Patients",

        active_patients_dashboard:
            "Active Patients",

        clinical_followup_dashboard:
            "Under clinical follow-up",

        active_alerts_dashboard:
            "Active Alerts",

        appointments_today:
            "Today's Checkups",

        clinical_schedule:
            "Clinical Schedule",

        registered_measurements:
            "Registered Measurements",

        biometric_history:
            "Biometric History",

        today_schedule:
            "Today's Schedule",

        today_schedule_description:
            "Checkups and appointments scheduled for today.",

        view_schedule:
            "View Schedule",

        no_today_appointments:
            "No checkups scheduled for today.",

        recent_patients:
            "Recent Patients",

        recent_patients_description:
            "Latest registered patients.",

        view_all:
            "View All",

        clinical_alerts:
            "Clinical Alerts",

        patients_require_review:
            "Patients requiring review.",

        view_all_alerts:
            "View All",

        weight_evolution:
            "Weight Progress",

        weight_evolution_description:
            "View the biometric progress of a patient.",

        search_patient:
            "Search patient...",

        last_weight:
            "Latest Weight",

        variation:
            "Change",

        last_control:
            "Last Checkup",

        patients_by_status:
            "Patients by Status",

        alerts_by_type:
            "Alerts by Type",

        active_label:
            "Active",

        inactive_label:
            "Inactive",

        active_plural:
            "Active",

        inactive_plural:
            "Inactive",

        no_registered_patients:
            "No patients registered.",

        no_active_alerts:
            "No active alerts.",

        no_patients_found:
            "No patients found.",

        no_registered_appointments:
            "No appointments registered.",

        no_scheduled_today:
            "No checkups scheduled for today.",

        alert_singular:
            "alert",

        alert_plural:
            "alerts",

        weight_kg_chart:
            "Weight (kg)",

        dashboard_load_error:
            "The dashboard could not be loaded.",


        /* PACIENTES */

        patients_title:
            "Patient Management",

        patients_subtitle:
            "Management and clinical monitoring of registered patients.",

        patient_search:
            "Search by appointment ID, patient ID, name or identification...",

        registered_patients:
            "Registered Patients",

        system_total:
            "System Total",

        current_follow_up:
            "Current follow-up",

        patients_followup:
            "Under Follow-up",

        patients_under_control:
            "Patients under monitoring",

        require_review:
            "Require review",

        patient_list:
            "General Patient List",

        patients_registered_now:
            "Patients currently registered in Nyvora.",

        initial_weight:
            "Initial Weight",

        record:
            "Record",

        upcoming_appointments:
            "Upcoming Appointments",

        appointments_description:
            "Scheduled checkups and appointments for patients.",

        no_appointments:
            "No appointments scheduled.",

        appointments_empty_description:
            "Upcoming appointments will appear here when scheduled.",

        system_activity:
            "System Activity",

        system_activity_description:
            "Activity will appear as actions are performed on patients.",

        clinical_summary:
            "Clinical Summary",

        active_alerts_summary:
            "Active Alerts",

        patient_initial_information:
            "Enter the patient's initial information.",

        personal_information:
            "Personal Information",

        main_patient_data:
            "Main patient information.",

        full_name:
            "Full Name",

        full_name_placeholder:
            "E.g. Maria Rodriguez Vargas",

        identification:
            "Identification",

        identification_placeholder:
            "E.g. 1-1234-5678",

        age:
            "Age",

        age_placeholder:
            "E.g. 35",

        phone:
            "Phone",

        phone_placeholder:
            "E.g. 8888-8888",

        height:
            "Height",

        height_placeholder:
            "1.70",

        clinical_followup_description:
            "Initial information for follow-up within Nyvora.",

        general_condition_goal:
            "General Condition / Goal",

        general_condition_placeholder:
            "E.g. Weight control and nutritional follow-up",

        observations:
            "Observations",

        observations_patient_placeholder:
            "Additional information relevant to follow-up...",

        save_patient:
            "Save Patient",

        edit_patient:
            "Edit Patient",

        open_record:
            "Open Record",

        name_required:
            "Enter the full name.",

        age_invalid:
            "Enter a valid age.",

        height_invalid:
            "Enter a valid height.",

        patient_unavailable:
            "Patient unavailable",

        registered_patient:
            "Registered patient",

        no_identification:
            "No identification",

        no_patients:
            "No patients found.",

        no_patients_filter:
            "No patients were found with the selected filters.",


        /* CITAS */

        appointments_title:
            "Appointment Management",

        appointments_subtitle:
            "Organize checkups, follow-ups and clinical appointments for patients.",

        search_patient_appointment:
            "Search by patient...",

        all_status:
            "All Statuses",

        scheduled:
            "Scheduled",

        confirmed:
            "Confirmed",

        cancelled:
            "Cancelled",

        new_appointment:
            "New Appointment",

        appointments_today:
            "Today's Appointments",

        day_schedule:
            "Today's Schedule",

        upcoming_appointments_kpi:
            "Upcoming Appointments",

        scheduled_upcoming:
            "Scheduled soon",

        completed_appointments:
            "Completed",

        completed_checkups:
            "Completed checkups",

        pending_appointments:
            "Pending",

        pending_followup:
            "Require follow-up",

        today_schedule_title:
            "Today's Schedule",

        today_schedule_text:
            "Appointments and checkups scheduled for today.",

        no_appointments_today:
            "No appointments scheduled for today.",

        today_appointments_text:
            "Today's appointments will appear here.",

        general_appointment_list:
            "General Appointment List",

        appointments_current_status:
            "View scheduled appointments and their current status.",

        appointment_type:
            "Type",

        professional:
            "Professional",

        upcoming_appointments_title:
            "Upcoming Appointments",

        upcoming_checkups:
            "Upcoming checkups scheduled for patients.",

        no_upcoming_appointments:
            "No upcoming appointments registered.",

        upcoming_appointments_text:
            "Upcoming appointments will appear here when scheduled.",

        schedule_new_appointment:
            "Schedule a new clinical checkup for a patient.",

        select_patient:
            "Select a patient",

        appointment_date:
            "Date",

        appointment_time:
            "Time",

        appointment_type_label:
            "Appointment Type",

        select_type:
            "Select a type",

        initial_assessment:
            "Initial Assessment",

        nutritional_control:
            "Nutritional Control",

        biometric_followup:
            "Biometric Follow-up",

        clinical_review:
            "Clinical Review",

        other:
            "Other",

        reason:
            "Reason",

        reason_placeholder:
            "E.g. Monthly follow-up checkup",

        notes:
            "Observations",

        appointment_notes_placeholder:
            "Additional information about the appointment...",

        reprogram_appointment:
            "Reschedule Appointment",

        cancel_appointment:
            "Cancel",

        reschedule:
            "Reschedule",

        confirm_cancel_appointment:
            "Cancel the appointment?",

        no_appointments_filters:
            "No appointments were found with the selected filters.",

        appointments_will_appear:
            "Appointments will appear here when scheduled.",

        save_appointment:
            "Save Appointment",


        /* MEDICAMENTOS */

        medications_title:
            "Medication Management",

        medications_subtitle:
            "View and manage medications registered in Nyvora.",

        medication_search:
            "Search medication, presentation or concentration...",

        registered_medications:
            "Registered Medications",

        active_medications:
            "Active Medications",

        available_currently:
            "Currently available",

        in_use:
            "In Use",

        medications_in_use:
            "In Use",

        associated_treatments:
            "Associated with treatments",

        inactive_medications:
            "Inactive",

        inactive_out_of_use:
            "Out of use",

        all_presentations:
            "All Presentations",

        tablets:
            "Tablets",

        capsules:
            "Capsules",

        syrup:
            "Syrup",

        suspension:
            "Suspension",

        solution:
            "Solution",

        injectable:
            "Injectable",

        cream:
            "Cream",

        register_medication:
            "Register Medication",

        medication_list:
            "Medication List",

        medications_currently_registered:
            "Medications currently registered in Nyvora.",

        medication:
            "Medication",

        presentation:
            "Presentation",

        concentration:
            "Concentration",

        concentration_placeholder:
            "E.g. 500 mg",

        reference_dose:
            "Reference Dose",

        reference_dose_label:
            "Reference Dose",

        associated_patients:
            "Associated Patients",

        no_medications:
            "No medications found.",

        no_medications_registered:
            "No medications registered",

        medications_will_appear:
            "Medications will appear here as they are registered.",

        medication_general_information:
            "Enter the medication's general information.",

        medication_information:
            "Medication Information",

        medication_identification:
            "Main identification information.",

        medication_name:
            "Medication Name",

        medication_name_placeholder:
            "E.g. Metformin",

        presentation_select:
            "Select a presentation",

        medication_usage_information:
            "Usage Information",

        medication_usage_description:
            "Reference information for follow-up.",

        dose:
            "Dose",

        dose_example:
            "E.g. 1 tablet",

        frequency:
            "Frequency",

        frequency_example:
            "E.g. Every 12 hours",

        undefined_frequency:
            "No frequency defined",

        deactivate_medication:
            "Deactivate",

        confirm_deactivate_medication:
            "Deactivate this medication?",

        edit_medication:
            "Edit Medication",

        medication_observations_placeholder:
            "Additional information about the medication...",

        save_medication:
            "Save Medication",


        /* TRATAMIENTOS */

        treatments_title:
            "Treatment Management",

        treatments_subtitle:
            "Management and monitoring of patients' clinical treatments.",

        treatment_search:
            "Search patient, medication or treatment...",

        new_treatment:
            "New Treatment",

        active_treatments:
            "Active Treatments",

        active_treatments_description:
            "Currently under follow-up",

        ending_soon:
            "Ending Soon",

        ending_soon_description:
            "During the next few days",

        completed_treatments:
            "Completed",

        completed_treatments_description:
            "Finished treatments",

        suspended_treatments:
            "Suspended",

        suspended_treatments_description:
            "Require follow-up",

        treatment:
            "Treatment",

        treatment_start:
            "Start",

        treatment_end:
            "End",

        start_date:
            "Start Date",

        end_date:
            "End Date",

        treatments_registered_description:
            "Treatments currently registered in Nyvora.",

        no_treatments:
            "No treatments registered.",

        no_treatments_found:
            "No treatments found.",

        new_treatment_description:
            "Register a clinical treatment for the patient.",

        patient_treatment_description:
            "Select the patient associated with the treatment.",

        search_patient_label:
            "Search patient",

        search_name_id:
            "Search by name or identification...",

        treatment_information:
            "Treatment Information",

        treatment_information_description:
            "Define the indicated clinical follow-up.",

        treatment_name:
            "Treatment Name",

        treatment_name_placeholder:
            "E.g. Metabolic control",

        search_medication:
            "Search medication...",

        dose_placeholder:
            "E.g. 500 mg",

        frequency_placeholder:
            "E.g. Every 12 hours",

        start_date_required:
            "Start Date",

        status_required:
            "Status",

        clinical_instructions:
            "Clinical Instructions",

        clinical_instructions_description:
            "Additional information for follow-up.",

        indications:
            "Instructions",

        indications_placeholder:
            "General treatment instructions...",

        observations_placeholder:
            "Additional follow-up information...",

        save_treatment:
            "Save Treatment",

        edit_treatment:
            "Edit Treatment",

        no_medication:
            "No medication",

        suspend_treatment:
            "Suspend treatment",

        suspend_question:
            "Suspend treatment?",

        open_treatment_record:
            "Open Record",


        /* MÉTRICAS */

        metrics_title:
            "Biometric Metrics",

        metrics_subtitle:
            "Record and consult patient biometric metrics.",

        historical_metrics:
            "Metrics History",

        metrics_history_description:
            "View and filter patient biometric records.",

        register_metrics:
            "Register Metrics",

        patient_label:
            "Patient",

        from:
            "From",

        to:
            "To",

        clear:
            "Clear",

        registered_measurements_kpi:
            "Registered Measurements",

        total_biometric_records:
            "Total biometric records",

        measured_patients:
            "Measured Patients",

        patients_with_records:
            "Patients with records",

        today_records:
            "Today's Records",

        measurements_today:
            "Measurements taken today",

        last_measurement:
            "Latest Measurement",

        latest_record:
            "Latest Record",

        biometric_records:
            "Biometric Records",

        measurement_history:
            "History of biometric measurements registered in Nyvora.",

        body_fat:
            "Body Fat",

        sleep_hours:
            "Sleep Hours",

        steps:
            "Steps",

        measurement_modal_title:
            "Register Metrics",

        measurement_modal_description:
            "Enter the patient's biometric measurements.",

        measurement_values_description:
            "Enter the values recorded during the checkup.",

        select_patient_measurement:
            "Select the patient associated with the measurement.",

        last_record:
            "Latest Record",

        select_patient_latest:
            "Select a patient to view their latest measurement.",

        no_patient_measurements:
            "This patient does not have any registered measurements yet.",

        measurement_registered:
            "Measurement registered",

        automatic:
            "Automatic",

        weight:
            "Weight",

        weight_kg:
            "Weight (kg)",

        weight_placeholder:
            "E.g. 72.5",

        bmi:
            "BMI",

        body_fat_placeholder:
            "E.g. 24.5",

        heart_rate:
            "Heart Rate",

        heart_rate_placeholder:
            "E.g. 75",

        sleep:
            "Sleep Hours",

        sleep_placeholder:
            "E.g. 7.5",

        steps_placeholder:
            "E.g. 8000",

        save_measurement:
            "Save Measurement",


        /* HISTORIAL */

        history_title:
            "Clinical History",

        history_subtitle:
            "View the patient's history and progress.",

        patient_history:
            "Patient History",

        history_query_description:
            "Select a patient and view their clinical information.",

        clinical_history:
            "Clinical History",

        patient_summary:
            "Patient Summary",

        patient_summary_description:
            "General information and current follow-up status.",

        evolution:
            "Biometric Progress",

        evolution_description:
            "Historical record of patient metrics and checkups.",

        clinical_notes:
            "Clinical Notes",

        clinical_notes_description:
            "Notes associated with the patient's follow-up.",

        recent_records:
            "Recent Records",

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

        no_records_period:
            "There are no records for this patient in the selected period.",

        no_notes:
            "No observations recorded.",

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


        /* ALERTAS */

        alerts_title:
            "Clinical Alerts",

        alerts_subtitle:
            "Monitor patients with clinical indicators that require attention or follow-up.",

        search_alert:
            "Search patient, alert type or condition...",

        search_patient_alert:
            "Search patient...",

        all_priorities:
            "All Priorities",

        all_status_alerts:
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

        registered_patient_ny:
            "Patient registered in Nyvora",

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


        /* CONFIGURACIÓN */

        settings_title:
            "Settings",

        settings_subtitle:
            "Manage your profile information and general platform preferences.",

        user_profile:
            "User Profile",

        role:
            "Role",

        join_date:
            "Join Date",

        system_preferences:
            "System Preferences",

        language:
            "Language",

        date_format:
            "Date Format",

        enable_notifications:
            "Enable notifications",

        save_changes:
            "Save Changes",

        system_information:
            "System Information",

        system_information_subtitle:
            "General information about the Nyvora platform.",

        system_name:
            "Nyvora",

        system_description:
            "Nyvora is a web platform developed for preventive monitoring and biometric follow-up of overweight patients.",

        version_label:
            "Version",

        university_label:
            "University",

        course_label:
            "Course",

        user_nyvora:
            "Nyvora User",

        user_load_error:
            "Unable to load user information.",

        settings_saved:
            "Settings saved successfully.",

        spanish:
            "Spanish",

        english:
            "English"
    }
};


function applyTranslations(root = document) {

    root
        .querySelectorAll("[data-lang]")
        .forEach((element) => {

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
        });


    root
        .querySelectorAll("[data-placeholder]")
        .forEach((element) => {

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
        });


    root
        .querySelectorAll("[data-title]")
        .forEach((element) => {

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
        });
}


function changeLanguage(language) {

    if (
        !translations[language]
    ) {

        return;
    }


    currentLanguage =
        language;


    localStorage.setItem(
        "nyvora-language",
        language
    );


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


function setLanguage(language) {

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


        document.documentElement.lang =
            currentLanguage;


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
                childList:
                    true,

                subtree:
                    true
            }
        );
    }
);