// JavaScript para Estudiantes.html con Header y Menú Integrado

console.log("Header y Menú script cargado");

// ===================== FUNCIONALIDAD DEL MENÚ =====================

// Variables globales del menú
const burger = document.getElementById('burger');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

// Esperar a que el DOM esté cargado para configurar el menú
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM cargado - ejecutando función de roles e inicialización");

    // Configurar event listeners del menú
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

    // Inicializar funcionalidad específica de estudiantes
    initializeApp();
});

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

// ======= CLICK EN BOTONES DEL MENÚ =======
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
            console.log("-> Redirigiendo a perfil");
            window.location.href = 'perfil.html';
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
            window.location.href = 'Valoracion_pedagogica.html';
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

// ===================== FUNCIONALIDAD DE ESTUDIANTES (ORIGINAL) =====================

// Líneas de debugging
console.log('=== DEBUG DE RUTAS ===');
console.log('URL actual:', window.location.href);
console.log('Protocolo:', window.location.protocol);
console.log('Ruta base:', window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')));

// Variables globales
let allStudents = [];
let currentSearchResults = [];
let currentStudentData = null;
let currentPage = 1;
const studentsPerPage = 12;
let currentSection = 'buscar';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const gradoFilter = document.getElementById('gradoFilter');
const grupoFilter = document.getElementById('grupoFilter');
const searchResults = document.getElementById('searchResults');
const studentsGrid = document.getElementById('studentsGrid');
const modal = document.getElementById('studentModal');
const closeModal = document.querySelector('.close');
const loadingSpinner = document.getElementById('loadingSpinner');
const pdfLoadingSpinner = document.getElementById('pdfLoadingSpinner');
const pageInfo = document.getElementById('pageInfo');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');

// Download buttons
const downloadAllPDF = document.getElementById('downloadAllPDF');
const downloadAllExcel = document.getElementById('downloadAllExcel');
const downloadSearchPDF = document.getElementById('downloadSearchPDF');
const downloadSearchExcel = document.getElementById('downloadSearchExcel');
const downloadStudentPDF = document.getElementById('downloadStudentPDF');
const searchDownloadControls = document.getElementById('searchDownloadControls');

// Configuración de la API
const API_BASE_URL = './php/Estudiantes.php';
console.log('API URL final:', new URL(API_BASE_URL, window.location.href).href);

// Inicialización de funcionalidad específica de estudiantes
function initializeApp() {
    setupEventListeners();
    loadFilters();

    // Mostrar sección de búsqueda por defecto
    showSection('buscar');
}

function setupEventListeners() {
    // Navegación interna
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Búsqueda
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Filtros
    gradoFilter.addEventListener('change', applyFilters);
    grupoFilter.addEventListener('change', applyFilters);

    // Modal
    closeModal.addEventListener('click', closeStudentModal);
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeStudentModal();
        }
    });

    // Paginación
    prevPageBtn.addEventListener('click', () => changePage(-1));
    nextPageBtn.addEventListener('click', () => changePage(1));

    // Pestañas del modal
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-tab')) {
            showModalTab(e.target.getAttribute('data-tab'));
        }
    });

    // Event listeners para descarga PDF
    downloadAllPDF.addEventListener('click', () => downloadAllStudentsPDF());
    downloadAllExcel.addEventListener('click', () => downloadAllStudentsExcel());
    downloadSearchPDF.addEventListener('click', () => downloadSearchResultsPDF());
    downloadSearchExcel.addEventListener('click', () => downloadSearchResultsExcel());
    downloadStudentPDF.addEventListener('click', () => downloadIndividualStudentPDF());
}

function showSection(sectionName) {
    // Actualizar navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Mostrar sección
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');

    currentSection = sectionName;

    // Cargar datos según la sección
    if (sectionName === 'lista') {
        loadAllStudents();
    } else {
        clearSearchResults();
    }
}

function showLoading() {
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showPDFLoading() {
    pdfLoadingSpinner.style.display = 'block';
}

function hidePDFLoading() {
    pdfLoadingSpinner.style.display = 'none';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="no-results">
            <h3>Error de Conexión</h3>
            <p>${message}</p>
            <p>Verifica que:</p>
            <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
                <li>El servidor web esté ejecutándose (XAMPP, WAMP, etc.)</li>
                <li>La base de datos MySQL esté activa</li>
                <li>Las credenciales de la base de datos sean correctas</li>
                <li>La base de datos 'ludik' exista</li>
            </ul>
        </div>
    `;

    if (currentSection === 'buscar') {
        searchResults.innerHTML = '';
        searchResults.appendChild(errorDiv);
    } else {
        studentsGrid.innerHTML = '';
        studentsGrid.appendChild(errorDiv);
    }
}

async function makeRequest(action, params = {}) {
    showLoading();

    try {
        // Construir URL correctamente usando la URL base configurada
        const url = new URL(API_BASE_URL, window.location.href);
        url.searchParams.append('action', action);

        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        console.log('Realizando petición a:', url.toString());

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Error desconocido en el servidor');
        }

        return data;

    } catch (error) {
        console.error('Error en la petición:', error);

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('No se puede conectar al servidor. Verifica que el servidor web esté ejecutándose.');
        } else if (error.message.includes('HTTP')) {
            showError(`Error del servidor: ${error.message}`);
        } else {
            showError(error.message);
        }

        throw error;
    } finally {
        hideLoading();
    }
}

async function loadFilters() {
    try {
        const data = await makeRequest('getFilters');

        // Cargar grados
        gradoFilter.innerHTML = '<option value="">Todos los grados</option>';
        data.grados.forEach(grado => {
            const option = document.createElement('option');
            option.value = grado.id_grado;
            option.textContent = grado.grado;
            gradoFilter.appendChild(option);
        });

        // Cargar grupos
        grupoFilter.innerHTML = '<option value="">Todos los grupos</option>';
        data.grupos.forEach(grupo => {
            const option = document.createElement('option');
            option.value = grupo.id_grupo;
            option.textContent = `${grupo.grado} - ${grupo.grupo}`;
            grupoFilter.appendChild(option);
        });

    } catch (error) {
        console.error('Error cargando filtros:', error);
    }
}

async function performSearch() {
    const searchTerm = searchInput.value.trim();

    if (searchTerm.length < 2) {
        showError('Ingresa al menos 2 caracteres para buscar');
        return;
    }

    try {
        const data = await makeRequest('searchStudents', { term: searchTerm });
        currentSearchResults = data.students;
        displaySearchResults(data.students);

        // Mostrar botones de descarga si hay resultados
        if (data.students.length > 0) {
            searchDownloadControls.style.display = 'block';
        } else {
            searchDownloadControls.style.display = 'none';
        }
    } catch (error) {
        console.error('Error en la búsqueda:', error);
    }
}

function displaySearchResults(students) {
    searchResults.innerHTML = '';

    if (students.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <h3>Sin resultados</h3>
                <p>No se encontraron estudiantes que coincidan con tu búsqueda.</p>
            </div>
        `;
        return;
    }

    students.forEach(student => {
        const studentCard = createStudentCard(student);
        searchResults.appendChild(studentCard);
    });
}

async function loadAllStudents() {
    try {
        const data = await makeRequest('getAllStudents');
        allStudents = data.students;
        displayStudentsList();
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
    }
}

function displayStudentsList() {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const studentsToShow = allStudents.slice(startIndex, endIndex);

    studentsGrid.innerHTML = '';

    if (studentsToShow.length === 0) {
        studentsGrid.innerHTML = `
            <div class="no-results">
                <h3>Sin estudiantes</h3>
                <p>No hay estudiantes registrados en el sistema.</p>
            </div>
        `;
        return;
    }

    studentsToShow.forEach(student => {
        const studentCard = createStudentCard(student);
        studentsGrid.appendChild(studentCard);
    });

    updatePaginationInfo();
}

function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.onclick = () => showStudentDetails(student.id_estudiante);

    const fullName = `${student.nombre} ${student.apellidos}`.trim();
    const documento = student.no_documento || 'Sin documento';
    const grado = student.grado || 'Sin asignar';
    const grupo = student.grupo || 'Sin grupo';
    const telefono = student.telefono || 'Sin teléfono';
    const correo = student.correo || 'Sin correo';

    card.innerHTML = `
        <div class="student-name">${fullName}</div>
        <div class="student-info">
            <div><strong>Documento:</strong> ${documento}</div>
            <div><strong>Grado:</strong> ${grado}</div>
            <div><strong>Grupo:</strong> ${grupo}</div>
            <div><strong>Teléfono:</strong> ${telefono}</div>
            <div><strong>Correo:</strong> ${correo}</div>
        </div>
        <div class="student-badge">${grado} - ${grupo}</div>
    `;

    return card;
}

async function showStudentDetails(studentId) {
    try {
        const data = await makeRequest('getStudentDetails', { id: studentId });
        const student = data.student;
        currentStudentData = student;

        // Actualizar título del modal
        document.getElementById('modalTitle').textContent =
            `${student.nombre} ${student.apellidos}`;

        // Llenar información personal
        fillPersonalInfo(student);
        fillAcademicInfo(student);
        fillFamilyInfo(student);
        fillMedicalInfo(student);
        fillPiarInfo(student);

        // Mostrar modal
        modal.style.display = 'block';
        showModalTab('personal');

    } catch (error) {
        console.error('Error cargando detalles del estudiante:', error);
        alert('Error al cargar los detalles del estudiante');
    }
}

function fillPersonalInfo(student) {
    const fields = {
        'nombreCompleto': `${student.nombre} ${student.apellidos}`,
        'documento': `${student.tipo_documento || ''} ${student.no_documento || ''}`.trim(),
        'fechaNacimiento': student.fecha_nacimiento || 'No registrada',
        'lugarNacimiento': student.lugar_nacimiento || 'No registrado',
        'sector': student.sector || 'No registrado',
        'direccion': student.direccion || 'No registrada',
        'telefono': student.telefono || 'No registrado',
        'correo': student.correo || 'No registrado',
        'victimaConflicto': student.victima_conflicto || 'No especificado',
        'grupoEtnico': student.grupo_etnico || 'No especificado',
        'conQuienVive': student.con_quien_vive || 'No especificado',
        'afiliacionSalud': student.afiliacion_salud || 'No especificada'
    };

    Object.keys(fields).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.textContent = fields[fieldId];
        }
    });
}

function fillAcademicInfo(student) {
    document.getElementById('gradoActual').textContent = student.grado || 'No asignado';
    document.getElementById('grupoActual').textContent = student.grupo || 'No asignado';

    // Información del entorno educativo
    const entornoDiv = document.getElementById('entornoEducativo');
    entornoDiv.innerHTML = '';

    if (student.entorno_educativo) {
        const entorno = student.entorno_educativo;
        entornoDiv.innerHTML = `
            <div class="info-item">
                <span class="label">Último grado cursado:</span>
                <span class="value">${entorno.ultimo_grado_cursado || 'No especificado'}</span>
            </div>
            <div class="info-item">
                <span class="label">Vinculado a otra institución:</span>
                <span class="value">${entorno.vinculado_otra_inst || 'No especificado'}</span>
            </div>
            <div class="info-item">
                <span class="label">Modalidad proveniente:</span>
                <span class="value">${entorno.modalidad_proveniente || 'No especificado'}</span>
            </div>
            <div class="info-item">
                <span class="label">Programas complementarios:</span>
                <span class="value">${entorno.asiste_programas_complementarios || 'No especificado'}</span>
            </div>
            <div class="info-item">
                <span class="label">Observaciones:</span>
                <span class="value">${entorno.observacion || 'Ninguna'}</span>
            </div>
        `;
    } else {
        entornoDiv.innerHTML = '<p>No hay información del entorno educativo registrada.</p>';
    }
}

function fillFamilyInfo(student) {
    // Información de la madre
    fillParentInfo('infoMadre', student.madre, 'madre');
    // Información del padre
    fillParentInfo('infoPadre', student.padre, 'padre');
    // Información del acudiente
    fillParentInfo('infoAcudiente', student.acudiente, 'acudiente');
}

function fillParentInfo(containerId, parentData, parentType) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!parentData) {
        container.innerHTML = `<p>No hay información de ${parentType} registrada.</p>`;
        return;
    }

    container.innerHTML = `
        <div class="info-item">
            <span class="label">Nombre completo:</span>
            <span class="value">${parentData.nombre_completo || 'No registrado'}</span>
        </div>
        <div class="info-item">
            <span class="label">Nivel educativo:</span>
            <span class="value">${parentData.nivel_educativo || 'No especificado'}</span>
        </div>
        <div class="info-item">
            <span class="label">Ocupación:</span>
            <span class="value">${parentData.ocupacion || 'No especificada'}</span>
        </div>
        <div class="info-item">
            <span class="label">Teléfono:</span>
            <span class="value">${parentData.telefono || 'No registrado'}</span>
        </div>
        <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">${parentData.email || 'No registrado'}</span>
        </div>
        ${parentType === 'acudiente' ? `
        <div class="info-item">
            <span class="label">Parentesco:</span>
            <span class="value">${parentData.parentesco || 'No especificado'}</span>
        </div>` : ''}
    `;
}

function fillMedicalInfo(student) {
    const container = document.getElementById('infoMedica');
    container.innerHTML = '';

    if (!student.info_medica) {
        container.innerHTML = '<p>No hay información médica registrada.</p>';
        return;
    }

    const medicalInfo = student.info_medica;
    let html = '';

    // Diagnósticos
    if (medicalInfo.diagnosticos && medicalInfo.diagnosticos.length > 0) {
        html += '<h4>Diagnósticos:</h4><ul>';
        medicalInfo.diagnosticos.forEach(diagnostico => {
            html += `<li><strong>${diagnostico.id_cie10}:</strong> ${diagnostico.descripcion}</li>`;
        });
        html += '</ul>';
    }

    // Medicamentos
    if (medicalInfo.medicamentos && medicalInfo.medicamentos.length > 0) {
        html += '<h4>Medicamentos:</h4><ul>';
        medicalInfo.medicamentos.forEach(medicamento => {
            html += `<li><strong>${medicamento.descripcion}</strong> - ${medicamento.frecuencia_horario}</li>`;
        });
        html += '</ul>';
    }

    // Tratamientos
    if (medicalInfo.tratamientos && medicalInfo.tratamientos.length > 0) {
        html += '<h4>Tratamientos:</h4><ul>';
        medicalInfo.tratamientos.forEach(tratamiento => {
            html += `<li><strong>${tratamiento.descripcion}</strong> - ${tratamiento.frecuencia}</li>`;
        });
        html += '</ul>';
    }

    if (html === '') {
        html = '<p>No hay información médica específica registrada.</p>';
    }

    container.innerHTML = html;
}

function fillPiarInfo(student) {
    const container = document.getElementById('infoPiar');
    const valoracionesContainer = document.getElementById('valoracionesList');

    // Información del PIAR
    if (student.piar) {
        const piar = student.piar;
        container.innerHTML = `
            <div class="info-item">
                <span class="label">Fecha:</span>
                <span class="value">${piar.fecha || 'No registrada'}</span>
            </div>
            <div class="info-item">
                <span class="label">Ajustes:</span>
                <span class="value">${piar.ajuste || 'No especificados'}</span>
            </div>
            <div class="info-item">
                <span class="label">Apoyos:</span>
                <span class="value">${piar.apoyo || 'No especificados'}</span>
            </div>
            <div class="info-item">
                <span class="label">Barreras:</span>
                <span class="value">${piar.barrera || 'No especificadas'}</span>
            </div>
        `;
    } else {
        container.innerHTML = '<p>No hay PIAR registrado para este estudiante.</p>';
    }

    // Valoraciones pedagógicas
    valoracionesContainer.innerHTML = '';

    if (student.valoraciones && student.valoraciones.length > 0) {
        student.valoraciones.forEach(valoracion => {
            const valoracionDiv = document.createElement('div');
            valoracionDiv.className = 'valoracion-item';
            valoracionDiv.innerHTML = `
                <h4>${valoracion.nombre_asig} - ${valoracion.periodo} ${valoracion.anio}</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Objetivo:</span>
                        <span class="value">${valoracion.objetivo || 'No especificado'}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Barrera:</span>
                        <span class="value">${valoracion.barrera || 'No especificada'}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Tipo de ajuste:</span>
                        <span class="value">${valoracion.tipo_ajuste || 'No especificado'}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Apoyo requerido:</span>
                        <span class="value">${valoracion.apoyo_requerido || 'No especificado'}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Seguimiento:</span>
                        <span class="value">${valoracion.seguimiento || 'No especificado'}</span>
                    </div>
                </div>
            `;
            valoracionesContainer.appendChild(valoracionDiv);
        });
    } else {
        valoracionesContainer.innerHTML = '<p>No hay valoraciones pedagógicas registradas.</p>';
    }
}

// ===================== FUNCIONES DE DESCARGA PDF =====================

// Función para descargar PDF de estudiante individual
async function downloadIndividualStudentPDF() {
    if (!currentStudentData) {
        alert('No hay datos de estudiante para descargar');
        return;
    }

    showPDFLoading();

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configuración de la página
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;

        // Función para agregar nueva página si es necesario
        function checkPageBreak(neededHeight = 10) {
            if (yPosition + neededHeight > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
                return true;
            }
            return false;
        }

        // Función para agregar texto con ajuste automático
        function addText(text, fontSize = 10, style = 'normal', maxWidth = pageWidth - 2 * margin) {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', style);

            const splitText = doc.splitTextToSize(text, maxWidth);
            const textHeight = splitText.length * (fontSize * 0.4);

            checkPageBreak(textHeight + 5);

            doc.text(splitText, margin, yPosition);
            yPosition += textHeight + 5;
        }

        // Función para agregar sección
        function addSection(title, content) {
            checkPageBreak(15);

            // Título de sección
            doc.setFillColor(102, 126, 234);
            doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 12, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin + 5, yPosition + 3);

            yPosition += 15;
            doc.setTextColor(0, 0, 0);

            // Contenido
            if (typeof content === 'object') {
                Object.keys(content).forEach(key => {
                    if (content[key]) {
                        addText(`${key}: ${content[key]}`, 10, 'normal');
                    }
                });
            } else {
                addText(content, 10, 'normal');
            }

            yPosition += 5;
        }

        // Encabezado del documento
        doc.setFillColor(102, 126, 234);
        doc.rect(0, 0, pageWidth, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('LUDIK - Información del Estudiante', margin, 20);

        yPosition = 40;
        doc.setTextColor(0, 0, 0);

        // Información personal
        const personalData = {
            'Nombre Completo': `${currentStudentData.nombre} ${currentStudentData.apellidos}`,
            'Documento': `${currentStudentData.tipo_documento || ''} ${currentStudentData.no_documento || ''}`.trim(),
            'Fecha de Nacimiento': currentStudentData.fecha_nacimiento || 'No registrada',
            'Lugar de Nacimiento': currentStudentData.lugar_nacimiento || 'No registrado',
            'Sector': currentStudentData.sector || 'No registrado',
            'Dirección': currentStudentData.direccion || 'No registrada',
            'Teléfono': currentStudentData.telefono || 'No registrado',
            'Correo': currentStudentData.correo || 'No registrado',
            'Víctima de Conflicto': currentStudentData.victima_conflicto || 'No especificado',
            'Grupo Étnico': currentStudentData.grupo_etnico || 'No especificado',
            'Con quien Vive': currentStudentData.con_quien_vive || 'No especificado',
            'Afiliación de Salud': currentStudentData.afiliacion_salud || 'No especificada'
        };

        addSection('DATOS PERSONALES', personalData);

        // Información académica
        const academicData = {
            'Grado Actual': currentStudentData.grado || 'No asignado',
            'Grupo': currentStudentData.grupo || 'No asignado'
        };

        if (currentStudentData.entorno_educativo) {
            const entorno = currentStudentData.entorno_educativo;
            academicData['Último grado cursado'] = entorno.ultimo_grado_cursado || 'No especificado';
            academicData['Vinculado a otra institución'] = entorno.vinculado_otra_inst || 'No especificado';
            academicData['Modalidad proveniente'] = entorno.modalidad_proveniente || 'No especificado';
            academicData['Programas complementarios'] = entorno.asiste_programas_complementarios || 'No especificado';
            academicData['Observaciones'] = entorno.observacion || 'Ninguna';
        }

        addSection('INFORMACIÓN ACADÉMICA', academicData);

        // Información familiar - Acudiente
        if (currentStudentData.acudiente) {
            const acudienteData = {
                'Nombre completo': currentStudentData.acudiente.nombre_completo || 'No registrado',
                'Parentesco': currentStudentData.acudiente.parentesco || 'No especificado',
                'Nivel educativo': currentStudentData.acudiente.nivel_educativo || 'No especificado',
                'Ocupación': currentStudentData.acudiente.ocupacion || 'No especificada',
                'Teléfono': currentStudentData.acudiente.telefono || 'No registrado',
                'Email': currentStudentData.acudiente.email || 'No registrado'
            };
            addSection('INFORMACIÓN DEL ACUDIENTE', acudienteData);
        }

        // Información familiar - Madre
        if (currentStudentData.madre) {
            const madreData = {
                'Nombre completo': currentStudentData.madre.nombre_completo || 'No registrado',
                'Nivel educativo': currentStudentData.madre.nivel_educativo || 'No especificado',
                'Ocupación': currentStudentData.madre.ocupacion || 'No especificada',
                'Teléfono': currentStudentData.madre.telefono || 'No registrado',
                'Email': currentStudentData.madre.email || 'No registrado'
            };
            addSection('INFORMACIÓN DE LA MADRE', madreData);
        }

        // Información familiar - Padre
        if (currentStudentData.padre) {
            const padreData = {
                'Nombre completo': currentStudentData.padre.nombre_completo || 'No registrado',
                'Nivel educativo': currentStudentData.padre.nivel_educativo || 'No especificado',
                'Ocupación': currentStudentData.padre.ocupacion || 'No especificada',
                'Teléfono': currentStudentData.padre.telefono || 'No registrado',
                'Email': currentStudentData.padre.email || 'No registrado'
            };
            addSection('INFORMACIÓN DEL PADRE', padreData);
        }

        // Información médica
        if (currentStudentData.info_medica) {
            let medicalText = '';
            const medical = currentStudentData.info_medica;

            if (medical.diagnosticos && medical.diagnosticos.length > 0) {
                medicalText += 'DIAGNÓSTICOS:\n';
                medical.diagnosticos.forEach(diag => {
                    medicalText += `• ${diag.id_cie10}: ${diag.descripcion}\n`;
                });
                medicalText += '\n';
            }

            if (medical.medicamentos && medical.medicamentos.length > 0) {
                medicalText += 'MEDICAMENTOS:\n';
                medical.medicamentos.forEach(med => {
                    medicalText += `• ${med.descripcion} - ${med.frecuencia_horario}\n`;
                });
                medicalText += '\n';
            }

            if (medical.tratamientos && medical.tratamientos.length > 0) {
                medicalText += 'TRATAMIENTOS:\n';
                medical.tratamientos.forEach(trat => {
                    medicalText += `• ${trat.descripcion} - ${trat.frecuencia}\n`;
                });
            }

            if (medicalText) {
                addSection('INFORMACIÓN MÉDICA', medicalText);
            }
        }

        // PIAR
        if (currentStudentData.piar) {
            const piarData = {
                'Fecha': currentStudentData.piar.fecha || 'No registrada',
                'Ajustes': currentStudentData.piar.ajuste || 'No especificados',
                'Apoyos': currentStudentData.piar.apoyo || 'No especificados',
                'Barreras': currentStudentData.piar.barrera || 'No especificadas'
            };
            addSection('PLAN INDIVIDUAL DE AJUSTES RAZONABLES (PIAR)', piarData);
        }

        // Valoraciones pedagógicas
        if (currentStudentData.valoraciones && currentStudentData.valoraciones.length > 0) {
            let valoracionesText = '';
            currentStudentData.valoraciones.forEach((val, index) => {
                valoracionesText += `${index + 1}. ${val.nombre_asig} - ${val.periodo} ${val.anio}\n`;
                valoracionesText += `   Objetivo: ${val.objetivo || 'No especificado'}\n`;
                valoracionesText += `   Barrera: ${val.barrera || 'No especificada'}\n`;
                valoracionesText += `   Tipo de ajuste: ${val.tipo_ajuste || 'No especificado'}\n`;
                valoracionesText += `   Apoyo requerido: ${val.apoyo_requerido || 'No especificado'}\n`;
                valoracionesText += `   Seguimiento: ${val.seguimiento || 'No especificado'}\n\n`;
            });
            addSection('VALORACIONES PEDAGÓGICAS', valoracionesText);
        }

        // Pie de página
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 30, pageHeight - 10);
            doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')}`, margin, pageHeight - 10);
        }

        // Guardar PDF
        const fileName = `estudiante_${currentStudentData.nombre}_${currentStudentData.apellidos}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error('Error generando PDF:', error);
        alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
        hidePDFLoading();
    }
}

// Función para descargar PDF de todos los estudiantes
async function downloadAllStudentsPDF() {
    if (!allStudents || allStudents.length === 0) {
        alert('No hay estudiantes para descargar');
        return;
    }

    showPDFLoading();

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configuración
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;

        // Encabezado
        doc.setFillColor(102, 126, 234);
        doc.rect(0, 0, pageWidth, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('LUDIK - Lista Completa de Estudiantes', margin, 20);

        yPosition = 40;
        doc.setTextColor(0, 0, 0);

        // Función para nueva página
        function checkPageBreak(neededHeight = 10) {
            if (yPosition + neededHeight > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
                return true;
            }
            return false;
        }

        // Información general
        doc.setFontSize(12);
        doc.text(`Total de estudiantes: ${allStudents.length}`, margin, yPosition);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, margin, yPosition + 10);
        yPosition += 30;

        // Lista de estudiantes
        allStudents.forEach((student, index) => {
            checkPageBreak(25);

            // Fondo alternado
            if (index % 2 === 0) {
                doc.setFillColor(248, 250, 252);
                doc.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 20, 'F');
            }

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');

            const fullName = `${student.nombre} ${student.apellidos}`.trim();
            doc.text(`${index + 1}. ${fullName}`, margin, yPosition);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            const documento = student.no_documento || 'Sin documento';
            const grado = student.grado || 'Sin asignar';
            const grupo = student.grupo || 'Sin grupo';
            const telefono = student.telefono || 'Sin teléfono';

            doc.text(`Documento: ${documento}`, margin + 5, yPosition + 7);
            doc.text(`Grado: ${grado} - Grupo: ${grupo}`, margin + 5, yPosition + 14);
            doc.text(`Teléfono: ${telefono}`, margin + 100, yPosition + 7);

            yPosition += 25;
        });

        // Pie de página
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 30, pageHeight - 10);
        }

        // Guardar
        const fileName = `estudiantes_completo_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error('Error generando PDF:', error);
        alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
        hidePDFLoading();
    }
}

// Función para descargar PDF de resultados de búsqueda
async function downloadSearchResultsPDF() {
    if (!currentSearchResults || currentSearchResults.length === 0) {
        alert('No hay resultados de búsqueda para descargar');
        return;
    }

    showPDFLoading();

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Similar a downloadAllStudentsPDF pero con currentSearchResults
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;

        // Encabezado
        doc.setFillColor(102, 126, 234);
        doc.rect(0, 0, pageWidth, 30, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('LUDIK - Resultados de Búsqueda', margin, 20);

        yPosition = 40;
        doc.setTextColor(0, 0, 0);

        function checkPageBreak(neededHeight = 10) {
            if (yPosition + neededHeight > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
                return true;
            }
            return false;
        }

        // Información de búsqueda
        doc.setFontSize(12);
        doc.text(`Término buscado: "${searchInput.value}"`, margin, yPosition);
        doc.text(`Resultados encontrados: ${currentSearchResults.length}`, margin, yPosition + 10);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, margin, yPosition + 20);
        yPosition += 40;

        // Lista de resultados
        currentSearchResults.forEach((student, index) => {
            checkPageBreak(25);

            if (index % 2 === 0) {
                doc.setFillColor(248, 250, 252);
                doc.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 20, 'F');
            }

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');

            const fullName = `${student.nombre} ${student.apellidos}`.trim();
            doc.text(`${index + 1}. ${fullName}`, margin, yPosition);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            const documento = student.no_documento || 'Sin documento';
            const grado = student.grado || 'Sin asignar';
            const grupo = student.grupo || 'Sin grupo';
            const telefono = student.telefono || 'Sin teléfono';

            doc.text(`Documento: ${documento}`, margin + 5, yPosition + 7);
            doc.text(`Grado: ${grado} - Grupo: ${grupo}`, margin + 5, yPosition + 14);
            doc.text(`Teléfono: ${telefono}`, margin + 100, yPosition + 7);

            yPosition += 25;
        });

        // Pie de página
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 30, pageHeight - 10);
        }

        const fileName = `busqueda_estudiantes_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error('Error generando PDF:', error);
        alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
        hidePDFLoading();
    }
}

// ===================== FUNCIONES DE DESCARGA EXCEL =====================

// Función para generar CSV (como alternativa a Excel)
function downloadAllStudentsExcel() {
    if (!allStudents || allStudents.length === 0) {
        alert('No hay estudiantes para descargar');
        return;
    }

    try {
        // Crear CSV
        const headers = ['Nombre', 'Apellidos', 'Documento', 'Grado', 'Grupo', 'Teléfono', 'Correo'];
        let csvContent = headers.join(',') + '\n';

        allStudents.forEach(student => {
            const row = [
                student.nombre || '',
                student.apellidos || '',
                student.no_documento || '',
                student.grado || '',
                student.grupo || '',
                student.telefono || '',
                student.correo || ''
            ];
            csvContent += row.map(field => `"${field}"`).join(',') + '\n';
        });

        // Descargar
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `estudiantes_completo_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error('Error generando CSV:', error);
        alert('Error al generar el archivo CSV');
    }
}

function downloadSearchResultsExcel() {
    if (!currentSearchResults || currentSearchResults.length === 0) {
        alert('No hay resultados de búsqueda para descargar');
        return;
    }

    try {
        const headers = ['Nombre', 'Apellidos', 'Documento', 'Grado', 'Grupo', 'Teléfono', 'Correo'];
        let csvContent = headers.join(',') + '\n';

        currentSearchResults.forEach(student => {
            const row = [
                student.nombre || '',
                student.apellidos || '',
                student.no_documento || '',
                student.grado || '',
                student.grupo || '',
                student.telefono || '',
                student.correo || ''
            ];
            csvContent += row.map(field => `"${field}"`).join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `busqueda_estudiantes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error('Error generando CSV:', error);
        alert('Error al generar el archivo CSV');
    }
}

// ===================== FUNCIONES RESTANTES =====================

function showModalTab(tabName) {
    // Actualizar pestañas
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Mostrar contenido
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function closeStudentModal() {
    modal.style.display = 'none';
    currentStudentData = null;
}

function clearSearchResults() {
    searchResults.innerHTML = '';
    searchDownloadControls.style.display = 'none';
    currentSearchResults = [];
}

function applyFilters() {
    // Esta función se puede implementar para filtrar por grado y grupo
    // Por ahora solo realizamos una nueva búsqueda si hay término
    if (searchInput.value.trim()) {
        performSearch();
    }
}

function updatePaginationInfo() {
    const totalPages = Math.ceil(allStudents.length / studentsPerPage);
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function changePage(direction) {
    const totalPages = Math.ceil(allStudents.length / studentsPerPage);

    if (direction === -1 && currentPage > 1) {
        currentPage--;
    } else if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    }

    displayStudentsList();
}

// Función de utilidad para debugging
window.testConnection = async function () {
    console.log('Probando conexión...');
    try {
        const data = await makeRequest('getFilters');
        console.log('Conexión exitosa:', data);
        return data;
    } catch (error) {
        console.error('Error de conexión:', error);
        return null;
    }
};