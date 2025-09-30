<?php
// filepath: php/registrar_piar.php - MODIFIED VERSION USING conexion.php

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
    
    // Obtener datos del formulario
    $id_estudiante = $_POST['id_estudiante'] ?? null;
    $fecha = $_POST['fecha'] ?? null;
    $ajuste = $_POST['ajuste'] ?? null;
    $apoyo = $_POST['apoyo'] ?? null;
    $barrera = $_POST['barrera'] ?? null;
    
    // Validar datos obligatorios
    if (!$id_estudiante || !$fecha || !$ajuste || !$apoyo || !$barrera) {
        throw new Exception('Todos los campos son obligatorios');
    }
    
    // Verificar que el estudiante existe
    $stmt_verificar = $pdo_conn->prepare("SELECT id_estudiante FROM estudiante WHERE id_estudiante = ?");
    $stmt_verificar->execute([$id_estudiante]);
    
    if ($stmt_verificar->rowCount() === 0) {
        throw new Exception('El estudiante seleccionado no existe');
    }
    
    // Insertar el PIAR
    $consulta = "INSERT INTO piar (id_estudiante, fecha, ajuste, apoyo, barrera) 
                VALUES (?, ?, ?, ?, ?)";
    
    $stmt = $pdo_conn->prepare($consulta);
    $stmt->execute([$id_estudiante, $fecha, $ajuste, $apoyo, $barrera]);
    
    $piar_id = $pdo_conn->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'PIAR registrado exitosamente',
        'piar_id' => $piar_id
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>