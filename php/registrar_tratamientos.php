<?php
// filepath: php/registrar_tratamientos.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de la base de datos
$servidor = "127.0.0.1";
$usuario = "root";
$password = "";
$base_datos = "ludik";

try {
    // Verificar que sea una petición POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    // Conectar a la base de datos
    $conexion = new PDO("mysql:host=$servidor;dbname=$base_datos;charset=utf8mb4", $usuario, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
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
    
    // Iniciar transacción
    $conexion->beginTransaction();
    
    $tratamientos_ids = [];
    
    // Insertar cada tratamiento
    $consulta = "INSERT INTO tratamiento (descripcion, frecuencia) VALUES (?, ?)";
    $stmt = $conexion->prepare($consulta);
    
    foreach ($tratamientos as $tratamiento) {
        $descripcion = trim($tratamiento['descripcion']);
        $frecuencia = trim($tratamiento['frecuencia']);
        
        if (empty($descripcion)) {
            throw new Exception('La descripción del tratamiento no puede estar vacía');
        }
        
        $stmt->execute([$descripcion, $frecuencia]);
        $tratamientos_ids[] = $conexion->lastInsertId();
    }
    
    // Confirmar transacción
    $conexion->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Tratamientos registrados exitosamente',
        'tratamientos_ids' => $tratamientos_ids
    ]);
    
} catch (PDOException $e) {
    if (isset($conexion)) {
        $conexion->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    if (isset($conexion)) {
        $conexion->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>