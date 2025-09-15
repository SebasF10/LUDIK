// JAVASCRIPT PARA REGISTRO COMPLETO - LUDIK (CORREGIDO)

// Variables globales
let currentStep = 1;
const totalSteps = 11;
let estudianteRegistradoId = null;
let estudianteRegistradoNombre = '';
let isPhase1Complete = false;

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

// Configurar event listeners
function setupEventListeners() {
    // Campos condicionales
    document.getElementById('victima_conflicto').addEventListener('change', handleVictimaConflicto);
    document.getElementById('grupo_etnico').addEventListener('change', handleGrupoEtnico);

    // Prevenir envío accidental con Enter
    document.addEventListener('keydown', function(event) {
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

        textarea.addEventListener('keydown', function(event) {
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

// Función para validar un campo individual
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

// Gestionar atributos required dinámicamente
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

// Función para manejar campos condicionales - víctima conflicto
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

// Función para manejar campos condicionales - grupo étnico
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

// Función para cargar grupos desde la base de datos
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

// Función para avanzar al siguiente paso
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

// Función para retroceder al paso anterior
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

// Función para registrar estudiante (Fase 1)
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
                
                showAlert(`¡Estudiante registrado exitosamente! ID: ${data.id_estudiante}. Ahora puede proceder con la descripción general.`, 'success');
                
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

// Función para configurar el paso de descripción
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

// Función para actualizar la visibilidad de los botones
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

// Función para actualizar barra de progreso
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const progress = (currentStep / totalSteps) * 100;
        progressBar.style.width = progress + '%';
    }
}

// Función para validar el paso actual
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

// Validaciones específicas para el paso 4
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

// Restaurar required para fase 1 (pasos 1-4)
function restoreAllRequiredAttributesForPhase1() {
    for (let step = 1; step <= 4; step++) {
        const stepElement = document.getElementById('form-step-' + step);
        const fields = stepElement.querySelectorAll('[data-originally-required]');
        fields.forEach(field => {
            field.setAttribute('required', '');
        });
    }
}

// Validar pasos 1 a 4 para fase 1
function validateSteps1to4() {
    let isValid = true;
    let firstInvalidStep = null;

    for (let step = 1; step <= 4; step++) {
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

// Validar todos los pasos para fase 2 (pasos 5-11)
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

// Ir a un paso específico
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

// Función para manejar el envío del formulario (Fase 2)
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

// Función para mostrar mensajes de alerta
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

// Mostrar overlay de loading
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

// Ocultar overlay de loading
function hideLoadingOverlay() {
    const overlay = document.getElementById('formLoading');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Función para reiniciar el formulario
function resetForm() {
    const form = document.getElementById('formulario-completo');
    form.reset();

    currentStep = 1;
    estudianteRegistradoId = null;
    estudianteRegistradoNombre = '';
    isPhase1Complete = false;

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

    // Reconfigurar required attributes
    manageRequiredAttributes();
    updateButtons();
    updateProgressBar();

    // Scroll hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para navegación con teclado
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

// Asignar el manejador de eventos al formulario cuando se carga
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formulario-completo');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

// Función de utilidad para debugging
function debugInfo() {
    console.log('Estado actual del formulario:');
    console.log('Paso actual:', currentStep);
    console.log('Total de pasos:', totalSteps);
    console.log('ID estudiante registrado:', estudianteRegistradoId);
    console.log('Fase 1 completa:', isPhase1Complete);
    
    const gruposSelect = document.getElementById('id_grupo');
    console.log('Grupos cargados:', gruposSelect ? gruposSelect.options.length - 1 : 0);
    
    // Mostrar campos con required
    const requiredFields = document.querySelectorAll('[required]');
    console.log('Campos required activos:', requiredFields.length);
    
    const originallyRequired = document.querySelectorAll('[data-originally-required]');
    console.log('Campos originally required:', originallyRequired.length);
}