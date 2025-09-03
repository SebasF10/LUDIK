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
        console.log("Click en:", texto);

        switch (texto) {
            case 'Perfil':
                window.location.href = 'perfil.html';
                break;
            case 'Estudiantes':
                window.location.href = 'Estudiantes.html';
                break;
            case 'Crear Cuentas':
                window.location.href = 'Crear_cuentas.html';
                break;
            case 'Actividades':
                window.location.href = 'Actividades.html';
                break;
            case 'Registrar un nuevo estudiante':
                window.location.href = 'Registrar_estudiante.html';
                break;
            case 'Comunicate':
                window.location.href = 'Comunicacion.html';
                break;
            case 'Ayuda':
                window.location.href = 'Ayuda.html';
                break;
            case 'Cerrar Sesion':
            case 'Cerrar Sesión':
                if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                    localStorage.removeItem('rol');
                    window.location.href = 'Inicio_sesion.html';
                }
                break;
        }

        // Cerrar menú
        burger.checked = false;
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});
