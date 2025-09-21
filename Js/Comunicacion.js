// ========== FUNCIONALIDAD DEL MENÚ EXTRAÍBLE ==========
console.log("Script cargado");

// Funcionalidad del menú
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
            console.log("-> Redirigiendo a crear cuentas");
            window.location.href = 'Crear_cuentas.html';
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
            console.log("-> ⌛ NO SE ENCONTRÓ COINCIDENCIA");
            console.log("Texto a comparar:", `"${textoLower}"`);
        }

        // Cerrar menú
        burger.checked = false;
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ========== FUNCIONALIDAD ESPECÍFICA DE COMUNICACIÓN ==========

// Comunicacion.js
class ComunicacionDocentes {
    constructor() {
        this.docentesContainer = document.getElementById('docentesContainer');
        this.searchInput = document.getElementById('searchInput');
        this.showAllBtn = document.getElementById('showAllBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.loadingElement = document.getElementById('loading');
        this.errorElement = document.getElementById('error');
        this.resultsCount = document.getElementById('resultsCount');

        this.currentDocentes = [];

        this.initEventListeners();
        this.loadAllDocentes();
    }

    initEventListeners() {
        // Botón mostrar todos
        this.showAllBtn.addEventListener('click', () => {
            this.loadAllDocentes();
        });

        // Botón buscar
        this.searchBtn.addEventListener('click', () => {
            this.searchDocentes();
        });

        // Botón limpiar
        this.clearBtn.addEventListener('click', () => {
            this.clearSearch();
        });

        // Enter en el campo de búsqueda
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchDocentes();
            }
        });

        // Búsqueda en tiempo real (opcional)
        this.searchInput.addEventListener('input', () => {
            const searchTerm = this.searchInput.value.trim();
            if (searchTerm.length === 0) {
                this.loadAllDocentes();
            }
        });
    }

    showLoading(show = true) {
        this.loadingElement.style.display = show ? 'block' : 'none';
        this.docentesContainer.style.display = show ? 'none' : 'grid';
    }

    showError(message) {
        this.errorElement.textContent = message;
        this.errorElement.style.display = 'block';
        setTimeout(() => {
            this.errorElement.style.display = 'none';
        }, 5000);
    }

    updateResultsCount(count) {
        this.resultsCount.textContent = count;
    }

    async loadAllDocentes() {
        try {
            this.showLoading(true);
            this.errorElement.style.display = 'none';

            const response = await fetch('php/Comunicacion.php?showAll=true');
            const data = await response.json();

            if (data.success) {
                this.currentDocentes = data.data;
                this.renderDocentes(this.currentDocentes);
                this.updateResultsCount(data.total);
                this.searchInput.value = '';
            } else {
                this.showError(data.error || 'Error al cargar los docentes');
            }
        } catch (error) {
            this.showError('Error de conexión: ' + error.message);
            console.error('Error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async searchDocentes() {
        const searchTerm = this.searchInput.value.trim();

        if (searchTerm.length < 2) {
            this.showError('Por favor, ingrese al menos 2 caracteres para buscar');
            return;
        }

        try {
            this.showLoading(true);
            this.errorElement.style.display = 'none';

            // CORREGIR LA RUTA DEL FETCH:
            const response = await fetch(`php/Comunicacion.php?search=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();

            if (data.success) {
                this.currentDocentes = data.data;
                this.renderDocentes(this.currentDocentes);
                this.updateResultsCount(data.total);

                if (data.total === 0) {
                    this.renderNoResults(searchTerm);
                }
            } else {
                this.showError(data.error || 'Error al buscar docentes');
            }
        } catch (error) {
            this.showError('Error de conexión: ' + error.message);
            console.error('Error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    clearSearch() {
        this.searchInput.value = '';
        this.loadAllDocentes();
    }

    renderDocentes(docentes) {
        if (docentes.length === 0) {
            this.renderNoResults();
            return;
        }

        const html = docentes.map(docente => {
            const materiasHtml = docente.materias.length > 0
                ? docente.materias.map(materia =>
                    `<span class="materia-tag">${this.escapeHtml(materia)}</span>`
                ).join('')
                : '<span style="color: #999; font-style: italic;">Sin materias asignadas</span>';

            const gruposText = docente.grupos.length > 0
                ? docente.grupos.join(', ')
                : 'Sin grupos asignados';

            const directorBadge = docente.es_director
                ? '<span class="director-badge">Director de Grupo</span>'
                : '';

            return `
                <div class="docente-card">
                    <div class="docente-header">
                        <div class="docente-nombre">
                            ${this.escapeHtml(docente.nombre)}
                            ${directorBadge}
                        </div>
                        <a href="mailto:${this.escapeHtml(docente.email)}" class="docente-email">
                            📧 ${this.escapeHtml(docente.email)}
                        </a>
                    </div>
                    
                    <div class="materias-section">
                        <h4>📚 Materias que imparte:</h4>
                        <div class="materias-list">
                            ${materiasHtml}
                        </div>
                    </div>
                    
                    <div class="grupos-section">
                        <h4>👥 Grupos:</h4>
                        <div class="grupos-list">
                            ${this.escapeHtml(gruposText)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.docentesContainer.innerHTML = html;
    }

    renderNoResults(searchTerm = '') {
        const message = searchTerm
            ? `No se encontraron docentes que coincidan con "${searchTerm}"`
            : 'No se encontraron docentes';

        const suggestion = searchTerm
            ? 'Intenta con un nombre diferente o usa el botón "Ver Todos los Docentes"'
            : 'Verifica la conexión a la base de datos';

        this.docentesContainer.innerHTML = `
            <div class="no-results">
                <h3>${message}</h3>
                <p>${suggestion}</p>
            </div>
        `;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM cargado - ejecutando función de roles del menú");

    // Primero verificar roles para el menú
    eliminarBotonesPorRol();

    // Luego inicializar la funcionalidad de comunicación
    new ComunicacionDocentes();
});