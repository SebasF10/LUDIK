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

// 🔹 Nueva función: eliminar botones restringidos
function eliminarBotonesPorRol() {
    const rol = localStorage.getItem("rol");
    console.log("Verificando rol:", rol);

    if (rol !== "admin") {
        // Buscar TODOS los botones del menú
        const todosLosBotones = document.querySelectorAll('.menu-button');
        console.log("Botones encontrados:", todosLosBotones.length);

        todosLosBotones.forEach(function (boton, index) {
            const textoDelBoton = boton.textContent.trim().toLowerCase();
            console.log(`Botón ${index}: "${textoDelBoton}"`);

            // Ocultar "Crear Cuentas"
            if (textoDelBoton.includes("crear cuenta")) {
                console.log("¡Eliminando botón Crear Cuentas!");
                boton.remove();
            }

            // Ocultar "Registrar un nuevo estudiante"
            if (textoDelBoton.includes("registrar un nuevo estudiante")) {
                console.log("¡Eliminando botón Registrar un nuevo estudiante!");
                boton.remove();
            }
        });
    } else {
        console.log("Usuario es admin, botones visibles");
    }
}

// Ejecutar cuando cargue todo
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM cargado");
    setTimeout(eliminarBotonesPorRol, 500); // Esperamos medio segundo
});

// También ejecutar inmediatamente
setTimeout(eliminarBotonesPorRol, 100);

// Ejecutar múltiples veces para asegurar
eliminarBotonesPorRol();
setTimeout(eliminarBotonesPorRol, 500);
setTimeout(eliminarBotonesPorRol, 1000);
setTimeout(eliminarBotonesPorRol, 2000);

// También cuando se cargue todo
document.addEventListener('DOMContentLoaded', eliminarBotonesPorRol);
window.addEventListener('load', eliminarBotonesPorRol);

// Y cuando la ventana reciba foco
window.addEventListener('focus', eliminarBotonesPorRol);

// Manejar clicks de botones
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('menu-button')) {
        const texto = e.target.textContent.trim();
        const textoLower = texto.toLowerCase();
        
        console.log("=== DEBUG CLICK ===");
        console.log("Texto original:", `"${texto}"`);
        console.log("Texto lowercase:", `"${textoLower}"`);
        console.log("Caracteres del texto:", Array.from(textoLower).map(c => `${c}(${c.charCodeAt(0)})`));
        console.log("==================");

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
            window.location.href = 'Actividades.html';
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
            window.location.href = 'valoracion_pedagogica.html';
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