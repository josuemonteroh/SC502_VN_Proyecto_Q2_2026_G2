"use strict";

/* Fecha y hora */

function nyvoraUpdateClock() {

    const dateElement =
        document.getElementById("current-date");

    if (!dateElement) {
        return;
    }

    const now =
        new Date();

    const idioma =
        typeof currentLanguage !== "undefined" &&
        currentLanguage === "en"
            ? "en-US"
            : "es-CR";

    const date =
        now.toLocaleDateString(
            idioma,
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    const time =
        now.toLocaleTimeString(
            idioma,
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    dateElement.innerHTML =
        `${date}<br>${time}`;
}


/* Verificar sesión */

async function nyvoraCheckSession() {

    try {

        const response =
            await fetch(
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


/* Sidebar */

function nyvoraLoadSidebar() {

    const container =
        document.getElementById(
            "sidebar-container"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `

        <aside class="sidebar">

            <div class="logo">

                <img
                    src="../assets/logonyvora.png"
                    alt="Nyvora">

            </div>


            <nav class="sidebar-nav">

                <ul>


                    <li>

                        <a
                            href="dashboard.html"
                            data-page="dashboard.html">

                            <i class="fa-solid fa-chart-line"></i>

                            <span data-lang="dashboard">
                                Dashboard
                            </span>

                        </a>

                    </li>


                    <li>

                        <a
                            href="pacientes.html"
                            data-page="pacientes.html">

                            <i class="fa-solid fa-users"></i>

                            <span data-lang="patients">
                                Pacientes
                            </span>

                        </a>

                    </li>


                    <li>

                        <a
                            href="citas.html"
                            data-page="citas.html">

                            <i class="fa-solid fa-calendar-check"></i>

                            <span data-lang="appointments">
                                Citas
                            </span>

                        </a>

                    </li>


                    <li>

                        <a
                            href="historial.html"
                            data-page="historial.html">

                            <i class="fa-solid fa-folder-open"></i>

                            <span data-lang="history">
                                Historial
                            </span>

                        </a>

                    </li>


                    <li>

                        <a
                            href="medicamentos.html"
                            data-page="medicamentos.html">

                            <i class="fa-solid fa-pills"></i>

                            <span data-lang="medications">
                                Medicamentos
                            </span>

                        </a>

                    </li>


                    <li>

                        <a
                            href="tratamientos.html"
                            data-page="tratamientos.html">

                            <i class="fa-solid fa-briefcase-medical"></i>

                            <span data-lang="treatments">
                                Tratamientos
                            </span>

                        </a>

                    </li>


                    <li>

                        <a
                            href="alertas.html"
                            data-page="alertas.html">

                            <i class="fa-solid fa-triangle-exclamation"></i>

                            <span data-lang="alerts">
                                Alertas
                            </span>

                        </a>

                    </li>


                    <li>

                        <a
                            href="metricas.html"
                            data-page="metricas.html">

                            <i class="fa-solid fa-weight-scale"></i>

                            <span data-lang="metrics">
                                Métricas
                            </span>

                        </a>

                    </li>


                    <li>

                        <a
                            href="configuracion.html"
                            data-page="configuracion.html">

                            <i class="fa-solid fa-gear"></i>

                            <span data-lang="settings">
                                Configuración
                            </span>

                        </a>

                    </li>


                </ul>

            </nav>

            <div class="sidebar-footer">

                <a href="http://localhost:8081/logout.php">

                    <i class="fa-solid fa-right-from-bracket"></i>

                    <span data-lang="logout">
                        Cerrar Sesión
                    </span>

                </a>

            </div>

        </aside>
    `;


    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const activeItem =
        container.querySelector(
            `[data-page="${currentPage}"]`
        );


    if (activeItem) {

        activeItem.parentElement.classList.add(
            "active"
        );
    }


    if (
        typeof applyTranslations ===
        "function"
    ) {

        applyTranslations(
            container
        );
    }
}


/* Usuario actual */

function nyvoraRenderCurrentUser(
    user
) {

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


    nameElements.forEach(
        (element) => {

            element.textContent =
                user.fullName ||
                "Usuario Nyvora";
        }
    );


    roleElements.forEach(
        (element) => {

            element.textContent =
                user.role ||
                "Usuario";
        }
    );
}


/* Inicialización */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        nyvoraLoadSidebar();


        const user =
            await nyvoraCheckSession();


        if (!user) {
            return;
        }


        nyvoraRenderCurrentUser(
            user
        );


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


/* Actualizar sidebar y reloj al cambiar idioma */

document.addEventListener(
    "languageChanged",
    () => {

        nyvoraLoadSidebar();

        nyvoraUpdateClock();
    }
);