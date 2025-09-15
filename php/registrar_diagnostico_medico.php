<?php
// filepath: php/registrar_diagnostico_medico.php

// Incluir el archivo de conexión
require_once 'conexion.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Verificar que sea una petición POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
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
    
    // Escapar datos para prevenir inyección SQL
    $piar_id = mysqli_real_escape_string($conexion, $piar_id);
    $DX = mysqli_real_escape_string($conexion, $DX);
    $apoyos_tecnicos = $apoyos_tecnicos ? mysqli_real_escape_string($conexion, $apoyos_tecnicos) : null;
    $url_soporte_dx = $url_soporte_dx ? mysqli_real_escape_string($conexion, $url_soporte_dx) : null;
    $entorno_salud_id = $entorno_salud_id ? mysqli_real_escape_string($conexion, $entorno_salud_id) : null;
    
    // Verificar que el PIAR existe
    $sql_verificar = "SELECT id_piar FROM piar WHERE id_piar = '$piar_id'";
    $result_verificar = mysqli_query($conexion, $sql_verificar);
    
    if (!$result_verificar) {
        throw new Exception('Error al verificar el PIAR: ' . mysqli_error($conexion));
    }
    
    if (mysqli_num_rows($result_verificar) === 0) {
        throw new Exception('El PIAR especificado no existe');
    }
    
    // Iniciar transacción
    mysqli_autocommit($conexion, FALSE);
    
    // Preparar valores para insertar diagnóstico médico
    $apoyos_value = $apoyos_tecnicos ? "'$apoyos_tecnicos'" : 'NULL';
    $url_value = $url_soporte_dx ? "'$url_soporte_dx'" : 'NULL';
    $entorno_value = $entorno_salud_id ? "'$entorno_salud_id'" : 'NULL';
    
    // Insertar diagnóstico médico
    $consulta_diag = "INSERT INTO diagnostico_medico 
                      (id_piar, DX, apoyos_tecnicos, url_soporte_dx, id_entorno_salud) 
                      VALUES ('$piar_id', '$DX', $apoyos_value, $url_value, $entorno_value)";
    
    if (!mysqli_query($conexion, $consulta_diag)) {
        throw new Exception('Error al insertar diagnóstico médico: ' . mysqli_error($conexion));
    }
    
    // Obtener el ID generado automáticamente
    $id_diag_med = mysqli_insert_id($conexion);
    
    // Insertar relaciones con todos los diagnósticos CIE-10 seleccionados
    $anio_actual = date('Y');
    
    foreach ($diagnosticos_cie10 as $cie10_id) {
        // Escapar el ID CIE-10
        $cie10_id = mysqli_real_escape_string($conexion, $cie10_id);
        
        // Verificar que el diagnóstico CIE-10 existe
        $sql_verificar_cie = "SELECT id_cie10 FROM dx_cie10 WHERE id_cie10 = '$cie10_id'";
        $result_verificar_cie = mysqli_query($conexion, $sql_verificar_cie);
        
        if (!$result_verificar_cie) {
            throw new Exception('Error al verificar el diagnóstico CIE-10: ' . mysqli_error($conexion));
        }
        
        if (mysqli_num_rows($result_verificar_cie) === 0) {
            throw new Exception("El diagnóstico CIE-10 '$cie10_id' no existe");
        }
        
        // Insertar relación
        $consulta_relacion = "INSERT INTO diagnostico_dx_cie10 
                              (id_diag_med, id_cie10, anio) 
                              VALUES ('$id_diag_med', '$cie10_id', '$anio_actual')";
        
        if (!mysqli_query($conexion, $consulta_relacion)) {
            throw new Exception('Error al insertar relación CIE-10: ' . mysqli_error($conexion));
        }
    }
    
    // Confirmar transacción
    mysqli_commit($conexion);
    mysqli_autocommit($conexion, TRUE);
    
    echo json_encode([
        'success' => true,
        'message' => 'Diagnóstico médico registrado exitosamente',
        'id_diag_med' => (int)$id_diag_med,
        'diagnosticos_asociados' => count($diagnosticos_cie10)
    ]);
    
} catch (Exception $e) {
    // Revertir transacción en caso de error
    mysqli_rollback($conexion);
    mysqli_autocommit($conexion, TRUE);
    
    // Determinar el código de respuesta HTTP
    if (strpos($e->getMessage(), 'Error al') === 0 || strpos($e->getMessage(), 'mysql') !== false) {
        http_response_code(500);
    } else {
        http_response_code(400);
    }
    
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>