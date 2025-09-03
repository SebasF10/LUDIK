<?php
// Parámetros BD local
DEFINE('USER', 'root');
DEFINE('PW', '');
DEFINE('HOST', 'localhost');
DEFINE('BD', 'ludik');

// Conexión con la BD
$conexion = mysqli_connect(HOST, USER, PW, BD);

// Establecer conjunto de caracteres
mysqli_set_charset($conexion, 'utf8mb4');

// Verificar la conexión con la BD
if (!$conexion) {
    die("La conexión con la BD falló: " . mysqli_connect_error());
}
?>
