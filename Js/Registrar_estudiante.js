// JAVASCRIPT PARA REGISTRO COMPLETO - LUDIK

// Variables globales
let currentStep = 1;
const totalSteps = 11;
let estudianteRegistradoId = null;

// Inicialización cuando se carga la página
window.onload = function () {
    cargarGrupos();
    updateButtons();
    setupEventListeners();
};

// Configurar event listeners
function setupEventListeners() {
    // Campos condicionales
    document.getElementById('victima_conflicto').addEventListener('change', handleVictimaConflicto);
    document.getElementById('grupo_etnico').addEventListener('change', handleGrupoEtnico);

    // Auto-resize para textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });

    // Validación en tiempo real
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#e9ecef';
            }
        });

        input.addEventListener('input', function () {
            if (this.style.borderColor === 'rgb(220, 53, 69)') {
                this.style.borderColor = '#e9ecef';
            }
        });
    });

    // Formulario submit
    document.getElementById('formulario-completo').addEventListener('submit', handleFormSubmit);

    // Navegación con teclado
    document.addEventListener('keydown', handleKeyNavigation);
}

// Función para manejar campos condicionales
function handleVictimaConflicto() {
    const container = document.getElementById('victima_tipo_container');
    const campo = document.getElementById('victima_tipo');

    if (this.value === 'Si') {
        container.style.display = 'block';
        campo.setAttribute('required', 'required');
    } else {
        container.style.display = 'none';
        campo.removeAttribute('required');
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
        if (currentStep < totalSteps) {
            // Ocultar paso actual
            document.getElementById('form-step-' + currentStep).classList.remove('active');
            document.getElementById('step' + currentStep).classList.remove('active');
            document.getElementById('step' + currentStep).classList.add('completed');

            // Mostrar siguiente paso
            currentStep++;
            document.getElementById('form-step-' + currentStep).classList.add('active');
            document.getElementById('step' + currentStep).classList.add('active');

            updateButtons();

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
        // Ocultar paso actual
        document.getElementById('form-step-' + currentStep).classList.remove('active');
        document.getElementById('step' + currentStep).classList.remove('active');

        // Mostrar paso anterior
        currentStep--;
        document.getElementById('form-step-' + currentStep).classList.add('active');
        document.getElementById('step' + currentStep).classList.remove('completed');
        document.getElementById('step' + currentStep).classList.add('active');

        updateButtons();

        // Scroll suave hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Función para configurar el paso de descripción
function setupDescripcionStep() {
    const selectEstudiante = document.getElementById('id_estudiante_descripcion');
    const nombreEstudiante = document.getElementById('estudiante_nombre').value;
    const apellidosEstudiante = document.getElementById('estudiante_apellidos').value;

    selectEstudiante.innerHTML = `<option value="nuevo_estudiante">${nombreEstudiante} ${apellidosEstudiante} (Recién registrado)</option>`;
}

// Función para actualizar la visibilidad de los botones
function updateButtons() {
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const btnRegistrar = document.getElementById('btnRegistrar');

    // Mostrar/ocultar botón anterior
    btnAnterior.style.display = currentStep > 1 ? 'block' : 'none';

    // Mostrar/ocultar botones siguiente y registrar
    if (currentStep === totalSteps) {
        btnSiguiente.style.display = 'none';
        btnRegistrar.style.display = 'block';
    } else {
        btnSiguiente.style.display = 'block';
        btnRegistrar.style.display = 'none';
    }
}

// Función para validar el paso actual
function validateCurrentStep() {
    const currentForm = document.getElementById('form-step-' + currentStep);
    const inputs = currentForm.querySelectorAll('input[required], select[required], textarea[required]');

    for (let input of inputs) {
        if (!input.value.trim()) {
            showAlert('Por favor complete todos los campos obligatorios del paso actual.', 'error');
            input.focus();
            return false;
        }

        // Validación específica para textareas (mínimo de caracteres)
        if (input.tagName === 'TEXTAREA' && input.value.trim().length < 10) {
            showAlert('Por favor proporcione una descripción más detallada (mínimo 10 caracteres).', 'error');
            input.focus();
            return false;
        }
    }

    // Validaciones específicas por paso
    if (currentStep === 4) {
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
    }

    return true;
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

// Función para reiniciar el formulario
function resetForm() {
    const form = document.getElementById('formulario-completo');
    form.reset();

    currentStep = 1;
    estudianteRegistradoId = null;

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

    // Ocultar campos condicionales
    document.getElementById('victima_tipo_container').style.display = 'none';
    document.getElementById('etnico_tipo_container').style.display = 'none';

    updateButtons();

    // Scroll hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para manejar el envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();

    if (!validateCurrentStep()) {
        return;
    }

    // Mostrar estado de carga
    const btnRegistrar = document.getElementById('btnRegistrar');
    const originalText = btnRegistrar.textContent;
    btnRegistrar.textContent = 'Procesando...';
    btnRegistrar.classList.add('loading');
    btnRegistrar.disabled = true;

    const form = document.getElementById('formulario-completo');
    const formData = new FormData(form);

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
                showAlert('¡Registro completo exitoso! Estudiante ID: ' + data.id_estudiante + ', Descripción ID: ' + data.id_descripcion_general, 'success');
                setTimeout(() => {
                    resetForm();
                }, 3000);
            } else {
                showAlert('Error: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Error de conexión al procesar el formulario', 'error');
        })
        .finally(() => {
            // Restaurar botón
            btnRegistrar.textContent = originalText;
            btnRegistrar.classList.remove('loading');
            btnRegistrar.disabled = false;
        });
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
            case 'Enter':
                if (currentStep === totalSteps) {
                    event.preventDefault();
                    document.getElementById('formulario-completo').dispatchEvent(new Event('submit'));
                }
                break;
        }
    }
}

// Función de utilidad para debugging
function debugInfo() {
    console.log('Estado actual del formulario:');
    console.log('Paso actual:', currentStep);
    console.log('Total de pasos:', totalSteps);
    console.log('ID estudiante registrado:', estudianteRegistradoId);
    console.log('Grupos cargados:', document.getElementById('id_grupo').options.length - 1);
}

// Función para mostrar progreso visual
function updateProgressIndicator() {
    const progress = (currentStep / totalSteps) * 100;
    console.log(`Progreso: ${progress.toFixed(1)}%`);
}