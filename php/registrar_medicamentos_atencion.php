<?php
// filepath: php/registrar_medicamentos_atencion.php

require_once 'config_db.php';

configurarHeaders();

try {
    // Verificar método
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    $conexion = obtenerConexion();
    
    // Obtener datos JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Datos no válidos');
    }
    
    $medicamentos = $data['medicamentos'] ?? [];
    $atencion_medica = $data['atencion_medica'] ?? [];
    
    if (empty($medicamentos) && empty($atencion_medica)) {
        throw new Exception('Debe proporcionar al menos un medicamento o una atención médica');
    }
    
    // Iniciar transacción (MySQLi)
    iniciarTransaccion($conexion);
    
    $medicamentos_ids = [];
    $atencion_ids = [];
    
    // Insertar medicamentos
    if (!empty($medicamentos)) {
        $consulta_med = "INSERT INTO medicamento (descripcion, frecuencia_horario) VALUES (?, ?)";
        $stmt_med = mysqli_prepare($conexion, $consulta_med);
        
        if (!$stmt_med) {
            throw new Exception('Error preparando consulta de medicamentos: ' . mysqli_error($conexion));
        }
        
        foreach ($medicamentos as $medicamento) {
            $descripcion = trim($medicamento['descripcion'] ?? '');
            $frecuencia = trim($medicamento['frecuencia_horario'] ?? '');
            
            if (empty($descripcion)) {
                throw new Exception('La descripción del medicamento no puede estar vacía');
            }
            
            mysqli_stmt_bind_param($stmt_med, "ss", $descripcion, $frecuencia);
            
            if (!mysqli_stmt_execute($stmt_med)) {
                throw new Exception('Error ejecutando consulta de medicamento: ' . mysqli_stmt_error($stmt_med));
            }
            
            $medicamentos_ids[] = mysqli_insert_id($conexion);
        }
        
        mysqli_stmt_close($stmt_med);
    }
    
    // Insertar atención médica
    if (!empty($atencion_medica)) {
        $consulta_aten = "INSERT INTO atencion_medica (descripcion, frecuencia) VALUES (?, ?)";
        $stmt_aten = mysqli_prepare($conexion, $consulta_aten);
        
        if (!$stmt_aten) {
            throw new Exception('Error preparando consulta de atención médica: ' . mysqli_error($conexion));
        }
        
        foreach ($atencion_medica as $atencion) {
            $descripcion = trim($atencion['descripcion'] ?? '');
            $frecuencia = trim($atencion['frecuencia'] ?? '');
            
            if (empty($descripcion)) {
                throw new Exception('La descripción de la atención médica no puede estar vacía');
            }
            
            mysqli_stmt_bind_param($stmt_aten, "ss", $descripcion, $frecuencia);
            
            if (!mysqli_stmt_execute($stmt_aten)) {
                throw new Exception('Error ejecutando consulta de atención médica: ' . mysqli_stmt_error($stmt_aten));
            }
            
            $atencion_ids[] = mysqli_insert_id($conexion);
        }
        
        mysqli_stmt_close($stmt_aten);
    }
    
    // Obtener el último tratamiento registrado (esto debería mejorarse con sesiones)
    $consulta_tratamiento = "SELECT id_tratamiento FROM tratamiento ORDER BY id_tratamiento DESC LIMIT 1";
    $resultado_tratamiento = ejecutarConsulta($consulta_tratamiento);
    $ultimo_tratamiento = mysqli_fetch_assoc($resultado_tratamiento);
    
    // Crear registro en entorno_salud
    $id_tratamiento = $ultimo_tratamiento ? $ultimo_tratamiento['id_tratamiento'] : null;
    $id_medicamento = !empty($medicamentos_ids) ? $medicamentos_ids[0] : null;
    $id_atencion = !empty($atencion_ids) ? $atencion_ids[0] : null;
    
    $consulta_entorno = "INSERT INTO entorno_salud (id_tratamiento, id_medicamento, id_atencion) VALUES (?, ?, ?)";
    $stmt_entorno = mysqli_prepare($conexion, $consulta_entorno);
    
    if (!$stmt_entorno) {
        throw new Exception('Error preparando consulta de entorno_salud: ' . mysqli_error($conexion));
    }
    
    mysqli_stmt_bind_param($stmt_entorno, "iii", $id_tratamiento, $id_medicamento, $id_atencion);
    
    if (!mysqli_stmt_execute($stmt_entorno)) {
        throw new Exception('Error ejecutando consulta de entorno_salud: ' . mysqli_stmt_error($stmt_entorno));
    }
    
    $entorno_salud_id = mysqli_insert_id($conexion);
    mysqli_stmt_close($stmt_entorno);
    
    // Confirmar transacción
    confirmarTransaccion($conexion);
    
    enviarRespuesta(true, 'Medicamentos y atención médica registrados exitosamente', [
        'entorno_salud_id' => $entorno_salud_id,
        'medicamentos_ids' => $medicamentos_ids,
        'atencion_ids' => $atencion_ids
    ]);
    
} catch (Exception $e) {
    manejarError($e, $conexion ?? null);
}
?>