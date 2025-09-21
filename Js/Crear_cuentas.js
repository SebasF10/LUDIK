console.log("Script de Crear Cuentas con Menú cargado");

// Variables globales para almacenar datos
let materiasData = [];
let gruposData = [];

// ========== FUNCIONALIDAD DEL MENÚ ========== 

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
            console.log("-> Ya estás en crear cuentas");
            // No redirigir, ya estamos en esta página
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

// ========== FUNCIONALIDAD DE CREAR CUENTAS ========== 

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

// ========== INICIALIZACIÓN ========== 

// EJECUTAR cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM cargado - ejecutando función de roles del menú");

    // VERIFICAR ROL INMEDIATAMENTE - SIMPLIFICADO
    const rol = localStorage.getItem('rol');
    console.log('Rol en localStorage:', rol);

    // Eliminar cualquier HR o línea que pueda existir
    const lineas = document.querySelectorAll('hr, .separator, .line, .divider');
    lineas.forEach(linea => {
        console.log('Eliminando línea encontrada');
        linea.remove();
    });

    // Ejecutar función de roles del menú
    eliminarBotonesPorRol();

    // Agregar validación a todos los formularios
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