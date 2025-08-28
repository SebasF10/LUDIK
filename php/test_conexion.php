<?php
$conexion = mysqli_connect('localhost', 'root', '', 'ludik');
if ($conexion) {
    echo "Conexión exitosa";
} else {
    echo "Error: " . mysqli_connect_error();
}
?>