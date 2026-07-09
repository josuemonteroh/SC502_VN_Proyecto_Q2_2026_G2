document.addEventListener("DOMContentLoaded", () => {

    // Referencias a los controles del panel de filtros
    const inputPaciente = document.getElementById("buscarPaciente");
    const selectPrioridad = document.getElementById("prioridad");
    const selectEstado = document.getElementById("estado");
    const btnBuscar = document.querySelector(".btn-primary");

    // Tabla de alertas
    const tabla = document.querySelectorAll(".panel table")[0];
    const filas = Array.from(tabla.querySelectorAll("tbody tr"));

    function normalizar(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function filtrarAlertas() {
        const paciente = normalizar(inputPaciente.value);
        const prioridad = normalizar(selectPrioridad.value);
        const estado = normalizar(selectEstado.value);

        let visibles = 0;

        filas.forEach((fila) => {
            const celdas = fila.querySelectorAll("td");

            const nombrePaciente = normalizar(celdas[0].textContent);
            const prioridadFila = normalizar(celdas[2].textContent);
            const estadoFila = normalizar(celdas[4].textContent);

            const coincidePaciente = nombrePaciente.includes(paciente);
            const coincidePrioridad = prioridad === "" || prioridadFila === prioridad;
            const coincideEstado = estado === "" || estadoFila === estado;

            const mostrar = coincidePaciente && coincidePrioridad && coincideEstado;

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
                mensaje.textContent = "No se encontraron alertas con los filtros seleccionados.";
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

    // filtrado en vivo
    btnBuscar.addEventListener("click", (e) => {
        e.preventDefault();
        filtrarAlertas();
    });

    inputPaciente.addEventListener("input", filtrarAlertas);
    selectPrioridad.addEventListener("change", filtrarAlertas);
    selectEstado.addEventListener("change", filtrarAlertas);

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

});