// Función para mostrar el formulario correspondiente
function mostrarFormulario(tipo) {
    // Ocultar todos los formularios
    document.getElementById('form_admin').style.display = 'none';
    document.getElementById('form_profesor').style.display = 'none';
    document.getElementById('form_acudiente').style.display = 'none';
    document.getElementById('mensaje_cuenta').style.display = 'none';

    // Mostrar el formulario seleccionado
    document.getElementById('form_' + tipo).style.display = 'block';

    // Cargar datos específicos según el tipo
    if (tipo === 'profesor') {
        cargarSedes();
        cargarMaterias();
    }
}

// Función para cargar las sedes desde la base de datos
function cargarSedes() {
    fetch('php/Obtener_datos.php?tipo=sedes')
        .then(response => response.json())
        .then(data => {
            const selectSede = document.querySelector('select[name="id_sede"]');
            selectSede.innerHTML = '<option value="">Seleccionar sede</option>';

            if (data.error) {
                console.error('Error al cargar sedes:', data.error);
                return;
            }

            data.forEach(sede => {
                const option = document.createElement('option');
                option.value = sede.id;
                option.textContent = sede.nombre;
                selectSede.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar sedes:', error));
}

// Función para cargar las materias desde la base de datos
function cargarMaterias() {
    fetch('php/Obtener_datos.php?tipo=materias')
        .then(response => response.json())
        .then(data => {
            const selectMateria = document.querySelector('select[name="id_materia"]');
            selectMateria.innerHTML = '<option value="">Seleccionar materia</option>';

            if (data.error) {
                console.error('Error al cargar materias:', data.error);
                return;
            }

            data.forEach(materia => {
                const option = document.createElement('option');
                option.value = materia.id;
                option.textContent = materia.nombre;
                selectMateria.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar materias:', error));
}

// Validación de contraseñas
function validarFormulario(form) {
    const contrasena = form.querySelector('input[name="contrasena"]').value;
    const confirmarContrasena = form.querySelector('input[name="confirmar_contrasena"]').value;

    if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden');
        return false;
    }

    if (contrasena.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return false;
    }

    return true;
}

// Agregar validación a todos los formularios
document.addEventListener('DOMContentLoaded', function () {
    const formularios = document.querySelectorAll('form');

    formularios.forEach(form => {
        form.addEventListener('submit', function (e) {
            if (!validarFormulario(this)) {
                e.preventDefault();
            }
        });
    });

    // Mostrar mensaje si viene de PHP
    const urlParams = new URLSearchParams(window.location.search);
    const mensaje = urlParams.get('mensaje');
    const tipo = urlParams.get('tipo');

    if (mensaje && tipo) {
        mostrarMensaje(mensaje, tipo);
    }
});

// Función para mostrar mensajes de resultado
function mostrarMensaje(mensaje, tipo) {
    const divMensaje = document.getElementById('mensaje_resultado');
    const textoMensaje = document.getElementById('texto_resultado');

    textoMensaje.textContent = mensaje;
    divMensaje.style.display = 'block';
    divMensaje.className = tipo; // 'exito' o 'error'

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        divMensaje.style.display = 'none';
    }, 5000);
}

// Función para limpiar formularios
function limpiarFormulario(formularioId) {
    const form = document.getElementById(formularioId);
    if (form) {
        form.reset();
    }
}

