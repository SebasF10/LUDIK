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

function ocultarBotonCrearCuentas() {
    const rol = localStorage.getItem("rol");
    console.log("Verificando rol:", rol);

    if (rol !== "admin") {
        // Buscar TODOS los botones del menú
        const todosLosBotones = document.querySelectorAll('.menu-button');
        console.log("Botones encontrados:", todosLosBotones.length);

        todosLosBotones.forEach(function (boton, index) {
            const textoDelBoton = boton.textContent.trim().toLowerCase();
            console.log(`Botón ${index}: "${textoDelBoton}"`);

            if (textoDelBoton === "crear cuentas" || textoDelBoton.includes("crear cuenta")) {
                console.log("¡Eliminando botón Crear Cuentas!");
                boton.style.display = "none";
                boton.remove(); // Lo eliminamos completamente
            }
        });
    } else {
        console.log("Usuario es admin, botón visible");
    }
}

// Ejecutar cuando cargue todo
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM cargado");
    setTimeout(ocultarBotonCrearCuentas, 500); // Esperamos medio segundo
});

// También ejecutar inmediatamente
setTimeout(ocultarBotonCrearCuentas, 100);

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
                window.location.href = 'estudiantes.html';
                break;
            case 'Crear Cuentas':
                window.location.href = 'Form_Crear_cuentas.html';
                break;
            case 'Actividades':
                window.location.href = 'actividades.html';
                break;
            case 'Registrar un nuevo estudiante':
                window.location.href = 'Form_Registrar_estudiante.html';
                break;
            case 'Comunicate':
                window.location.href = 'comunicacion.html';
                break;
            case 'Ayuda':
                window.location.href = 'ayuda.html';
                break;
            case 'Cerrar Sesion':
            case 'Cerrar Sesión':
                if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                    localStorage.removeItem('rol');
                    window.location.href = 'index.html';
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

// Función que sabemos que funciona
function eliminarCrearCuentas() {
    const rol = localStorage.getItem('rol');
    if (rol !== 'admin') {
        document.querySelectorAll('.menu-button').forEach(function (btn) {
            if (btn.textContent.toLowerCase().includes('crear cuenta')) {
                btn.remove();
                console.log('Botón eliminado para rol:', rol);
            }
        });
    }
}

// Ejecutar múltiples veces
eliminarCrearCuentas();
setTimeout(eliminarCrearCuentas, 100);
setTimeout(eliminarCrearCuentas, 500);
setTimeout(eliminarCrearCuentas, 1000);
setTimeout(eliminarCrearCuentas, 2000);

// También cuando se cargue todo
document.addEventListener('DOMContentLoaded', eliminarCrearCuentas);
window.addEventListener('load', eliminarCrearCuentas);

// Y cuando la ventana reciba foco
window.addEventListener('focus', eliminarCrearCuentas);