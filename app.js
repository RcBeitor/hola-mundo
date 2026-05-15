// Reloj y fecha
function actualizarFechaHora() {
    const ahora = new Date();
    document.getElementById('hora').textContent = ahora.toLocaleTimeString('es-ES');
    document.getElementById('fecha').textContent = ahora.toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}
actualizarFechaHora();
setInterval(actualizarFechaHora, 1000);

// Color aleatorio del titulo cada segundo
const colores = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bcd', '#ffffff', '#ffb347'];
let colorIndex = 0;
setInterval(() => {
    const titulo = document.getElementById('titulo');
    if (titulo) {
        titulo.style.color = colores[colorIndex % colores.length];
        colorIndex++;
    }
}, 1000);

// Saludo personalizado
const inputNombre = document.getElementById('inputNombre');
if (inputNombre) {
    inputNombre.addEventListener('input', () => {
        const nombre = inputNombre.value.trim();
        const saludo = document.getElementById('saludo');
        saludo.textContent = nombre ? `¡Hola, ${nombre}!` : '';
    });
}

// Contador de clicks
let clicks = 0;
const btnContador = document.getElementById('btnContador');
if (btnContador) {
    btnContador.addEventListener('click', () => {
        clicks++;
        document.getElementById('contador').textContent = clicks;
    });
}

// Tema claro / oscuro
const btnTema = document.getElementById('btnTema');
if (btnTema) {
    const temaGuardado = localStorage.getItem('tema') || 'claro';
    aplicarTema(temaGuardado);

    btnTema.addEventListener('click', () => {
        const esOscuro = document.body.classList.contains('oscuro');
        aplicarTema(esOscuro ? 'claro' : 'oscuro');
    });
}

function aplicarTema(tema) {
    document.body.classList.remove('claro', 'oscuro');
    document.body.classList.add(tema);
    localStorage.setItem('tema', tema);
    if (btnTema) {
        btnTema.textContent = tema === 'oscuro' ? '☀️ Modo claro' : '🌙 Modo oscuro';
    }
}
