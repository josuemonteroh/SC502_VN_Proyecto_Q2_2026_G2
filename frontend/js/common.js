"use strict";

/* Fecha y hora */

function nyvoraUpdateClock() {
    const dateElement =
        document.getElementById("current-date");

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

    dateElement.innerHTML =
        `${date}<br>${time}`;
}

/* Verificar sesión */

async function nyvoraCheckSession() {
    try {
        const response = await fetch(
            "http://localhost:8081/session_user.php",
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            window.location.href =
                "../login.html";

            return null;
        }

        const result =
            await response.json();

        if (!result.success) {
            window.location.href =
                "../login.html";

            return null;
        }

        return result.data;

    } catch (error) {
        console.error(
            "No se pudo verificar la sesión:",
            error
        );

        window.location.href =
            "../login.html";

        return null;
    }
}

/* Cargar sidebar */

async function nyvoraLoadSidebar() {
    const container =
        document.getElementById(
            "sidebar-container"
        );

    if (!container) {
        return;
    }

    try {
        const response = await fetch(
            "../components/sidebar.html",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                "No se pudo cargar el sidebar."
            );
        }

        container.innerHTML =
            await response.text();

        const currentPage =
            window.location.pathname
                .split("/")
                .pop();

        const activeItem =
            container.querySelector(
                `[data-page="${currentPage}"]`
            );

        if (activeItem) {
            activeItem.classList.add("active");
        }

    } catch (error) {
        console.error(
            "Error cargando sidebar:",
            error
        );
    }
}

/* Usuario actual */

function nyvoraRenderCurrentUser(user) {
    if (!user) {
        return;
    }

    const nameElements =
        document.querySelectorAll(
            "[data-current-user-name]"
        );

    const roleElements =
        document.querySelectorAll(
            "[data-current-user-role]"
        );

    nameElements.forEach((element) => {
        element.textContent =
            user.fullName ||
            "Usuario Nyvora";
    });

    roleElements.forEach((element) => {
        element.textContent =
            user.role ||
            "Usuario";
    });
}

/* Inicialización */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await nyvoraLoadSidebar();

        const user =
            await nyvoraCheckSession();

        if (!user) {
            return;
        }

        nyvoraRenderCurrentUser(user);

        if (
            typeof nyvoraEnsureDemoData ===
            "function"
        ) {
            nyvoraEnsureDemoData();
        }

        nyvoraUpdateClock();

        setInterval(
            nyvoraUpdateClock,
            1000
        );
    }
);