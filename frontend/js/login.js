"use strict";

/* Login */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("login-form");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const remember = document.querySelector("input[name='remember']");

    const USER = "administrador@nyvora.com";
    const PASSWORD = "Grupo2";

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const user = email.value.trim();
        const pass = password.value.trim();

        if (!user) {
            alert("Ingrese el correo electrónico.");
            email.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(user)) {
            alert("Ingrese un correo electrónico válido.");
            email.focus();
            return;
        }

        if (!pass) {
            alert("Ingrese la contraseña.");
            password.focus();
            return;
        }

        if (user !== USER || pass !== PASSWORD) {
            alert("Correo o contraseña incorrectos.");
            password.value = "";
            password.focus();
            return;
        }

        const session = {
            name: "Administrador",
            email: user,
            role: "Administrador",
            loginDate: new Date().toISOString()
        };

        sessionStorage.setItem(
            "nyvora_current_user",
            JSON.stringify(session)
        );

        if (remember.checked) {
            localStorage.setItem(
                "nyvora_remember_email",
                user
            );
        } else {
            localStorage.removeItem(
                "nyvora_remember_email"
            );
        }

        window.location.href = "pages/dashboard.html";

    });

    /* Recordar correo */

    const rememberedEmail = localStorage.getItem(
        "nyvora_remember_email"
    );

    if (rememberedEmail) {

        email.value = rememberedEmail;

        remember.checked = true;

    }

});