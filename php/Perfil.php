<?php
session_start();
include("conexion.php");

// Verificar sesión
if (!isset($_SESSION['usuario']) || !isset($_SESSION['rol'])) {
    echo json_encode(["error" => "No hay sesión activa"]);
    exit;
}

$usuario = $_SESSION['usuario'];
$rol = $_SESSION['rol'];
$tabla = "";
$campo_nombre = "nombre"; // por defecto

// Determinar tabla y campo nombre según el rol
switch ($rol) {
    case "admin":
        $tabla = "admin";
        $campo_nombre = "nombre_completo";
        $foto = "img\logoadmin.png";
        break;

    case "docente":
        $tabla = "docente";
        $campo_nombre = "nombre";
        $foto = "img\logoprofe.png";
        break;

    case "docente_apoyo":
        $tabla = "docente_apoyo";
        $campo_nombre = "nombre";
        $foto = "img\logoProfeapoyo.png";
        break;

    case "directivo":
        $tabla = "directivo";
        $campo_nombre = "nombre";
        $foto = "img\logodirectivo.webp";
        break;

    case "acudiente":

        $tabla = "acudiente";

        

        $campo_nombre = "nombre_completo";
        $foto = "img\logoacudiente.webp";
        break;

    case "madre":
        $tabla = "madre";
        $campo_nombre = "nombre_completo";
        $foto = "img\Logomadre.webp";
        break;

    case "padre":
        $tabla = "padre";
        $campo_nombre = "nombre_completo";
        $foto = "img\logopadre.png";
        break;

    default:
        echo json_encode(["error" => "Rol no válido"]);
        exit;
}

$email = $usuario['email'];
$query = "SELECT * FROM $tabla WHERE email='$email' LIMIT 1";
$resultado = $conexion->query($query);

if ($resultado->num_rows > 0) {
    $datos = $resultado->fetch_assoc();

    // Determinar nombre con fallback
    $nombre = null;
    if (isset($datos[$campo_nombre])) {
        $nombre = $datos[$campo_nombre];
    } elseif (isset($datos['nombre'])) {
        $nombre = $datos['nombre'];
    } elseif (isset($datos['nombre_completo'])) {
        $nombre = $datos['nombre_completo'];
    } else {
        $nombre = "Sin nombre";
    }

    $respuesta = [
        "nombre" => $nombre,
        "email" => $datos['email'] ?? "Sin email",
        "celular" => $datos['celular'] ?? "No registrado",
        "rol" => $rol,
        "foto" => $foto
    ];

    echo json_encode($respuesta);
} else {
    echo json_encode(["error" => "No se encontraron datos en tabla $tabla"]);
}

?>
