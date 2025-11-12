<?php
session_start();
include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $contrasena = $_POST['contrasena'];
    $rol = $_POST['rol'];

    $usuario = null;
    $rol_final = $rol;

    if ($rol === "admin") {
        // admin
        $query = "SELECT * FROM admin WHERE email='$email'";
        $resultado = $conexion->query($query);
        if ($resultado && $resultado->num_rows > 0) {
            $row = $resultado->fetch_assoc();
            // Verificar contraseña encriptada o sin encriptar (para migración)
            if (password_verify($contrasena, $row['contrasena']) || $contrasena === $row['contrasena']) {
                $usuario = $row;
                $rol_final = "admin";
                
                // Si la contraseña no está encriptada, actualizarla
                if ($contrasena === $row['contrasena']) {
                    $nueva_hash = password_hash($contrasena, PASSWORD_DEFAULT);
                    $update = "UPDATE admin SET contrasena='$nueva_hash' WHERE email='$email'";
                    $conexion->query($update);
                }
            }
        }

        // docente_apoyo
        if (!$usuario) {
            $query = "SELECT * FROM docente_apoyo WHERE email='$email'";
            $resultado = $conexion->query($query);
            if ($resultado && $resultado->num_rows > 0) {
                $row = $resultado->fetch_assoc();
                if (password_verify($contrasena, $row['contrasena']) || $contrasena === $row['contrasena']) {
                    $usuario = $row;
                    $rol_final = "docente_apoyo";
                    
                    if ($contrasena === $row['contrasena']) {
                        $nueva_hash = password_hash($contrasena, PASSWORD_DEFAULT);
                        $update = "UPDATE docente_apoyo SET contrasena='$nueva_hash' WHERE email='$email'";
                        $conexion->query($update);
                    }
                }
            }
        }
    }

    elseif ($rol === "directivo") {
        $query = "SELECT * FROM directivo WHERE email='$email'";
        $resultado = $conexion->query($query);
        if ($resultado && $resultado->num_rows > 0) {
            $row = $resultado->fetch_assoc();
            if (password_verify($contrasena, $row['contrasena']) || $contrasena === $row['contrasena']) {
                $usuario = $row;
                $rol_final = "directivo";
                
                if ($contrasena === $row['contrasena']) {
                    $nueva_hash = password_hash($contrasena, PASSWORD_DEFAULT);
                    $update = "UPDATE directivo SET contrasena='$nueva_hash' WHERE email='$email'";
                    $conexion->query($update);
                }
            }
        }
    }

    elseif ($rol === "docente") {
        $query = "SELECT * FROM docente WHERE email='$email'";
        $resultado = $conexion->query($query);
        if ($resultado && $resultado->num_rows > 0) {
            $row = $resultado->fetch_assoc();
            if (password_verify($contrasena, $row['contrasena']) || $contrasena === $row['contrasena']) {
                $usuario = $row;
                $rol_final = "docente";
                
                if ($contrasena === $row['contrasena']) {
                    $nueva_hash = password_hash($contrasena, PASSWORD_DEFAULT);
                    $update = "UPDATE docente SET contrasena='$nueva_hash' WHERE email='$email'";
                    $conexion->query($update);
                }
            }
        }
    }

    elseif ($rol === "acudiente") {
        // acudiente
        $query = "SELECT * FROM acudiente WHERE email='$email'";
        $resultado = $conexion->query($query);
        if ($resultado && $resultado->num_rows > 0) {
            $row = $resultado->fetch_assoc();
            if (password_verify($contrasena, $row['contrasena']) || $contrasena === $row['contrasena']) {
                $usuario = $row;
                $rol_final = "acudiente";
                
                if ($contrasena === $row['contrasena']) {
                    $nueva_hash = password_hash($contrasena, PASSWORD_DEFAULT);
                    $update = "UPDATE acudiente SET contrasena='$nueva_hash' WHERE email='$email'";
                    $conexion->query($update);
                }
            }
        }

        // madre
        if (!$usuario) {
            $query = "SELECT * FROM madre WHERE email='$email'";
            $resultado = $conexion->query($query);
            if ($resultado && $resultado->num_rows > 0) {
                $row = $resultado->fetch_assoc();
                if (password_verify($contrasena, $row['contrasena']) || $contrasena === $row['contrasena']) {
                    $usuario = $row;
                    $rol_final = "madre";
                    
                    if ($contrasena === $row['contrasena']) {
                        $nueva_hash = password_hash($contrasena, PASSWORD_DEFAULT);
                        $update = "UPDATE madre SET contrasena='$nueva_hash' WHERE email='$email'";
                        $conexion->query($update);
                    }
                }
            }
        }

        // padre
        if (!$usuario) {
            $query = "SELECT * FROM padre WHERE email='$email'";
            $resultado = $conexion->query($query);
            if ($resultado && $resultado->num_rows > 0) {
                $row = $resultado->fetch_assoc();
                if (password_verify($contrasena, $row['contrasena']) || $contrasena === $row['contrasena']) {
                    $usuario = $row;
                    $rol_final = "padre";
                    
                    if ($contrasena === $row['contrasena']) {
                        $nueva_hash = password_hash($contrasena, PASSWORD_DEFAULT);
                        $update = "UPDATE padre SET contrasena='$nueva_hash' WHERE email='$email'";
                        $conexion->query($update);
                    }
                }
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