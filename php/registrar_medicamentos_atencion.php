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
    
    // Iniciar transacción
    $conexion->beginTransaction();
    
    $medicamentos_ids = [];
    $atencion_ids = [];
    
    // Insertar medicamentos
    if (!empty($medicamentos)) {
        $consulta_med = "INSERT INTO medicamento (descripcion, frecuencia_horario) VALUES (?, ?)";
        $stmt_med = $conexion->prepare($consulta_med);
        
        foreach ($medicamentos as $medicamento) {
            $descripcion = trim($medicamento['descripcion']);
            $frecuencia = trim($medicamento['frecuencia_horario']);
            
            if (empty($descripcion)) {
                throw new Exception('La descripción del medicamento no puede estar vacía');
            }
            
            $stmt_med->execute([$descripcion, $frecuencia]);
            $medicamentos_ids[] = $conexion->lastInsertId();
        }
    }
    
    // Insertar atención médica
    if (!empty($atencion_medica)) {
        $consulta_aten = "INSERT INTO atencion_medica (descripcion, frecuencia) VALUES (?, ?)";
        $stmt_aten = $conexion->prepare($consulta_aten);
        
        foreach ($atencion_medica as $atencion) {
            $descripcion = trim($atencion['descripcion']);
            $frecuencia = trim($atencion['frecuencia']);
            
            if (empty($descripcion)) {
                throw new Exception('La descripción de la atención médica no puede estar vacía');
            }
            
            $stmt_aten->execute([$descripcion, $frecuencia]);
            $atencion_ids[] = $conexion->lastInsertId();
        }
    }
    
    // Obtener el último tratamiento registrado (esto debería mejorarse con sesiones)
    $stmt_tratamiento = $conexion->prepare("SELECT id_tratamiento FROM tratamiento ORDER BY id_tratamiento DESC LIMIT 1");
    $stmt_tratamiento->execute();
    $ultimo_tratamiento = $stmt_tratamiento->fetch(PDO::FETCH_ASSOC);
    
    // Crear registro en entorno_salud
    $id_tratamiento = $ultimo_tratamiento ? $ultimo_tratamiento['id_tratamiento'] : null;
    $id_medicamento = !empty($medicamentos_ids) ? $medicamentos_ids[0] : null;
    $id_atencion = !empty($atencion_ids) ? $atencion_ids[0] : null;
    
    $consulta_entorno = "INSERT INTO entorno_salud (id_tratamiento, id_medicamento, id_atencion) 
                         VALUES (?, ?, ?)";
    $stmt_entorno = $conexion->prepare($consulta_entorno);
    $stmt_entorno->execute([$id_tratamiento, $id_medicamento, $id_atencion]);
    
    $entorno_salud_id = $conexion->lastInsertId();
    
    // Confirmar transacción
    $conexion->commit();
    
    enviarRespuesta(true, 'Medicamentos y atención médica registrados exitosamente', [
        'entorno_salud_id' => $entorno_salud_id,
        'medicamentos_ids' => $medicamentos_ids,
        'atencion_ids' => $atencion_ids
    ]);
    
} catch (Exception $e) {
    manejarError($e, $conexion ?? null);
}
?>