<?php
// filepath: php/obtener_diagnosticos_cie10.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Configuración de la base de datos
$servidor = "127.0.0.1";
$usuario = "root";
$password = "";
$base_datos = "ludik";

try {
    // Conectar a la base de datos
    $conexion = new PDO("mysql:host=$servidor;dbname=$base_datos;charset=utf8mb4", $usuario, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Consulta para obtener todos los diagnósticos CIE-10
    $consulta = "SELECT id_cie10, descripcion 
                 FROM dx_cie10 
                 ORDER BY id_cie10";
    
    $stmt = $conexion->prepare($consulta);
    $stmt->execute();
    
    $diagnosticos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($diagnosticos);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Error de conexión a la base de datos: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>