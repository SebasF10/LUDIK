<?php
include("conexion.php");

header('Content-Type: application/json');

$result = $conexion->query("SELECT COUNT(*) as total FROM estudiante");
if ($result) {
    $row = $result->fetch_assoc();
    echo json_encode(['total' => $row['total']]);
} else {
    echo json_encode(['total' => 0]);
}
?>