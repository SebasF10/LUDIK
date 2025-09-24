// ===================== FUNCIONES DE UTILIDAD =====================


function showLoading() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'block';
    }
}

function hideLoading() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}

function showPDFLoading() {
    if (pdfLoadingSpinner) {
        pdfLoadingSpinner.style.display = 'block';
    }
}

function hidePDFLoading() {
    if (pdfLoadingSpinner) {
        pdfLoadingSpinner.style.display = 'none';
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="no-results">
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;

    if (currentSection === 'buscar' && searchResults) {
        searchResults.innerHTML = '';
        searchResults.appendChild(errorDiv);
    } else if (studentsGrid) {
        studentsGrid.innerHTML = '';
        studentsGrid.appendChild(errorDiv);
    }

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (errorDiv && errorDiv.parentNode) {
            errorDiv.remove();
=======
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
    }, 5000);
}


function showModalTab(tabName) {
    // Actualizar pestañas
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Mostrar contenido
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      
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
    const activeContent = document.getElementById(`${tabName}Tab`);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

function closeStudentModal() {
    if (modal) {
        modal.style.display = 'none';
    }
    currentStudentData = null;
}

/**
 * Limpiar resultados de búsqueda
 */
function clearSearchResults() {
    if (searchResults) {
        searchResults.innerHTML = '';
    }
    if (searchDownloadControls) {
        searchDownloadControls.style.display = 'none';
    }
    currentSearchResults = [];
}

/**
 * Aplicar filtros
 */
function applyFilters() {
    if (searchInput && searchInput.value.trim()) {
        performSearch();
    }
}

/**
 * Actualizar información de paginación
 */
function updatePaginationInfo() {
    if (!pageInfo) return;
    
    const totalPages = Math.ceil(allStudents.length / studentsPerPage);
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage === 1;
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
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
}


function changePage(direction) {
    const totalPages = Math.ceil(allStudents.length / studentsPerPage);

// Líneas de debugging
console.log('=== DEBUG DE RUTAS ===');
console.log('URL actual:', window.location.href);
console.log('Protocolo:', window.location.protocol);
console.log('Ruta base:', window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')));


    if (direction === -1 && currentPage > 1) {
        currentPage--;
    } else if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    }

    displayStudentsList();
}

// ===================== FUNCIONES DE DESCARGA PDF =====================

/**
 * Descargar PDF de estudiante individual
 */
async function downloadIndividualStudentPDF() {
    if (!currentStudentData) {
        alert('No hay datos de estudiante para descargar');
        return;
    }


    // Verificar permisos de descarga según rol
    if (!canDownloadStudentData()) {
        alert('No tiene permisos para descargar esta información');
        return;
    }

    showPDFLoading();

// Inicialización de funcionalidad específica de estudiantes
function initializeApp() {
    setupEventListeners();
    loadFilters();


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

        // Información personal (adaptada según rol)
        const personalData = getPersonalDataForPDF(currentStudentData);
        addSection('DATOS PERSONALES', personalData);

        // Información académica (según permisos)
        if (canViewAcademicInfo()) {
            const academicData = getAcademicDataForPDF(currentStudentData);
            addSection('INFORMACIÓN ACADÉMICA', academicData);
        }

        // Información familiar (según permisos)
        if (canViewFamilyInfo()) {
            const familyData = getFamilyDataForPDF(currentStudentData);
            if (familyData) {
                addSection('INFORMACIÓN FAMILIAR', familyData);
            }
        }

        // Información médica (según permisos)
        if (canViewMedicalInfo()) {
            const medicalData = getMedicalDataForPDF(currentStudentData);
            if (medicalData) {
                addSection('INFORMACIÓN MÉDICA', medicalData);
            }
        }

        // PIAR (solo roles educativos)
        if (canViewPiarInfo() && currentStudentData.piar) {
            const piarData = {
                'Fecha': currentStudentData.piar.fecha || 'No registrada',
                'Ajustes': currentStudentData.piar.ajuste || 'No especificados',
                'Apoyos': currentStudentData.piar.apoyo || 'No especificados',
                'Barreras': currentStudentData.piar.barrera || 'No especificadas'
            };
            addSection('PLAN INDIVIDUAL DE AJUSTES RAZONABLES (PIAR)', piarData);
        }

        // Valoraciones pedagógicas (solo roles educativos)
        if (canViewPiarInfo() && currentStudentData.valoraciones && currentStudentData.valoraciones.length > 0) {
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

/**
 * Verificar si puede descargar datos del estudiante
 */
function canDownloadStudentData() {
    return ['admin', 'directivo', 'docente_apoyo', 'docente'].includes(currentUserRole);
}

/**
 * Verificar permisos de visualización
 */
function canViewAcademicInfo() {
    return ['admin', 'directivo', 'docente_apoyo', 'docente'].includes(currentUserRole);
}

function canViewFamilyInfo() {
    return ['admin', 'directivo', 'docente_apoyo', 'docente'].includes(currentUserRole) || 
           ['madre', 'padre', 'acudiente'].includes(currentUserRole);
}

function canViewMedicalInfo() {
    return ['admin', 'directivo', 'docente_apoyo', 'docente'].includes(currentUserRole);
}

function canViewPiarInfo() {
    return ['admin', 'directivo', 'docente_apoyo', 'docente'].includes(currentUserRole);
}

/**
 * Obtener datos personales para PDF según rol
 */
function getPersonalDataForPDF(student) {
    const baseData = {
        'Nombre Completo': `${student.nombre} ${student.apellidos}`,
        'Documento': `${student.tipo_documento || ''} ${student.no_documento || ''}`.trim(),
        'Fecha de Nacimiento': student.fecha_nacimiento || 'No registrada',
        'Teléfono': student.telefono || 'No registrado',
        'Correo': student.correo || 'No registrado',
        'Afiliación de Salud': student.afiliacion_salud || 'No especificada'
    };

    // Información completa solo para roles educativos
    if (canViewAcademicInfo()) {
        baseData['Lugar de Nacimiento'] = student.lugar_nacimiento || 'No registrado';
        baseData['Sector'] = student.sector || 'No registrado';
        baseData['Dirección'] = student.direccion || 'No registrada';
        baseData['Víctima de Conflicto'] = student.victima_conflicto || 'No especificado';
        baseData['Grupo Étnico'] = student.grupo_etnico || 'No especificado';
        baseData['Con quien Vive'] = student.con_quien_vive || 'No especificado';
    }

    return baseData;
}

/**
 * Obtener datos académicos para PDF
 */
function getAcademicDataForPDF(student) {
    const academicData = {
        'Grado Actual': student.grado || 'No asignado',
        'Grupo': student.grupo || 'No asignado'
    };

    if (student.entorno_educativo) {
        const entorno = student.entorno_educativo;
        academicData['Último grado cursado'] = entorno.ultimo_grado_cursado || 'No especificado';
        academicData['Vinculado a otra institución'] = entorno.vinculado_otra_inst || 'No especificado';
        academicData['Modalidad proveniente'] = entorno.modalidad_proveniente || 'No especificado';
        academicData['Programas complementarios'] = entorno.asiste_programas_complementarios || 'No especificado';
        academicData['Observaciones'] = entorno.observacion || 'Ninguna';
    }

    return academicData;
}

/**
 * Obtener datos familiares para PDF
 */
function getFamilyDataForPDF(student) {
    if (currentUserRole === 'madre' && student.madre) {
        return {
            'Información de la Madre': student.madre.nombre_completo || 'No registrado',
            'Nivel educativo': student.madre.nivel_educativo || 'No especificado',
            'Ocupación': student.madre.ocupacion || 'No especificada',
            'Teléfono': student.madre.telefono || 'No registrado',
            'Email': student.madre.email || 'No registrado'
        };
    } else if (currentUserRole === 'padre' && student.padre) {
        return {
            'Información del Padre': student.padre.nombre_completo || 'No registrado',
            'Nivel educativo': student.padre.nivel_educativo || 'No especificado',
            'Ocupación': student.padre.ocupacion || 'No especificada',
            'Teléfono': student.padre.telefono || 'No registrado',
            'Email': student.padre.email || 'No registrado'
        };
    } else if (currentUserRole === 'acudiente' && student.acudiente) {
        return {
            'Información del Acudiente': student.acudiente.nombre_completo || 'No registrado',
            'Parentesco': student.acudiente.parentesco || 'No especificado',
            'Nivel educativo': student.acudiente.nivel_educativo || 'No especificado',
            'Ocupación': student.acudiente.ocupacion || 'No especificada',
            'Teléfono': student.acudiente.telefono || 'No registrado',
            'Email': student.acudiente.email || 'No registrado'
        };
    } else if (canViewAcademicInfo()) {
        // Roles educativos pueden ver toda la información familiar
        const familyData = {};
        
        if (student.madre) {
            familyData['Madre - Nombre'] = student.madre.nombre_completo || 'No registrado';
            familyData['Madre - Ocupación'] = student.madre.ocupacion || 'No especificada';
            familyData['Madre - Teléfono'] = student.madre.telefono || 'No registrado';
        }
        
        if (student.padre) {
            familyData['Padre - Nombre'] = student.padre.nombre_completo || 'No registrado';
            familyData['Padre - Ocupación'] = student.padre.ocupacion || 'No especificada';
            familyData['Padre - Teléfono'] = student.padre.telefono || 'No registrado';
        }
        
        if (student.acudiente) {
            familyData['Acudiente - Nombre'] = student.acudiente.nombre_completo || 'No registrado';
            familyData['Acudiente - Parentesco'] = student.acudiente.parentesco || 'No especificado';
            familyData['Acudiente - Teléfono'] = student.acudiente.telefono || 'No registrado';
        }
        
        return familyData;
    }

    return null;
}

/**
 * Obtener datos médicos para PDF
 */
function getMedicalDataForPDF(student) {
    if (!student.info_medica) return null;

    let medicalText = '';
    const medical = student.info_medica;

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

    return medicalText || null;
}

/**
 * Descargar PDF de todos los estudiantes
 */
async function downloadAllStudentsPDF() {
    if (!allStudents || allStudents.length === 0) {
        alert('No hay estudiantes para descargar');
        return;
    }

    if (!canDownloadStudentData()) {
        alert('No tiene permisos para descargar esta información');
        return;
    }

    showPDFLoading();

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

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
        doc.text('LUDIK - Lista de Estudiantes', margin, 20);

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

        doc.setFontSize(12);
        doc.text(`Total de estudiantes: ${allStudents.length}`, margin, yPosition);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, margin, yPosition + 10);
        doc.text(`Generado por: ${getRoleDisplayName(currentUserRole)}`, margin, yPosition + 20);
        yPosition += 40;

        allStudents.forEach((student, index) => {
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

        const fileName = `estudiantes_completo_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error('Error generando PDF:', error);
        alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
        hidePDFLoading();
    }
}

/**
 * Descargar PDF de resultados de búsqueda
 */
async function downloadSearchResultsPDF() {
    if (!currentSearchResults || currentSearchResults.length === 0) {
        alert('No hay resultados de búsqueda para descargar');
        return;
    }

    if (!canDownloadStudentData()) {
        alert('No tiene permisos para descargar esta información');
        return;
    }

    showPDFLoading();

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;

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

        doc.setFontSize(12);
        doc.text(`Término buscado: "${searchInput.value}"`, margin, yPosition);
        doc.text(`Resultados encontrados: ${currentSearchResults.length}`, margin, yPosition + 10);
        doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, margin, yPosition + 20);
        yPosition += 40;

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

/**
 * Descargar Excel de todos los estudiantes
 */
function downloadAllStudentsExcel() {
    if (!allStudents || allStudents.length === 0) {
        alert('No hay estudiantes para descargar');
        return;
    }

    if (!canDownloadStudentData()) {
        alert('No tiene permisos para descargar esta información');
        return;
    }

    try {
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

/**
 * Descargar Excel de resultados de búsqueda
 */
function downloadSearchResultsExcel() {
    if (!currentSearchResults || currentSearchResults.length === 0) {
        alert('No hay resultados de búsqueda para descargar');
        return;
    }

    if (!canDownloadStudentData()) {
        alert('No tiene permisos para descargar esta información');
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

// ===================== FUNCIÓN DE UTILIDAD PARA DEBUGGING =====================

/**
 * Función de utilidad para debugging
 */
window.testConnection = async function () {
    console.log('Probando conexión...');
    try {
        const data = await makeAuthenticatedRequest('getFilters');
        console.log('Conexión exitosa:', data);
        return data;
    } catch (error) {
        console.error('Error de conexión:', error);
        return null;
    }
};

/**
 * Función para regresar o redireccionar
 */
function goBackOrRedirect(ruta) {
    if (ruta && ruta.trim() !== '') {
        window.location.href = ruta;
    } else {
        window.history.back();
    }
}// JavaScript para Estudiantes con Control de Roles y Fotos
// Estudiantes_con_roles.js

console.log("Script de estudiantes con roles cargado");

// ===================== FUNCIONALIDAD DEL MENÚ =====================

// Variables globales
let allStudents = [];
let currentSearchResults = [];
let currentStudentData = null;
let currentPage = 1;
const studentsPerPage = 12;
let currentSection = 'buscar';
let currentUserRole = null;
let currentUser = null;

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

// Funcionalidad del menú
const burger = document.getElementById('burger');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM cargado - ejecutando función de roles y inicialización");
    
    // Obtener rol del usuario
    currentUserRole = localStorage.getItem("rol");
    console.log("Rol del usuario:", currentUserRole);
    
    // Mostrar indicador de rol
    showRoleIndicator();
    
    // Configurar menú según rol
    eliminarBotonesPorRol();
    
    // Inicializar aplicación
    initializeApp();
});

/**
 * Mostrar indicador de rol en el header
 */
function showRoleIndicator() {
    const rightSection = document.querySelector('.right-section');
    
    if (currentUserRole) {
        const roleIndicator = document.createElement('div');
        roleIndicator.className = 'role-indicator';
        
        const roleIcon = document.createElement('div');
        roleIcon.className = 'role-icon';
        
        const roleText = document.createElement('span');
        roleText.textContent = getRoleDisplayName(currentUserRole);
        
        roleIndicator.appendChild(roleIcon);
        roleIndicator.appendChild(roleText);
        
        // Insertar antes del logo
        const logo = rightSection.querySelector('.header-logo');
        rightSection.insertBefore(roleIndicator, logo);
    }
}

/**
 * Obtener nombre de rol para mostrar
 */
function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'Administrador',
        'directivo': 'Directivo',
        'docente_apoyo': 'Docente de Apoyo',
        'docente': 'Docente',
        'madre': 'Madre',
        'padre': 'Padre',
        'acudiente': 'Acudiente'
    };
    
    return roleNames[role] || 'Usuario';
}

/**
 * Función para eliminar botones según rol
 */
function eliminarBotonesPorRol() {
    const rol = currentUserRole;
    console.log("Configurando menú para rol:", rol);

    const todosLosBotones = document.querySelectorAll('.menu-button');
    console.log("Botones encontrados:", todosLosBotones.length);

    todosLosBotones.forEach(function (boton, index) {
        const textoDelBoton = boton.textContent.trim().toLowerCase();
        console.log(`Botón ${index}: "${textoDelBoton}"`);

        // Lógica según el rol
        if (rol === "admin") {
            // Admin: puede ver todos los botones
            console.log("Usuario es admin, todos los botones visibles");

        } else if (rol === "directivo") {
            // Directivo: similar a admin pero sin crear cuentas
            if (textoDelBoton.includes("crear cuenta")) {
                console.log("Eliminando botón Crear Cuentas para directivo");
                boton.remove();
            }

        } else if (rol === "docente_apoyo") {
            // Docente de apoyo: ocultar solo "Crear Cuentas"
            if (textoDelBoton.includes("crear cuenta")) {
                console.log("Eliminando botón Crear Cuentas para docente_apoyo");
                boton.remove();
            }

        } else if (rol === "docente") {
            // Docente regular: ocultar varios botones
            if (textoDelBoton.includes("crear cuenta") ||
                textoDelBoton.includes("registrar un nuevo estudiante") ||
                textoDelBoton.includes("registrar un piar")) {
                console.log("Eliminando botón restringido para docente:", textoDelBoton);
                boton.remove();
            }

        } else if (rol === "madre" || rol === "padre" || rol === "acudiente") {
            // Padres: solo pueden ver estudiantes y comunicación
            if (!textoDelBoton.includes("estudiantes") &&
                !textoDelBoton.includes("comunicate") &&
                !textoDelBoton.includes("perfil") &&
                !textoDelBoton.includes("ayuda") &&
                !textoDelBoton.includes("cerrar sesion")) {
                console.log("Eliminando botón restringido para padre:", textoDelBoton);
                boton.remove();
            }

        } else {
            // Rol desconocido: comportamiento restrictivo
            console.log("Rol desconocido, aplicando restricciones máximas");
            if (!textoDelBoton.includes("perfil") &&
                !textoDelBoton.includes("ayuda") &&
                !textoDelBoton.includes("cerrar sesion")) {
                boton.remove();
            }
        }
    });
}

/**
 * Event listeners del menú
 */
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

// Manejar clicks de botones del menú
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('menu-button')) {
        const texto = e.target.textContent.trim().toLowerCase();

        console.log("=== DEBUG CLICK MENÚ ===");
        console.log("Texto:", texto);

        if (texto.includes('perfil')) {
            window.location.href = 'perfil.html';
        } else if (texto.includes('estudiantes')) {
            // Ya estamos en estudiantes, solo cerrar menú
            console.log("Ya estamos en la página de estudiantes");
        } else if (texto.includes('crear cuentas')) {
            window.location.href = 'Crear_cuentas.html';
        } else if (texto.includes('actividades')) {
            window.location.href = 'Ejercicios.html';
        } else if (texto.includes('registrar un nuevo estudiante')) {
            window.location.href = 'Registrar_estudiante.html';
        } else if (texto.includes('registrar un piar')) {
            window.location.href = 'Registrar_PIAR.html';
        } else if (texto.includes('valoración') || texto.includes('valoracion')) {
            window.location.href = 'Valoracion_pedagogica.html';
        } else if (texto.includes('comunicate')) {
            window.location.href = 'Comunicacion.html';
        } else if (texto.includes('ayuda')) {
            window.location.href = 'Ayuda.html';
        } else if (texto.includes('cerrar sesion') || texto.includes('cerrar sesión')) {
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                localStorage.removeItem('rol');
                window.location.href = 'Inicio_sesion.html';
            }
        }

        // Cerrar menú
        burger.checked = false;
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ===================== FUNCIONALIDAD DE ESTUDIANTES =====================

/**
 * Inicializar aplicación
 */
function initializeApp() {
    setupEventListeners();
    loadFilters();
    showSection('buscar');
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
    // Navegación interna
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Búsqueda
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Filtros
    if (gradoFilter) {
        gradoFilter.addEventListener('change', applyFilters);
    }
    if (grupoFilter) {
        grupoFilter.addEventListener('change', applyFilters);
    }


    if (closeModal) {
        closeModal.addEventListener('click', closeStudentModal);
    }
    
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeStudentModal();
        }
    });

        // Encabezado del documento
        doc.setFillColor(102, 126, 234);
        doc.rect(0, 0, pageWidth, 30, 'F');


    // Paginación
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => changePage(-1));
    }
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => changePage(1));
    }

    // Pestañas del modal
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-tab')) {
            showModalTab(e.target.getAttribute('data-tab'));
        }
    });

    // Event listeners para descarga PDF
    if (downloadAllPDF) {
        downloadAllPDF.addEventListener('click', () => downloadAllStudentsPDF());
    }
    if (downloadAllExcel) {
        downloadAllExcel.addEventListener('click', () => downloadAllStudentsExcel());
    }
    if (downloadSearchPDF) {
        downloadSearchPDF.addEventListener('click', () => downloadSearchResultsPDF());
    }
    if (downloadSearchExcel) {
        downloadSearchExcel.addEventListener('click', () => downloadSearchResultsExcel());
    }
    if (downloadStudentPDF) {
        downloadStudentPDF.addEventListener('click', () => downloadIndividualStudentPDF());
    }
}

/**
 * Mostrar sección
 */
function showSection(sectionName) {
    // Actualizar navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Mostrar sección
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const activeSection = document.getElementById(sectionName);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    currentSection = sectionName;

    // Cargar datos según la sección
    if (sectionName === 'lista') {
        loadAllStudents();
    } else {
        clearSearchResults();
    }
}


async function makeAuthenticatedRequest(action, params = {}) {
    showLoading();
=======
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
            const medical = currentStudentData.info_medica;e

    try {
        const url = new URL(API_BASE_URL, window.location.href);
        url.searchParams.append('action', action);

        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        console.log('Realizando petición autenticada a:', url.toString());

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin' // Incluir cookies de sesión
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

        if (error.message.includes('No autorizado')) {
            showError('Sesión expirada. Por favor, inicie sesión nuevamente.');
            setTimeout(() => {
                window.location.href = 'Inicio_sesion.html';
            }, 2000);
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('No se puede conectar al servidor. Verifique su conexión.');
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

/**
 * Cargar filtros según el rol
 */
async function loadFilters() {
    try {
        const data = await makeAuthenticatedRequest('getFilters');

        // Cargar grados
        if (gradoFilter) {
            gradoFilter.innerHTML = '<option value="">Todos los grados</option>';
            data.grados.forEach(grado => {
                const option = document.createElement('option');
                option.value = grado.id_grado;
                option.textContent = grado.grado;
                gradoFilter.appendChild(option);
            });
        }

        // Cargar grupos
        if (grupoFilter) {
            grupoFilter.innerHTML = '<option value="">Todos los grupos</option>';
            data.grupos.forEach(grupo => {
                const option = document.createElement('option');
                option.value = grupo.id_grupo;
                option.textContent = `${grupo.grado} - ${grupo.grupo}`;
                grupoFilter.appendChild(option);
            });
        }

    } catch (error) {
        console.error('Error cargando filtros:', error);
    }
}

/**
 * Realizar búsqueda
 */
async function performSearch() {
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();

    if (searchTerm.length < 2) {
        showError('Ingresa al menos 2 caracteres para buscar');
        return;
    }

    try {
        const data = await makeAuthenticatedRequest('searchStudents', { term: searchTerm });
        currentSearchResults = data.students;
        displaySearchResults(data.students);

        // Mostrar botones de descarga si hay resultados
        if (searchDownloadControls) {
            if (data.students.length > 0) {
                searchDownloadControls.style.display = 'block';
            } else {
                searchDownloadControls.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error en la búsqueda:', error);
    }
}

/**
 * Mostrar resultados de búsqueda
 */
function displaySearchResults(students) {
    if (!searchResults) return;
    
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

/**
 * Cargar todos los estudiantes
 */
async function loadAllStudents() {
    try {
        const data = await makeAuthenticatedRequest('getAllStudents');
        allStudents = data.students;
        displayStudentsList();
    } catch (error) {
        console.error('Error cargando estudiantes:', error);
    }
}

/**
 * Mostrar lista de estudiantes con paginación
 */
function displayStudentsList() {
    if (!studentsGrid) return;
    
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const studentsToShow = allStudents.slice(startIndex, endIndex);

    studentsGrid.innerHTML = '';

    if (studentsToShow.length === 0) {
        studentsGrid.innerHTML = `
            <div class="no-results">
                <h3>Sin estudiantes</h3>
                <p>No hay estudiantes registrados en el sistema o no tienes acceso a ninguno.</p>
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

/**
 * Crear tarjeta de estudiante con foto
 */
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

    // Crear elemento de foto
    let photoElement;
    if (student.foto_url && student.foto_url !== 'photos/default.png') {
        photoElement = `<img src="${student.foto_url}" alt="Foto de ${fullName}" class="student-photo" onerror="this.outerHTML='<div class=\\'student-photo default\\'>${getInitials(fullName)}</div>'">`;
    } else {
        photoElement = `<div class="student-photo default">${getInitials(fullName)}</div>`;
    }

    // Badge especial para padres
    let badgeClass = 'student-badge';
    let badgeText = `${grado} - ${grupo}`;
    
    if (['madre', 'padre', 'acudiente'].includes(currentUserRole)) {
        badgeClass += ' parent-relation';
        badgeText = getParentRelationText(currentUserRole);
    }

    card.innerHTML = `
        ${photoElement}
        <div class="student-name">${fullName}</div>
        <div class="student-info">
            <div><strong>Documento:</strong> ${documento}</div>
            <div><strong>Grado:</strong> ${grado}</div>
            <div><strong>Grupo:</strong> ${grupo}</div>
            <div><strong>Teléfono:</strong> ${telefono}</div>
            <div><strong>Correo:</strong> ${correo}</div>
        </div>
        <div class="${badgeClass}">${badgeText}</div>
    `;

    return card;
}

/**
 * Obtener iniciales del nombre
 */
function getInitials(fullName) {
    return fullName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
}

/**
 * Obtener texto de relación para padres
 */
function getParentRelationText(role) {
    const relations = {
        'madre': 'Mi hijo/a',
        'padre': 'Mi hijo/a', 
        'acudiente': 'A mi cargo'
    };
    return relations[role] || 'Estudiante';
}

/**
 * Mostrar detalles del estudiante
 */
async function showStudentDetails(studentId) {
    try {
        const data = await makeAuthenticatedRequest('getStudentDetails', { id: studentId });
        const student = data.student;
        currentStudentData = student;

        // Actualizar título del modal con foto
        const modalTitle = document.getElementById('modalTitle');
        const modalHeader = document.querySelector('.modal-header');
        
        if (modalTitle && modalHeader) {
            // Limpiar header anterior
            const existingPhoto = modalHeader.querySelector('.modal-student-photo');
            if (existingPhoto) {
                existingPhoto.remove();
            }

            modalTitle.textContent = `${student.nombre} ${student.apellidos}`;

            // Agregar foto al modal
            let photoElement;
            if (student.foto_url && student.foto_url !== 'photos/default.png') {
                photoElement = document.createElement('img');
                photoElement.src = student.foto_url;
                photoElement.alt = `Foto de ${student.nombre} ${student.apellidos}`;
                photoElement.className = 'modal-student-photo';
                photoElement.onerror = function() {
                    this.outerHTML = `<div class="modal-student-photo default">${getInitials(student.nombre + ' ' + student.apellidos)}</div>`;
                };
            } else {
                photoElement = document.createElement('div');
                photoElement.className = 'modal-student-photo default';
                photoElement.textContent = getInitials(student.nombre + ' ' + student.apellidos);
            }

            // Insertar foto antes del título
            modalHeader.insertBefore(photoElement, modalTitle);
        }

        // Llenar información según el rol
        if (['admin', 'directivo', 'docente_apoyo', 'docente'].includes(currentUserRole)) {
            // Roles educativos: información completa
            fillPersonalInfo(student);
            fillAcademicInfo(student);
            fillFamilyInfo(student);
            fillMedicalInfo(student);
            fillPiarInfo(student);
        } else if (['madre', 'padre', 'acudiente'].includes(currentUserRole)) {
            // Padres: información limitada
            fillPersonalInfoForParents(student);
            fillAcademicInfoForParents(student);
            fillFamilyInfoForParents(student);
            fillMedicalInfoForParents(student);
            fillPiarInfoForParents(student);
        }

        // Mostrar modal
        if (modal) {
            modal.style.display = 'block';
            showModalTab('personal');
        }

    } catch (error) {
        console.error('Error cargando detalles del estudiante:', error);
        alert('Error al cargar los detalles del estudiante');
    }
}

/**
 * Llenar información personal completa
 */
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

/**
 * Llenar información personal para padres (limitada)
 */
function fillPersonalInfoForParents(student) {
    const fields = {
        'nombreCompleto': `${student.nombre} ${student.apellidos}`,
        'documento': `${student.tipo_documento || ''} ${student.no_documento || ''}`.trim(),
        'fechaNacimiento': student.fecha_nacimiento || 'No registrada',
        'telefono': student.telefono || 'No registrado',
        'correo': student.correo || 'No registrado',
        'afiliacionSalud': student.afiliacion_salud || 'No especificada'
    };

    // Campos restringidos para padres
    const restrictedFields = ['lugarNacimiento', 'sector', 'direccion', 'victimaConflicto', 'grupoEtnico', 'conQuienVive'];
    
    Object.keys(fields).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.textContent = fields[fieldId];
        }
    });

    // Ocultar información restringida
    restrictedFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.textContent = 'Información restringida';
            element.style.color = '#94a3b8';
        }
    });
}

/**
 * Llenar información académica completa
 */
function fillAcademicInfo(student) {
    const gradoActual = document.getElementById('gradoActual');
    const grupoActual = document.getElementById('grupoActual');
    
    if (gradoActual) {
        gradoActual.textContent = student.grado || 'No asignado';
    }
    if (grupoActual) {
        grupoActual.textContent = student.grupo || 'No asignado';
    }

    // Información del entorno educativo
    const entornoDiv = document.getElementById('entornoEducativo');
    if (entornoDiv) {
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
}

/**
 * Llenar información académica para padres
 */
function fillAcademicInfoForParents(student) {
    const gradoActual = document.getElementById('gradoActual');
    const grupoActual = document.getElementById('grupoActual');
    
    if (gradoActual) {
        gradoActual.textContent = student.grado || 'No asignado';
    }
    if (grupoActual) {
        grupoActual.textContent = student.grupo || 'No asignado';
    }

    // Información del entorno educativo restringida
    const entornoDiv = document.getElementById('entornoEducativo');
    if (entornoDiv) {
        entornoDiv.innerHTML = `
            <div class="restricted-content">
                <h3>Información Académica Detallada</h3>
                <p>Esta información está disponible solo para el personal educativo. Para consultas específicas, contacte al docente o coordinador académico.</p>
            </div>
        `;
    }
}

/**
 * Llenar información familiar
 */
function fillFamilyInfo(student) {
    // Información de la madre
    fillParentInfo('infoMadre', student.madre, 'madre');
    // Información del padre  
    fillParentInfo('infoPadre', student.padre, 'padre');
    // Información del acudiente
    fillParentInfo('infoAcudiente', student.acudiente, 'acudiente');
}

/**
 * Llenar información familiar para padres (solo su propia información)
 */
function fillFamilyInfoForParents(student) {
    // Los padres solo pueden ver su propia información
    if (currentUserRole === 'madre') {
        fillParentInfo('infoMadre', student.madre, 'madre');
        hideParentSection('infoPadre', 'padre');
        hideParentSection('infoAcudiente', 'acudiente');
    } else if (currentUserRole === 'padre') {
        fillParentInfo('infoPadre', student.padre, 'padre');
        hideParentSection('infoMadre', 'madre');
        hideParentSection('infoAcudiente', 'acudiente');
    } else if (currentUserRole === 'acudiente') {
        fillParentInfo('infoAcudiente', student.acudiente, 'acudiente');
        hideParentSection('infoMadre', 'madre');
        hideParentSection('infoPadre', 'padre');
    }
}

/**
 * Ocultar sección de padre
 */
function hideParentSection(containerId, parentType) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="restricted-content">
                <h3>Información de ${parentType}</h3>
                <p>Esta información está restringida por privacidad.</p>
            </div>
        `;
    }
}

/**
 * Llenar información de padre/madre/acudiente
 */
function fillParentInfo(containerId, parentData, parentType) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
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

/**
 * Llenar información médica completa
 */
function fillMedicalInfo(student) {
    const container = document.getElementById('infoMedica');
    if (!container) return;
    
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

/**
 * Llenar información médica para padres (resumida)
 */
function fillMedicalInfoForParents(student) {
    const container = document.getElementById('infoMedica');
    if (!container) return;
    
    container.innerHTML = '';

    if (!student.info_medica) {
        container.innerHTML = '<p>No hay información médica registrada.</p>';
        return;
    }

    const medicalInfo = student.info_medica;
    
    container.innerHTML = `
        <div class="parent-limited-info">
            <h4>Resumen de Información Médica</h4>
            <div class="info-summary">
                <div class="info-summary-item">
                    <div class="count">${medicalInfo.total_diagnosticos || 0}</div>
                    <div class="label">Diagnósticos</div>
                </div>
                <div class="info-summary-item">
                    <div class="count">${medicalInfo.total_medicamentos || 0}</div>
                    <div class="label">Medicamentos</div>
                </div>
                <div class="info-summary-item">
                    <div class="count">${medicalInfo.total_tratamientos || 0}</div>
                    <div class="label">Tratamientos</div>
                </div>
            </div>
            ${medicalInfo.dx_general ? `<p><strong>Diagnóstico General:</strong> ${medicalInfo.dx_general}</p>` : ''}
        </div>
        <div class="restricted-content">
            <h3>Información Médica Detallada</h3>
            <p>Para acceder a información médica detallada, consulte con el personal médico o educativo de la institución.</p>
        </div>
    `;
}

/**
 * Llenar información del PIAR
 */
function fillPiarInfo(student) {
    const container = document.getElementById('infoPiar');
    const valoracionesContainer = document.getElementById('valoracionesList');

    // Información del PIAR
    if (container) {
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
    }

    // Valoraciones pedagógicas
    if (valoracionesContainer) {
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

function fillPiarInfoForParents(student) {
    const container = document.getElementById('infoPiar');
    const valoracionesContainer = document.getElementById('valoracionesList');

    if (container) {
        container.innerHTML = `
            <div class="restricted-content">
                <h3>Plan Individual de Ajustes Razonables (PIAR)</h3>
                <p>Esta información pedagógica especializada está disponible para consulta con el equipo docente y de apoyo de la institución.</p>
            </div>
        `;
    }

    if (valoracionesContainer) {
        valoracionesContainer.innerHTML = `
            <div class="restricted-content">
                <h3>Valoraciones Pedagógicas</h3>
                <p>Las valoraciones pedagógicas son documentos técnicos disponibles para consulta en reuniones con el equipo educativo.</p>
            </div>
        `;
    }
}

};

