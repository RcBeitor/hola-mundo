let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
let filtroActivo = 'todas';

function guardar() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function renderizar() {
    const lista = document.getElementById('listaTareas');
    lista.innerHTML = '';

    const visibles = tareas.filter(t => {
        if (filtroActivo === 'pendientes')  return !t.completada;
        if (filtroActivo === 'completadas') return t.completada;
        return true;
    });

    if (visibles.length === 0) {
        lista.innerHTML = '<li class="todo-vacio">No hay tareas aqui</li>';
    }

    visibles.forEach(tarea => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (tarea.completada ? ' completada' : '');
        li.innerHTML = `
            <span class="todo-check" data-id="${tarea.id}">${tarea.completada ? '✅' : '⬜'}</span>
            <span class="todo-texto">${tarea.texto}</span>
            <button class="todo-borrar" data-id="${tarea.id}">🗑️</button>
        `;
        lista.appendChild(li);
    });

    const pendientes = tareas.filter(t => !t.completada).length;
    document.getElementById('contadorPendientes').textContent =
        `${pendientes} tarea${pendientes !== 1 ? 's' : ''} pendiente${pendientes !== 1 ? 's' : ''}`;
}

function añadir() {
    const input = document.getElementById('inputTarea');
    const texto = input.value.trim();
    if (!texto) return;
    tareas.unshift({ id: Date.now(), texto, completada: false });
    input.value = '';
    guardar();
    renderizar();
}

document.getElementById('btnAnadir').addEventListener('click', añadir);
document.getElementById('inputTarea').addEventListener('keydown', e => {
    if (e.key === 'Enter') añadir();
});

document.getElementById('listaTareas').addEventListener('click', e => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    if (e.target.classList.contains('todo-check')) {
        const tarea = tareas.find(t => t.id === id);
        if (tarea) tarea.completada = !tarea.completada;
        guardar();
        renderizar();
    }

    if (e.target.classList.contains('todo-borrar')) {
        tareas = tareas.filter(t => t.id !== id);
        guardar();
        renderizar();
    }
});

document.getElementById('btnLimpiar').addEventListener('click', () => {
    tareas = tareas.filter(t => !t.completada);
    guardar();
    renderizar();
});

document.querySelectorAll('.filtro').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filtro').forEach(b => b.classList.remove('activo-filtro'));
        btn.classList.add('activo-filtro');
        filtroActivo = btn.dataset.filtro;
        renderizar();
    });
});

renderizar();
