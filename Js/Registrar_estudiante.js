// filepath: registro-estudiante-app/registro-estudiante-app/Js/registrar_estudiante.js

// Registrar_estudiante.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro-multi-paso');
    let pasoActual = 1;
    const totalPasos = 4;
    
    // Función para mostrar un paso específico
    function mostrarPaso(numeroPaso) {
        // Ocultar todos los pasos
        document.querySelectorAll('.form-step').forEach(paso => {
            paso.style.display = 'none';
            // IMPORTANTE: Remover required de campos ocultos
            paso.querySelectorAll('input, select').forEach(campo => {
                campo.removeAttribute('required');
            });
        });
        
        // Mostrar el paso actual
        const pasoVisible = document.getElementById(getPasoId(numeroPaso));
        if (pasoVisible) {
            pasoVisible.style.display = 'block';
            // IMPORTANTE: Agregar required solo a campos visibles
            pasoVisible.querySelectorAll('input, select').forEach(campo => {
                const esRequerido = debeSerRequerido(campo);
                if (esRequerido) {
                    campo.setAttribute('required', 'required');
                }
            });
        }
        
        pasoActual = numeroPaso;
    }
    
    // Función para determinar el ID del paso
    function getPasoId(numero) {
        const pasos = ['paso-madre', 'paso-padre', 'paso-cuidador', 'paso-estudiante'];
        return pasos[numero - 1];
    }
    
    // Función para determinar si un campo debe ser requerido
    function debeSerRequerido(campo) {
        // Campos que no deben ser required por defecto
        const camposOpcionales = ['victima_tipo', 'etnico_tipo'];
        
        if (camposOpcionales.includes(campo.name)) {
            return false;
        }
        
        // Todos los demás campos son requeridos
        return true;
    }
    
    // Función para validar el paso actual
    function validarPasoActual() {
        const pasoVisible = document.getElementById(getPasoId(pasoActual));
        const camposRequeridos = pasoVisible.querySelectorAll('[required]');
        let esValido = true;
        
        camposRequeridos.forEach(campo => {
            if (!campo.value.trim()) {
                campo.focus();
                esValido = false;
                return false;
            }
        });
        
        return esValido;
    }
    
    // Event listeners para botones "Siguiente"
    document.getElementById('btn-siguiente-madre').addEventListener('click', function(e) {
        e.preventDefault();
        if (validarPasoActual()) {
            mostrarPaso(2);
        }
    });
    
    document.getElementById('btn-siguiente-padre').addEventListener('click', function(e) {
        e.preventDefault();
        if (validarPasoActual()) {
            mostrarPaso(3);
        }
    });
    
    document.getElementById('btn-siguiente-cuidador').addEventListener('click', function(e) {
        e.preventDefault();
        if (validarPasoActual()) {
            mostrarPaso(4);
        }
    });
    
    // Manejar campos condicionales
    document.getElementById('victima_conflicto').addEventListener('change', function() {
        const container = document.getElementById('victima_tipo_container');
        const campoTipo = document.getElementById('victima_tipo');
        
        if (this.value === 'Si') {
            container.style.display = 'block';
            campoTipo.setAttribute('required', 'required');
        } else {
            container.style.display = 'none';
            campoTipo.removeAttribute('required');
            campoTipo.value = '';
        }
    });
    
    document.getElementById('grupo_etnico').addEventListener('change', function() {
        const container = document.getElementById('etnico_tipo_container');
        const campoTipo = document.getElementById('etnico_tipo');
        
        if (this.value === 'Si') {
            container.style.display = 'block';
            campoTipo.setAttribute('required', 'required');
        } else {
            container.style.display = 'none';
            campoTipo.removeAttribute('required');
            campoTipo.value = '';
        }
    });
    
    // Validación antes del envío del formulario
    form.addEventListener('submit', function(e) {
        // Asegurarse de que solo los campos visibles tengan required
        document.querySelectorAll('.form-step').forEach(paso => {
            if (paso.style.display === 'none') {
                paso.querySelectorAll('input, select').forEach(campo => {
                    campo.removeAttribute('required');
                });
            }
        });
        
        // Validar el último paso
        if (!validarPasoActual()) {
            e.preventDefault();
            return false;
        }
        
        // El formulario se enviará normalmente si llega aquí
        console.log('Enviando formulario...');
    });
    
    // Inicializar mostrando el primer paso
    mostrarPaso(1);
});

// Función adicional para debugging
function mostrarCamposRequeridos() {
    console.log('Campos requeridos actualmente:');
    document.querySelectorAll('[required]').forEach(campo => {
        console.log(`- ${campo.name}: ${campo.value}`);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registro-multi-paso');
    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        if (validateForm()) {
            form.submit();
        }
    });

    function validateForm() {
        const estudianteNombre = document.getElementById('estudiante_nombre').value;
        const madreNombre = document.getElementById('madre_nombre').value;
        const padreNombre = document.getElementById('padre_nombre').value;
        const cuidadorNombre = document.getElementById('cuidador_nombre').value;

        if (!estudianteNombre || !madreNombre || !padreNombre || !cuidadorNombre) {
            alert('Por favor, complete todos los campos requeridos.');
            return false;
        }
        return true;
    }

    // Botones para avanzar
    document.getElementById('btn-siguiente-madre').onclick = function () {
        document.getElementById('paso-madre').style.display = 'none';
        document.getElementById('paso-padre').style.display = 'block';
    };
    document.getElementById('btn-siguiente-padre').onclick = function () {
        document.getElementById('paso-padre').style.display = 'none';
        document.getElementById('paso-cuidador').style.display = 'block';
    };
    document.getElementById('btn-siguiente-cuidador').onclick = function () {
        document.getElementById('paso-cuidador').style.display = 'none';
        document.getElementById('paso-estudiante').style.display = 'block';
    };

    // Mostrar campos condicionales
    document.getElementById('victima_conflicto').onchange = function () {
        document.getElementById('victima_tipo_container').style.display = this.value === 'Si' ? 'block' : 'none';
    };
    document.getElementById('grupo_etnico').onchange = function () {
        document.getElementById('etnico_tipo_container').style.display = this.value === 'Si' ? 'block' : 'none';
    };
});