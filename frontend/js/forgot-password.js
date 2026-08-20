"use strict";

/* Recuperar contraseña */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("forgot-password-form");
    const message = document.getElementById("recovery-message");
    const email = document.getElementById("email");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!email.value.trim()) {
            email.focus();
            return;
        }

        message.classList.add("show");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 3500);
    });
});