<?php
session_start();
include("conexion.php"); // usa tu conexión

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $contrasena = $_POST['contrasena'];
    $rol = $_POST['rol'];

    $usuario = null;
    $rol_final = $rol;

    if ($rol === "admin") {
        // admin
        $query = "SELECT * FROM admin WHERE email='$email' AND contrasena='$contrasena'";
        $resultado = $conexion->query($query);
        if ($resultado && $resultado->num_rows > 0) {
            $usuario = $resultado->fetch_assoc();
            $rol_final = "admin";
        }

        // docente_apoyo
        if (!$usuario) {
            $query = "SELECT * FROM docente_apoyo WHERE email='$email' AND contrasena='$contrasena'";
            $resultado = $conexion->query($query);
            if ($resultado && $resultado->num_rows > 0) {
                $usuario = $resultado->fetch_assoc();
                $rol_final = "docente_apoyo";
            }
        }

        // directivo
        if (!$usuario) {
            $query = "SELECT * FROM directivo WHERE email='$email' AND contrasena='$contrasena'";
            $resultado = $conexion->query($query);
            if ($resultado && $resultado->num_rows > 0) {
                $usuario = $resultado->fetch_assoc();
                $rol_final = "directivo";
            }
        }
    }

    elseif ($rol === "docente") {
        $query = "SELECT * FROM docente WHERE email='$email' AND contrasena='$contrasena'";
        $resultado = $conexion->query($query);
        if ($resultado && $resultado->num_rows > 0) {
            $usuario = $resultado->fetch_assoc();
            $rol_final = "docente";
        }
    }

    elseif ($rol === "acudiente") {
        // acudiente
        $query = "SELECT * FROM acudiente WHERE email='$email' AND contrasena='$contrasena'";

        $resultado = $conexion->query($query);
        if ($resultado && $resultado->num_rows > 0) {
            $usuario = $resultado->fetch_assoc();
            $rol_final = "acudiente";
        }

        // madre
        if (!$usuario) {
            $query = "SELECT * FROM madre WHERE email='$email' AND contrasena='$contrasena'";
            $resultado = $conexion->query($query);
            if ($resultado && $resultado->num_rows > 0) {
                $usuario = $resultado->fetch_assoc();
                $rol_final = "madre";
            }
        }

        // padre
        if (!$usuario) {
            $query = "SELECT * FROM padre WHERE email='$email' AND contrasena='$contrasena'";
            $resultado = $conexion->query($query);
            if ($resultado && $resultado->num_rows > 0) {
                $usuario = $resultado->fetch_assoc();
                $rol_final = "padre";
            }
        }
    }

    if ($usuario) {
        $_SESSION['usuario'] = $usuario;
        $_SESSION['rol'] = $rol_final;

        // Guardar el rol en localStorage y redirigir
        echo "<script>
            localStorage.setItem('rol', '$rol_final');
            window.location.href = '../Interfaz.html';
        </script>";
        exit;
    } else {
        echo "<script>alert('Credenciales incorrectas'); window.location.href='../Inicio_sesion.html';</script>";
    }
}
?>
