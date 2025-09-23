console.log("Interfaz.js - Header y Menú script cargado");

// Variables globales del menú
const burger = document.getElementById('burger');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

// Esperar a que el DOM esté cargado para configurar el menú
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM cargado - Inicializando funcionalidades");

    // Configurar event listeners del menú solo si existen los elementos
    if (burger && sideMenu && overlay) {
        // Abrir / cerrar menú con el checkbox
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

        // Cerrar menú al hacer clic en el overlay
        overlay.addEventListener('click', function () {
            burger.checked = false;
            sideMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    } else {
        console.warn("Elementos del menú no encontrados en el DOM.");
    }

    // Verificar y aplicar restricciones por rol
    verificarYAplicarRestricciones();
});

// ======= FUNCIÓN PARA INSPECCIONAR Y ELIMINAR ELEMENTOS EXTRAÑOS =======
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

        if (!['menu-header', 'menu-buttons'].some(clase => elemento.classList.contains(clase))) {
            if (elemento.tagName === 'HR' || elemento.offsetHeight <= 5) {
                console.log(`🗑️ ELIMINANDO elemento extraño en side-menu: ${elemento.tagName}`);
                elemento.remove();
            }
        }
    });
}

// ======= FUNCIÓN PARA VERIFICAR ROL Y APLICAR RESTRICCIONES =======
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

// ======= FUNCIÓN PARA ELIMINAR BOTONES SEGÚN ROL =======
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

    // Inspección adicional después de eliminar botones
    setTimeout(inspeccionarYEliminar, 100);
}

// ======= MANEJO DE CLICKS EN BOTONES DEL MENÚ =======
document.addEventListener('click', function (e) {
    const boton = e.target.closest('.menu-button');
    if (boton) {
        const texto = boton.textContent.trim();
        const textoLower = texto.toLowerCase();

        console.log("=== DEBUG CLICK ===", textoLower);

        // Navegación según el botón clickeado
        if (textoLower.includes('perfil')) {
            window.location.href = 'perfil.html';
        } else if (textoLower.includes('estudiantes')) {
            window.location.href = 'Estudiantes.html';
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

        // Cerrar menú al hacer click en cualquier botón
        if (burger && sideMenu && overlay) {
            burger.checked = false;
            sideMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// ======= FUNCIONES ADICIONALES PARA PERSONALIZACIÓN =======

// Función para cambiar el título del header
function cambiarTitulo(nuevoTitulo) {
    const titulo = document.querySelector('.title');
    if (titulo) {
        titulo.textContent = nuevoTitulo;
    }
}

// Función para cambiar el logo
function cambiarLogo(rutaLogo) {
    const logo = document.querySelector('.header-logo');
    if (logo) {
        logo.src = rutaLogo;
    }
}

// Función para añadir botón personalizado al menú
function añadirBotonMenu(icono, texto, callback) {
    const menuButtons = document.querySelector('.menu-buttons');
    const botonCerrarSesion = document.querySelector('.close-session');

    if (menuButtons) {
        const nuevoBoton = document.createElement('button');
        nuevoBoton.className = 'menu-button';
        nuevoBoton.innerHTML = `
            <span class="menu-icon">${icono}</span>
            ${texto}
        `;

        // Insertar antes del botón de cerrar sesión
        if (botonCerrarSesion) {
            menuButtons.insertBefore(nuevoBoton, botonCerrarSesion);
        } else {
            menuButtons.appendChild(nuevoBoton);
        }

        // Añadir evento click
        nuevoBoton.addEventListener('click', callback);

        return nuevoBoton;
    }
}

// Función para remover botón específico
function removerBotonMenu(textoBoton) {
    const botones = document.querySelectorAll('.menu-button');
    botones.forEach(boton => {
        if (boton.textContent.trim().toLowerCase().includes(textoBoton.toLowerCase())) {
            boton.remove();
        }
    });
}

// Función para cambiar el título del panel de control
function cambiarTituloPanel(nuevoTitulo) {
    const menuTitle = document.querySelector('.menu-title');
    if (menuTitle) {
        menuTitle.textContent = nuevoTitulo;
    }
}

// ======= FUNCIONES DE DETECCIÓN DE DISPOSITIVO =======
function esMobile() {
    return window.innerWidth <= 768;
}

function esTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function esDesktop() {
    return window.innerWidth > 1024;
}

// ======= FUNCIONES DE UTILIDAD ADICIONALES =======

// Función para mostrar/ocultar elementos según rol
function mostrarElementoPorRol(selector, rolesPermitidos) {
    const elemento = document.querySelector(selector);
    const rolActual = localStorage.getItem('rol');

    if (elemento) {
        if (rolesPermitidos.includes(rolActual)) {
            elemento.style.display = '';
        } else {
            elemento.style.display = 'none';
        }
    }
}

// Función para obtener información del usuario actual
function obtenerInfoUsuario() {
    return {
        rol: localStorage.getItem('rol') || 'invitado',
        usuario: localStorage.getItem('usuario') || 'Usuario',
        ultimoAcceso: localStorage.getItem('ultimoAcceso') || new Date().toISOString()
    };
}

// Función para log de actividad (para debugging)
function logActividad(accion, detalles = '') {
    const timestamp = new Date().toLocaleString();
    const usuario = obtenerInfoUsuario();
    console.log(`[${timestamp}] ${usuario.rol.toUpperCase()}: ${accion} ${detalles}`);
}

// Función para validar sesión
function validarSesion() {
    const rol = localStorage.getItem('rol');
    const usuario = localStorage.getItem('usuario');

    if (!rol || !usuario) {
        console.warn('Sesión no válida, redirigiendo al login');
        window.location.href = 'Inicio_sesion.html';
        return false;
    }

    return true;
}

// Función para actualizar último acceso
function actualizarUltimoAcceso() {
    localStorage.setItem('ultimoAcceso', new Date().toISOString());
}

// ======= EVENTOS DE VENTANA =======
window.addEventListener('resize', function () {
    // Cerrar menú si se redimensiona la ventana
    if (burger && burger.checked && esDesktop()) {
        burger.checked = false;
        if (sideMenu) sideMenu.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Prevenir scroll del body cuando el menú está abierto
window.addEventListener('scroll', function () {
    if (sideMenu && sideMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    }
});

// ======= INICIALIZACIÓN ADICIONAL =======
// Actualizar último acceso al cargar la página
actualizarUltimoAcceso();

// Log de carga de página
logActividad('Página cargada', 'Interfaz.html');

// Exportar funciones para uso global (opcional)
window.InterfazMenu = {
    cambiarTitulo,
    cambiarLogo,
    añadirBotonMenu,
    removerBotonMenu,
    cambiarTituloPanel,
    inspeccionarYEliminar,
    eliminarBotonesPorRol,
    mostrarElementoPorRol,
    obtenerInfoUsuario,
    validarSesion,
    esMobile,
    esTablet,
    esDesktop
};

// ======= MANEJO DE ERRORES =======
window.addEventListener('error', function (e) {
    console.error('Error en Interfaz.js:', e.error);
    logActividad('Error', e.error?.message || 'Error desconocido');
});

// ======= VERIFICACIONES FINALES =======
// Verificar que todos los elementos críticos estén presentes
setTimeout(() => {
    const elementosCriticos = ['burger', 'sideMenu', 'overlay'];
    const elementosFaltantes = elementosCriticos.filter(id => !document.getElementById(id));

    if (elementosFaltantes.length > 0) {
        console.warn('Elementos críticos faltantes:', elementosFaltantes);
    } else {
        console.log('✅ Todos los elementos del menú están presentes');
    }
}, 1000);

console.log("✅ Interfaz.js completamente cargado y configurado");