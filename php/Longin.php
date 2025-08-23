<?php
session_start();
require_once "conexion.php";

$email = $_POST['email'];
$contrasena = $_POST['contrasena'];
$rol = $_POST['rol']; // admin, profesor, acudiente

$sql = "";
if ($rol === "admin") {
    // Tabla admin → campo email
    $sql = "SELECT * FROM admin WHERE email='$email' AND contrasena='$contrasena'";
} elseif ($rol === "profesor") {
    // Tabla docente → campo correo y contraseña
    $sql = "SELECT * FROM docente WHERE correo='$email' AND contraseña='$contrasena'";
} elseif ($rol === "acudiente") {
    // Tabla cuidador → campo email
    $sql = "SELECT * FROM cuidador WHERE email='$email' AND contrasena='$contrasena'";
}

$result = mysqli_query($conexion, $sql);

if ($result && mysqli_num_rows($result) > 0) {
    // ✅ Login correcto → guardar en sesión PHP y localStorage
    $_SESSION['rol'] = $rol;
    $_SESSION['usuario_id'] = mysqli_fetch_assoc($result)['id'] ?? null;
    
    echo "<!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
    </head>
    <body>
        <script>
            // Guardar rol en localStorage
            localStorage.setItem('rol', '$rol');
            // Confirmar que se guardó
            console.log('Rol guardado:', localStorage.getItem('rol'));
            // Redirigir
            window.location.href = '../interfaz.html';
        </script>
    </body>
    </html>";
    exit();
} else {
    // ❌ Login fallido
    echo "<!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
    </head>
    <body>
        <script>
            alert('Usuario o contraseña incorrectos');
            window.location.href = '../index.html';
        </script>
    </body>
    </html>";
    exit();
}
?>