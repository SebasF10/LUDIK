<?php
// filepath: php/obtener_estudiantes.php

// Incluir el archivo de conexión
require_once 'conexion.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Consulta para obtener todos los estudiantes
    $consulta = "SELECT id_estudiante, nombre, apellidos 
                 FROM estudiante 
                 ORDER BY apellidos, nombre";
    
    $result = mysqli_query($conexion, $consulta);
    
    if (!$result) {
        throw new Exception('Error en la consulta: ' . mysqli_error($conexion));
    }
    
    $estudiantes = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $estudiantes[] = $row;
    }
    
    echo json_encode($estudiantes);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>