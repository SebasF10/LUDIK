// Variables globales
let currentStep = 1;
const totalSteps = 7;

// Cargar estudiantes al cargar la página
window.onload = function() {
    cargarEstudiantes();
    updateButtons();
};

// Función para avanzar al siguiente paso
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            // Ocultar paso actual
            document.getElementById('form-step-' + currentStep).style.display = 'none';
            document.getElementById('step' + currentStep).classList.remove('active');
            document.getElementById('step' + currentStep).classList.add('completed');
            
            // Mostrar siguiente paso
            currentStep++;
            document.getElementById('form-step-' + currentStep).style.display = 'block';
            document.getElementById('step' + currentStep).classList.add('active');
            
            updateButtons();
            
            // Scroll suave hacia arriba
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Función para retroceder al paso anterior
function previousStep() {
    if (currentStep > 1) {
        // Ocultar paso actual
        document.getElementById('form-step-' + currentStep).style.display = 'none';
        document.getElementById('step' + currentStep).classList.remove('active');
        
        // Mostrar paso anterior
        currentStep--;
        document.getElementById('form-step-' + currentStep).style.display = 'block';
        document.getElementById('step' + currentStep).classList.remove('completed');
        document.getElementById('step' + currentStep).classList.add('active');
        
        updateButtons();
        
        // Scroll suave hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    const inputs = currentForm.querySelectorAll('textarea[required], select[required]');
    
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
    return true;
}

// Función para cargar estudiantes desde la base de datos
function cargarEstudiantes() {
    fetch('php/cargar_estudiantes.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const select = document.getElementById('id_estudiante');
            select.innerHTML = '<option value="">Seleccione un estudiante</option>';
            
            if (data.error) {
                showAlert('Error al cargar estudiantes: ' + data.message, 'error');
                return;
            }
            
            if (data.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No hay estudiantes registrados';
                option.disabled = true;
                select.appendChild(option);
                return;
            }
            
            data.forEach(estudiante => {
                const option = document.createElement('option');
                option.value = estudiante.id_estudiante;
                option.textContent = `${estudiante.nombre} ${estudiante.apellidos} - Doc: ${estudiante.no_documento}`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error cargando estudiantes:', error);
            showAlert('Error de conexión al cargar la lista de estudiantes', 'error');
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

// Función para reiniciar el formulario
function resetForm() {
    const form = document.getElementById('descripcionGeneralForm');
    form.reset();
    
    currentStep = 1;
    
    // Ocultar todos los pasos excepto el primero
    document.querySelectorAll('.form-step').forEach(step => step.style.display = 'none');
    document.getElementById('form-step-1').style.display = 'block';
    
    // Reiniciar indicadores de progreso
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        indicator.classList.remove('active', 'completed');
    });
    document.getElementById('step1').classList.add('active');
    
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
    
    const form = document.getElementById('descripcionGeneralForm');
    const formData = new FormData(form);
    
    fetch('php/Descripción_general.php', {
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
            showAlert('Descripción general registrada exitosamente. ID: ' + data.id_descripcion_general, 'success');
            resetForm();
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
        switch(event.key) {
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
                    document.getElementById('descripcionGeneralForm').dispatchEvent(new Event('submit'));
                }
                break;
        }
    }
}

// Event listeners que se ejecutan cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Agregar event listener al formulario
    const form = document.getElementById('descripcionGeneralForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Agregar navegación con teclado
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Agregar auto-resize a textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
    
    // Agregar validación en tiempo real
    const inputs = document.querySelectorAll('textarea[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#e9ecef';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(220, 53, 69)') {
                this.style.borderColor = '#e9ecef';
            }
        });
    });
});

// Función de utilidad para debugging
function debugInfo() {
    console.log('Estado actual del formulario:');
    console.log('Paso actual:', currentStep);
    console.log('Total de pasos:', totalSteps);
    console.log('Estudiantes cargados:', document.getElementById('id_estudiante').options.length - 1);
}