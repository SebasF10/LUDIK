<?php
// filepath: php/config_db.php

// Incluir el archivo de conexión
require_once 'conexion.php';

// Función para obtener conexión a la base de datos (usa la conexión ya establecida)
function obtenerConexion() {
    global $conexion;
    return $conexion;
}

// Función para iniciar transacción
function iniciarTransaccion($conexion) {
    mysqli_autocommit($conexion, FALSE);
}

// Función para confirmar transacción
function confirmarTransaccion($conexion) {
    mysqli_commit($conexion);
    mysqli_autocommit($conexion, TRUE);
}

// Función para revertir transacción
function revertirTransaccion($conexion) {
    mysqli_rollback($conexion);
    mysqli_autocommit($conexion, TRUE);
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
    if ($conexion) {
        // Revertir transacción si está activa
        revertirTransaccion($conexion);
    }
    
    // Verificar si es un error de mysqli o general
    if (strpos($e->getMessage(), 'mysql') !== false || mysqli_error($conexion)) {
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

// Función para escapar cadenas (helper para mysqli)
function escaparCadena($cadena) {
    global $conexion;
    return mysqli_real_escape_string($conexion, $cadena);
}

// Función para validar entrada
function validarEntrada($input, $tipo = 'string') {
    switch ($tipo) {
        case 'int':
            return filter_var($input, FILTER_VALIDATE_INT);
        case 'email':
            return filter_var($input, FILTER_VALIDATE_EMAIL);
        case 'string':
        default:
            return escaparCadena(trim(strip_tags($input)));
    }
}

// Función para ejecutar consulta de manera segura
function ejecutarConsulta($sql) {
    global $conexion;
    
    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        throw new Exception("Error en la consulta: " . mysqli_error($conexion));
    }
    
    return $result;
}

// Función para obtener un solo resultado
function obtenerUno($sql) {
    $result = ejecutarConsulta($sql);
    return mysqli_fetch_assoc($result);
}

// Función para obtener múltiples resultados
function obtenerTodos($sql) {
    $result = ejecutarConsulta($sql);
    $datos = [];
    
    while ($row = mysqli_fetch_assoc($result)) {
        $datos[] = $row;
    }
    
    return $datos;
}
?>