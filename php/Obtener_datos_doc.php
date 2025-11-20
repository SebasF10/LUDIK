<?php
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

$tipo = $_GET['tipo'] ?? '';

try {
    switch ($tipo) {
        case 'asignaturas':
        case 'materias':
            obtenerAsignaturas($conexion);
            break;
        case 'grupos':
            obtenerGrupos($conexion);
            break;
        default:
            echo json_encode(['error' => 'Tipo no especificado o inválido']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

function obtenerAsignaturas($conexion) {
    $sql = "SELECT id_asignatura as id, nombre_asig as nombre FROM asignatura ORDER BY nombre_asig";
    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        throw new Exception("Error al obtener asignaturas: " . mysqli_error($conexion));
    }
    
    $asignaturas = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $asignaturas[] = $row;
    }
    
    echo json_encode($asignaturas);
}

function obtenerGrupos($conexion) {
    $sql = "SELECT id_grupo as id, grupo as nombre FROM grupo ORDER BY grupo";
    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        throw new Exception("Error al obtener grupos: " . mysqli_error($conexion));
    }
    
    $grupos = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $grupos[] = $row;
    }
    
    echo json_encode($grupos);
}
?>