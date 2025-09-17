<?php
// Parámetros BD local

DEFINE('USER', 'root');
DEFINE('PW', '');
DEFINE('HOST', 'localhost');
DEFINE('BD', 'ludik');


// Parámetros BD remota (InfinityFree)
/*
define('USER', 'if0_39848338');
define('PW', 'iLov3Window5');
define('HOST', 'sql113.infinityfree.com');
define('BD', 'if0_39848338_ludik');
*/

// Parametros BD remota (Hosting del colegio)

/*
DEFINE('USER', 'colegdfs_ludik');
DEFINE('PW', '=Mw_r.tu)~g(');
DEFINE('HOST', 'localhost');
DEFINE('BD', 'colegdfs_ludik');
*/

// Conexión con la BD
$conexion = mysqli_connect(HOST, USER, PW, BD);

// Establecer conjunto de caracteres
mysqli_set_charset($conexion, 'utf8mb4');

// Verificar la conexión con la BD
if (!$conexion) {
    die("La conexión con la BD falló: " . mysqli_connect_error());
}
?>
