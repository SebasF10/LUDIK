console.log("Script de Registrar Estudiante cargado con funcionalidad de menú");

// ============================================
// FUNCIONALIDAD DEL MENÚ EXTRAÍBLE - COPIADO DE MENU.JS
// ============================================

// Funcionalidad del menú
const burger = document.getElementById('burger');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

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
            // Elementos HR
            elemento.tagName === 'HR' ||
            // Elementos vacíos o con poca altura
            (elemento.offsetHeight <= 5 && !elemento.textContent?.trim()) ||
            // Elementos con clases de separador
            elemento.className?.includes('separator') ||
            elemento.className?.includes('divider') ||
            elemento.className?.includes('line') ||
            // Elementos que no son botones y no tienen texto
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

        // Eliminar elementos extraños que no sean menu-header, menu-buttons o menu-bottom
        if (!['menu-header', 'menu-buttons', 'menu-bottom'].some(clase => elemento.classList.contains(clase))) {
            if (elemento.tagName === 'HR' || elemento.offsetHeight <= 5) {
                console.log(`🗑️ ELIMINANDO elemento extraño en side-menu: ${elemento.tagName}`);
                elemento.remove();
            }
        }
    });
}

// Función simplificada para eliminar botones según rol
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

        // Lógica según el rol
        if (rol === "admin") {
            // Admin: puede ver todos los botones
            console.log("Usuario es admin, todos los botones visibles");

        } else if (rol === "docente_apoyo") {
            // Docente de apoyo: ocultar solo "Crear Cuentas"
            if (textoDelBoton.includes("crear cuenta")) {
                console.log("¡Eliminando botón Crear Cuentas para docente_apoyo!");
                boton.remove();
            }

        } else if (rol === "docente") {
            // Docente regular: ocultar "Crear Cuentas", "Registrar PIAR" y "Registrar estudiante"
            if (textoDelBoton.includes("crear cuenta")) {
                console.log("¡Eliminando botón Crear Cuentas para docente!");
                boton.remove();
            }
            if (textoDelBoton.includes("registrar un nuevo estudiante")) {
                console.log("¡Eliminando botón Registrar un nuevo estudiante para docente!");
                boton.remove();
            }
            if (textoDelBoton.includes("registrar un piar")) {
                console.log("¡Eliminando botón Registrar un PIAR para docente!");
                boton.remove();
            }

        } else {
            // Rol desconocido o sin rol: comportamiento por defecto
            console.log("Rol desconocido o sin rol, aplicando restricciones por defecto");
            if (textoDelBoton.includes("crear cuenta") ||
                textoDelBoton.includes("registrar un nuevo estudiante") ||
                textoDelBoton.includes("registrar un piar")) {
                console.log("¡Eliminando botón restringido para usuario sin rol definido!");
                boton.remove();
            }
        }
    });

    // DESPUÉS DE MODIFICAR: INSPECCIONAR OTRA VEZ
    setTimeout(inspeccionarYEliminar, 100);
}

// EJECUTAR cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM cargado - ejecutando función de roles");
    eliminarBotonesPorRol();
});

// Manejar clicks de botones del menú
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('menu-button')) {
        const texto = e.target.textContent.trim();
        const textoLower = texto.toLowerCase();

        console.log("=== DEBUG CLICK ===");
        console.log("Texto original:", `"${texto}"`);
        console.log("Texto lowercase:", `"${textoLower}"`);

        if (textoLower.includes('perfil')) {
            console.log("-> Redirigiendo a perfil");
            window.location.href = 'perfil.html';
        } else if (textoLower.includes('estudiantes')) {
            console.log("-> Redirigiendo a estudiantes");
            window.location.href = 'Estudiantes.html';
        } else if (textoLower.includes('crear cuentas')) {
            console.log("-> Redirigiendo a crear cuentas");
            window.location.href = 'Crear_cuentas.html';
        } else if (textoLower.includes('actividades')) {
            console.log("-> Redirigiendo a actividades");
            window.location.href = 'Ejercicios.html';
        } else if (textoLower.includes('registrar un nuevo estudiante')) {
            console.log("-> Redirigiendo a registrar estudiante");
            window.location.href = 'Registrar_estudiante.html';
        } else if (textoLower.includes('registrar un piar')) {
            console.log("-> Redirigiendo a registrar PIAR");
            window.location.href = 'Registrar_PIAR.html';
        } else if (textoLower.includes('descripción general')) {
            console.log("-> Redirigiendo a descripción general");
            window.location.href = 'Descripción_general.html';
        } else if (textoLower.includes('valoración') || textoLower.includes('valoracion') || textoLower.includes('pedagogica') || textoLower.includes('pedagógica')) {
            console.log("-> ¡ENCONTRADO! Redirigiendo a valoración pedagógica");
            window.location.href = 'Valoracion_pedagogica.html';
        } else if (textoLower.includes('comunicate')) {
            console.log("-> Redirigiendo a comunicación");
            window.location.href = 'Comunicacion.html';
        } else if (textoLower.includes('ayuda')) {
            console.log("-> Redirigiendo a ayuda");
            window.location.href = 'Ayuda.html';
        } else if (textoLower.includes('cerrar sesion') || textoLower.includes('cerrar sesión')) {
            console.log("-> Cerrando sesión");
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                localStorage.removeItem('rol');
                window.location.href = 'Inicio_sesion.html';
            }
        } else {
            console.log("-> ❌ NO SE ENCONTRÓ COINCIDENCIA");
            console.log("Texto a comparar:", `"${textoLower}"`);
        }

        // Cerrar menú
        burger.checked = false;
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ============================================
// FUNCIONALIDAD ORIGINAL DE REGISTRAR ESTUDIANTE
// ============================================

// Variables globales
let currentStep = 1;
const totalSteps = 11;
let estudianteRegistradoId = null;
let estudianteRegistradoNombre = '';
let isPhase1Complete = false;
let madreSkipped = false;
let padreSkipped = false;

// Inicialización cuando se carga la página
window.onload = function () {
    cargarGrupos();
    updateButtons();
    setupEventListeners();

    // Configurar required attributes desde el inicio
    manageRequiredAttributes();
    updateProgressBar();

    // Agregar novalidate al formulario para evitar validación automática del navegador
    document.getElementById('formulario-completo').setAttribute('novalidate', '');
};

// ==================== FUNCIONES PARA MANEJO DE SKIP ====================

function showSkipOptions(type) {
    const options = document.getElementById(type + '-skip-options');
    options.classList.add('active');
}

function cancelSkip(type) {
    const options = document.getElementById(type + '-skip-options');
    options.classList.remove('active');
    // Limpiar radio buttons
    const radios = document.querySelectorAll(`input[name="${type}_skip_reason"]`);
    radios.forEach(radio => radio.checked = false);
}

function confirmSkip(type) {
    const selectedReason = document.querySelector(`input[name="${type}_skip_reason"]:checked`);

    if (!selectedReason) {
        alert('Por favor seleccione una razón para omitir el registro.');
        return;
    }

    const reason = selectedReason.value;
    const reasonText = selectedReason.nextElementSibling.textContent;

    // Validación mejorada: permitir que ambos padres no estén presentes, pero asegurar acudiente
    if (type === 'madre' && padreSkipped) {
        const padreReason = document.getElementById('padre_skip_reason_value').value;
        if (reason === 'no_presente' && padreReason === 'no_presente') {
            // Ambos padres no presentes es válido, pero recordar sobre el acudiente
            showAlert('Ambos padres marcados como no presentes. Asegúrese de registrar correctamente los datos del acudiente en el paso 3.', 'warning');
        }
    }

    if (type === 'padre' && madreSkipped) {
        const madreReason = document.getElementById('madre_skip_reason_value').value;
        if (reason === 'no_presente' && madreReason === 'no_presente') {
            // Ambos padres no presentes es válido, pero recordar sobre el acudiente
            showAlert('Ambos padres marcados como no presentes. Asegúrese de registrar correctamente los datos del acudiente en el paso 3.', 'warning');
        }
    }

    // Validación para evitar contradicciones: si un padre es "es_acudiente" y el otro también
    if (type === 'madre' && padreSkipped) {
        const padreReason = document.getElementById('padre_skip_reason_value').value;
        if (reason === 'es_acudiente' && padreReason === 'es_acudiente') {
            alert('No puede marcar ambos padres como acudientes. Solo uno puede ser el acudiente principal.');
            return;
        }
    }

    if (type === 'padre' && madreSkipped) {
        const madreReason = document.getElementById('madre_skip_reason_value').value;
        if (reason === 'es_acudiente' && madreReason === 'es_acudiente') {
            alert('No puede marcar ambos padres como acudientes. Solo uno puede ser el acudiente principal.');
            return;
        }
    }

    // Marcar como omitido
    if (type === 'madre') {
        madreSkipped = true;
    } else {
        padreSkipped = true;
    }

    // Actualizar UI
    document.getElementById(type + '-skip-options').classList.remove('active');
    document.getElementById(type + '-skipped-info').style.display = 'block';
    document.getElementById(type + '-skip-reason-text').textContent = reasonText;
    document.getElementById(type + '-form-fields').classList.add('form-disabled');

    // Actualizar campos ocultos
    document.getElementById(type + '_skipped').value = 'true';
    document.getElementById(type + '_skip_reason_value').value = reason;

    // Remover required de campos del formulario
    const formFields = document.getElementById(type + '-form-fields');
    const requiredFields = formFields.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.removeAttribute('required');
        field.setAttribute('data-was-required', 'true');
    });

    // Mostrar mensaje informativo según la razón
    let infoMessage = '';
    if (reason === 'no_presente') {
        infoMessage = `Se registrará un placeholder indicando que ${type} no está presente.`;
    } else if (reason === 'es_acudiente') {
        infoMessage = `Se marcará que ${type} será registrado como acudiente. Los datos se registrarán en el paso 3.`;
        // Pre-llenar algunos campos del acudiente si es posible
        prefillCuidadorFields(type);
    }

    if (infoMessage) {
        showAlert(infoMessage, 'warning');
    }
}

function prefillCuidadorFields(parentType) {
    // Esta función se ejecuta cuando un padre será el acudiente
    // Podría copiar algunos datos básicos si ya se llenaron
    const parentName = document.getElementById(`${parentType}_nombre`).value;
    const parentEducation = document.getElementById(`${parentType}_educacion`).value;
    const parentEmail = document.getElementById(`${parentType}_email`).value;
    const parentPhone = document.getElementById(`${parentType}_telefono`).value;
    const parentPassword = document.getElementById(`${parentType}_contrasena`).value;

    // Solo pre-llenar si hay datos disponibles
    if (parentName) {
        // Marcar que estos campos serán pre-llenados en el paso 3
        sessionStorage.setItem('prefill_cuidador_nombre', parentName);
        sessionStorage.setItem('prefill_cuidador_educacion', parentEducation);
        sessionStorage.setItem('prefill_cuidador_email', parentEmail);
        sessionStorage.setItem('prefill_cuidador_telefono', parentPhone);
        sessionStorage.setItem('prefill_cuidador_contrasena', parentPassword);
        sessionStorage.setItem('prefill_cuidador_parentesco', parentType === 'madre' ? 'Madre' : 'Padre');
    }
}

function applyCuidadorPrefill() {
    // Aplicar pre-llenado si está disponible
    const nombre = sessionStorage.getItem('prefill_cuidador_nombre');
    if (nombre) {
        document.getElementById('cuidador_nombre').value = nombre;
        document.getElementById('cuidador_educacion').value = sessionStorage.getItem('prefill_cuidador_educacion') || '';
        document.getElementById('cuidador_email').value = sessionStorage.getItem('prefill_cuidador_email') || '';
        document.getElementById('cuidador_telefono').value = sessionStorage.getItem('prefill_cuidador_telefono') || '';
        document.getElementById('cuidador_contrasena').value = sessionStorage.getItem('prefill_cuidador_contrasena') || '';
        document.getElementById('cuidador_parentesco').value = sessionStorage.getItem('prefill_cuidador_parentesco') || '';

        // Limpiar datos de sesión
        sessionStorage.removeItem('prefill_cuidador_nombre');
        sessionStorage.removeItem('prefill_cuidador_educacion');
        sessionStorage.removeItem('prefill_cuidador_email');
        sessionStorage.removeItem('prefill_cuidador_telefono');
        sessionStorage.removeItem('prefill_cuidador_contrasena');
        sessionStorage.removeItem('prefill_cuidador_parentesco');

        showAlert('Datos pre-llenados basados en la información del padre/madre. Verifique y complete según sea necesario.', 'success');
    }
}


function undoSkip(type) {
    // Restaurar estado
    if (type === 'madre') {
        madreSkipped = false;
    } else {
        padreSkipped = false;
    }

    // Actualizar UI
    document.getElementById(type + '-skipped-info').style.display = 'none';
    document.getElementById(type + '-form-fields').classList.remove('form-disabled');

    // Limpiar campos ocultos
    document.getElementById(type + '_skipped').value = 'false';
    document.getElementById(type + '_skip_reason_value').value = '';

    // Restaurar required en campos del formulario
    const formFields = document.getElementById(type + '-form-fields');
    const wasRequiredFields = formFields.querySelectorAll('[data-was-required]');
    wasRequiredFields.forEach(field => {
        field.setAttribute('required', '');
        field.removeAttribute('data-was-required');
    });

    // Limpiar radio buttons
    const radios = document.querySelectorAll(`input[name="${type}_skip_reason"]`);
    radios.forEach(radio => radio.checked = false);

    showAlert(`Registro de ${type} restaurado. Debe completar los campos requeridos.`, 'success');
}

// ==================== CONFIGURACIÓN DE EVENT LISTENERS ====================

function setupEventListeners() {
    // Campos condicionales
    document.getElementById('victima_conflicto').addEventListener('change', handleVictimaConflicto);
    document.getElementById('grupo_etnico').addEventListener('change', handleGrupoEtnico);

    // Prevenir envío accidental con Enter
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA' && event.target.type !== 'submit') {
            event.preventDefault();
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
                nextStep();
            }
        }
    });

    // Auto-resize para textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });

        textarea.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && event.ctrlKey) {
                event.preventDefault();
                nextStep();
            }
        });
    });

    // Validación en tiempo real
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });

    // Navegación con teclado
    document.addEventListener('keydown', handleKeyNavigation);
}

// ==================== FUNCIONES DE VALIDACIÓN ====================

function validateField(field) {
    const isRequired = field.hasAttribute('required') || field.hasAttribute('data-originally-required');
    const isEmpty = !field.value.trim();

    if (isRequired && isEmpty) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        field.style.borderColor = '#dc3545';
    } else {
        field.classList.remove('invalid');
        field.classList.add('valid');
        field.style.borderColor = '#28a745';
    }
}

function manageRequiredAttributes() {
    const allSteps = document.querySelectorAll('.form-step');

    allSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        const fields = step.querySelectorAll('input, select, textarea');

        fields.forEach(field => {
            if (stepNumber === currentStep) {
                // Paso activo: restaurar required original
                if (field.hasAttribute('data-originally-required')) {
                    field.setAttribute('required', '');
                }
            } else {
                // Paso inactivo: guardar y remover required
                if (field.hasAttribute('required')) {
                    field.setAttribute('data-originally-required', 'true');
                    field.removeAttribute('required');
                }
            }
        });
    });
}

function validateCurrentStep() {
    const currentForm = document.getElementById('form-step-' + currentStep);
    const requiredFields = currentForm.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('invalid');
            field.style.borderColor = '#dc3545';
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
            isValid = false;
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
            field.style.borderColor = '#28a745';
        }
    });

    if (!isValid) {
        showAlert('Por favor complete todos los campos obligatorios del paso actual.', 'error');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
        return false;
    }

    // Validaciones específicas por paso
    if (currentStep === 4) {
        return validateStep4();
    }

    return true;
}

function validateStep4() {
    // Validar documento único
    const documento = document.getElementById('no_documento').value;
    if (documento && documento.length < 6) {
        showAlert('El número de documento debe tener al menos 6 caracteres.', 'error');
        document.getElementById('no_documento').focus();
        return false;
    }

    // Validar fecha de nacimiento
    const fechaNac = new Date(document.getElementById('fecha_nacimiento').value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();

    if (edad < 5 || edad > 25) {
        showAlert('La edad del estudiante debe estar entre 5 y 25 años.', 'error');
        document.getElementById('fecha_nacimiento').focus();
        return false;
    }

    return true;
}

function validateSteps1to4() {
    let isValid = true;
    let firstInvalidStep = null;

    for (let step = 1; step <= 4; step++) {
        const stepElement = document.getElementById('form-step-' + step);

        // Skip validation for skipped parents
        if ((step === 1 && madreSkipped) || (step === 2 && padreSkipped)) {
            continue;
        }

        const fields = stepElement.querySelectorAll('[data-originally-required], [required]');

        for (let field of fields) {
            if (!field.value.trim()) {
                if (!firstInvalidStep) {
                    firstInvalidStep = step;
                }
                isValid = false;
                break;
            }
        }
    }

    if (!isValid && firstInvalidStep) {
        goToStep(firstInvalidStep);
        showAlert(`Por favor complete todos los campos obligatorios en el paso ${firstInvalidStep}.`, 'error');
    }

    return isValid;
}

function validateAllDescriptionSteps() {
    let isValid = true;
    let firstInvalidStep = null;

    for (let step = 5; step <= totalSteps; step++) {
        const stepElement = document.getElementById('form-step-' + step);
        const fields = stepElement.querySelectorAll('[data-originally-required], [required]');

        for (let field of fields) {
            if (!field.value.trim()) {
                if (!firstInvalidStep) {
                    firstInvalidStep = step;
                }
                isValid = false;
                break;
            }
        }
    }

    if (!isValid && firstInvalidStep) {
        goToStep(firstInvalidStep);
        showAlert(`Por favor complete todos los campos obligatorios en el paso ${firstInvalidStep}.`, 'error');
    }

    return isValid;
}

// ==================== MANEJO DE CAMPOS CONDICIONALES ====================

function handleVictimaConflicto() {
    const container = document.getElementById('victima_tipo_container');
    const campo = document.getElementById('victima_tipo');

    if (this.value === 'Si') {
        container.style.display = 'block';
        campo.setAttribute('required', 'required');
    } else {
        container.style.display = 'none';
        campo.removeAttribute('required');
        campo.removeAttribute('data-originally-required');
        campo.value = '';
    }
}

function handleGrupoEtnico() {
    const container = document.getElementById('etnico_tipo_container');
    const campo = document.getElementById('etnico_tipo');

    if (this.value === 'Si') {
        container.style.display = 'block';
        campo.setAttribute('required', 'required');
    } else {
        container.style.display = 'none';
        campo.removeAttribute('required');
        campo.removeAttribute('data-originally-required');
        campo.value = '';
    }
}

// ==================== CARGA DE DATOS ====================

function cargarGrupos() {
    fetch('php/Cargar_grupos.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const select = document.getElementById('id_grupo');
            select.innerHTML = '<option value="">Seleccione un grupo</option>';

            if (data.error) {
                showAlert('Error al cargar grupos: ' + data.message, 'error');
                return;
            }

            if (data.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No hay grupos disponibles';
                option.disabled = true;
                select.appendChild(option);
                return;
            }

            data.forEach(grupo => {
                const option = document.createElement('option');
                option.value = grupo.id_grupo;
                option.textContent = grupo.grupo + ' - ' + grupo.grado;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error cargando grupos:', error);
            showAlert('Error de conexión al cargar la lista de grupos', 'error');
        });
}

// ==================== NAVEGACIÓN ENTRE PASOS ====================

function nextStep() {
    if (validateCurrentStep()) {
        // Si estamos en el paso 4 y aún no se ha completado la fase 1, registrar estudiante
        if (currentStep === 4 && !isPhase1Complete) {
            registerStudentPhase1();
            return;
        }

        if (currentStep < totalSteps) {
            // Ocultar paso actual
            document.getElementById('form-step-' + currentStep).classList.remove('active');
            document.getElementById('step' + currentStep).classList.remove('active');
            document.getElementById('step' + currentStep).classList.add('completed');

            // Mostrar siguiente paso
            currentStep++;
            document.getElementById('form-step-' + currentStep).classList.add('active');
            document.getElementById('step' + currentStep).classList.add('active');

            // Si llegamos al paso 3 (acudiente), verificar y mostrar mensaje adecuado
            if (currentStep === 3) {
                updateCuidadorStepMessage();
            }

            // Gestionar atributos required
            manageRequiredAttributes();
            updateButtons();
            updateProgressBar();

            // Scroll suave hacia arriba
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Si llegamos al paso 5, configurar la descripción
            if (currentStep === 5) {
                setupDescripcionStep();
            }
        }
    }
}

function updateCuidadorStepMessage() {
    const warningDiv = document.querySelector('#form-step-3 .warning-text');
    const madreReason = document.getElementById('madre_skip_reason_value').value;
    const padreReason = document.getElementById('padre_skip_reason_value').value;

    let message = '<strong>Nota:</strong> ';

    if (madreSkipped && padreSkipped) {
        if (madreReason === 'no_presente' && padreReason === 'no_presente') {
            message += 'Ambos padres no están presentes. Es OBLIGATORIO registrar aquí los datos del acudiente responsable del menor (abuelo/a, tío/a, hermano/a mayor, tutor legal, etc.).';
            warningDiv.style.backgroundColor = '#fff3cd';
            warningDiv.style.borderColor = '#ffc107';
            warningDiv.style.color = '#856404';
        } else if ((madreReason === 'es_acudiente' && padreReason === 'no_presente') ||
            (madreReason === 'no_presente' && padreReason === 'es_acudiente')) {
            const parenteAcudiente = madreReason === 'es_acudiente' ? 'madre' : 'padre';
            message += `La ${parenteAcudiente} actuará como acudiente. Registre aquí los datos de la ${parenteAcudiente}.`;
            warningDiv.style.backgroundColor = '#d1ecf1';
            warningDiv.style.borderColor = '#bee5eb';
            warningDiv.style.color = '#0c5460';

            // Aplicar pre-llenado si está disponible
            applyCuidadorPrefill();
        }
    } else if (madreSkipped) {
        if (madreReason === 'es_acudiente') {
            message += 'La madre actuará como acudiente. Registre aquí los datos de la madre.';
            applyCuidadorPrefill();
        } else {
            message += 'La madre no está presente. Registre aquí los datos del acudiente principal del estudiante.';
        }
    } else if (padreSkipped) {
        if (padreReason === 'es_acudiente') {
            message += 'El padre actuará como acudiente. Registre aquí los datos del padre.';
            applyCuidadorPrefill();
        } else {
            message += 'El padre no está presente. Registre aquí los datos del acudiente principal del estudiante.';
        }
    } else {
        message += 'Este registro es obligatorio. Si la madre o el padre es el acudiente principal, registre aquí esa información.';
    }

    warningDiv.innerHTML = message;
}

function previousStep() {
    if (currentStep > 1) {
        // No permitir retroceder más allá del paso 5 si ya se completó la fase 1
        if (isPhase1Complete && currentStep <= 5) {
            showAlert('No puede retroceder una vez que el estudiante ha sido registrado en la base de datos.', 'warning');
            return;
        }

        // Ocultar paso actual
        document.getElementById('form-step-' + currentStep).classList.remove('active');
        document.getElementById('step' + currentStep).classList.remove('active');

        // Mostrar paso anterior
        currentStep--;
        document.getElementById('form-step-' + currentStep).classList.add('active');
        document.getElementById('step' + currentStep).classList.remove('completed');
        document.getElementById('step' + currentStep).classList.add('active');

        // Gestionar atributos required
        manageRequiredAttributes();
        updateButtons();
        updateProgressBar();

        // Scroll suave hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function goToStep(targetStep) {
    if (targetStep < 1 || targetStep > totalSteps) return;

    // No permitir ir a pasos anteriores si ya se completó la fase 1
    if (isPhase1Complete && targetStep < 5) {
        showAlert('No puede retroceder una vez que el estudiante ha sido registrado en la base de datos.', 'warning');
        return;
    }

    // Ocultar paso actual
    document.getElementById('form-step-' + currentStep).classList.remove('active');
    document.getElementById('step' + currentStep).classList.remove('active');

    // Mostrar paso objetivo
    currentStep = targetStep;
    document.getElementById('form-step-' + currentStep).classList.add('active');
    document.getElementById('step' + currentStep).classList.add('active');

    // Gestionar required attributes
    manageRequiredAttributes();
    updateButtons();
    updateProgressBar();

    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== REGISTRO DE ESTUDIANTE (FASE 1) ====================

function registerStudentPhase1() {
    showLoadingOverlay();

    // Restaurar todos los required para validación
    restoreAllRequiredAttributesForPhase1();

    if (!validateSteps1to4()) {
        hideLoadingOverlay();
        return;
    }

    const form = document.getElementById('formulario-completo');
    const formData = new FormData(form);
    formData.set('phase', '1');

    fetch('php/Registrar_estudiante.php', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                isPhase1Complete = true;
                estudianteRegistradoId = data.id_estudiante;
                estudianteRegistradoNombre = data.data.nombre_completo;

                let message = `¡Estudiante registrado exitosamente! ID: ${data.id_estudiante}. `;

                // Agregar información sobre skips si hay
                if (data.skip_info) {
                    if (data.skip_info.madre) {
                        message += `Madre: ${data.skip_info.madre}. `;
                    }
                    if (data.skip_info.padre) {
                        message += `Padre: ${data.skip_info.padre}. `;
                    }
                }

                message += 'Ahora puede proceder con la descripción general.';

                showAlert(message, 'success');

                // Avanzar al paso 5
                document.getElementById('form-step-' + currentStep).classList.remove('active');
                document.getElementById('step' + currentStep).classList.remove('active');
                document.getElementById('step' + currentStep).classList.add('completed');

                currentStep = 5;
                document.getElementById('form-step-' + currentStep).classList.add('active');
                document.getElementById('step' + currentStep).classList.add('active');

                setupDescripcionStep();
                manageRequiredAttributes();
                updateButtons();
                updateProgressBar();

                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                showAlert('Error en Fase 1: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Error de conexión al registrar el estudiante', 'error');
        })
        .finally(() => {
            hideLoadingOverlay();
            // Restaurar gestión de required
            manageRequiredAttributes();
        });
}

function setupDescripcionStep() {
    const selectEstudiante = document.getElementById('id_estudiante_descripcion');

    if (isPhase1Complete && estudianteRegistradoNombre) {
        selectEstudiante.innerHTML = `<option value="${estudianteRegistradoId}">${estudianteRegistradoNombre} (Recién registrado)</option>`;
        selectEstudiante.value = estudianteRegistradoId;
    } else {
        const nombreEstudiante = document.getElementById('estudiante_nombre').value;
        const apellidosEstudiante = document.getElementById('estudiante_apellidos').value;
        selectEstudiante.innerHTML = `<option value="nuevo_estudiante">${nombreEstudiante} ${apellidosEstudiante} (Debe completar registro primero)</option>`;
    }
}

function restoreAllRequiredAttributesForPhase1() {
    for (let step = 1; step <= 4; step++) {
        const stepElement = document.getElementById('form-step-' + step);
        const fields = stepElement.querySelectorAll('[data-originally-required]');
        fields.forEach(field => {
            field.setAttribute('required', '');
        });
    }
}

// ==================== REGISTRO DE DESCRIPCIÓN (FASE 2) ====================

function handleFormSubmit(event) {
    event.preventDefault();

    if (!isPhase1Complete) {
        showAlert('Debe completar el registro del estudiante antes de enviar la descripción general.', 'error');
        return;
    }

    // Mostrar loading
    showLoadingOverlay();

    // Restaurar todos los required de la fase 2
    for (let step = 5; step <= totalSteps; step++) {
        const stepElement = document.getElementById('form-step-' + step);
        const fields = stepElement.querySelectorAll('[data-originally-required]');
        fields.forEach(field => {
            field.setAttribute('required', '');
        });
    }

    if (!validateAllDescriptionSteps()) {
        hideLoadingOverlay();
        return;
    }

    const form = document.getElementById('formulario-completo');
    const formData = new FormData(form);
    formData.set('phase', '2');
    formData.set('id_estudiante', estudianteRegistradoId);

    fetch('php/Registrar_estudiante.php', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showAlert(`¡Registro completo exitoso! Descripción general creada para ${data.student_name}`, 'success');
                setTimeout(() => {
                    resetForm();
                }, 3000);
            } else {
                showAlert('Error en Fase 2: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Error de conexión al procesar la descripción general', 'error');
        })
        .finally(() => {
            hideLoadingOverlay();
            manageRequiredAttributes();
        });
}

// ==================== FUNCIONES DE UI ====================

function updateButtons() {
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const btnRegistrar = document.getElementById('btnRegistrar');

    // Mostrar/ocultar botón anterior
    btnAnterior.style.display = currentStep > 1 ? 'inline-block' : 'none';

    // Mostrar/ocultar botones siguiente y registrar
    if (currentStep === totalSteps) {
        btnSiguiente.style.display = 'none';
        btnRegistrar.style.display = 'inline-block';
        btnRegistrar.textContent = 'Completar Descripción General';
    } else if (currentStep === 4 && !isPhase1Complete) {
        btnSiguiente.textContent = 'Registrar Estudiante';
    } else {
        btnSiguiente.style.display = 'inline-block';
        btnRegistrar.style.display = 'none';
        btnSiguiente.textContent = 'Siguiente';
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = (currentStep / totalSteps) * 100;
        progressBar.style.width = progress + '%';
    }
}

function showAlert(message, type = 'success') {
    // Remover alertas existentes
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Crear nueva alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    // Insertar después del título
    const title = document.querySelector('.section h1');
    title.parentNode.insertBefore(alertDiv, title.nextSibling);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);

    // Scroll suave hacia la alerta
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showLoadingOverlay() {
    let overlay = document.getElementById('formLoading');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'formLoading';
        overlay.className = 'form-loading';
        overlay.innerHTML = `
            <div class="spinner"></div>
            <div class="loading-text">Procesando registro...</div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('formLoading');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function resetForm() {
    const form = document.getElementById('formulario-completo');
    form.reset();

    currentStep = 1;
    estudianteRegistradoId = null;
    estudianteRegistradoNombre = '';
    isPhase1Complete = false;
    madreSkipped = false;
    padreSkipped = false;

    // Limpiar sessionStorage de pre-llenado
    sessionStorage.removeItem('prefill_cuidador_nombre');
    sessionStorage.removeItem('prefill_cuidador_educacion');
    sessionStorage.removeItem('prefill_cuidador_email');
    sessionStorage.removeItem('prefill_cuidador_telefono');
    sessionStorage.removeItem('prefill_cuidador_contrasena');
    sessionStorage.removeItem('prefill_cuidador_parentesco');

    // Ocultar todos los pasos excepto el primero
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('form-step-1').classList.add('active');

    // Reiniciar indicadores de progreso
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        indicator.classList.remove('active', 'completed');
    });
    document.getElementById('step1').classList.add('active');

    // Limpiar atributos data-originally-required
    document.querySelectorAll('[data-originally-required]').forEach(field => {
        field.removeAttribute('data-originally-required');
        field.classList.remove('valid', 'invalid');
        field.style.borderColor = '#e9ecef';
    });

    // Ocultar campos condicionales
    document.getElementById('victima_tipo_container').style.display = 'none';
    document.getElementById('etnico_tipo_container').style.display = 'none';

    // Reset skip states
    document.getElementById('madre-skipped-info').style.display = 'none';
    document.getElementById('padre-skipped-info').style.display = 'none';
    document.getElementById('madre-form-fields').classList.remove('form-disabled');
    document.getElementById('padre-form-fields').classList.remove('form-disabled');

    // Restaurar mensaje original del cuidador
    const warningDiv = document.querySelector('#form-step-3 .warning-text');
    if (warningDiv) {
        warningDiv.innerHTML = '<strong>Nota:</strong> Este registro es obligatorio. Si la madre o el padre es el acudiente principal, registre aquí esa información.';
        warningDiv.style.backgroundColor = '';
        warningDiv.style.borderColor = '';
        warningDiv.style.color = '#856404';
    }

    // Reconfigurar required attributes
    manageRequiredAttributes();
    updateButtons();
    updateProgressBar();

    // Scroll hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== NAVEGACIÓN CON TECLADO ====================

function handleKeyNavigation(event) {
    if (event.ctrlKey) {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                if (currentStep > 1) {
                    previousStep();
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (currentStep < totalSteps) {
                    nextStep();
                }
                break;
        }
    }
}

// ==================== FUNCIONES DE UTILIDAD ====================

function goBackOrRedirect(ruta) {
    if (ruta && ruta.trim() !== '') {
        window.location.href = ruta;
    } else {
        window.history.back();
    }
}

function debugInfo() {
    console.log('Estado actual del formulario:');
    console.log('Paso actual:', currentStep);
    console.log('Total de pasos:', totalSteps);
    console.log('ID estudiante registrado:', estudianteRegistradoId);
    console.log('Fase 1 completa:', isPhase1Complete);
    console.log('Madre omitida:', madreSkipped);
    console.log('Padre omitido:', padreSkipped);

    const gruposSelect = document.getElementById('id_grupo');
    console.log('Grupos cargados:', gruposSelect ? gruposSelect.options.length - 1 : 0);

    const requiredFields = document.querySelectorAll('[required]');
    console.log('Campos required activos:', requiredFields.length);

    const originallyRequired = document.querySelectorAll('[data-originally-required]');
    console.log('Campos originally required:', originallyRequired.length);
}

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formulario-completo');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});