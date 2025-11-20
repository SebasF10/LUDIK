console.log("Modificar asignación docentes - Script cargado");

// Variables globales
const burger = document.getElementById('burger');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');
let materiasData = [];
let gruposData = [];
let docentesData = [];
let anioSeleccionado = new Date().getFullYear();

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', function () {
    inicializarMenu();
    verificarYAplicarRestricciones();
    cargarAnios();
    cargarMaterias();
    cargarGrupos();
    configurarEventListeners();
    cargarDocentes();
});

// ========== FUNCIONES DE MENÚ ==========
function inicializarMenu() {
    if (burger && sideMenu && overlay) {
        burger.addEventListener('change', function () {
            if (this.checked) {
                sideMenu.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
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
}

function verificarYAplicarRestricciones() {
    const rol = localStorage.getItem('rol');
    console.log('Rol en localStorage:', rol);
    eliminarBotonesPorRol();
}

function eliminarBotonesPorRol() {
    const rol = localStorage.getItem("rol");
    const todosLosBotones = document.querySelectorAll('.menu-button');

    todosLosBotones.forEach(function (boton) {
        const textoDelBoton = boton.textContent.trim().toLowerCase();

        if (rol !== "admin") {
            if (textoDelBoton.includes("crear cuenta")) {
                boton.remove();
            }
            if (rol === "docente" || rol === "directivos") {
                if (textoDelBoton.includes("registrar un nuevo estudiante") ||
                    textoDelBoton.includes("registrar un piar")) {
                    boton.remove();
                }
            }
        }
    });
}

// Click en botones del menú
document.addEventListener('click', function (e) {
    const boton = e.target.closest('.menu-button');
    if (boton) {
        const textoLower = boton.textContent.trim().toLowerCase();

        if (textoLower.includes('volver a interfaz')) {
            window.location.href = 'Interfaz.html';
        } else if (textoLower.includes('perfil')) {
            window.location.href = 'perfil.html';
        } else if (textoLower.includes('estudiantes')) {
            window.location.href = 'Estudiantes.html';
        } else if (textoLower.includes('actividades')) {
            window.location.href = 'Ejercicios.html';
        } else if (textoLower.includes('registrar un nuevo estudiante')) {
            window.location.href = 'Registrar_estudiante.html';
        } else if (textoLower.includes('registrar un piar')) {
            window.location.href = 'Registrar_PIAR.html';
        } else if (textoLower.includes('valoraciÃ³n') || textoLower.includes('valoracion') || textoLower.includes('pedagogica')) {
            window.location.href = 'Valoracion_pedagogica.html';
        } else if (textoLower.includes('comunicate')) {
            window.location.href = 'Comunicacion.html';
        } else if (textoLower.includes('ayuda')) {
            window.location.href = 'Ayuda.html';
        } else if (textoLower.includes('cerrar sesion') || textoLower.includes('cerrar sesiÃ³n')) {
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                localStorage.removeItem('rol');
                window.location.href = 'Inicio_sesion.html';
            }
        }

        if (burger && sideMenu && overlay) {
            burger.checked = false;
            sideMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// ========== FUNCIONES PRINCIPALES ==========

function cargarAnios() {
    const selectAnio = document.getElementById('anio_seleccionado');
    const anioActual = new Date().getFullYear();
    
    for (let i = 0; i < 5; i++) {
        const anio = anioActual - i;
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        if (anio === anioActual) option.selected = true;
        selectAnio.appendChild(option);
    }
}

function cargarMaterias() {
    fetch('php/Obtener_datos_doc.php?tipo=asignaturas')
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                materiasData = data;
            }
        })
        .catch(error => console.error('Error al cargar asignaturas:', error));
}

function cargarGrupos() {
    fetch('php/Obtener_datos_doc.php?tipo=grupos')
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                gruposData = data;
            }
        })
        .catch(error => console.error('Error al cargar grupos:', error));
}

function cargarDocentes() {
    const anio = document.getElementById('anio_seleccionado').value;
    anioSeleccionado = anio;
    
    const contenedor = document.getElementById('docentes_list');
    contenedor.innerHTML = `
        <div class="loading-message">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando docentes...</p>
        </div>
    `;

    fetch(`php/Modificar_asignacion_docentes.php?action=listar_docentes&anio=${anio}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                contenedor.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Error al cargar docentes: ${data.error}</p>
                    </div>
                `;
                return;
            }

            docentesData = data;
            mostrarDocentes(data);
        })
        .catch(error => {
            console.error('Error:', error);
            contenedor.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error al cargar los datos</p>
                </div>
            `;
        });
}

function mostrarDocentes(docentes) {
    const contenedor = document.getElementById('docentes_list');
    
    if (docentes.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-slash"></i>
                <p>No se encontraron docentes</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = '';
    
    docentes.forEach(docente => {
        const card = crearCardDocente(docente);
        contenedor.appendChild(card);
    });
}

function crearCardDocente(docente) {
    const card = document.createElement('div');
    card.className = 'docente-card';
    card.dataset.docenteId = docente.id;

    let gruposHTML = '';
    if (docente.grupos && docente.grupos.length > 0) {
        gruposHTML = `
            <div class="info-item">
                <div class="info-label">Grupos:</div>
                <div class="grupos-list">
                    ${docente.grupos.map(g => `<span class="tag">${g.nombre}</span>`).join('')}
                </div>
            </div>
        `;
    }

    let asignaturasHTML = '';
    if (docente.asignaturas && docente.asignaturas.length > 0) {
        const asignaturasUnicas = [...new Set(docente.asignaturas.map(a => a.nombre))];
        asignaturasHTML = `
            <div class="info-item">
                <div class="info-label">Asignaturas:</div>
                <div class="asignaturas-list">
                    ${asignaturasUnicas.map(a => `<span class="tag">${a}</span>`).join('')}
                </div>
            </div>
        `;
    }

    let directorHTML = '';
    if (docente.es_director == 1 && docente.grupo_director) {
        directorHTML = `
            <div class="info-item">
                <div class="info-label">Director de:</div>
                <span class="badge badge-director">${docente.grupo_director}</span>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="docente-header">
            <div>
                <div class="docente-nombre">${docente.nombre_completo}</div>
                <div class="docente-email">${docente.email}</div>
            </div>
            <button class="btn-editar" onclick="abrirModalEdicion(${docente.id})">
                <i class="fas fa-edit"></i> Editar
            </button>
        </div>
        <div class="docente-info-row">
            ${gruposHTML}
            ${asignaturasHTML}
            ${directorHTML}
        </div>
    `;

    return card;
}

function configurarEventListeners() {
    // Cambio de año
    document.getElementById('anio_seleccionado').addEventListener('change', cargarDocentes);

    // Búsqueda
    document.getElementById('buscar_docente').addEventListener('input', function(e) {
        const termino = e.target.value.toLowerCase();
        const docentesFiltrados = docentesData.filter(d => 
            d.nombre_completo.toLowerCase().includes(termino) ||
            d.email.toLowerCase().includes(termino)
        );
        mostrarDocentes(docentesFiltrados);
    });

    // Cerrar modal
    document.querySelector('.close-modal').addEventListener('click', cerrarModal);
    
    document.getElementById('modal_edicion').addEventListener('click', function(e) {
        if (e.target === this) cerrarModal();
    });

    // Envío de formulario
    document.getElementById('form_modificar_asignacion').addEventListener('submit', guardarCambios);
}

// ========== FUNCIONES DEL MODAL ==========

function abrirModalEdicion(idDocente) {
    const docente = docentesData.find(d => d.id == idDocente);
    if (!docente) return;

    // Llenar información del docente
    document.getElementById('modal_docente_nombre').textContent = docente.nombre_completo;
    document.getElementById('modal_docente_email').textContent = docente.email;
    document.getElementById('modal_anio').textContent = anioSeleccionado;
    document.getElementById('modal_id_docente').value = docente.id;
    document.getElementById('modal_anio_hidden').value = anioSeleccionado;

    // Cargar grupos
    cargarGruposModal(docente);

    // Configurar director de grupo
    document.getElementById('modal_es_director').value = docente.es_director || '0';
    mostrarSelectorGrupoDirectorModal();
    
    // Mostrar modal
    document.getElementById('modal_edicion').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function cargarGruposModal(docente) {
    const contenedor = document.getElementById('modal_checkbox_grupos');
    contenedor.innerHTML = '';

    gruposData.forEach(grupo => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'grupos_seleccionados[]';
        checkbox.value = grupo.id;
        
        // Marcar si el docente ya tiene este grupo
        if (docente.grupos && docente.grupos.some(g => g.id == grupo.id)) {
            checkbox.checked = true;
        }
        
        checkbox.addEventListener('change', manejarSeleccionGrupoModal);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + grupo.nombre));
        contenedor.appendChild(label);
    });

    // Trigger para mostrar asignaturas si hay grupos seleccionados
    if (docente.grupos && docente.grupos.length > 0) {
        manejarSeleccionGrupoModal(docente);
    }
}

function manejarSeleccionGrupoModal(docenteActual = null) {
    const gruposSeleccionados = document.querySelectorAll('#modal_checkbox_grupos input[name="grupos_seleccionados[]"]:checked');
    const contenedorAsignaturas = document.getElementById('modal_asignaturas_por_grupo');

    contenedorAsignaturas.innerHTML = '<h3>Asignaturas para cada grupo:</h3>';

    if (gruposSeleccionados.length > 0) {
        contenedorAsignaturas.style.display = 'block';

        gruposSeleccionados.forEach(grupoCheckbox => {
            const grupoId = grupoCheckbox.value;
            const grupo = gruposData.find(g => g.id == grupoId);

            if (grupo) {
                crearSelectorAsignaturasPorGrupoModal(grupo, docenteActual);
            }
        });

        actualizarSelectorDirectorGrupoModal();
    } else {
        contenedorAsignaturas.style.display = 'none';
        document.getElementById('modal_grupo_director').innerHTML = '<option value="">Seleccione un grupo</option>';
    }
}

function crearSelectorAsignaturasPorGrupoModal(grupo, docenteActual) {
    const contenedorAsignaturas = document.getElementById('modal_asignaturas_por_grupo');

    const grupoDiv = document.createElement('div');
    grupoDiv.className = 'grupo-asignaturas';
    grupoDiv.setAttribute('data-grupo-id', grupo.id);

    const titulo = document.createElement('h4');
    titulo.textContent = `Asignaturas para ${grupo.nombre}`;
    grupoDiv.appendChild(titulo);

    const checkboxList = document.createElement('div');
    checkboxList.className = 'checkbox-list';

    materiasData.forEach(materia => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = `asignaturas_grupo_${grupo.id}[]`;
        checkbox.value = materia.id;

        // Marcar si el docente ya tiene esta asignatura en este grupo
        if (docenteActual && docenteActual.asignaturas) {
            const tieneAsignatura = docenteActual.asignaturas.some(
                a => a.id == materia.id && a.id_grupo == grupo.id
            );
            if (tieneAsignatura) {
                checkbox.checked = true;
            }
        }

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + materia.nombre));
        checkboxList.appendChild(label);
    });

    grupoDiv.appendChild(checkboxList);
    contenedorAsignaturas.appendChild(grupoDiv);
}

function mostrarSelectorGrupoDirectorModal() {
    const esDirector = document.getElementById('modal_es_director').value;
    const container = document.getElementById('modal_grupo_director_container');

    if (esDirector === "1") {
        container.style.display = 'block';
        actualizarSelectorDirectorGrupoModal();
    } else {
        container.style.display = 'none';
        document.getElementById('modal_grupo_director').innerHTML = '<option value="">Seleccione un grupo</option>';
    }
}

function actualizarSelectorDirectorGrupoModal() {
    const gruposSeleccionados = document.querySelectorAll('#modal_checkbox_grupos input[name="grupos_seleccionados[]"]:checked');
    const select = document.getElementById('modal_grupo_director');
    const valorActual = select.value;

    select.innerHTML = '<option value="">Seleccione un grupo</option>';

    gruposSeleccionados.forEach(grupoCheckbox => {
        const grupoId = grupoCheckbox.value;
        const grupo = gruposData.find(g => g.id == grupoId);

        if (grupo) {
            const option = document.createElement('option');
            option.value = grupo.id;
            option.textContent = grupo.nombre;
            if (valorActual == grupo.id) {
                option.selected = true;
            }
            select.appendChild(option);
        }
    });
}

function cerrarModal() {
    document.getElementById('modal_edicion').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('form_modificar_asignacion').reset();
}

function guardarCambios(e) {
    e.preventDefault();

    if (!validarFormularioModal()) {
        return;
    }

    const formData = new FormData(e.target);
    formData.append('action', 'actualizar_asignacion');

    fetch('php/Modificar_asignacion_docentes.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                mostrarAlertaFlotante(data.message, 'exito');
                cerrarModal();
                cargarDocentes();
            } else {
                mostrarAlertaFlotante('Error: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarAlertaFlotante('Error al guardar los cambios', 'error');
        });
}

function validarFormularioModal() {
    const gruposSeleccionados = document.querySelectorAll('#modal_checkbox_grupos input[name="grupos_seleccionados[]"]:checked');

    if (gruposSeleccionados.length === 0) {
        mostrarAlertaFlotante('Debe seleccionar al menos un grupo', 'error');
        return false;
    }

    // Verificar que cada grupo tenga al menos una asignatura
    for (let grupoCheckbox of gruposSeleccionados) {
        const grupoId = grupoCheckbox.value;
        const asignaturasGrupo = document.querySelectorAll(`input[name="asignaturas_grupo_${grupoId}[]"]:checked`);

        if (asignaturasGrupo.length === 0) {
            const grupo = gruposData.find(g => g.id == grupoId);
            mostrarAlertaFlotante(`Debe seleccionar al menos una asignatura para ${grupo.nombre}`, 'error');
            return false;
        }
    }

    // Si es director, verificar que haya seleccionado un grupo
    const esDirector = document.getElementById('modal_es_director').value;
    if (esDirector === "1") {
        const grupoDirector = document.getElementById('modal_grupo_director').value;
        if (!grupoDirector) {
            mostrarAlertaFlotante('Debe seleccionar el grupo que dirige', 'error');
            return false;
        }
    }

    return true;
}

function mostrarAlertaFlotante(mensaje, tipo = "exito") {
    const alerta = document.createElement("div");
    alerta.className = `alerta-flotante ${tipo === "error" ? "error" : ""}`;
    alerta.textContent = mensaje;
    document.body.appendChild(alerta);

    setTimeout(() => alerta.classList.add("mostrar"), 100);

    setTimeout(() => {
        alerta.classList.remove("mostrar");
        setTimeout(() => alerta.remove(), 300);
    }, 4000);
}

// Hacer funciones accesibles globalmente
window.abrirModalEdicion = abrirModalEdicion;
window.cerrarModal = cerrarModal;
window.mostrarSelectorGrupoDirectorModal = mostrarSelectorGrupoDirectorModal;