"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const API_SESSION =
        "http://localhost:8081/session_user.php";


    const inputNombre =
        document.getElementById(
            "profile-fullname"
        );

    const inputEmail =
        document.getElementById(
            "profile-email"
        );

    const inputRol =
        document.getElementById(
            "profile-role"
        );

    const inputFechaIngreso =
        document.getElementById(
            "profile-joindate"
        );

    const selectIdioma =
        document.getElementById(
            "config-language"
        );

    const selectFormato =
        document.getElementById(
            "config-dateformat"
        );

    const checkNotificaciones =
        document.getElementById(
            "config-notifications"
        );

    const btnGuardar =
        document.getElementById(
            "btn-guardar-config"
        );

    const userName =
        document.getElementById(
            "user-name"
        );


    const CONFIGURACION_KEYS = {

        idioma:
            "nyvora_config_language",

        formato:
            "nyvora_config_dateformat",

        notificaciones:
            "nyvora_config_notifications"
    };


    function traducir(
        clave,
        valorDefault = ""
    ) {

        if (
            typeof translations !== "undefined" &&
            typeof currentLanguage !== "undefined" &&
            translations[currentLanguage] &&
            translations[currentLanguage][clave] !== undefined
        ) {

            return translations[
                currentLanguage
            ][clave];
        }


        return valorDefault;
    }


    function formatearFecha(
        fecha
    ) {

        if (!fecha) {

            return traducir(
                "no_date",
                "Sin fecha"
            );
        }


        const fechaConvertida =
            new Date(
                String(
                    fecha
                ).replace(
                    " ",
                    "T"
                )
            );


        if (
            Number.isNaN(
                fechaConvertida.getTime()
            )
        ) {

            return traducir(
                "no_date",
                "Sin fecha"
            );
        }


        const idioma =
            currentLanguage === "en"
                ? "en-US"
                : "es-CR";


        const formato =
            localStorage.getItem(
                CONFIGURACION_KEYS.formato
            ) ||
            "DD/MM/YYYY";


        if (
            formato ===
            "YYYY-MM-DD"
        ) {

            return fechaConvertida
                .toISOString()
                .slice(
                    0,
                    10
                );
        }


        if (
            formato ===
            "MM/DD/YYYY"
        ) {

            return fechaConvertida.toLocaleDateString(
                "en-US",
                {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric"
                }
            );
        }


        return fechaConvertida.toLocaleDateString(
            idioma,
            {
                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric"
            }
        );
    }


    function cargarConfiguraciones() {

        const idiomaGuardado =
            localStorage.getItem(
                CONFIGURACION_KEYS.idioma
            );


        const formatoGuardado =
            localStorage.getItem(
                CONFIGURACION_KEYS.formato
            );


        const notificacionesGuardadas =
            localStorage.getItem(
                CONFIGURACION_KEYS.notificaciones
            );


        if (
            selectIdioma
        ) {

            selectIdioma.value =
                idiomaGuardado ||
                currentLanguage ||
                "es";
        }


        if (
            selectFormato
        ) {

            selectFormato.value =
                formatoGuardado ||
                "DD/MM/YYYY";
        }


        if (
            checkNotificaciones
        ) {

            checkNotificaciones.checked =
                notificacionesGuardadas !==
                "false";
        }
    }


    async function cargarPerfil() {

        try {

            const respuesta =
                await fetch(
                    API_SESSION,
                    {
                        method:
                            "GET",

                        credentials:
                            "include"
                    }
                );


            const datos =
                await respuesta.json();


            if (
                !respuesta.ok ||
                !datos.success
            ) {

                window.location.href =
                    "../login.html";

                return;
            }


            const usuario =
                datos.data;


            if (
                inputNombre
            ) {

                inputNombre.value =
                    usuario.fullName ||
                    "";
            }


            if (
                inputEmail
            ) {

                inputEmail.value =
                    usuario.email ||
                    "";
            }


            if (
                inputRol
            ) {

                inputRol.value =
                    usuario.role ||
                    "";
            }


            if (
                inputFechaIngreso
            ) {

                inputFechaIngreso.value =
                    formatearFecha(
                        usuario.createdAt
                    );
            }


            if (
                userName
            ) {

                userName.textContent =
                    usuario.fullName ||
                    traducir(
                        "user_nyvora",
                        "Usuario Nyvora"
                    );
            }


        } catch (error) {

            console.error(
                "Error cargando configuración:",
                error
            );


            alert(
                traducir(
                    "user_load_error",
                    "No fue posible cargar la información del usuario."
                )
            );


            window.location.href =
                "../login.html";
        }
    }


    function guardarConfiguraciones() {

        const idioma =
            selectIdioma?.value ||
            "es";


        const formato =
            selectFormato?.value ||
            "DD/MM/YYYY";


        const notificaciones =
            checkNotificaciones
                ? checkNotificaciones.checked
                : true;


        localStorage.setItem(
            CONFIGURACION_KEYS.idioma,
            idioma
        );


        localStorage.setItem(
            CONFIGURACION_KEYS.formato,
            formato
        );


        localStorage.setItem(
            CONFIGURACION_KEYS.notificaciones,
            String(
                notificaciones
            )
        );


        if (
            typeof setLanguage ===
            "function"
        ) {

            setLanguage(
                idioma
            );

        } else if (
            typeof changeLanguage ===
            "function"
        ) {

            changeLanguage(
                idioma
            );
        }


        if (
            inputFechaIngreso &&
            window.__nyvoraUserCreatedAt
        ) {

            inputFechaIngreso.value =
                formatearFecha(
                    window.__nyvoraUserCreatedAt
                );
        }


        alert(
            traducir(
                "settings_saved",
                "Configuración guardada correctamente."
            )
        );
    }


    selectIdioma?.addEventListener(
        "change",
        () => {

            const idioma =
                selectIdioma.value;


            if (
                typeof setLanguage ===
                "function"
            ) {

                setLanguage(
                    idioma
                );
            }
        }
    );


    btnGuardar?.addEventListener(
        "click",
        guardarConfiguraciones
    );


    document.addEventListener(
        "languageChanged",
        () => {

            cargarConfiguraciones();


            if (
                window.__nyvoraUserCreatedAt &&
                inputFechaIngreso
            ) {

                inputFechaIngreso.value =
                    formatearFecha(
                        window.__nyvoraUserCreatedAt
                    );
            }
        }
    );


    const cargarTodo =
        async () => {

            await cargarPerfil();


            if (
                inputFechaIngreso
            ) {

                window.__nyvoraUserCreatedAt =
                    null;
            }


            cargarConfiguraciones();
        };


    cargarTodo();

});