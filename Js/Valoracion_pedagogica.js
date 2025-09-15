// valoracion_pedagogica.js

// Variables globales
let pasoActual = 1;
let seleccion = {
    grupo: null,
    asignatura: null,
    estudiante: null,
    piar: null
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    inicializarEventos();
    cargarGrupos();
});

// Inicializar eventos
function inicializarEventos() {
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const btnRegistrar = document.getElementById('btnRegistrar');

    btnAnterior.addEventListener('click', pasoAnterior);
    btnSiguiente.addEventListener('click', pasoSiguiente);
    btnRegistrar.addEventListener('click', registrarValoracion);
}

// Navegación entre pasos
function mostrarPaso(paso) {
    // Ocultar todos los pasos
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    // Mostrar paso actual
    document.getElementById(`paso${paso}`).classList.add('active');

    // Actualizar indicadores
    actualizarIndicadores(paso);

    // Controlar botones
    controlarBotones(paso);

    pasoActual = paso;
}

function actualizarIndicadores(paso) {
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        const stepNum = index + 1;
        
        indicator.classList.remove('active', 'completed');
        
        if (stepNum === paso) {
            indicator.classList.add('active');
        } else if (stepNum < paso) {
            indicator.classList.add('completed');
        }
    });
}

function controlarBotones(paso) {
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const btnRegistrar = document.getElementById('btnRegistrar');

    // Botón anterior
    btnAnterior.style.display = paso > 1 ? 'inline-block' : 'none';

    // Botón siguiente
    btnSiguiente.style.display = paso < 4 ? 'inline-block' : 'none';

    // Botón registrar
    btnRegistrar.style.display = paso === 4 ? 'inline-block' : 'none';
}

function pasoAnterior() {
    if (pasoActual > 1) {
        mostrarPaso(pasoActual - 1);
    }
}

function pasoSiguiente() {
    if (validarPasoActual()) {
        if (pasoActual < 4) {
            mostrarPaso(pasoActual + 1);
            
            // Cargar datos del siguiente paso
            switch(pasoActual) {
                case 2:
                    cargarAsignaturas();
                    break;
                case 3:
                    cargarEstudiantes();
                    break;
                case 4:
                    mostrarInformacionSeleccionada();
                    break;
            }
        }
    }
}

function validarPasoActual() {
    switch(pasoActual) {
        case 1:
            if (!seleccion.grupo) {
                mostrarMensaje('Por favor selecciona un grupo', 'error');
                return false;
            }
            break;
        case 2:
            if (!seleccion.asignatura) {
                mostrarMensaje('Por favor selecciona una asignatura', 'error');
                return false;
            }
            break;
        case 3:
            if (!seleccion.estudiante) {
                mostrarMensaje('Por favor selecciona un estudiante', 'error');
                return false;
            }
            break;
    }
    return true;
}

// Funciones para cargar datos
async function cargarGrupos() {
    try {
        mostrarCargando('grupoCards');
        
        const response = await fetch('php/obtener_grupos_vp.php');
        const data = await response.json();
        
        if (data.success) {
            mostrarGrupos(data.grupos);
        } else {
            mostrarMensaje(data.message || 'Error al cargar los grupos', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión al cargar los grupos', 'error');
    }
}

async function cargarAsignaturas() {
    try {
        mostrarCargando('asignaturaCards');
        
        const response = await fetch(`php/obtener_asignaturas_vp.php?id_grupo=${seleccion.grupo.id}`);
        const data = await response.json();
        
        if (data.success) {
            mostrarAsignaturas(data.asignaturas);
        } else {
            mostrarMensaje(data.message || 'Error al cargar las asignaturas', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión al cargar las asignaturas', 'error');
    }
}

async function cargarEstudiantes() {
    try {
        mostrarCargando('estudianteCards');
        
        const response = await fetch(`php/obtener_estudiantes_vp.php?id_grupo=${seleccion.grupo.id}`);
        const data = await response.json();
        
        if (data.success) {
            mostrarEstudiantes(data.estudiantes);
        } else {
            mostrarMensaje(data.message || 'Error al cargar los estudiantes', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión al cargar los estudiantes', 'error');
    }
}

// Funciones para mostrar datos
function mostrarGrupos(grupos) {
    const container = document.getElementById('grupoCards');
    
    if (grupos.length === 0) {
        container.innerHTML = '<p class="no-data">No tienes grupos asignados.</p>';
        return;
    }
    
    container.innerHTML = grupos.map(grupo => `
        <div class="card" onclick="seleccionarGrupo(${JSON.stringify(grupo).replace(/"/g, '&quot;')})">
            <div class="card-title">${grupo.grupo}</div>
            <div class="card-subtitle">Grado: ${grupo.grado}</div>
            <div class="card-info">
                <div>📚 Asignaturas: ${grupo.total_asignaturas || 0}</div>
                <div>👥 Estudiantes: ${grupo.total_estudiantes || 0}</div>
            </div>
        </div>
    `).join('');
}

function mostrarAsignaturas(asignaturas) {
    const container = document.getElementById('asignaturaCards');
    
    if (asignaturas.length === 0) {
        container.innerHTML = '<p class="no-data">No tienes asignaturas asignadas para este grupo.</p>';
        return;
    }
    
    container.innerHTML = asignaturas.map(asignatura => `
        <div class="card" onclick="seleccionarAsignatura(${JSON.stringify(asignatura).replace(/"/g, '&quot;')})">
            <div class="card-title">${asignatura.nombre_asig}</div>
            <div class="card-info">
                <div>📖 Asignatura</div>
                <div>Grupo: ${seleccion.grupo.grupo}</div>
            </div>
        </div>
    `).join('');
}

function mostrarEstudiantes(estudiantes) {
    const container = document.getElementById('estudianteCards');
    
    if (estudiantes.length === 0) {
        container.innerHTML = '<p class="no-data">No hay estudiantes registrados en este grupo.</p>';
        return;
    }
    
    container.innerHTML = estudiantes.map(estudiante => `
        <div class="card" onclick="seleccionarEstudiante(${JSON.stringify(estudiante).replace(/"/g, '&quot;')})">
            <div class="card-title">${estudiante.nombre} ${estudiante.apellidos}</div>
            <div class="card-subtitle">Documento: ${estudiante.no_documento}</div>
            <div class="card-info">
                <div>📧 ${estudiante.correo}</div>
                <div>📞 ${estudiante.telefono}</div>
                <div class="piar-status ${estudiante.tiene_piar ? 'tiene-piar' : 'sin-piar'}">
                    ${estudiante.tiene_piar ? '✅ Tiene PIAR' : '❌ Sin PIAR'}
                </div>
            </div>
        </div>
    `).join('');
}

// Funciones de selección
function seleccionarGrupo(grupo) {
    // Remover selección anterior
    document.querySelectorAll('#grupoCards .card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Agregar selección actual
    event.target.closest('.card').classList.add('selected');
    
    seleccion.grupo = grupo;
    mostrarMensaje(`Grupo ${grupo.grupo} seleccionado`, 'exito');
}

function seleccionarAsignatura(asignatura) {
    // Remover selección anterior
    document.querySelectorAll('#asignaturaCards .card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Agregar selección actual
    event.target.closest('.card').classList.add('selected');
    
    seleccion.asignatura = asignatura;
    mostrarMensaje(`Asignatura ${asignatura.nombre_asig} seleccionada`, 'exito');
}

function seleccionarEstudiante(estudiante) {
    // Remover selección anterior
    document.querySelectorAll('#estudianteCards .card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Agregar selección actual
    event.target.closest('.card').classList.add('selected');
    
    seleccion.estudiante = estudiante;
    seleccion.piar = estudiante.id_piar;
    
    if (!estudiante.tiene_piar) {
        mostrarMensaje('Advertencia: Este estudiante no tiene PIAR registrado. Se creará uno automáticamente.', 'info');
    }
    
    mostrarMensaje(`Estudiante ${estudiante.nombre} ${estudiante.apellidos} seleccionado`, 'exito');
}

// Mostrar información seleccionada
function mostrarInformacionSeleccionada() {
    document.getElementById('infoGrupo').textContent = seleccion.grupo.grupo;
    document.getElementById('infoAsignatura').textContent = seleccion.asignatura.nombre_asig;
    document.getElementById('infoEstudiante').textContent = `${seleccion.estudiante.nombre} ${seleccion.estudiante.apellidos}`;
}

// Registrar valoración pedagógica
async function registrarValoracion() {
    const form = document.getElementById('formValoracion');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = new FormData(form);
    
    // Agregar datos de selección
    formData.append('id_grupo', seleccion.grupo.id);
    formData.append('id_asignatura', seleccion.asignatura.id_asignatura);
    formData.append('id_estudiante', seleccion.estudiante.id_estudiante);
    formData.append('id_piar', seleccion.piar);
    
    try {
        // Deshabilitar botón mientras se procesa
        const btnRegistrar = document.getElementById('btnRegistrar');
        btnRegistrar.disabled = true;
        btnRegistrar.textContent = 'Registrando...';
        
        const response = await fetch('php/registrar_valoracion.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarMensaje('Valoración pedagógica registrada exitosamente', 'exito');
            
            // Esperar un momento y redirigir o limpiar form
            setTimeout(() => {
                if (confirm('¿Deseas crear otra valoración pedagógica?')) {
                    location.reload();
                } else {
                    // Redirigir a página principal o dashboard
                    window.location.href = 'Interfaz.html';
                }
            }, 2000);
            
        } else {
            mostrarMensaje(data.message || 'Error al registrar la valoración', 'error');
        }
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión al registrar la valoración', 'error');
    } finally {
        // Rehabilitar botón
        const btnRegistrar = document.getElementById('btnRegistrar');
        btnRegistrar.disabled = false;
        btnRegistrar.textContent = 'Registrar Valoración';
    }
}

// Funciones de utilidad
function mostrarMensaje(mensaje, tipo) {
    const container = document.getElementById('mensaje-container');
    
    // Limpiar mensajes anteriores
    container.innerHTML = '';
    
    const div = document.createElement('div');
    div.className = `mensaje ${tipo}`;
    div.textContent = mensaje;
    
    container.appendChild(div);
    
    // Auto-ocultar después de 5 segundos (excepto errores)
    if (tipo !== 'error') {
        setTimeout(() => {
            div.remove();
        }, 5000);
    }
    
    // Scroll hacia arriba para ver el mensaje
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function mostrarCargando(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

// Función para limpiar mensajes
function limpiarMensajes() {
    document.getElementById('mensaje-container').innerHTML = '';
}