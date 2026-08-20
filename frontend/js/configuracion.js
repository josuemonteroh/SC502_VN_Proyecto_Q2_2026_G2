"use strict";

/* Configuración */

document.addEventListener("DOMContentLoaded", () => {
    /* API */

    const API_SESSION = "http://localhost:8081/session_user.php";

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

    /* Claves de configuración */

    const CONFIGURACION_KEYS = {
        idioma: "nyvora_config_language",
        formato: "nyvora_config_dateformat",
        notificaciones: "nyvora_config_notifications"
    };

    /* Formatear fecha */

    function formatearFecha(fecha) {
        if (!fecha) {
            return "Sin fecha";
        }

        const fechaConvertida = new Date(fecha.replace(" ", "T"));

        if (Number.isNaN(fechaConvertida.getTime())) {
            return "Sin fecha";
        }

        return fechaConvertida.toLocaleDateString("es-CR", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    /* Cargar configuraciones */

    function cargarConfiguraciones() {
        const idioma = localStorage.getItem(CONFIGURACION_KEYS.idioma) || "es-CR";
        const formato = localStorage.getItem(CONFIGURACION_KEYS.formato) || "DD/MM/YYYY";
        const notificaciones = localStorage.getItem(CONFIGURACION_KEYS.notificaciones) !== "false";

        if (selectIdioma) {
            selectIdioma.value = idioma;
        }

        if (selectFormato) {
            selectFormato.value = formato;
        }

        if (checkNotificaciones) {
            checkNotificaciones.checked = notificaciones;
        }
    }

    /* Cargar perfil */

    async function cargarPerfil() {
        try {
            const respuesta = await fetch(API_SESSION, {
                method: "GET",
                credentials: "include"
            });

            const datos = await respuesta.json();

            if (!respuesta.ok || !datos.success) {
                window.location.href = "../login.html";
                return;
            }

            const usuario = datos.data;

            if (inputNombre) {
                inputNombre.value = usuario.fullName || "";
            }

            if (inputEmail) {
                inputEmail.value = usuario.email || "";
            }

            if (inputRol) {
                inputRol.value = usuario.role || "";
            }

            if (inputFechaIngreso) {
                inputFechaIngreso.value = formatearFecha(usuario.createdAt);
            }

            if (userName) {
                userName.textContent = usuario.fullName || "Usuario";
            }

        } catch (error) {
            console.error("Error cargando configuración:", error);
            alert("No fue posible cargar la información del usuario.");
            window.location.href = "../login.html";
        }
    }

    /* Guardar configuraciones */

    function guardarConfiguraciones() {
        localStorage.setItem(
            CONFIGURACION_KEYS.idioma,
            selectIdioma.value
        );

        localStorage.setItem(
            CONFIGURACION_KEYS.formato,
            selectFormato.value
        );

        localStorage.setItem(
            CONFIGURACION_KEYS.notificaciones,
            checkNotificaciones.checked
        );

        alert("Configuración guardada correctamente.");
    }

    /* Eventos */

    btnGuardar?.addEventListener("click", guardarConfiguraciones);

    /* Inicialización */

    cargarPerfil();
    cargarConfiguraciones();
});