<?php
// filepath: php/registrar_piar.php

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
    $stmt_verificar = $conexion->prepare("SELECT id_estudiante FROM estudiante WHERE id_estudiante = ?");
    $stmt_verificar->execute([$id_estudiante]);
    
    if ($stmt_verificar->rowCount() === 0) {
        throw new Exception('El estudiante seleccionado no existe');
    }
    
    // Insertar el PIAR
    $consulta = "INSERT INTO piar (id_estudiante, fecha, ajuste, apoyo, barrera) 
                 VALUES (?, ?, ?, ?, ?)";
    
    $stmt = $conexion->prepare($consulta);
    $stmt->execute([$id_estudiante, $fecha, $ajuste, $apoyo, $barrera]);
    
    $piar_id = $conexion->lastInsertId();
    
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