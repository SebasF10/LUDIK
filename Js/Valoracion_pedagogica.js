// valoracion_pedagogica.js - Sistema CRUD completo para valoraciones pedagógicas con menú integrado

console.log("Header y Menú script cargado");

// ===== VARIABLES GLOBALES PRINCIPALES =====
let modoActual = 'dashboard'; // 'dashboard' o 'formulario'
let pasoActual = 1;
let valoracionActual = null; // Para edición
let seleccion = {
    grupo: null,
    asignatura: null,
    estudiante: null,
    piar: null
};

// Variables globales del menú
const burger = document.getElementById('burger');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

// ===== NUEVA FUNCIÓN: SCROLL AUTOMÁTICO AL BOTÓN SIGUIENTE =====
function scrollToNextButton() {
    const btnSiguiente = document.getElementById('btnSiguiente');
    if (btnSiguiente && btnSiguiente.style.display !== 'none') {
        setTimeout(() => {
            btnSiguiente.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 300);
    }
}

// ===== INICIALIZAR LA APLICACIÓN =====
document.addEventListener('DOMContentLoaded', function () {
    inicializarMenu();
    inicializarEventos();
    mostrarDashboard();
});

// ===== FUNCIONALIDAD DEL MENÚ - FUSIONADA =====
function inicializarMenu() {
    // Configurar event listeners del menú solo si existen los elementos
    if (burger && sideMenu && overlay) {
        burger.addEventListener('change', function () {
            if (this.checked) {
                sideMenu.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';

                // INSPECCIONAR ELEMENTOS cuando se abra el menú
                setTimeout(inspeccionarYEliminar, 200);
            } else {
                sideMenu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        overlay.addEventListener('click', function () {
            burger.checked = false;
            sideMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Verificar y aplicar restricciones por rol
    verificarYAplicarRestricciones();
}

// FUNCIÓN PARA INSPECCIONAR Y ELIMINAR ELEMENTOS EXTRAÑOS
function inspeccionarYEliminar() {
    console.log("🔍 INSPECCIONANDO ELEMENTOS EN EL MENÚ");

    const menuButtons = document.querySelector('.menu-buttons');
    if (!menuButtons) return;

    // Obtener TODOS los hijos directos
    const todosLosHijos = Array.from(menuButtons.children);

    console.log("📋 Elementos encontrados en menu-buttons:");
    todosLosHijos.forEach((elemento, index) => {
        console.log(`${index}: ${elemento.tagName} - ${elemento.className} - "${elemento.textContent?.trim()}" - Height: ${elemento.offsetHeight}px`);

        // Eliminar elementos sospechosos
        if (
            elemento.tagName === 'HR' ||
            (elemento.offsetHeight <= 5 && !elemento.textContent?.trim()) ||
            elemento.className?.includes('separator') ||
            elemento.className?.includes('divider') ||
            elemento.className?.includes('line') ||
            (!elemento.classList.contains('menu-button') && !elemento.textContent?.trim())
        ) {
            console.log(`🗑️ ELIMINANDO elemento sospechoso: ${elemento.tagName} - ${elemento.className}`);
            elemento.remove();
        }
    });

    // También verificar en el contenedor principal del menú
    const sideMenuChildren = Array.from(sideMenu.children);
    console.log("📋 Elementos en side-menu:");
    sideMenuChildren.forEach((elemento, index) => {
        console.log(`${index}: ${elemento.tagName} - ${elemento.className} - Height: ${elemento.offsetHeight}px`);

        if (!['menu-header', 'menu-buttons', 'menu-bottom'].some(clase => elemento.classList.contains(clase))) {
            if (elemento.tagName === 'HR' || elemento.offsetHeight <= 5) {
                console.log(`🗑️ ELIMINANDO elemento extraño en side-menu: ${elemento.tagName}`);
                elemento.remove();
            }
        }
    });
}

// FUNCIÓN PARA VERIFICAR ROL Y APLICAR RESTRICCIONES
function verificarYAplicarRestricciones() {
    const rol = localStorage.getItem('rol');
    console.log('Rol en localStorage:', rol);

    // Eliminar cualquier HR o línea que pueda existir
    const lineas = document.querySelectorAll('hr, .separator, .line, .divider');
    lineas.forEach(linea => {
        console.log('Eliminando línea encontrada');
        linea.remove();
    });

    // Aplicar restricciones por rol
    eliminarBotonesPorRol();
}

// FUNCIÓN SIMPLIFICADA PARA ELIMINAR BOTONES SEGÚN ROL
function eliminarBotonesPorRol() {
    const rol = localStorage.getItem("rol");
    console.log("Verificando rol:", rol);

    // PRIMERO: INSPECCIONAR Y ELIMINAR ELEMENTOS EXTRAÑOS
    inspeccionarYEliminar();

    // Buscar TODOS los botones del menú
    const todosLosBotones = document.querySelectorAll('.menu-button');
    console.log("Botones encontrados:", todosLosBotones.length);

    todosLosBotones.forEach(function (boton, index) {
        const textoDelBoton = boton.textContent.trim().toLowerCase();
        console.log(`Botón ${index}: "${textoDelBoton}"`);

        if (rol === "admin") {
            console.log("Usuario es admin, todos los botones visibles");

        } else if (rol === "docente_apoyo") {
            if (textoDelBoton.includes("crear cuenta")) {
                console.log("¡Eliminando botón Crear Cuentas para docente_apoyo!");
                boton.remove();
            }

        } else if (rol === "docente") {
            if (textoDelBoton.includes("crear cuenta")) {
                boton.remove();
            }
            if (textoDelBoton.includes("registrar un nuevo estudiante")) {
                boton.remove();
            }
            if (textoDelBoton.includes("registrar un piar")) {
                boton.remove();
            }

        } else {
            if (textoDelBoton.includes("crear cuenta") ||
                textoDelBoton.includes("registrar un nuevo estudiante") ||
                textoDelBoton.includes("registrar un piar")) {
                boton.remove();
            }
        }
    });

    setTimeout(inspeccionarYEliminar, 100);
}

// ======= CLICK EN BOTONES DEL MENÚ - FUSIONADO =======
document.addEventListener('click', function (e) {
    const boton = e.target.closest('.menu-button');
    if (boton) {
        const texto = boton.textContent.trim();
        const textoLower = texto.toLowerCase();

        console.log("=== DEBUG CLICK ===", textoLower);

        // Navegación según el botón clickeado
        if (textoLower.includes('volver a interfaz')) {
            window.location.href = 'Interfaz.html';
        } else if (textoLower.includes('perfil')) {
            window.location.href = 'perfil.html';
        } else if (textoLower.includes('estudiantes')) {
            window.location.href = 'Estudiantes.html';
        } else if (textoLower.includes('crear cuentas')) {
            window.location.href = 'Crear_cuentas.html';
        } else if (textoLower.includes('actividades')) {
            window.location.href = 'Ejercicios.html';
        } else if (textoLower.includes('registrar un nuevo estudiante')) {
            window.location.href = 'Registrar_estudiante.html';
        } else if (textoLower.includes('registrar un piar')) {
            window.location.href = 'Registrar_PIAR.html';
        } else if (textoLower.includes('descripción general')) {
            window.location.href = 'Descripción_general.html';
        } else if (textoLower.includes('valoración') || textoLower.includes('valoracion') || textoLower.includes('pedagogica') || textoLower.includes('pedagógica')) {
            // Ya estamos en valoración pedagógica, no hacer nada
            console.log("-> Ya estás en valoración pedagógica");
        } else if (textoLower.includes('documentos')) {
            console.log("-> Redirigiendo a documentos");
            window.location.href = 'Documentos.html';
        } else if (textoLower.includes('comunicate')) {
            window.location.href = 'Comunicacion.html';
        } else if (textoLower.includes('ayuda')) {
            window.location.href = 'Ayuda.html';
        } else if (textoLower.includes('cerrar sesion') || textoLower.includes('cerrar sesión')) {
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                localStorage.removeItem('rol');
                window.location.href = 'Inicio_sesion.html';
            }
        }

        // Cerrar menú al hacer click
        if (burger && sideMenu && overlay) {
            burger.checked = false;
            sideMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// ===== EVENTOS PRINCIPALES =====
function inicializarEventos() {
    // Botones principales
    document.getElementById('btnNuevaValoracion')?.addEventListener('click', () => mostrarFormulario());

    // Botones de navegación del formulario
    document.getElementById('btnCancelar')?.addEventListener('click', cancelarFormulario);
    document.getElementById('btnAnterior')?.addEventListener('click', pasoAnterior);
    document.getElementById('btnSiguiente')?.addEventListener('click', pasoSiguiente);
    document.getElementById('btnGuardar')?.addEventListener('click', guardarValoracion);

    // Filtros
    document.getElementById('btnFiltrar')?.addEventListener('click', aplicarFiltros);
    document.getElementById('btnLimpiarFiltros')?.addEventListener('click', limpiarFiltros);

    // Modal de eliminación
    document.getElementById('btnCerrarModal')?.addEventListener('click', cerrarModalEliminar);
    document.getElementById('btnCancelarEliminar')?.addEventListener('click', cerrarModalEliminar);
    document.getElementById('btnConfirmarEliminar')?.addEventListener('click', confirmarEliminar);
}

// ===== DASHBOARD =====
async function mostrarDashboard() {
    modoActual = 'dashboard';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('formularioSection').style.display = 'none';

    await Promise.all([
        cargarValoraciones(),
        cargarEstadisticas(),
        cargarGruposParaFiltros()
    ]);
}

async function cargarValoraciones() {
    try {
        mostrarCargandoTabla(true);

        // Construir parámetros de filtro
        const params = new URLSearchParams({
            accion: 'listar_valoraciones'
        });

        const anio = document.getElementById('filtroAnio')?.value;
        const periodo = document.getElementById('filtroPeriodo')?.value;
        const grupo = document.getElementById('filtroGrupo')?.value;

        if (anio) params.append('anio', anio);
        if (periodo) params.append('periodo', periodo);
        if (grupo) params.append('id_grupo', grupo);

        const response = await fetch(`php/Valoracion_pedagogica.php?${params}`);
        const data = await response.json();

        if (data.success) {
            mostrarTablaValoraciones(data.valoraciones);
        } else {
            mostrarMensaje(data.message || 'Error al cargar las valoraciones', 'error');
            mostrarTablaValoraciones([]);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión al cargar las valoraciones', 'error');
        mostrarTablaValoraciones([]);
    } finally {
        mostrarCargandoTabla(false);
    }
}

function mostrarTablaValoraciones(valoraciones) {
    const tbody = document.getElementById('tablaValoracionesBody');
    const noDataDiv = document.getElementById('noDataTable');
    const tabla = document.getElementById('tablaValoraciones');

    if (valoraciones.length === 0) {
        tabla.style.display = 'none';
        noDataDiv.style.display = 'block';
        return;
    }

    tabla.style.display = 'table';
    noDataDiv.style.display = 'none';

    tbody.innerHTML = valoraciones.map(val => {
        const periodoTexto = {
            '1': 'Primer Período',
            '2': 'Segundo Período',
            '3': 'Tercer Período',
            '4': 'Cuarto Período'
        }[val.periodo] || `Período ${val.periodo}`;

        return `
            <tr>
                <td>
                    <div class="student-info">
                        <div class="student-name">${val.estudiante_completo}</div>
                        <div class="student-doc">${val.no_documento}</div>
                    </div>
                </td>
                <td>
                    <div class="group-info">
                        <div class="group-name">${val.grupo}</div>
                        <div class="group-grade">Grado: ${val.grado}</div>
                    </div>
                </td>
                <td>${val.nombre_asig}</td>
                <td>
                    <span class="period-badge period-${val.periodo}">
                        ${periodoTexto}
                    </span>
                </td>
                <td>${val.anio}</td>
                <td class="actions-cell">
                    <button onclick="editarValoracion(${val.id_valoracion_pedagogica})" 
                            class="btn-action btn-edit" title="Editar">
                        ✏️
                    </button>
                    <button onclick="verValoracion(${val.id_valoracion_pedagogica})" 
                            class="btn-action btn-view" title="Ver detalles">
                        👁️
                    </button>
                    <button onclick="eliminarValoracion(${val.id_valoracion_pedagogica}, '${val.estudiante_completo}', '${val.nombre_asig}', '${periodoTexto}', '${val.anio}')" 
                            class="btn-action btn-delete" title="Eliminar">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function cargarEstadisticas() {
    try {
        const response = await fetch('php/Valoracion_pedagogica.php?accion=estadisticas');
        const data = await response.json();

        if (data.success) {
            document.getElementById('totalValoraciones').textContent = data.estadisticas.total_valoraciones;
            document.getElementById('totalEstudiantes').textContent = data.estadisticas.total_estudiantes;
            document.getElementById('totalGrupos').textContent = data.estadisticas.total_grupos;
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

async function cargarGruposParaFiltros() {
    try {
        const response = await fetch('php/Valoracion_pedagogica.php?accion=obtener_grupos');
        const data = await response.json();

        if (data.success) {
            const select = document.getElementById('filtroGrupo');
            select.innerHTML = '<option value="">Todos los grupos</option>' +
                data.grupos.map(grupo => `<option value="${grupo.id}">${grupo.grupo} - ${grupo.grado}</option>`).join('');
        }
    } catch (error) {
        console.error('Error al cargar grupos para filtros:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const btnIA = document.getElementById('btnIA');
    if (btnIA) {
        btnIA.addEventListener('click', function () {
            window.open('https://ia-ludik-1.onrender.com/', '_blank');
        });
    }
});


function aplicarFiltros() {
    cargarValoraciones();
}

function limpiarFiltros() {
    document.getElementById('filtroAnio').value = '';
    document.getElementById('filtroPeriodo').value = '';
    document.getElementById('filtroGrupo').value = '';
    cargarValoraciones();
}

function mostrarCargandoTabla(mostrar) {
    document.getElementById('loadingTable').style.display = mostrar ? 'flex' : 'none';
}

// ===== ACCIONES DE VALORACIONES =====
async function verValoracion(idValoracion) {
    try {
        const response = await fetch(`php/Valoracion_pedagogica.php?accion=obtener_valoracion&id_valoracion=${idValoracion}`);
        const data = await response.json();

        if (data.success) {
            const val = data.valoracion;
            const periodoTexto = {
                '1': 'Primer Período',
                '2': 'Segundo Período',
                '3': 'Tercer Período',
                '4': 'Cuarto Período'
            }[val.periodo] || `Período ${val.periodo}`;

            // Crear elemento de foto
            const fullName = `${val.estudiante_nombre} ${val.estudiante_apellidos}`;
            const initials = getInitials(fullName);
            let photoElement;
            
            if (val.foto_url && val.foto_url !== 'photos/default.png') {
                const photoPath = val.foto_url.startsWith('photos/') ? val.foto_url : `photos/${val.foto_url}`;
                photoElement = `
                    <img src="${photoPath}" 
                        alt="Foto de ${fullName}" 
                        class="modal-student-photo-detail" 
                        onerror="this.outerHTML='<div class=\\'modal-student-photo-detail default\\'>${initials}</div>'">
                `;
            } else {
                photoElement = `<div class="modal-student-photo-detail default">${initials}</div>`;
            }

            const contenido = `
                <div class="valoracion-detalle">
                    <div class="info-header-with-photo">
                        ${photoElement}
                        <div class="info-header-text">
                            <h3>${val.estudiante_nombre} ${val.estudiante_apellidos}</h3>
                            <p><strong>Grupo:</strong> ${val.grupo} - ${val.grado} | 
                            <strong>Asignatura:</strong> ${val.nombre_asig} | 
                            <strong>Período:</strong> ${periodoTexto} ${val.anio}</p>
                            <p><strong>Docente:</strong> ${val.docente_nombre}</p>
                        </div>
                    </div>
                    
                    <div class="detalle-grid">
                        <div class="detalle-item">
                            <h4>Objetivo</h4>
                            <p>${val.objetivo}</p>
                        </div>
                        
                        <div class="detalle-item">
                            <h4>Barreras Identificadas</h4>
                            <p>${val.barrera}</p>
                        </div>
                        
                        <div class="detalle-item">
                            <h4>Tipo de Ajuste</h4>
                            <p>${val.tipo_ajuste}</p>
                        </div>
                        
                        <div class="detalle-item">
                            <h4>Apoyo Requerido</h4>
                            <p>${val.apoyo_requerido}</p>
                        </div>
                        
                        <div class="detalle-item">
                            <h4>Seguimiento</h4>
                            <p>${val.seguimiento}</p>
                        </div>
                    </div>
                    
                    <div class="detalle-footer">
                        <small><strong>ID Valoración:</strong> ${val.id_valoracion_pedagogica}</small>
                    </div>
                </div>
            `;

            // Crear modal temporal para mostrar detalles
            mostrarModalTemporal('Detalles de la Valoración Pedagógica', contenido);

        } else {
            mostrarMensaje(data.message || 'Error al obtener los detalles', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión al obtener los detalles', 'error');
    }
}

async function editarValoracion(idValoracion) {
    try {
        const response = await fetch(`php/Valoracion_pedagogica.php?accion=obtener_valoracion&id_valoracion=${idValoracion}`);
        const data = await response.json();

        if (data.success) {
            valoracionActual = data.valoracion;

            // Configurar selección previa
            seleccion = {
                grupo: {
                    id: valoracionActual.id_grupo,
                    grupo: valoracionActual.grupo,
                    grado: valoracionActual.grado
                },
                asignatura: {
                    id_asignatura: valoracionActual.id_asignatura,
                    nombre_asig: valoracionActual.nombre_asig
                },
                estudiante: {
                    id_estudiante: valoracionActual.id_estudiante,
                    nombre: valoracionActual.estudiante_nombre,
                    apellidos: valoracionActual.estudiante_apellidos,
                    no_documento: valoracionActual.no_documento,
                    id_piar: valoracionActual.id_piar
                },
                piar: valoracionActual.id_piar
            };

            // Cambiar al modo formulario
            mostrarFormulario(true);

            // Saltar directamente al paso 4 (formulario) para edición
            mostrarPaso(4);

            // Llenar el formulario con los datos existentes
            llenarFormularioEdicion();

        } else {
            mostrarMensaje(data.message || 'Error al cargar la valoración', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión al cargar la valoración', 'error');
    }
}

function eliminarValoracion(idValoracion, estudiante, asignatura, periodo, anio) {
    // Preparar información para mostrar en el modal
    document.getElementById('infoValoracionEliminar').innerHTML = `
        <div class="valoracion-info-delete">
            <p><strong>Estudiante:</strong> ${estudiante}</p>
            <p><strong>Asignatura:</strong> ${asignatura}</p>
            <p><strong>Período:</strong> ${periodo} ${anio}</p>
        </div>
    `;

    // Guardar el ID para usar en la confirmación
    document.getElementById('btnConfirmarEliminar').setAttribute('data-id', idValoracion);

    // Mostrar el modal
    document.getElementById('modalEliminar').style.display = 'flex';
}

async function confirmarEliminar() {
    const idValoracion = document.getElementById('btnConfirmarEliminar').getAttribute('data-id');

    if (!idValoracion) return;

    try {
        const formData = new FormData();
        formData.append('accion', 'eliminar_valoracion');
        formData.append('id_valoracion', idValoracion);

        const response = await fetch('php/Valoracion_pedagogica.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            mostrarMensaje('Valoración eliminada exitosamente', 'exito');
            cerrarModalEliminar();
            cargarValoraciones(); // Recargar la tabla
            cargarEstadisticas(); // Actualizar estadísticas
        } else {
            mostrarMensaje(data.message || 'Error al eliminar la valoración', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión al eliminar la valoración', 'error');
    }
}

function cerrarModalEliminar() {
    document.getElementById('modalEliminar').style.display = 'none';
}

// ===== FORMULARIO =====
function mostrarFormulario(esEdicion = false) {
    modoActual = 'formulario';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('formularioSection').style.display = 'block';

    // Configurar título y textos según el modo
    if (esEdicion) {
        document.getElementById('tituloFormulario').textContent = 'Editar Valoración Pedagógica';
        document.getElementById('tituloPaso4').textContent = 'Paso 4: Editar Valoración Pedagógica';
        document.getElementById('btnGuardar').textContent = 'Actualizar Valoración';
    } else {
        document.getElementById('tituloFormulario').textContent = 'Nueva Valoración Pedagógica';
        document.getElementById('tituloPaso4').textContent = 'Paso 4: Crear Valoración Pedagógica';
        document.getElementById('btnGuardar').textContent = 'Guardar Valoración';
        valoracionActual = null;
        seleccion = { grupo: null, asignatura: null, estudiante: null, piar: null };
        limpiarFormulario();
    }

    if (!esEdicion) {
        mostrarPaso(1);
        cargarGrupos();
    }
}

function cancelarFormulario() {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.')) {
        mostrarDashboard();
    }
}

function llenarFormularioEdicion() {
    // Mostrar información seleccionada
    document.getElementById('infoGrupo').textContent = `${seleccion.grupo.grupo} - ${seleccion.grupo.grado}`;
    document.getElementById('infoAsignatura').textContent = seleccion.asignatura.nombre_asig;
    document.getElementById('infoEstudiante').textContent = `${seleccion.estudiante.nombre} ${seleccion.estudiante.apellidos}`;

    // Llenar campos del formulario
    document.getElementById('idValoracion').value = valoracionActual.id_valoracion_pedagogica;
    document.getElementById('periodo').value = valoracionActual.periodo;
    document.getElementById('anio').value = valoracionActual.anio;
    document.getElementById('objetivo').value = valoracionActual.objetivo;
    document.getElementById('barrera').value = valoracionActual.barrera;
    document.getElementById('tipo_ajuste').value = valoracionActual.tipo_ajuste;
    document.getElementById('apoyo_requerido').value = valoracionActual.apoyo_requerido;
    document.getElementById('seguimiento').value = valoracionActual.seguimiento;
}

function limpiarFormulario() {
    document.getElementById('formValoracion').reset();
    document.getElementById('idValoracion').value = '';
    document.getElementById('infoGrupo').textContent = '-';
    document.getElementById('infoAsignatura').textContent = '-';
    document.getElementById('infoEstudiante').textContent = '-';
}

// Navegación entre pasos
function mostrarPaso(paso) {
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    document.getElementById(`paso${paso}`).classList.add('active');
    actualizarIndicadores(paso);
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
    const btnGuardar = document.getElementById('btnGuardar');

    btnAnterior.style.display = paso > 1 ? 'inline-block' : 'none';
    btnSiguiente.style.display = paso < 4 ? 'inline-block' : 'none';
    btnGuardar.style.display = paso === 4 ? 'inline-block' : 'none';
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

            switch (pasoActual) {
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
    switch (pasoActual) {
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

// ===== CARGAR DATOS PARA FORMULARIO =====
async function cargarGrupos() {
    try {
        mostrarCargando('grupoCards');
        const response = await fetch('php/Valoracion_pedagogica.php?accion=obtener_grupos');
        const data = await response.json();

        if (data.success) {
            mostrarGruposPorGrado(data.grupos);
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
        const response = await fetch(`php/Valoracion_pedagogica.php?accion=obtener_asignaturas&id_grupo=${seleccion.grupo.id}`);
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
        const response = await fetch(`php/Valoracion_pedagogica.php?accion=obtener_estudiantes&id_grupo=${seleccion.grupo.id}`);
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

// ===== MOSTRAR GRUPOS POR GRADO CON CATEGORÍAS =====
function mostrarGruposPorGrado(grupos) {
    const container = document.getElementById('grupoCards');

    if (grupos.length === 0) {
        container.innerHTML = '<p class="no-data">No tienes grupos asignados.</p>';
        return;
    }

    // Agrupar por grado
    const gruposPorGrado = {};
    grupos.forEach(grupo => {
        // Extraer el número del grado (ej: "Grado 6" -> 6)
        const gradoNumero = grupo.grado.match(/\d+/)?.[0] || grupo.grado;
        
        if (!gruposPorGrado[gradoNumero]) {
            gruposPorGrado[gradoNumero] = [];
        }
        gruposPorGrado[gradoNumero].push(grupo);
    });

    // Ordenar grados numéricamente
    const gradosOrdenados = Object.keys(gruposPorGrado).sort((a, b) => {
        const numA = parseInt(a) || 0;
        const numB = parseInt(b) || 0;
        return numA - numB;
    });

    // Generar HTML con acordeones
    container.innerHTML = gradosOrdenados.map(gradoNum => {
        const gruposDelGrado = gruposPorGrado[gradoNum];
        const gradoId = `grado-${gradoNum}`;
        
        return `
            <div class="grado-category">
                <div class="grado-header" onclick="toggleGrado('${gradoId}')">
                    <h3>📚 Grado ${gradoNum}</h3>
                    <span class="toggle-icon" id="icon-${gradoId}">▼</span>
                </div>
                <div class="grado-content" id="${gradoId}">
                    ${gruposDelGrado.map(grupo => `
                        <div class="card grupo-card" onclick="seleccionarGrupo(${JSON.stringify(grupo).replace(/"/g, '&quot;')})">
                            <div class="card-title">${grupo.grupo}</div>
                            <div class="card-subtitle">Grado: ${grupo.grado}</div>
                            <div class="card-info">
                                <div>📚 Asignaturas: ${grupo.total_asignaturas || 0}</div>
                                <div>👥 Estudiantes: ${grupo.total_estudiantes || 0}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Función para alternar la visibilidad de las categorías de grado
function toggleGrado(gradoId) {
    const content = document.getElementById(gradoId);
    const icon = document.getElementById(`icon-${gradoId}`);
    
    if (content.classList.contains('active')) {
        content.classList.remove('active');
        icon.textContent = '▼';
    } else {
        // Cerrar todas las demás categorías
        document.querySelectorAll('.grado-content').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelectorAll('.toggle-icon').forEach(el => {
            el.textContent = '▼';
        });
        
        // Abrir la categoría seleccionada
        content.classList.add('active');
        icon.textContent = '▲';
    }
}

// ===== MOSTRAR DATOS EN CARDS =====
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

    container.innerHTML = estudiantes.map(estudiante => {
        const fullName = `${estudiante.nombre} ${estudiante.apellidos}`;
        const initials = getInitials(fullName);

        let photoElement;
        if (estudiante.url_foto && estudiante.url_foto !== 'photos/default.png') {
            const photoPath = estudiante.url_foto.startsWith('photos/') ? estudiante.url_foto : `photos/${estudiante.url_foto}`;
            photoElement = `<img src="${photoPath}" alt="Foto de ${fullName}" class="student-photo-card" onerror="this.outerHTML='<div class=\\'student-photo-card default\\'>${initials}</div>'">`;
        } else {
            photoElement = `<div class="student-photo-card default">${initials}</div>`;
        }

        return `
            <div class="card" onclick="seleccionarEstudiante(${JSON.stringify(estudiante).replace(/"/g, '&quot;')})">
                ${photoElement}
                <div class="card-title">${fullName}</div>
                <div class="card-subtitle">Documento: ${estudiante.no_documento}</div>
                <div class="card-info">
                    <div>📧 ${estudiante.correo}</div>
                    <div>📞 ${estudiante.telefono}</div>
                    <div class="piar-status ${estudiante.tiene_piar ? 'tiene-piar' : 'sin-piar'}">
                        ${estudiante.tiene_piar ? '✅ Tiene PIAR' : '❌ Sin PIAR'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ===== FUNCIONES DE SELECCIÓN CON SCROLL AUTOMÁTICO =====
function seleccionarGrupo(grupo) {
    document.querySelectorAll('.grupo-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.card').classList.add('selected');
    seleccion.grupo = grupo;
    mostrarMensaje(`Grupo ${grupo.grupo} seleccionado`, 'exito');
    
    // SCROLL AUTOMÁTICO AL BOTÓN SIGUIENTE
    scrollToNextButton();
}

function seleccionarAsignatura(asignatura) {
    document.querySelectorAll('#asignaturaCards .card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.card').classList.add('selected');
    seleccion.asignatura = asignatura;
    mostrarMensaje(`Asignatura ${asignatura.nombre_asig} seleccionada`, 'exito');
    
    // SCROLL AUTOMÁTICO AL BOTÓN SIGUIENTE
    scrollToNextButton();
}

function seleccionarEstudiante(estudiante) {
    document.querySelectorAll('#estudianteCards .card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.card').classList.add('selected');
    seleccion.estudiante = estudiante;
    seleccion.piar = estudiante.id_piar;

    if (!estudiante.tiene_piar) {
        mostrarMensaje('Advertencia: Este estudiante no tiene PIAR registrado. Se creará uno automáticamente.', 'info');
    }

    mostrarMensaje(`Estudiante ${estudiante.nombre} ${estudiante.apellidos} seleccionado`, 'exito');
    
    // SCROLL AUTOMÁTICO AL BOTÓN SIGUIENTE
    scrollToNextButton();
}

function mostrarInformacionSeleccionada() {
    document.getElementById('infoGrupo').textContent = seleccion.grupo.grupo;
    document.getElementById('infoAsignatura').textContent = seleccion.asignatura.nombre_asig;
    document.getElementById('infoEstudiante').textContent = `${seleccion.estudiante.nombre} ${seleccion.estudiante.apellidos}`;
}

// ===== GUARDAR/ACTUALIZAR VALORACIÓN =====
async function guardarValoracion() {
    const form = document.getElementById('formValoracion');

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);

    // Determinar si es creación o actualización
    const esEdicion = valoracionActual !== null;
    const accion = esEdicion ? 'actualizar_valoracion' : 'crear_valoracion';

    formData.append('accion', accion);

    if (!esEdicion) {
        // Solo para nuevas valoraciones
        formData.append('id_grupo', seleccion.grupo.id);
        formData.append('id_asignatura', seleccion.asignatura.id_asignatura);
        formData.append('id_estudiante', seleccion.estudiante.id_estudiante);
        formData.append('id_piar', seleccion.piar || '');
    }

    try {
        const btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.disabled = true;
        btnGuardar.textContent = esEdicion ? 'Actualizando...' : 'Guardando...';

        const response = await fetch('php/Valoracion_pedagogica.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            const mensaje = esEdicion ? 'Valoración actualizada exitosamente' : 'Valoración creada exitosamente';
            mostrarMensaje(mensaje, 'exito');

            setTimeout(() => {
                mostrarDashboard();
            }, 1500);

        } else {
            mostrarMensaje(data.message || 'Error al guardar la valoración', 'error');
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión al guardar la valoración', 'error');
    } finally {
        const btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.disabled = false;
        btnGuardar.textContent = valoracionActual ? 'Actualizar Valoración' : 'Guardar Valoración';
    }
}

// ===== UTILIDADES =====
function mostrarMensaje(mensaje, tipo) {
    const container = document.getElementById('mensaje-container');
    container.innerHTML = '';

    const div = document.createElement('div');
    div.className = `mensaje ${tipo}`;
    div.textContent = mensaje;

    container.appendChild(div);

    if (tipo !== 'error') {
        setTimeout(() => {
            div.remove();
        }, 5000);
    }

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

function mostrarModalTemporal(titulo, contenido) {
    // Crear modal temporal
    const modalHtml = `
        <div id="modalTemporal" class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3>${titulo}</h3>
                    <button onclick="cerrarModalTemporal()" class="btn-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${contenido}
                </div>
                <div class="modal-footer">
                    <button onclick="cerrarModalTemporal()" class="btn-nav btn-primary">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function cerrarModalTemporal() {
    const modal = document.getElementById('modalTemporal');
    if (modal) {
        modal.remove();
    }
}

function goBackOrRedirect(ruta) {
    if (ruta && ruta.trim() !== '') {
        window.location.href = ruta;
    } else {
        window.history.back();
    }
}

// Obtener iniciales de un nombre completo
function getInitials(fullName) {
    if (!fullName) return '??';

    const names = fullName.trim().split(' ').filter(n => n.length > 0);

    if (names.length === 0) return '??';
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();

    // Tomar primera letra del primer nombre y primera letra del último apellido
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}