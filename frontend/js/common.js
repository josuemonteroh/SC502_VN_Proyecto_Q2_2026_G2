"use strict";

/* Fecha y hora */

function nyvoraUpdateClock() {
    const dateElement = document.getElementById("current-date");

    if (!dateElement) {
        return;
    }

    const now = new Date();

    const date = now.toLocaleDateString("es-CR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const time = now.toLocaleTimeString("es-CR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    dateElement.innerHTML = `${date}<br>${time}`;
}

/* Cerrar sesión */

function nyvoraConfigureLogout() {
    const logoutLink = [...document.querySelectorAll("a")].find((link) =>
        link.textContent.includes("Cerrar Sesión")
    );

    if (!logoutLink) {
        return;
    }

    logoutLink.addEventListener("click", () => {
        sessionStorage.removeItem("nyvora_current_user");
    });
}

/* Inicialización */

document.addEventListener("DOMContentLoaded", () => {
    nyvoraEnsureDemoData();
    nyvoraUpdateClock();

    setInterval(nyvoraUpdateClock, 1000);

    nyvoraConfigureLogout();
});