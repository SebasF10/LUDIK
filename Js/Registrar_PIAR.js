console.log("Script cargado");

// Variables para el PIAR
let pasoActual = 1;
let piarId = null;
let entornoSaludId = null;
let contadorTratamientos = 1;
let contadorMedicamentos = 1;
let contadorAtencion = 1;

// ===== FUNCIONALIDAD DEL MENÚ EXTRAÍBLE =====
const burger = document.getElementById('burger');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

// Event listener para el menú hamburguesa
if (burger) {
    burger.addEventListener('change', function () {
        if (this.checked) {
            sideMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Inspeccionar elementos cuando se abra el menú
            setTimeout(inspeccionarYEliminar, 200);
        } else {
            sideMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Event listener para cerrar el menú con overlay
if (overlay) {
    overlay.addEventListener('click', function () {
        burger.checked = false;
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

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

// ===== FUNCIONALIDAD PIAR =====

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM cargado - ejecutando función de roles");
    eliminarBotonesPorRol();

    // VERIFICAR ROL INMEDIATAMENTE - SIMPLIFICADO
    const rol = localStorage.getItem('rol');
    console.log('Rol en localStorage:', rol);

    // Eliminar cualquier HR o línea que pueda existir
    const lineas = document.querySelectorAll('hr, .separator, .line, .divider');
    lineas.forEach(linea => {
        console.log('Eliminando línea encontrada');
        linea.remove();
    });

    // Si NO es admin, ocultar el botón
    if (rol !== 'admin') {
        const botonCrear = document.getElementById('btnCrearCuentas');
        if (botonCrear) {
            botonCrear.style.display = 'none';
            console.log('Botón ocultado para rol:', rol);
        }
    }

    // Inicializar funciones del PIAR
    cargarEstudiantes();
    cargarDiagnosticosCIE10();
    configurarFechaActual();
});

// Configurar fecha actual
function configurarFechaActual() {
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split('T')[0];
    const fechaInput = document.getElementById('fecha_piar');
    if (fechaInput) {
        fechaInput.value = fechaFormateada;
    }
}

// Cargar lista de estudiantes
async function cargarEstudiantes() {
    try {
        const response = await fetch('php/obtener_estudiantes.php');
        const estudiantes = await response.json();

        const select = document.getElementById('id_estudiante');
        if (select) {
            select.innerHTML = '<option value="">Seleccionar estudiante...</option>';

            estudiantes.forEach(estudiante => {
                const option = document.createElement('option');
                option.value = estudiante.id_estudiante;
                option.textContent = `${estudiante.nombre} ${estudiante.apellidos}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        mostrarMensaje('Error al cargar estudiantes: ' + error.message, 'error');
    }
}

// Cargar diagnósticos CIE-10
async function cargarDiagnosticosCIE10() {
    try {
        const response = await fetch('php/obtener_diagnosticos_cie10.php');
        const diagnosticos = await response.json();

        const container = document.getElementById('diagnosticos-cie10-container');
        if (container) {
            container.innerHTML = '';

            diagnosticos.forEach(diagnostico => {
                const div = document.createElement('div');
                div.className = 'checkbox-item';

                div.innerHTML = `
                    <input type="checkbox" id="cie10_${diagnostico.id_cie10}" 
                           name="diagnosticos_cie10[]" value="${diagnostico.id_cie10}">
                    <label for="cie10_${diagnostico.id_cie10}">
                        <strong>${diagnostico.id_cie10}</strong> - ${diagnostico.descripcion}
                    </label>
                `;

                container.appendChild(div);
            });
        }
    } catch (error) {
        mostrarMensaje('Error al cargar diagnósticos CIE-10: ' + error.message, 'error');
    }
}

// Registrar PIAR
async function registrarPIAR() {
    const form = document.getElementById('form-piar');
    const formData = new FormData(form);

    if (!validarFormulario(form)) {
        mostrarMensaje('Por favor complete todos los campos requeridos', 'error');
        return;
    }

    try {
        const response = await fetch('php/Registrar_PIAR.php', {
            method: 'POST',
            body: formData
        });

        const resultado = await response.json();

        if (resultado.success) {
            piarId = resultado.piar_id;
            mostrarMensaje('PIAR registrado exitosamente', 'exito');
            marcarPasoCompletado(1);
            mostrarPaso(2);
        } else {
            mostrarMensaje('Error al registrar PIAR: ' + resultado.message, 'error');
        }
    } catch (error) {
        mostrarMensaje('Error de conexión: ' + error.message, 'error');
    }
}

// Registrar tratamientos
async function registrarTratamientos() {
    const tratamientos = [];
    const items = document.querySelectorAll('.tratamiento-item');

    items.forEach((item, index) => {
        const descripcion = item.querySelector('textarea[name="descripcion_tratamiento[]"]').value;
        const frecuencia = item.querySelector('input[name="frecuencia_tratamiento[]"]').value;

        if (descripcion.trim()) {
            tratamientos.push({
                descripcion: descripcion,
                frecuencia: frecuencia
            });
        }
    });

    if (tratamientos.length === 0) {
        mostrarMensaje('Debe agregar al menos un tratamiento', 'error');
        return;
    }

    try {
        const response = await fetch('php/registrar_tratamientos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tratamientos: tratamientos })
        });

        const resultado = await response.json();

        if (resultado.success) {
            mostrarMensaje('Tratamientos registrados exitosamente', 'exito');
            marcarPasoCompletado(2);
            mostrarPaso(3);
        } else {
            mostrarMensaje('Error al registrar tratamientos: ' + resultado.message, 'error');
        }
    } catch (error) {
        mostrarMensaje('Error de conexión: ' + error.message, 'error');
    }
}

// Registrar medicamentos y atención médica
async function registrarMedicamentosYAtencion() {
    const medicamentos = [];
    const atencionMedica = [];

    // Recopilar medicamentos
    const medicamentoItems = document.querySelectorAll('.medicamento-item');
    medicamentoItems.forEach(item => {
        const descripcion = item.querySelector('textarea[name="descripcion_medicamento[]"]').value;
        const frecuencia = item.querySelector('input[name="frecuencia_medicamento[]"]').value;

        if (descripcion.trim()) {
            medicamentos.push({
                descripcion: descripcion,
                frecuencia_horario: frecuencia
            });
        }
    });

    // Recopilar atención médica
    const atencionItems = document.querySelectorAll('.atencion-item');
    atencionItems.forEach(item => {
        const descripcion = item.querySelector('textarea[name="descripcion_atencion[]"]').value;
        const frecuencia = item.querySelector('input[name="frecuencia_atencion[]"]').value;

        if (descripcion.trim()) {
            atencionMedica.push({
                descripcion: descripcion,
                frecuencia: frecuencia
            });
        }
    });

    if (medicamentos.length === 0 && atencionMedica.length === 0) {
        mostrarMensaje('Debe agregar al menos un medicamento o una atención médica', 'error');
        return;
    }

    try {
        const response = await fetch('php/registrar_medicamentos_atencion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                medicamentos: medicamentos,
                atencion_medica: atencionMedica
            })
        });

        const resultado = await response.json();

        if (resultado.success) {
            entornoSaludId = resultado.entorno_salud_id;
            mostrarMensaje('Medicamentos y atención médica registrados exitosamente', 'exito');
            marcarPasoCompletado(3);
            mostrarPaso(4);
        } else {
            mostrarMensaje('Error al registrar medicamentos y atención: ' + resultado.message, 'error');
        }
    } catch (error) {
        mostrarMensaje('Error de conexión: ' + error.message, 'error');
    }
}

// Registrar diagnóstico médico
async function registrarDiagnostico() {
    const form = document.getElementById('form-diagnostico');

    if (!validarFormulario(form)) {
        mostrarMensaje('Por favor complete todos los campos requeridos', 'error');
        return;
    }

    // Obtener diagnósticos CIE-10 seleccionados
    const diagnosticosSeleccionados = [];
    const checkboxes = document.querySelectorAll('input[name="diagnosticos_cie10[]"]:checked');
    checkboxes.forEach(checkbox => {
        diagnosticosSeleccionados.push(checkbox.value);
    });

    if (diagnosticosSeleccionados.length === 0) {
        mostrarMensaje('Debe seleccionar al menos un diagnóstico CIE-10', 'error');
        return;
    }

    const datos = {
        piar_id: piarId,
        entorno_salud_id: entornoSaludId,
        DX: document.getElementById('dx_descripcion').value,
        apoyos_tecnicos: document.getElementById('apoyos_tecnicos').value,
        url_soporte_dx: document.getElementById('url_soporte_dx').value,
        diagnosticos_cie10: diagnosticosSeleccionados
    };

    try {
        const response = await fetch('php/registrar_diagnostico_medico.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();

        if (resultado.success) {
            mostrarMensaje('¡Registro completo! PIAR y diagnóstico médico registrados exitosamente', 'exito');
            marcarPasoCompletado(4);

            // Opcional: redirigir después de un tiempo
            setTimeout(() => {
                if (confirm('¿Desea registrar otro PIAR?')) {
                    location.reload();
                } else {
                    window.location.href = 'Interfaz.html';
                }
            }, 3000);
        } else {
            mostrarMensaje('Error al registrar diagnóstico: ' + resultado.message, 'error');
        }
    } catch (error) {
        mostrarMensaje('Error de conexión: ' + error.message, 'error');
    }
}

// Funciones de navegación
function mostrarPaso(numeroPaso) {
    // Ocultar todos los formularios
    document.querySelectorAll('.form-step').forEach(form => {
        form.classList.remove('active');
    });

    // Mostrar el formulario del paso actual
    const pasoActivo = document.getElementById(`form-${obtenerNombrePaso(numeroPaso)}`);
    if (pasoActivo) {
        pasoActivo.classList.add('active');
    }

    // Actualizar indicador de progreso
    document.querySelectorAll('.step-indicator').forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === numeroPaso) {
            step.classList.add('active');
        }
    });

    pasoActual = numeroPaso;
}

function obtenerNombrePaso(numero) {
    const nombres = {
        1: 'piar',
        2: 'tratamiento',
        3: 'medicamentos',
        4: 'diagnostico'
    };
    return nombres[numero] || 'piar';
}

function marcarPasoCompletado(numeroPaso) {
    const step = document.getElementById(`step${numeroPaso}`);
    if (step) {
        step.classList.add('completed');
        step.innerHTML = '✓';
    }
}

// Funciones para agregar elementos dinámicamente
function agregarTratamiento() {
    contadorTratamientos++;
    const container = document.getElementById('tratamientos-container');

    const div = document.createElement('div');
    div.className = 'tratamiento-item';
    div.innerHTML = `
        <button type="button" class="btn-eliminar" onclick="eliminarElemento(this, 'tratamiento')">×</button>
        <label for="descripcion_tratamiento_${contadorTratamientos}">Descripción del Tratamiento:</label>
        <textarea id="descripcion_tratamiento_${contadorTratamientos}" 
                  name="descripcion_tratamiento[]" rows="3" 
                  placeholder="Describa el tratamiento..."></textarea>
        
        <label for="frecuencia_tratamiento_${contadorTratamientos}">Frecuencia:</label>
        <input type="text" id="frecuencia_tratamiento_${contadorTratamientos}" 
               name="frecuencia_tratamiento[]" 
               placeholder="Ej: Una vez por semana">
    `;

    container.appendChild(div);
}

function agregarMedicamento() {
    contadorMedicamentos++;
    const container = document.getElementById('medicamentos-container');

    const div = document.createElement('div');
    div.className = 'medicamento-item';
    div.innerHTML = `
        <button type="button" class="btn-eliminar" onclick="eliminarElemento(this, 'medicamento')">×</button>
        <label for="descripcion_medicamento_${contadorMedicamentos}">Descripción del Medicamento:</label>
        <textarea id="descripcion_medicamento_${contadorMedicamentos}" 
                  name="descripcion_medicamento[]" rows="2" 
                  placeholder="Nombre y detalles del medicamento..."></textarea>
        
        <label for="frecuencia_medicamento_${contadorMedicamentos}">Frecuencia/Horario:</label>
        <input type="text" id="frecuencia_medicamento_${contadorMedicamentos}" 
               name="frecuencia_medicamento[]" 
               placeholder="Ej: Cada 8 horas">
    `;

    container.appendChild(div);
}

function agregarAtencion() {
    contadorAtencion++;
    const container = document.getElementById('atencion-container');

    const div = document.createElement('div');
    div.className = 'atencion-item';
    div.innerHTML = `
        <button type="button" class="btn-eliminar" onclick="eliminarElemento(this, 'atencion')">×</button>
        <label for="descripcion_atencion_${contadorAtencion}">Descripción de la Atención:</label>
        <textarea id="descripcion_atencion_${contadorAtencion}" 
                  name="descripcion_atencion[]" rows="2" 
                  placeholder="Tipo de atención médica..."></textarea>
        
        <label for="frecuencia_atencion_${contadorAtencion}">Frecuencia:</label>
        <input type="text" id="frecuencia_atencion_${contadorAtencion}" 
               name="frecuencia_atencion[]" 
               placeholder="Ej: Cada 3 meses">
    `;

    container.appendChild(div);
}

// Eliminar elemento
function eliminarElemento(boton, tipo) {
    const item = boton.parentElement;
    const container = item.parentElement;

    // Solo eliminar si hay más de un elemento
    const items = container.querySelectorAll(`.${tipo}-item`);
    if (items.length > 1) {
        item.remove();
    } else {
        mostrarMensaje(`Debe mantener al menos un ${tipo}`, 'error');
    }
}

// Validar formulario
function validarFormulario(form) {
    const camposRequeridos = form.querySelectorAll('[required]');
    let valido = true;

    camposRequeridos.forEach(campo => {
        if (!campo.value.trim()) {
            campo.style.borderColor = '#dc3545';
            valido = false;
        } else {
            campo.style.borderColor = '#e5e7eb';
        }
    });

    return valido;
}

// Mostrar mensaje
function mostrarMensaje(mensaje, tipo) {
    const div = document.getElementById('mensaje');
    if (div) {
        div.textContent = mensaje;
        div.className = `mensaje ${tipo}`;
        div.style.display = 'block';

        // Auto-ocultar después de 5 segundos si es éxito
        if (tipo === 'exito') {
            setTimeout(() => {
                div.style.display = 'none';
            }, 5000);
        }

        // Scroll hacia arriba para mostrar el mensaje
        div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Función para el botón regresar
function goBackOrRedirect(ruta) {
    if (ruta && ruta.trim() !== '') {
        window.location.href = ruta;   // Ir a la ruta que pongas
    } else {
        window.history.back();         // Si está vacío, volver atrás
    }
}