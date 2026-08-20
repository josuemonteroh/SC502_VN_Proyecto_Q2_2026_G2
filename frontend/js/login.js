"use strict";

/* Login */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const email = document.getElementById("email");
    const remember = document.querySelector("input[name='remember']");
    const requestAccessLink = document.getElementById("request-access-link");

    /* Recordar correo */

    const rememberedEmail = localStorage.getItem("nyvora_remember_email");

    if (rememberedEmail) {
        email.value = rememberedEmail;
        remember.checked = true;
    }

    /* Guardar correo */

    form.addEventListener("submit", () => {
        const user = email.value.trim();

        if (remember.checked && user) {
            localStorage.setItem("nyvora_remember_email", user);
        } else {
            localStorage.removeItem("nyvora_remember_email");
        }
    });

    /* Solicitar acceso */

    requestAccessLink?.addEventListener("click", (e) => {
        e.preventDefault();

        const language = currentLanguage || "es";

        alert(
            `${translations[language].request_access_title}\n\n` +
            translations[language].request_access_message
        );
    });
});