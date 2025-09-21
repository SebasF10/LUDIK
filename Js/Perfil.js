document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loading");

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
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animarCards, 500);
});
