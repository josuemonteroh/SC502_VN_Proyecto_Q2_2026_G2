// FORMULARIO DE REGISTRO
const formMetricas = document.getElementById('form-metricas');

formMetricas.addEventListener('submit', function (e) {
    e.preventDefault();

    const datos = {
        fecha: new Date().toISOString().split('T')[0],
        paciente: document.getElementById('paciente').value,
        peso: document.getElementById('peso').value,
        imc: document.getElementById('imc').value,
        grasa: document.getElementById('grasa').value,
        fc: document.getElementById('fc').value,
        sueno: document.getElementById('sueno').value,
        pasos: document.getElementById('pasos').value
    };

    console.log("Métricas registradas:", datos);

    alert("Métricas registradas correctamente.");

    formMetricas.reset();
});


// TABLA HISTÓRICO
const tablaMetricas = document.getElementById('tabla-metricas');

// Datos de prueba
const datosPrueba = [
    { fecha: '2026-07-02', paciente: 'María Gómez', peso: 65, imc: 23.4, grasa: 28, fc: 72, sueno: 7.5, pasos: 8500 },
    { fecha: '2026-07-01', paciente: 'Carlos Vargas', peso: 82, imc: 27.1, grasa: 32, fc: 78, sueno: 6.0, pasos: 6000 },
    { fecha: '2026-06-30', paciente: 'Ana Rodríguez', peso: 59, imc: 22.8, grasa: 26, fc: 70, sueno: 8.0, pasos: 9000 }
];

function renderMetricas(lista) {
    tablaMetricas.innerHTML = '';

    lista.forEach(m => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${m.fecha}</td>
            <td>${m.paciente}</td>
            <td>${m.peso}</td>
            <td>${m.imc}</td>
            <td>${m.grasa}</td>
            <td>${m.fc}</td>
            <td>${m.sueno}</td>
            <td>${m.pasos}</td>
        `;
        tablaMetricas.appendChild(fila);
    });
}

renderMetricas(datosPrueba);


// FILTRO POR FECHA
document.getElementById('btn-filtrar').addEventListener('click', () => {
    const desde = document.getElementById('fecha-desde').value;
    const hasta = document.getElementById('fecha-hasta').value;

    let filtrados = datosPrueba;

    if (desde) {
        filtrados = filtrados.filter(m => m.fecha >= desde);
    }

    if (hasta) {
        filtrados = filtrados.filter(m => m.fecha <= hasta);
    }

    renderMetricas(filtrados);
});


// Alturas de ejemplo (luego vendrán del backend)
const alturasPacientes = {
    "María Gómez": 1.65,
    "Carlos Vargas": 1.78,
    "Ana Rodríguez": 1.62,
    "Laura Méndez": 1.70
};

// Calcular IMC
document.getElementById('peso').addEventListener('input', calcularIMC);
document.getElementById('paciente').addEventListener('change', calcularIMC);

function calcularIMC() {
    const paciente = document.getElementById('paciente').value;
    const peso = parseFloat(document.getElementById('peso').value);

    if (!paciente || !peso || !alturasPacientes[paciente]) {
        document.getElementById('imc').value = "";
        return;
    }

    const altura = alturasPacientes[paciente];
    const imc = peso / (altura * altura);

    document.getElementById('imc').value = imc.toFixed(1);
}
