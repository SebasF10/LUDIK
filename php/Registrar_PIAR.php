<?php
// filepath: php/registrar_piar.php - MODIFIED VERSION USING conexion.php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
    $compromiso = $_POST['compromiso'] ?? null;

    // Validar datos obligatorios
    if (!$id_estudiante || !$fecha || !$ajuste || !$apoyo || !$barrera || !$compromiso) {
        throw new Exception('Todos los campos son obligatorios');
    }

    // Verificar que el estudiante existe
    $stmt_verificar = $conexion->prepare("SELECT id_estudiante FROM estudiante WHERE id_estudiante = ?");
    $stmt_verificar->bind_param("i", $id_estudiante);
    $stmt_verificar->execute();
    $stmt_verificar->store_result();

    if ($stmt_verificar->num_rows === 0) {
        throw new Exception('El estudiante seleccionado no existe');
    }
    $stmt_verificar->close();

    // Insertar el PIAR
    $consulta = "INSERT INTO piar (id_estudiante, fecha, ajuste, apoyo, barrera, compromiso) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($consulta);
    $stmt->bind_param("isssss", $id_estudiante, $fecha, $ajuste, $apoyo, $barrera, $compromiso);

    if (!$stmt->execute()) {
        throw new Exception('Error al registrar el PIAR: ' . $stmt->error);
    }

    $piar_id = $stmt->insert_id;
    $stmt->close();

    echo json_encode([
        'success' => true,
        'message' => 'PIAR registrado exitosamente',
        'piar_id' => $piar_id
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
