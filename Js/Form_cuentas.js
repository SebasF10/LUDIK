// Función para mostrar el formulario correspondiente
function mostrarFormulario(tipo) {
    // Ocultar todos los formularios
    document.getElementById('form_admin').style.display = 'none';
    document.getElementById('form_docente').style.display = 'none';
    document.getElementById('form_directivos').style.display = 'none';
    document.getElementById('mensaje_cuenta').style.display = 'none';

    // Mostrar el formulario seleccionado
    document.getElementById('form_' + tipo).style.display = 'block';

    // Cargar datos específicos según el tipo
    if (tipo === 'docente') {
        cargarMaterias();
        cargarGrupos();
    }
}

// Función para cargar las materias desde la base de datos
function cargarMaterias() {
    fetch('php/Obtener_datos.php?tipo=materias')
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('checkbox_materias');
            contenedor.innerHTML = '';
            if (data.error) return;
            data.forEach(materia => {
                const label = document.createElement('label');
                label.className = 'checkbox-item';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'id_materia[]';
                checkbox.value = materia.id;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(' ' + materia.nombre));
                contenedor.appendChild(label);
            });
        })
        .catch(error => console.error('Error al cargar materias:', error));
}

function cargarGrupos() {
    fetch('php/Obtener_datos.php?tipo=grupos')
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('checkbox_grupos');
            contenedor.innerHTML = '';
            if (data.error) return;
            data.forEach(grupo => {
                const label = document.createElement('label');
                label.className = 'checkbox-item';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'id_grupo[]';
                checkbox.value = grupo.id;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(' ' + grupo.nombre));
                contenedor.appendChild(label);
            });
        })
        .catch(error => console.error('Error al cargar grupos:', error));
}

// Función para mostrar el selector de grupo para directores
function mostrarSelectorGrupoDirector() {
    const esDirector = document.getElementById('es_director').value;
    const container = document.getElementById('grupo_director_container');
    if (esDirector === "1") {
        container.style.display = 'block';
        cargarGruposDirector();
    } else {
        container.style.display = 'none';
        document.getElementById('grupo_director').innerHTML = '';
    }
}

function cargarGruposDirector() {
    fetch('php/Obtener_datos.php?tipo=grupos')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('grupo_director');
            select.innerHTML = '';
            if (data.error) return;
            data.forEach(grupo => {
                const option = document.createElement('option');
                option.value = grupo.id;
                option.textContent = grupo.nombre;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar grupos director:', error));
}

// Validación de contraseñas
function validarFormulario(form) {
    const contrasena = form.querySelector('input[name="contrasena"]').value;
    const confirmarContrasena = form.querySelector('input[name="confirmar_contrasena"]').value;

    if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden');
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

