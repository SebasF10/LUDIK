// ======= FUNCIONALIDAD DEL MENÚ (COPIADA DE Menu.js) =======
console.log("Script cargado");

// Funcionalidad del menú
const burger = document.getElementById('burger');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

// Esperar a que el DOM esté cargado para configurar el menú
document.addEventListener('DOMContentLoaded', function() {
    // Configurar event listeners del menú solo si existen los elementos
    if (burger && sideMenu && overlay) {
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
    }
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
            console.log("-> Ya estás en perfil");
            // No redirigir porque ya estamos en perfil
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
            console.log("-> ❌ NO SE ENCONTRÓ COINCIDENCIA");
            console.log("Texto a comparar:", `"${textoLower}"`);
        }

        // Cerrar menú
        if (burger && sideMenu && overlay) {
            burger.checked = false;
            sideMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// ======= FUNCIONALIDAD DEL PERFIL (ORIGINAL) =======
document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading");

    // Ejecutar funciones del menú
    eliminarBotonesPorRol();

    // Mostrar loading al inicio
    loading.style.display = "flex";

    fetch("php/Perfil.php")
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                window.location.href = "Inicio_sesion.html";
                return;
            }

            // Ocultar loading
            loading.style.display = "none";

            // Cargar datos básicos del usuario
            cargarDatosBasicos(data);

            // Cargar contenido específico según el rol
            cargarContenidoPorRol(data);
        })
        .catch(err => {
            loading.style.display = "none";
            console.error("Error cargando perfil:", err);
            alert("Error al cargar el perfil. Intenta nuevamente.");
        });
});

function cargarDatosBasicos(data) {
    // Datos principales
    document.getElementById("fotoPerfil").src = data.foto || "img/default-avatar.png";
    document.getElementById("nombreUsuario").textContent = data.nombre || "Sin nombre";
    document.getElementById("rolBadge").textContent = data.rol || "Usuario";
    document.getElementById("emailUsuario").textContent = data.email || "Sin email";
    document.getElementById("celularUsuario").textContent = data.celular || "No registrado";

    // Aplicar clase del rol para estilos
    const rolNormalizado = (data.rol || "").toLowerCase().replace(/\s+/g, "_");
    document.body.classList.add("rol-" + rolNormalizado);

    // Información adicional si existe
    if (data.info_adicional) {
        document.getElementById("infoAdicional").style.display = "flex";
        document.getElementById("infoAdicionalTexto").innerHTML = data.info_adicional;
    }
}

function cargarContenidoPorRol(data) {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    // Crear cards según el rol
    switch (data.rol) {
        case "admin":
            crearCardsAdmin(container, data);
            break;
        case "docente":
            crearCardsDocente(container, data);
            break;
        case "docente_apoyo":
            crearCardsDocenteApoyo(container, data);
            break;
        case "directivo":
            crearCardsDirectivo(container, data);
            break;
        case "estudiante":
            crearCardsEstudiante(container, data);
            break;
        case "madre":
        case "padre":
        case "acudiente":
            crearCardsFamilia(container, data);
            break;
    }
}

function crearCardsAdmin(container, data) {
    // Estadísticas del sistema
    if (data.estadisticas) {
        const statsCard = crearCard("fas fa-chart-bar", "Estadísticas del Sistema", [
            { label: "Total Estudiantes", value: data.estadisticas.total_estudiantes || 0 },
            { label: "Total Docentes", value: data.estadisticas.total_docentes || 0 },
            { label: "Total Directivos", value: data.estadisticas.total_directivos || 0 },
            { label: "Total Grupos", value: data.estadisticas.total_grupos || 0 },
            { label: "Total Asignaturas", value: data.estadisticas.total_asignaturas || 0 }
        ]);
        container.appendChild(statsCard);
    }

    // PIARs activos
    if (data.piars_activos) {
        const piarsCard = crearCard("fas fa-file-medical", "PIARs Activos",
            data.piars_activos.map(piar => ({
                label: piar.estudiante,
                value: `Actualizado: ${piar.fecha}`
            }))
        );
        container.appendChild(piarsCard);
    }

    // Actividad reciente
    if (data.actividad_reciente) {
        const actividadCard = crearCardLista("fas fa-clock", "Actividad Reciente",
            data.actividad_reciente.map(actividad => actividad.descripcion)
        );
        container.appendChild(actividadCard);
    }
}

function crearCardsDocente(container, data) {
    // Grupos asignados
    if (data.grupos_asignados) {
        const gruposCard = crearCardLista("fas fa-users", "Mis Grupos",
            data.grupos_asignados.map(grupo => `${grupo.grado} - Grupo ${grupo.grupo} (${grupo.total_estudiantes} estudiantes)`)
        );
        container.appendChild(gruposCard);
    }

    // Asignaturas que dicta
    if (data.asignaturas) {
        const asignaturasCard = crearCardLista("fas fa-book", "Asignaturas que Dicto",
            data.asignaturas.map(asignatura => asignatura.nombre_asig)
        );
        container.appendChild(asignaturasCard);
    }

    // Estudiantes con PIAR
    if (data.estudiantes_piar) {
        const piarCard = crearCardLista("fas fa-heart", "Estudiantes con PIAR",
            data.estudiantes_piar.map(est => `${est.nombre} ${est.apellidos} - ${est.grupo}`)
        );
        container.appendChild(piarCard);
    }

    // Director de grupo (si aplica)
    if (data.es_director_grupo && data.grupo_dirigido) {
        const directorCard = crearCard("fas fa-crown", "Dirección de Grupo", [
            { label: "Grupo a Cargo", value: data.grupo_dirigido.nombre },
            { label: "Total Estudiantes", value: data.grupo_dirigido.total_estudiantes },
            { label: "Estudiantes con PIAR", value: data.grupo_dirigido.estudiantes_piar }
        ]);
        container.appendChild(directorCard);
    }
}

function crearCardsDocenteApoyo(container, data) {
    // Estudiantes que apoya
    if (data.estudiantes_apoyo) {
        const estudiantesCard = crearCardLista("fas fa-hands-helping", "Estudiantes que Apoyo",
            data.estudiantes_apoyo.map(est => `${est.nombre} ${est.apellidos} (${est.grado} - ${est.grupo})`)
        );
        container.appendChild(estudiantesCard);
    }

    // PIARs activos
    if (data.piars_activos) {
        const piarsCard = crearCard("fas fa-clipboard-list", "PIARs en Seguimiento", [
            { label: "Total PIARs", value: data.piars_activos.total },
            { label: "Actualizados este mes", value: data.piars_activos.recientes },
            { label: "Pendientes revisión", value: data.piars_activos.pendientes }
        ]);
        container.appendChild(piarsCard);
    }
}

function crearCardsDirectivo(container, data) {
    // Estadísticas generales
    if (data.estadisticas) {
        const statsCard = crearCard("fas fa-chart-line", "Resumen Institucional", [
            { label: "Total Estudiantes", value: data.estadisticas.total_estudiantes },
            { label: "Docentes Activos", value: data.estadisticas.total_docentes },
            { label: "Grupos Formados", value: data.estadisticas.total_grupos },
            { label: "PIARs Activos", value: data.estadisticas.total_piars }
        ]);
        container.appendChild(statsCard);
    }

    // Información del cargo
    if (data.cargo) {
        const cargoCard = crearCard("fas fa-briefcase", "Información del Cargo", [
            { label: "Cargo", value: data.cargo },
            { label: "Sede Principal", value: data.sede || "Sede A" },
            { label: "Años de Experiencia", value: data.experiencia || "N/A" }
        ]);
        container.appendChild(cargoCard);
    }
}

function crearCardsEstudiante(container, data) {
    // Información académica
    if (data.info_academica) {
        const academicoCard = crearCard("fas fa-graduation-cap", "Información Académica", [
            { label: "Grado", value: data.info_academica.grado },
            { label: "Grupo", value: data.info_academica.grupo },
            { label: "Director de Grupo", value: data.info_academica.director_grupo },
            { label: "Año", value: data.info_academica.anio }
        ]);
        container.appendChild(academicoCard);
    }

    // Información familiar
    if (data.info_familiar) {
        const familiarCard = crearCard("fas fa-home", "Información Familiar", [
            { label: "Madre", value: data.info_familiar.madre || "No registrada" },
            { label: "Padre", value: data.info_familiar.padre || "No registrado" },
            { label: "Acudiente", value: data.info_familiar.acudiente || "No registrado" },
            { label: "Vive con", value: data.info_familiar.con_quien_vive || "No especificado" }
        ]);
        container.appendChild(familiarCard);
    }

    // PIAR (si existe)
    if (data.piar) {
        const piarCard = crearCard("fas fa-heart", "Plan Individual (PIAR)", [
            { label: "Estado", value: "Activo" },
            { label: "Última actualización", value: data.piar.fecha },
            { label: "Diagnóstico", value: data.piar.diagnostico || "Ver detalles" },
            { label: "Apoyos requeridos", value: data.piar.total_apoyos || "N/A" }
        ]);
        container.appendChild(piarCard);
    }

    // Asignaturas y docentes
    if (data.asignaturas_docentes) {
        const docentesCard = crearCardLista("fas fa-chalkboard-teacher", "Mis Docentes",
            data.asignaturas_docentes.map(ad => `${ad.asignatura}: ${ad.docente}`)
        );
        container.appendChild(docentesCard);
    }
}

function crearCardsFamilia(container, data) {
    // Información del estudiante conectado
    if (data.estudiante_conectado) {
        const estudianteCard = crearCard("fas fa-child", "Mi Hijo/a", [
            { label: "Nombre", value: `${data.estudiante_conectado.nombre} ${data.estudiante_conectado.apellidos}` },
            { label: "Documento", value: data.estudiante_conectado.no_documento },
            { label: "Grado", value: data.estudiante_conectado.grado_actual },
            { label: "Grupo", value: data.estudiante_conectado.grupo_actual },
            { label: "Director de Grupo", value: data.estudiante_conectado.director_grupo }
        ]);
        container.appendChild(estudianteCard);
    }

    // Información académica del estudiante
    if (data.info_academica_estudiante) {
        const academicoCard = crearCardLista("fas fa-book-open", "Asignaturas y Docentes",
            data.info_academica_estudiante.map(info => `${info.asignatura}: ${info.docente}`)
        );
        container.appendChild(academicoCard);
    }

    // PIAR del estudiante (si existe)
    if (data.estudiante_piar) {
        const piarCard = crearCard("fas fa-medical-file", "Plan Individual (PIAR)", [
            { label: "Estado", value: "Activo" },
            { label: "Última actualización", value: data.estudiante_piar.fecha },
            { label: "Diagnóstico principal", value: data.estudiante_piar.diagnostico },
            { label: "Próxima revisión", value: data.estudiante_piar.proxima_revision }
        ]);
        container.appendChild(piarCard);
    }

    // Información familiar completa
    if (data.info_familia_completa) {
        const familiaCard = crearCard("fas fa-users", "Núcleo Familiar", [
            { label: "Madre", value: data.info_familia_completa.madre },
            { label: "Padre", value: data.info_familia_completa.padre },
            { label: "Acudiente", value: data.info_familia_completa.acudiente },
            { label: "Hermanos", value: data.info_familia_completa.hermanos || "0" }
        ]);
        container.appendChild(familiaCard);
    }
}

// Función para crear una card con estadísticas
function crearCard(icono, titulo, estadisticas) {
    const card = document.createElement('div');
    card.className = 'data-card';

    const header = `
        <div class="card-header">
            <i class="${icono}"></i>
            <h3>${titulo}</h3>
        </div>
    `;

    const content = estadisticas.map(stat => `
        <div class="stat-item">
            <span class="stat-label">${stat.label}</span>
            <span class="stat-value">${stat.value}</span>
        </div>
    `).join('');

    card.innerHTML = `
        ${header}
        <div class="card-content">
            ${content}
        </div>
    `;

    return card;
}

// Función para crear una card con lista
function crearCardLista(icono, titulo, items) {
    const card = document.createElement('div');
    card.className = 'data-card';

    const header = `
        <div class="card-header">
            <i class="${icono}"></i>
            <h3>${titulo}</h3>
        </div>
    `;

    const content = items.slice(0, 10).map(item => `
        <div class="list-item">${item}</div>
    `).join('');

    const moreInfo = items.length > 10 ? `
        <div class="list-item" style="text-align: center; font-style: italic; color: #666;">
            ... y ${items.length - 10} más
        </div>
    ` : '';

    card.innerHTML = `
        ${header}
        <div class="card-content">
            ${content}
            ${moreInfo}
        </div>
    `;

    return card;
}

// Función para manejar el botón regresar
function goBackOrRedirect(ruta) {
    if (ruta && ruta.trim() !== '') {
        window.location.href = ruta;
    } else {
        window.history.back();
    }
}

// Función para formatear fechas
function formatearFecha(fecha) {
    if (!fecha) return "N/A";

    try {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return fecha;
    }
}

// Función para animar las cards al cargar
function animarCards() {
    const cards = document.querySelectorAll('.data-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Llamar animación después de cargar las cards
setTimeout(() => {
    animarCards();
}, 500);