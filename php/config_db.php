<?php
// filepath: php/config_db.php

// Configuración de la base de datos
define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'ludik');

// Función para obtener conexión a la base de datos
function obtenerConexion() {
    try {
        $conexion = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", 
            DB_USER, 
            DB_PASS
        );
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conexion;
    } catch (PDOException $e) {
        throw new Exception('Error de conexión a la base de datos: ' . $e->getMessage());
    }
}

// Función para enviar respuesta JSON
function enviarRespuesta($success, $message, $data = null) {
    $respuesta = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $respuesta = array_merge($respuesta, $data);
    }
    
    header('Content-Type: application/json');
    echo json_encode($respuesta);
}

// Función para manejar errores
function manejarError($e, $conexion = null) {
    if ($conexion && $conexion->inTransaction()) {
        $conexion->rollBack();
    }
    
    if ($e instanceof PDOException) {
        http_response_code(500);
        enviarRespuesta(false, 'Error de base de datos: ' . $e->getMessage());
    } else {
        http_response_code(400);
        enviarRespuesta(false, $e->getMessage());
    }
}

// Headers para CORS
function configurarHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    // Manejar preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
?>