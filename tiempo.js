const CODIGOS_TIEMPO = {
    0:  { desc: 'Cielo despejado',     icono: '☀️' },
    1:  { desc: 'Mayormente despejado', icono: '🌤️' },
    2:  { desc: 'Parcialmente nublado', icono: '⛅' },
    3:  { desc: 'Nublado',             icono: '☁️' },
    45: { desc: 'Niebla',              icono: '🌫️' },
    48: { desc: 'Niebla con escarcha', icono: '🌫️' },
    51: { desc: 'Llovizna ligera',     icono: '🌦️' },
    53: { desc: 'Llovizna moderada',   icono: '🌦️' },
    55: { desc: 'Llovizna intensa',    icono: '🌧️' },
    61: { desc: 'Lluvia ligera',       icono: '🌧️' },
    63: { desc: 'Lluvia moderada',     icono: '🌧️' },
    65: { desc: 'Lluvia intensa',      icono: '🌧️' },
    71: { desc: 'Nieve ligera',        icono: '🌨️' },
    73: { desc: 'Nieve moderada',      icono: '🌨️' },
    75: { desc: 'Nieve intensa',       icono: '❄️' },
    80: { desc: 'Chubascos ligeros',   icono: '🌦️' },
    81: { desc: 'Chubascos moderados', icono: '🌧️' },
    82: { desc: 'Chubascos fuertes',   icono: '⛈️' },
    95: { desc: 'Tormenta',            icono: '⛈️' },
    99: { desc: 'Tormenta con granizo',icono: '⛈️' },
};

async function buscarCiudad(nombre) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nombre)}&count=1&language=es&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.results || data.results.length === 0) throw new Error('Ciudad no encontrada');
    return data.results[0];
}

async function obtenerTiempo(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m`;
    const res = await fetch(url);
    return await res.json();
}

function mostrarTiempo(ciudad, datos) {
    const current = datos.current;
    const codigo = current.weathercode;
    const info = CODIGOS_TIEMPO[codigo] || { desc: 'Desconocido', icono: '❓' };

    document.getElementById('ciudadNombre').textContent = `${ciudad.name}, ${ciudad.country}`;
    document.getElementById('tiempoIcono').textContent = info.icono;
    document.getElementById('tiempoDesc').textContent = info.desc;
    document.getElementById('temperatura').textContent = `${current.temperature_2m}°C`;
    document.getElementById('humedad').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('viento').textContent = `${current.windspeed_10m} km/h`;

    document.getElementById('resultadoTiempo').classList.remove('oculto');
}

document.getElementById('btnBuscar').addEventListener('click', buscar);
document.getElementById('inputCiudad').addEventListener('keydown', e => {
    if (e.key === 'Enter') buscar();
});

async function buscar() {
    const nombre = document.getElementById('inputCiudad').value.trim();
    const errorEl = document.getElementById('errorCiudad');
    const cargando = document.getElementById('cargando');

    errorEl.textContent = '';
    document.getElementById('resultadoTiempo').classList.add('oculto');

    if (!nombre) {
        errorEl.textContent = 'Escribe el nombre de una ciudad.';
        return;
    }

    cargando.classList.remove('oculto');
    try {
        const ciudad = await buscarCiudad(nombre);
        const datos = await obtenerTiempo(ciudad.latitude, ciudad.longitude);
        mostrarTiempo(ciudad, datos);
    } catch (e) {
        errorEl.textContent = 'No se encontro la ciudad. Intenta con otro nombre.';
    } finally {
        cargando.classList.add('oculto');
    }
}
