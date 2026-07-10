"use strict";

/* Configuración */

document.addEventListener("DOMContentLoaded", () => {

    /* Elementos del DOM */

    const inputNombre = document.getElementById("profile-fullname");
    const inputEmail = document.getElementById("profile-email");
    const inputRol = document.getElementById("profile-role");
    const inputFechaIngreso = document.getElementById("profile-joindate");
    const selectIdioma = document.getElementById("config-language");
    const selectFormato = document.getElementById("config-dateformat");
    const checkNotificaciones = document.getElementById("config-notifications");
    const btnGuardar = document.getElementById("btn-guardar-config");
    const userName = document.getElementById("user-name");

    /* Cargar configuraciones desde localStorage */

    const CONFIGURACION_KEYS = {
        idioma: "nyvora_config_language",
        formato: "nyvora_config_dateformat",
        notificaciones: "nyvora_config_notifications"
    };

    function cargarConfiguraciones() {

        const idioma = localStorage.getItem(CONFIGURACION_KEYS.idioma) || "es-CR";
        const formato = localStorage.getItem(CONFIGURACION_KEYS.formato) || "DD/MM/YYYY";
        const notificaciones = localStorage.getItem(CONFIGURACION_KEYS.notificaciones) !== "false";

        selectIdioma.value = idioma;
        selectFormato.value = formato;
        checkNotificaciones.checked = notificaciones;

    }

    /* Cargar datos del usuario */

    function cargarPerfil() {

        const usuario = sessionStorage.getItem("nyvora_current_user");

        if (usuario) {

            const datos = JSON.parse(usuario);
            inputNombre.value = datos.name || "Dr. Usuario";
            inputEmail.value = datos.email || "usuario@nyvora.com";
            inputRol.value = datos.role || "Doctor";
            userName.textContent = datos.name || "Dr. Usuario";

            const fechaLogin = new Date(datos.loginDate);
            inputFechaIngreso.value = nyvoraFormatDate(fechaLogin);

        } else {

            inputNombre.value = "Dr. Usuario";
            inputEmail.value = "usuario@nyvora.com";
            inputRol.value = "Doctor";
            inputFechaIngreso.value = nyvoraFormatDate(new Date());

        }

    }

    /* Guardar configuraciones */

    function guardarConfiguraciones() {

        localStorage.setItem(CONFIGURACION_KEYS.idioma, selectIdioma.value);
        localStorage.setItem(CONFIGURACION_KEYS.formato, selectFormato.value);
        localStorage.setItem(CONFIGURACION_KEYS.notificaciones, checkNotificaciones.checked);

        alert("✓ Configuraciones guardadas correctamente.");

    }

    /* Event listeners */

    if (btnGuardar) {

        btnGuardar.addEventListener("click", guardarConfiguraciones);

    }

    /* Cargar datos al iniciar */

    cargarPerfil();
    cargarConfiguraciones();

});
