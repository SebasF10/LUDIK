<?php
// registrar_valoracion.php
session_start();
header('Content-Type: application/json');

// Verificar que el usuario esté logueado y tenga rol autorizado
if (!isset($_SESSION['usuario']) || !isset($_SESSION['rol']) || 
    !in_array($_SESSION['rol'], ['docente', 'admin', 'docente_apoyo'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

require_once 'conexion.php';

$rol = $_SESSION['rol'];

try {
    // Obtener y validar datos del formulario
    $id_grupo = intval($_POST['id_grupo'] ?? 0);
    $id_asignatura = intval($_POST['id_asignatura'] ?? 0);
    $id_estudiante = intval($_POST['id_estudiante'] ?? 0);
    $id_piar = intval($_POST['id_piar'] ?? 0);
    $periodo = mysqli_real_escape_string($conexion, $_POST['periodo'] ?? '');
    $anio = intval($_POST['anio'] ?? 0);
    $objetivo = mysqli_real_escape_string($conexion, trim($_POST['objetivo'] ?? ''));
    $barrera = mysqli_real_escape_string($conexion, trim($_POST['barrera'] ?? ''));
    $tipo_ajuste = mysqli_real_escape_string($conexion, trim($_POST['tipo_ajuste'] ?? ''));
    $apoyo_requerido = mysqli_real_escape_string($conexion, trim($_POST['apoyo_requerido'] ?? ''));
    $seguimiento = mysqli_real_escape_string($conexion, trim($_POST['seguimiento'] ?? ''));
    
    // Validar campos requeridos
    if (empty($id_grupo) || empty($id_asignatura) || empty($id_estudiante) || 
        empty($periodo) || empty($anio) || empty($objetivo) || empty($barrera) || 
        empty($tipo_ajuste) || empty($apoyo_requerido) || empty($seguimiento)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
        exit;
    }
    
    // Verificar permisos según el rol
    if ($rol === 'docente') {
        // Solo para docentes: verificar que tienen acceso a esta combinación grupo-asignatura
        $id_docente = $_SESSION['usuario']['id_docente'];
        
        $query_verificacion = "
            SELECT COUNT(*) as count 
            FROM asignatura_docente_grupo adg 
            WHERE adg.id_docente = ? AND adg.id_grupo = ? AND adg.id_asignatura = ?
        ";
        
        $stmt_verificacion = mysqli_prepare($conexion, $query_verificacion);
        mysqli_stmt_bind_param($stmt_verificacion, "iii", $id_docente, $id_grupo, $id_asignatura);
        mysqli_stmt_execute($stmt_verificacion);
        $result_verificacion = mysqli_stmt_get_result($stmt_verificacion);
        $row_verificacion = mysqli_fetch_assoc($result_verificacion);
        
        if ($row_verificacion['count'] == 0) {
            echo json_encode(['success' => false, 'message' => 'No tienes acceso a esta asignatura en este grupo']);
            exit;
        }
        
        mysqli_stmt_close($stmt_verificacion);
    }
    // Admin y docente_apoyo tienen acceso completo, no necesitan verificación adicional
    
    // Iniciar transacción
    mysqli_autocommit($conexion, false);
    
    // Si el estudiante no tiene PIAR, crear uno
    if (empty($id_piar)) {
        $query_piar = "
            INSERT INTO piar (id_estudiante, fecha, ajuste, apoyo, barrera) 
            VALUES (?, CURDATE(), 'Ajuste inicial generado automáticamente', 'Apoyo inicial', 'Barrera inicial identificada')
        ";
        
        $stmt_piar = mysqli_prepare($conexion, $query_piar);
        mysqli_stmt_bind_param($stmt_piar, "i", $id_estudiante);
        
        if (!mysqli_stmt_execute($stmt_piar)) {
            throw new Exception('Error al crear PIAR: ' . mysqli_error($conexion));
        }
        
        $id_piar = mysqli_insert_id($conexion);
        mysqli_stmt_close($stmt_piar);
    }
    
    // Verificar si ya existe una valoración para este estudiante, asignatura y período
    $query_existente = "
        SELECT id_valoracion_pedagogica 
        FROM valoracion_pedagogica 
        WHERE id_piar = ? AND id_asignatura = ? AND periodo = ? AND anio = ?
    ";
    
    $stmt_existente = mysqli_prepare($conexion, $query_existente);
    mysqli_stmt_bind_param($stmt_existente, "issi", $id_piar, $id_asignatura, $periodo, $anio);
    mysqli_stmt_execute($stmt_existente);
    $result_existente = mysqli_stmt_get_result($stmt_existente);
    
    if (mysqli_num_rows($result_existente) > 0) {
        throw new Exception('Ya existe una valoración pedagógica para este estudiante en esta asignatura y período');
    }
    
    mysqli_stmt_close($stmt_existente);
    
    // Insertar la valoración pedagógica
    $query_valoracion = "
        INSERT INTO valoracion_pedagogica (
            id_piar, 
            id_asignatura, 
            periodo, 
            anio, 
            objetivo, 
            barrera, 
            tipo_ajuste, 
            apoyo_requerido, 
            seguimiento
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";
    
    $stmt_valoracion = mysqli_prepare($conexion, $query_valoracion);
    mysqli_stmt_bind_param(
        $stmt_valoracion, 
        "ississsss", 
        $id_piar, 
        $id_asignatura, 
        $periodo, 
        $anio, 
        $objetivo, 
        $barrera, 
        $tipo_ajuste, 
        $apoyo_requerido, 
        $seguimiento
    );
    
    if (!mysqli_stmt_execute($stmt_valoracion)) {
        throw new Exception('Error al registrar la valoración pedagógica: ' . mysqli_error($conexion));
    }
    
    $id_valoracion = mysqli_insert_id($conexion);
    mysqli_stmt_close($stmt_valoracion);
    
    // Confirmar transacción
    mysqli_commit($conexion);
    mysqli_autocommit($conexion, true);
    
    echo json_encode([
        'success' => true,
        'message' => 'Valoración pedagógica registrada exitosamente',
        'id_valoracion' => $id_valoracion,
        'registro_por' => $rol
    ]);
    
} catch (Exception $e) {
    // Revertir transacción en caso de error
    mysqli_rollback($conexion);
    mysqli_autocommit($conexion, true);
    
    error_log("Error en registrar_valoracion.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

mysqli_close($conexion);
?>