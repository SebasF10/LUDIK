<?php
// filepath: php/registrar_tratamientos.php - MODIFIED VERSION USING conexion.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir archivo de conexión universal
require_once 'conexion.php';

try {
    // Verificar que sea una petición POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    // Usar la conexión MySQLi del archivo incluido
    $conn = $conexion;
    
    // Obtener datos JSON del cuerpo de la petición
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data || !isset($data['tratamientos'])) {
        throw new Exception('Datos no válidos');
    }
    
    $tratamientos = $data['tratamientos'];
    
    if (empty($tratamientos)) {
        throw new Exception('Debe proporcionar al menos un tratamiento');
    }
    
    // Validar estructura de datos
    foreach ($tratamientos as $index => $tratamiento) {
        if (!is_array($tratamiento)) {
            throw new Exception("Tratamiento en posición $index no es válido");
        }
        if (!isset($tratamiento['descripcion'])) {
            throw new Exception("Falta descripción en tratamiento en posición $index");
        }
    }
    
    // Iniciar transacción
    $conn->autocommit(false);
    
    $tratamientos_ids = [];
    
    // Preparar consulta para insertar tratamientos
    $consulta = "INSERT INTO tratamiento (descripcion, frecuencia) VALUES (?, ?)";
    $stmt = $conn->prepare($consulta);
    
    if (!$stmt) {
        throw new Exception('Error preparando la consulta: ' . $conn->error);
    }
    
    // Insertar cada tratamiento
    foreach ($tratamientos as $index => $tratamiento) {
        $descripcion = trim($tratamiento['descripcion']);
        $frecuencia = isset($tratamiento['frecuencia']) ? trim($tratamiento['frecuencia']) : '';
        
        if (empty($descripcion)) {
            throw new Exception("La descripción del tratamiento en posición $index no puede estar vacía");
        }
        
        // Bind parameters
        $stmt->bind_param("ss", $descripcion, $frecuencia);
        
        if (!$stmt->execute()) {
            throw new Exception('Error insertando tratamiento: ' . $stmt->error);
        }
        
        $tratamientos_ids[] = $conn->insert_id;
    }
    
    $stmt->close();
    
    // Confirmar transacción
    $conn->commit();
    
    // Restaurar autocommit
    $conn->autocommit(true);
    
    echo json_encode([
        'success' => true,
        'message' => 'Tratamientos registrados exitosamente',
        'tratamientos_ids' => $tratamientos_ids,
        'total_insertados' => count($tratamientos_ids)
    ]);
    
} catch (Exception $e) {
    // Rollback en caso de error
    if (isset($conn) && $conn->connect_errno === 0) {
        $conn->rollback();
        $conn->autocommit(true);
    }
    
    // Determinar código de estado HTTP apropiado
    $status_code = (strpos($e->getMessage(), 'Error de base de datos') !== false || 
                   strpos($e->getMessage(), 'Error preparando') !== false || 
                   strpos($e->getMessage(), 'Error insertando') !== false) ? 500 : 400;
    
    http_response_code($status_code);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Nota: La conexión se cierra automáticamente al finalizar el script
// o se puede cerrar desde conexion.php si es necesario
?>