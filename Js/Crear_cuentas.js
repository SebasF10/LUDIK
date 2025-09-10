// Variables globales para almacenar datos
let materiasData = [];
let gruposData = [];

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
        cargarGrupos();
        cargarMaterias();
    }
}

// Función para cargar las materias desde la base de datos
function cargarMaterias() {
    fetch('php/Obtener_datos.php?tipo=materias')
        .then(response => response.json())
        .then(data => {
            if (data.error) return;
            materiasData = data;
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
            
            gruposData = data;
            
            data.forEach(grupo => {
                const label = document.createElement('label');
                label.className = 'checkbox-item';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'grupos_seleccionados[]';
                checkbox.value = grupo.id;
                checkbox.addEventListener('change', manejarSeleccionGrupo);
                
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(' ' + grupo.nombre));
                contenedor.appendChild(label);
            });
        })
        .catch(error => console.error('Error al cargar grupos:', error));
}

// Función para manejar la selección de grupos
function manejarSeleccionGrupo() {
    const gruposSeleccionados = document.querySelectorAll('input[name="grupos_seleccionados[]"]:checked');
    const contenedorAsignaturas = document.getElementById('asignaturas_por_grupo');
    
    // Limpiar contenedor
    contenedorAsignaturas.innerHTML = '<h3>Selecciona las asignaturas para cada grupo:</h3>';
    
    if (gruposSeleccionados.length > 0) {
        contenedorAsignaturas.style.display = 'block';
        
        gruposSeleccionados.forEach(grupoCheckbox => {
            const grupoId = grupoCheckbox.value;
            const grupo = gruposData.find(g => g.id == grupoId);
            
            if (grupo) {
                crearSelectorAsignaturasPorGrupo(grupo);
            }
        });
        
        // Actualizar selector de director de grupo
        actualizarSelectorDirectorGrupo();
    } else {
        contenedorAsignaturas.style.display = 'none';
        document.getElementById('grupo_director').innerHTML = '';
    }
}

// Función para crear el selector de asignaturas para un grupo específico
function crearSelectorAsignaturasPorGrupo(grupo) {
    const contenedorAsignaturas = document.getElementById('asignaturas_por_grupo');
    
    const grupoDiv = document.createElement('div');
    grupoDiv.className = 'grupo-asignaturas';
    grupoDiv.setAttribute('data-grupo-id', grupo.id);
    
    const titulo = document.createElement('h4');
    titulo.textContent = `Asignaturas para ${grupo.nombre}`;
    grupoDiv.appendChild(titulo);
    
    const checkboxList = document.createElement('div');
    checkboxList.className = 'checkbox-list';
    
    materiasData.forEach(materia => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = `asignaturas_grupo_${grupo.id}[]`;
        checkbox.value = materia.id;
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + materia.nombre));
        checkboxList.appendChild(label);
    });
    
    grupoDiv.appendChild(checkboxList);
    contenedorAsignaturas.appendChild(grupoDiv);
}

// Función para mostrar el selector de grupo para directores
function mostrarSelectorGrupoDirector() {
    const esDirector = document.getElementById('es_director').value;
    const container = document.getElementById('grupo_director_container');
    
    if (esDirector === "1") {
        container.style.display = 'block';
        actualizarSelectorDirectorGrupo();
    } else {
        container.style.display = 'none';
        document.getElementById('grupo_director').innerHTML = '';
    }
}

// Función para actualizar el selector de director de grupo con los grupos seleccionados
function actualizarSelectorDirectorGrupo() {
    const gruposSeleccionados = document.querySelectorAll('input[name="grupos_seleccionados[]"]:checked');
    const select = document.getElementById('grupo_director');
    
    select.innerHTML = '<option value="">Seleccione un grupo</option>';
    
    gruposSeleccionados.forEach(grupoCheckbox => {
        const grupoId = grupoCheckbox.value;
        const grupo = gruposData.find(g => g.id == grupoId);
        
        if (grupo) {
            const option = document.createElement('option');
            option.value = grupo.id;
            option.textContent = grupo.nombre;
            select.appendChild(option);
        }
    });
}

// Validación de contraseñas
function validarFormulario(form) {
    const contrasena = form.querySelector('input[name="contrasena"]').value;
    const confirmarContrasena = form.querySelector('input[name="confirmar_contrasena"]').value;

    if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden');
        return false;
    }

    // Validación específica para docentes
    if (form.id === 'form_docente') {
        const gruposSeleccionados = form.querySelectorAll('input[name="grupos_seleccionados[]"]:checked');
        
        if (gruposSeleccionados.length === 0) {
            alert('Debe seleccionar al menos un grupo');
            return false;
        }
        
        // Verificar que cada grupo tenga al menos una asignatura seleccionada
        for (let grupoCheckbox of gruposSeleccionados) {
            const grupoId = grupoCheckbox.value;
            const asignaturasGrupo = form.querySelectorAll(`input[name="asignaturas_grupo_${grupoId}[]"]:checked`);
            
            if (asignaturasGrupo.length === 0) {
                const grupo = gruposData.find(g => g.id == grupoId);
                alert(`Debe seleccionar al menos una asignatura para el grupo ${grupo.nombre}`);
                return false;
            }
        }
        
        // Si es director, verificar que haya seleccionado un grupo
        const esDirector = form.querySelector('#es_director').value;
        if (esDirector === "1") {
            const grupoDirector = form.querySelector('#grupo_director').value;
            if (!grupoDirector) {
                alert('Debe seleccionar el grupo que va a dirigir');
                return false;
            }
        }
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
        // Limpiar también las asignaturas por grupo
        if (formularioId === 'form_docente') {
            document.getElementById('asignaturas_por_grupo').style.display = 'none';
            document.getElementById('asignaturas_por_grupo').innerHTML = '<h3>Selecciona las asignaturas para cada grupo:</h3>';
        }
    }
}