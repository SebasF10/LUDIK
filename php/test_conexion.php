<?php
$conexion = mysqli_connect('localhost', 'root', '', 'ludick');
if ($conexion) {
    echo "Conexión exitosa";
} else {
    echo "Error: " . mysqli_connect_error();
}
?>