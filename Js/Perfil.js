document.addEventListener("DOMContentLoaded", () => {
    fetch("php/Perfil.php")
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                window.location.href = "Index2.html";
                return;
            }

            // Insertar datos
            document.getElementById("fotoPerfil").src = data.foto;
            document.getElementById("nombreUsuario").textContent = data.nombre;
            document.getElementById("rolUsuario").textContent = data.rol;
            document.getElementById("emailUsuario").textContent = data.email;
            document.getElementById("celularUsuario").textContent = data.celular ?? "No registrado";

            // 🚀 Normalizamos el rol (todo minúscula, sin espacios)
            const rolNormalizado = data.rol.toLowerCase().replace(/\s+/g, "_");
            document.body.classList.add("rol-" + rolNormalizado);

            console.log("Clase aplicada:", "rol-" + rolNormalizado);
        })
        .catch(err => {
            console.error("Error cargando perfil:", err);
        });
});

function goBackOrRedirect(ruta) {
    if (ruta && ruta.trim() !== '') {
        window.location.href = ruta;   // Ir a la ruta que pongas
    } else {
        window.history.back();         // Si está vacío, volver atrás
    }
}
