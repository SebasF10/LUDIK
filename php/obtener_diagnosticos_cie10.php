<?php
// filepath: php/obtener_diagnosticos_cie10.php

// Incluir el archivo de conexión
require_once 'conexion.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Consulta para obtener todos los diagnósticos CIE-10
    $consulta = "SELECT id_cie10, descripcion 
                 FROM dx_cie10 
                 ORDER BY id_cie10";
    
    $result = mysqli_query($conexion, $consulta);
    
    if (!$result) {
        throw new Exception('Error en la consulta: ' . mysqli_error($conexion));
    }
    
    $diagnosticos = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $diagnosticos[] = $row;
    }
    
    echo json_encode($diagnosticos);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>