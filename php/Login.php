<?php
session_start();
require_once "conexion.php";

$email = $_POST['email'];
$contrasena = $_POST['contrasena'];
$rol = $_POST['rol']; // admin, profesor, acudiente

$stmt = null;
if ($rol === "admin") {
    // Tabla admin → campo email
    $stmt = $conexion->prepare("SELECT * FROM admin WHERE email=? AND contrasena=?");
    $stmt->bind_param("ss", $email, $contrasena);
} elseif ($rol === "docente") {
    // Tabla docente → campo correo y contraseña
    $stmt = $conexion->prepare("SELECT * FROM docente WHERE email=? AND contrasena=?");
    $stmt->bind_param("ss", $email, $contrasena);
} elseif ($rol === "acudiente") {
    // Tabla cuidador → campo email
    $stmt = $conexion->prepare("SELECT * FROM cuidador WHERE email=? AND contrasena=?");
    $stmt->bind_param("ss", $email, $contrasena);
}

$result = null;
if ($stmt) {
    $stmt->execute();
    $result = $stmt->get_result();
}

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