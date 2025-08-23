<?php
header('Content-Type: application/json');
require_once "conexion.php"; // conexión a la BD

if (!isset($_GET['tipo'])) {
    echo json_encode(["error" => "Falta el parámetro tipo"]);
    exit;
}

$tipo = $_GET['tipo'];

if ($tipo === "sedes") {
    $sql = "SELECT id_sede AS id, sede_nombre AS nombre FROM sede";
} elseif ($tipo === "materias") {
    $sql = "SELECT id_materia AS id, nombre AS nombre FROM materia";
} else {
    echo json_encode(["error" => "Tipo no válido"]);
    exit;
}

$result = $conexion->query($sql);

if ($result) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    echo json_encode(["error" => "Error en la consulta: " . $conexion->error]);
}

$conexion->close();
?>
