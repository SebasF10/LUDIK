function mostrarFormulario(rol) {
    // Ocultar todos los formularios
    document.getElementById('form_admin').style.display = 'none';
    document.getElementById('form_profesor').style.display = 'none';
    document.getElementById('form_acudiente').style.display = 'none';

    // Mostrar solo el seleccionado
    if (rol === 'admin') {
        document.getElementById('form_admin').style.display = 'block';
    } else if (rol === 'profesor') {
        document.getElementById('form_profesor').style.display = 'block';
    } else if (rol === 'acudiente') {
        document.getElementById('form_acudiente').style.display = 'block';
    }
}