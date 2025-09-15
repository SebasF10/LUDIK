// JavaScript para Estudiantes.html - Sistema de Gestión de Estudiantes

// Líneas de debugging - agregar después de la línea 1
console.log('=== DEBUG DE RUTAS ===');
console.log('URL actual:', window.location.href);
console.log('Protocolo:', window.location.protocol);
console.log('Ruta base:', window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')));

// Variables globales
let allStudents = [];
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
const pageInfo = document.getElementById('pageInfo');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');

// Configuración de la API
const API_BASE_URL = './php/Estudiantes.php';
console.log('API URL final:', new URL(API_BASE_URL, window.location.href).href);
// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

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
        displaySearchResults(data.students);
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
}

function clearSearchResults() {
    searchResults.innerHTML = '';
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