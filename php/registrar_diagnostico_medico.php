<?php
// filepath: php/registrar_diagnostico_medico.php

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
    
    if (!$data) {
        throw new Exception('Datos no válidos');
    }
    
    // Validar datos requeridos
    $piar_id = $data['piar_id'] ?? null;
    $entorno_salud_id = $data['entorno_salud_id'] ?? null;
    $DX = trim($data['DX'] ?? '');
    $apoyos_tecnicos = trim($data['apoyos_tecnicos'] ?? '');
    $url_soporte_dx = trim($data['url_soporte_dx'] ?? '');
    $diagnosticos_cie10 = $data['diagnosticos_cie10'] ?? [];
    
    if (!$piar_id || !$DX || empty($diagnosticos_cie10)) {
        throw new Exception('PIAR ID, descripción del diagnóstico y al menos un diagnóstico CIE-10 son obligatorios');
    }
    
    // Verificar que el PIAR existe
    $stmt_verificar = $conexion->prepare("SELECT id_piar FROM piar WHERE id_piar = ?");
    $stmt_verificar->execute([$piar_id]);
    
    if ($stmt_verificar->rowCount() === 0) {
        throw new Exception('El PIAR especificado no existe');
    }
    
    // Iniciar transacción
    $conexion->beginTransaction();
    
    // Insertar diagnóstico médico (sin especificar id_diag_med, se genera automáticamente)
    $consulta_diag = "INSERT INTO diagnostico_medico 
                      (id_piar, DX, apoyos_tecnicos, url_soporte_dx, id_entorno_salud) 
                      VALUES (?, ?, ?, ?, ?)";
    
    $stmt_diag = $conexion->prepare($consulta_diag);
    
    $stmt_diag->execute([
        $piar_id,
        $DX,
        $apoyos_tecnicos ?: null,
        $url_soporte_dx ?: null,
        $entorno_salud_id
    ]);
    
    // Obtener el ID generado automáticamente
    $id_diag_med = $conexion->lastInsertId();
    
    // Insertar relaciones con todos los diagnósticos CIE-10 seleccionados
    $consulta_relacion = "INSERT INTO diagnostico_dx_cie10 
                          (id_diag_med, id_cie10, anio) 
                          VALUES (?, ?, ?)";
    
    $stmt_relacion = $conexion->prepare($consulta_relacion);
    $anio_actual = date('Y');
    
    foreach ($diagnosticos_cie10 as $cie10_id) {
        // Verificar que el diagnóstico CIE-10 existe
        $stmt_verificar_cie = $conexion->prepare("SELECT id_cie10 FROM dx_cie10 WHERE id_cie10 = ?");
        $stmt_verificar_cie->execute([$cie10_id]);
        
        if ($stmt_verificar_cie->rowCount() === 0) {
            throw new Exception("El diagnóstico CIE-10 '$cie10_id' no existe");
        }
        
        $stmt_relacion->execute([$id_diag_med, $cie10_id, $anio_actual]);
    }
    
    // Confirmar transacción
    $conexion->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Diagnóstico médico registrado exitosamente',
        'id_diag_med' => (int)$id_diag_med, // Convertir a entero para la respuesta
        'diagnosticos_asociados' => count($diagnosticos_cie10)
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