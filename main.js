// main.js

document.addEventListener("DOMContentLoaded", () => {
    initCharts();
    initMap();
    initPeopleIcons();
    calcularPrediccionInicial();
});

// Función para manejar las Pestañas (Tabs)
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Variables Globales para Gráficas
let chartHistorico, chartExponencial, chartPrediccion, chartSimulador;

// Colores Tema Oscuro Neon
const colorPrimarioLine = '#c127b9'; // Magenta
const colorPrimarioBg = 'rgba(193, 39, 185, 0.6)';
const colorAcentoLine = '#00e5ff'; // Cyan
const colorAcentoBg = 'rgba(0, 229, 255, 0.2)';
const colorTerceroLine = '#ffb703'; // Yellow/Orange
const colorTerceroBg = 'rgba(255, 183, 3, 0.4)';
const textGlobalColor = '#e2e8f0';

Chart.defaults.color = textGlobalColor;
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

// Datos Históricos de Puebla
const historico_puebla = [
    {"anio": 1990, "poblacion": 4118059},
    {"anio": 2000, "poblacion": 5076686},
    {"anio": 2010, "poblacion": 5779829},
    {"anio": 2020, "poblacion": 6583278}
];

// Función de Cálculo Exponencial Local
function calcularPrediccionJS(poblacion_inicial, tasa_crecimiento, anios) {
    let r = parseFloat(tasa_crecimiento);
    if (r >= 1) r = r / 100.0;
    
    let P0 = parseFloat(poblacion_inicial);
    let t = parseInt(anios);
    let anio_base = 2020;
    
    let resultados = [];
    
    for (let anio_offset = 0; anio_offset <= t; anio_offset++) {
        let anio_actual = anio_base + anio_offset;
        let P_t = P0 * Math.exp(r * anio_offset);
        resultados.push({
            anio: anio_actual,
            poblacion: Math.round(P_t)
        });
    }
    
    return {
        prediccion_final: resultados[resultados.length - 1].poblacion,
        serie_temporal: resultados
    };
}

async function initCharts() {
    try {
        const dataHist = historico_puebla;
        
        const labelsHist = dataHist.map(d => d.anio);
        const dataValuesHist = dataHist.map(d => d.poblacion);

        // 1. Gráfica Histórica (Capítulo 1)
        const ctxHist = document.getElementById('chartHistorico').getContext('2d');
        chartHistorico = new Chart(ctxHist, {
            type: 'bar',
            data: {
                labels: labelsHist,
                datasets: [{
                    label: 'Población Histórica',
                    data: dataValuesHist,
                    backgroundColor: colorPrimarioBg,
                    borderColor: colorPrimarioLine,
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: { responsive: true, scales: { y: { beginAtZero: false } } }
        });

        // 2. Gráfica Exponencial (Capítulo 2) - Mostramos la curva suave
        const ctxExp = document.getElementById('chartExponencial').getContext('2d');
        chartExponencial = new Chart(ctxExp, {
            type: 'line',
            data: {
                labels: labelsHist,
                datasets: [{
                    label: 'Tendencia Exponencial',
                    data: dataValuesHist,
                    borderColor: colorAcentoLine,
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4, // Curva suave
                    pointBackgroundColor: colorAcentoLine
                }]
            },
            options: { responsive: true }
        });

        // 3. Gráfica Predicción (Capítulo 3)
        const dataPred = calcularPrediccionJS(6583278, 1.4, 20);
        
        const labelsPred = dataPred.serie_temporal.map(d => d.anio);
        const valuesPred = dataPred.serie_temporal.map(d => d.poblacion);

        const ctxPred = document.getElementById('chartPrediccion').getContext('2d');
        chartPrediccion = new Chart(ctxPred, {
            type: 'line',
            data: {
                labels: labelsPred,
                datasets: [{
                    label: 'Proyección Futura',
                    data: valuesPred,
                    borderColor: colorTerceroLine, // Naranja/Amarillo
                    backgroundColor: colorTerceroBg,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { responsive: true }
        });

    } catch (error) {
        console.error("Error al cargar gráficas:", error);
    }
}

// Inicializar Mapa con Leaflet
function initMap() {
    // Coordenadas de Puebla de Zaragoza
    const pueblaCoords = [19.0414, -98.2063];
    
    const map = L.map('map').setView(pueblaCoords, 10);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Marcador principal
    const marker = L.marker(pueblaCoords).addTo(map);
    marker.bindPopup("<b>Ciudad de Puebla</b><br>Concentra la mayor densidad poblacional del estado.").openPopup();

    // Circulo representando densidad (ejemplo visual)
    L.circle(pueblaCoords, {
        color: colorPrimarioLine,
        fillColor: colorPrimarioLine,
        fillOpacity: 0.2,
        radius: 15000
    }).addTo(map);
}

// Animación de Iconos de Personas (Capítulo 4)
function initPeopleIcons() {
    const container = document.getElementById('people-container');
    const numPeople = 50;
    
    for (let i = 0; i < numPeople; i++) {
        setTimeout(() => {
            const person = document.createElement('span');
            person.className = 'person-icon';
            person.innerHTML = '👤';
            // Colores aleatorios para representar diversidad
            const colors = [colorPrimarioLine, colorAcentoLine, colorTerceroLine, '#10b981', '#ef4444'];
            person.style.color = colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(person);
        }, i * 100); // Aparecen gradualmente
    }
}

// Lógica del Simulador
async function calcularSimulacion() {
    const p0 = document.getElementById('sim-p0').value;
    const r = document.getElementById('sim-r').value;
    const t = document.getElementById('sim-t').value;

    try {
        const data = calcularPrediccionJS(p0, r, t);

        // Actualizar UI
        const formatoNumero = new Intl.NumberFormat('es-MX').format(data.prediccion_final);
        document.getElementById('sim-resultado').innerText = formatoNumero + " hab.";

        // Actualizar gráfica del simulador
        const labels = data.serie_temporal.map(d => d.anio);
        const values = data.serie_temporal.map(d => d.poblacion);

        if (chartSimulador) {
            chartSimulador.destroy();
        }

        const ctxSim = document.getElementById('chartSimulador').getContext('2d');
        chartSimulador = new Chart(ctxSim, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Simulación',
                    data: values,
                    borderColor: colorPrimarioLine,
                    backgroundColor: colorPrimarioBg,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: { responsive: true }
        });

    } catch (error) {
        console.error("Error en simulación:", error);
    }
}

// Para llenar el KPI del Header en la carga inicial
async function calcularPrediccionInicial() {
    try {
        const data = calcularPrediccionJS(6583278, 1.4, 10);
        const formatoNumero = new Intl.NumberFormat('es-MX').format(data.prediccion_final);
        document.getElementById('kpi-prediccion').innerText = formatoNumero;
    } catch (error) {
        console.error(error);
    }
}
