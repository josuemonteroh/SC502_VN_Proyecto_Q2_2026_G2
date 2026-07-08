"use strict";

/*

    Fecha y hora
    Corrección de enlaces vacíos.
    Cierre de sesión visual
*/

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


function nyvoraFixNavigationLinks() {
    const navigation = [
        {
            icon: "fa-folder-open",
            page: "historial.html"
        },
        {
            icon: "fa-triangle-exclamation",
            page: "alertas.html"
        }
    ];

    navigation.forEach(item => {
        const icon = document.querySelector(`.${item.icon}`);

        if (!icon) {
            return;
        }

        const link = icon.closest("a");

        if (link && link.getAttribute("href") === "#") {
            link.setAttribute("href", item.page);
        }
    });
}


function nyvoraConfigureLogout() {
    const links = [...document.querySelectorAll("a")];

    const logoutLink = links.find(link => {
        return link.textContent.includes("Cerrar Sesión");
    });

    if (!logoutLink) {
        return;
    }

    logoutLink.addEventListener("click", () => {
        sessionStorage.removeItem("nyvora_current_user");
    });
}


document.addEventListener("DOMContentLoaded", () => {
    nyvoraEnsureDemoData();

    nyvoraUpdateClock();

    setInterval(nyvoraUpdateClock, 1000);

    nyvoraFixNavigationLinks();

    nyvoraConfigureLogout();
});