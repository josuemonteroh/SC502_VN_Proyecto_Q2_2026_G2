document.addEventListener("DOMContentLoaded", () => {

    // Controles de la barra de acciones
    const inputBuscar = document.querySelector(".panel .search-box[type='text']");
    const selectEstado = document.querySelectorAll(".panel select.search-box")[0];
    const selectOrden = document.querySelectorAll(".panel select.search-box")[1];

    // Tabla de pacientes
    const tabla = document.querySelectorAll(".panel table")[0];
    const tbody = tabla.querySelector("tbody");
    const filas = Array.from(tbody.querySelectorAll("tr"));

    function normalizar(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    // --- Filtrado por nombre y estado ---
    function filtrarPacientes() {
        const busqueda = normalizar(inputBuscar.value);
        const estado = normalizar(selectEstado.value);
        const estadoEsTodos = estado === "" || estado === "estado";

        let visibles = 0;

        filas.forEach((fila) => {
            const celdas = fila.querySelectorAll("td");
            const nombre = normalizar(celdas[0].textContent);
            const estadoFila = normalizar(celdas[4].textContent);

            const coincideNombre = nombre.includes(busqueda);
            const coincideEstado = estadoEsTodos || estadoFila === estado;

            const mostrar = coincideNombre && coincideEstado;
            fila.style.display = mostrar ? "" : "none";

            if (mostrar) visibles++;
        });

        mostrarMensajeSinResultados(visibles);
    }

    function mostrarMensajeSinResultados(visibles) {
        let mensaje = tabla.parentElement.querySelector(".sin-resultados");

        if (visibles === 0) {
            if (!mensaje) {
                mensaje = document.createElement("p");
                mensaje.className = "sin-resultados";
                mensaje.textContent = "No se encontraron pacientes con los filtros seleccionados.";
                mensaje.style.textAlign = "center";
                mensaje.style.padding = "1rem";
                mensaje.style.color = "#888";
                tabla.insertAdjacentElement("afterend", mensaje);
            }
            mensaje.style.display = "block";
        } else if (mensaje) {
            mensaje.style.display = "none";
        }
    }

    // --- Orden ---
    function ordenarPacientes() {
        const criterio = normalizar(selectOrden.value);

        const filasOrdenables = filas.slice();

        if (criterio === "nombre") {
            filasOrdenables.sort((a, b) =>
                normalizar(a.querySelectorAll("td")[0].textContent)
                    .localeCompare(normalizar(b.querySelectorAll("td")[0].textContent))
            );
        } else if (criterio === "edad") {
            filasOrdenables.sort((a, b) =>
                parseInt(a.querySelectorAll("td")[1].textContent) -
                parseInt(b.querySelectorAll("td")[1].textContent)
            );
        } else if (criterio === "ultimo control") {
            // Orden simple basado en el texto 
            const prioridad = { "hoy": 0, "ayer": 1 };
            filasOrdenables.sort((a, b) => {
                const textoA = normalizar(a.querySelectorAll("td")[3].textContent);
                const textoB = normalizar(b.querySelectorAll("td")[3].textContent);
                const valorA = prioridad[textoA] ?? 2;
                const valorB = prioridad[textoB] ?? 2;
                return valorA - valorB;
            });
        } else {
            return; // Ordenar
        }

        filasOrdenables.forEach((fila) => tbody.appendChild(fila));
    }

    // --- Redirección al perfil del paciente ---
    function irAlPerfil(nombrePaciente) {
        const nombreCodificado = encodeURIComponent(nombrePaciente.trim());
        window.location.href = `perfil.html?paciente=${nombreCodificado}`;
    }

    filas.forEach((fila) => {
        const link = fila.querySelector(".action-link");
        const nombre = fila.querySelectorAll("td")[0].textContent;

        if (link) {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                irAlPerfil(nombre);
            });
        }
    });

    // Eventos de filtro y orden
    inputBuscar.addEventListener("input", filtrarPacientes);
    selectEstado.addEventListener("change", filtrarPacientes);
    selectOrden.addEventListener("change", ordenarPacientes);

});


