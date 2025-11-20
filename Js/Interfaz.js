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

    // Ocultar acciones/controles adicionales para padres/madres/acudientes
    ocultarAccionesYControlesParaPadres();
}

// ======= FUNCIÓN PARA ELIMINAR BOTONES SEGÚN ROL =======
function eliminarBotonesPorRol() {
    const rol = (localStorage.getItem("rol") || '').toLowerCase();
    console.log("Verificando rol:", rol);

    // PRIMERO: INSPECCIONAR Y ELIMINAR ELEMENTOS EXTRAÑOS
    inspeccionarYEliminar();

    // Buscar TODOS los botones del menú
    const todosLosBotones = Array.from(document.querySelectorAll('.menu-button'));
    console.log("Botones encontrados:", todosLosBotones.length);

    const padres = ['padre', 'madre', 'acudiente'];
    const esPadre = padres.includes(rol);

    // listas de palabras clave
    const bloqueadasGenerales = ['crear cuenta', 'registrar un nuevo estudiante', 'registrar un piar', 'valoracion', 'valoración'];
    // palabras permitidas específicamente para padres (variantes sin/acento)
    const permitidasPadres = ['perfil', 'estudiantes', 'estudiante', 'econ', 'económica', 'economica', 'ayuda', 'manual', 'manual de usuario', 'cerrar sesión', 'cerrar sesion'];

    todosLosBotones.forEach(function (boton, index) {
        const textoDelBoton = (boton.textContent || '').trim().toLowerCase();
        console.log(`Botón ${index}: "${textoDelBoton}"`);

        // Admin: ver todo
        if (rol === "admin") {
            boton.style.display = '';
            return;
        }

        // Docente de apoyo: todo menos "crear cuenta"
        if (rol === "docente_apoyo") {
            boton.style.display = textoDelBoton.includes("crear cuenta") ? 'none' : '';
            return;
        }

        // Docente: quitar creación de cuentas y registros de estudiantes/piar
        if (rol === "docente") {
            if (textoDelBoton.includes("crear cuenta") ||
                textoDelBoton.includes("registrar un nuevo estudiante") ||
                textoDelBoton.includes("registrar un piar")) {
                boton.style.display = 'none';
            } else {
                boton.style.display = '';
            }
            return;
        }

        // Directivo: quitar cuentas, registrar estudiante, registrar PIAR, valoraciones
        if (rol === "directivo") {
            boton.style.display = bloqueadasGenerales.some(k => textoDelBoton.includes(k)) ? 'none' : '';
            return;
        }

        // Padres/madres/acudientes: mostrar SOLO los permitidos en permitidasPadres
        if (esPadre) {
            const permitido = permitidasPadres.some(k => textoDelBoton.includes(k));
            boton.style.display = permitido ? '' : 'none';
            return;
        }

        // Otros roles: ocultar botones administrativos generales
        if (bloqueadasGenerales.some(k => textoDelBoton.includes(k))) {
            boton.style.display = 'none';
        } else {
            boton.style.display = '';
        }
    });

    // Forzar visibilidad de botones clave por id (si existen)
    const idsMostrar = ['btnPerfil', 'btnEstudiantes', 'btnEconomica', 'btnAyuda', 'btnManual', 'btnCerrarSesion'];
    idsMostrar.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = '';
    });

    // Inspección adicional después de ocultar botones
    setTimeout(inspeccionarYEliminar, 100);
}

// Nueva función: oculta/remueve botones y tarjetas de acciones para padres/madres/acudientes
function ocultarAccionesYControlesParaPadres() {
    const rol = (localStorage.getItem('rol') || '').toLowerCase();
    const padres = ['padre', 'madre', 'acudiente'];
    if (!padres.includes(rol)) return;

    console.log('Ocultando controles restringidos para rol padre/madre/acudiente');

    // IDs conocidos en la UI
    const idsAEliminar = ['btnIA', 'btnValoracion', 'btnDocumentos'];

    idsAEliminar.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.remove();
            console.log(`Eliminado elemento con id: ${id}`);
        }
    });

    // Eliminar tarjetas de acciones que contengan textos relacionados (acciones rápidas)
    const actionCards = Array.from(document.querySelectorAll('#accionesRapidas .action-card'));
    actionCards.forEach(card => {
        const txt = (card.textContent || '').toLowerCase();
        if (txt.includes('diseña actividades') || txt.includes('ia') || txt.includes('valoraciones pedagogicas') || txt.includes('valoración') || txt.includes('documentos')) {
            card.remove();
            console.log('Eliminada action-card restringida para padres');
        }
    });

    // También intentar remover enlaces o botones sueltos con texto relevante
    const botones = Array.from(document.querySelectorAll('button, a, .menu-button'));
    botones.forEach(b => {
        const txt = (b.textContent || '').toLowerCase();
        if (txt.includes('documentos') || txt.includes('valoración') || txt.includes('valoracion') || txt.includes('ia') || txt.includes('nubi') || txt.includes('diseña actividades')) {
            b.remove();
        }
    });

    // Re-ejecutar inspección para limpiar residuos DOM
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
        } else if (textoLower.includes('modificar asignacion de los docentes')) {
            window.location.href = 'Modificar_asignacion_docentes.html';
        } else if (textoLower.includes('documentos')) {
            console.log("-> Redirigiendo a documentos");
            window.location.href = 'Documentos.html';
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


document.addEventListener('DOMContentLoaded', function () {
    const btnDocumentos = document.getElementById('btnDocumentos');
    if (btnDocumentos) {
        btnDocumentos.addEventListener('click', function () {
            window.location.href = 'Documentos.html';
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const btnIA = document.getElementById('btnIA');
    if (btnIA) {
        btnIA.addEventListener('click', function () {
            window.open('https://ia-ludik-1.onrender.com/', '_blank');
        });
    }
});

// Handler explícito para redirigir a la página de modificar asignación de docentes
document.addEventListener('DOMContentLoaded', function () {
    const btnModificar = document.getElementById('btnModificarAsignacion');
    if (btnModificar) {
        btnModificar.addEventListener('click', function () {
            window.location.href = 'Modificar_asignacion_docentes.html';
        });
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

document.addEventListener('DOMContentLoaded', function () {
    // ACCIONES RÁPIDAS SEGÚN ROL
    const acciones = document.getElementById('accionesRapidas');
    if (!acciones) return;

    const rol = (localStorage.getItem('rol') || '').toLowerCase();
    acciones.innerHTML = ''; // Limpia acciones previas

    // Cargar cantidad real de estudiantes
    fetch('php/contar_estudiantes.php')
        .then(response => response.json())
        .then(data => {
            const num = document.getElementById('numEstudiantes');
            if (num && data.total !== undefined) {
                num.textContent = data.total;
            }
        })
        .catch(err => {
            console.error('Error al cargar el número de estudiantes:', err);
        });

    if (['padre', 'madre', 'acudiente'].includes(rol)) {
        // Botón de Ayuda
        acciones.innerHTML += `
            <div class="action-card">
                <div class="action-icon">❓</div>
                <h3>Ayuda</h3>
                <p>Preguntas frecuentes con nuestra plataforma</p>
                <button class="action-btn" id="btnAyuda">Ir a Ayuda</button>
            </div>
            <div class="action-card">
                <div class="action-icon">📊</div>
                <h3>Ver Progreso</h3>
                <p>Consulta el progreso de tu hijo</p>
                <button class="action-btn" id="btnProgresoHijo">Ver Progreso</button>
            </div>
            <div class="action-card">
                <div class="action-icon">💬</div>
                <h3>Comunícate</h3>
                <p>Comunícate con docentes y directivos</p>
                <button class="action-btn" id="btnComunicacion">Abrir Chat</button>
            </div>
        `;
    } else {
        // Botón de IA Nubi
        acciones.innerHTML += `
            <div class="action-card">
                <div class="action-icon">🤖</div>
                <h3>Diseña actividades con nuestra IA Nubi</h3>
                <p>Genera actividades adaptadas con inteligencia artificial</p>
                <button class="action-btn" id="btnNubiIA">Comenzar</button>
            </div>
            <div class="action-card">
                <div class="action-icon">📊</div>
                <h3>Valoraciones Pedagógicas</h3>
                <p>Crea valoraciones pedagógicas para tus estudiantes</p>
                <button class="action-btn" id="btnValoracion">Crear Valoración</button>
            </div>
            <div class="action-card">
                <div class="action-icon">💬</div>
                <h3>Comunícate</h3>
                <p>Comunícate con padres y estudiantes</p>
                <button class="action-btn" id="btnComunicacion">Abrir Chat</button>
            </div>
        `;
    }

    // Asignar eventos a los botones
    if (document.getElementById('btnNubiIA')) {
        document.getElementById('btnNubiIA').addEventListener('click', function () {
            window.open('https://ia-ludik-1.onrender.com/', '_blank');
        });
    }
    if (document.getElementById('btnValoracion')) {
        document.getElementById('btnValoracion').addEventListener('click', function () {
            window.location.href = 'Valoracion_pedagogica.html';
        });
    }
    if (document.getElementById('btnAyuda')) {
        document.getElementById('btnAyuda').addEventListener('click', function () {
            window.location.href = 'Ayuda.html';
        });
    }
    if (document.getElementById('btnProgresoHijo')) {
        document.getElementById('btnProgresoHijo').addEventListener('click', function () {
            window.location.href = 'Estudiantes.html';
        });
    }
    if (document.getElementById('btnComunicacion')) {
        document.getElementById('btnComunicacion').addEventListener('click', function () {
            window.location.href = 'Comunicacion.html';
        });
    }
});