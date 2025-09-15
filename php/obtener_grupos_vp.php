<?php
// obtener_grupos_vp.php
session_start();
header('Content-Type: application/json');

// Verificar que el docente esté logueado
if (!isset($_SESSION['usuario']['id_docente']) || !isset($_SESSION['rol']) || $_SESSION['rol'] !== 'docente') {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

require_once 'conexion.php';

$id_docente = $_SESSION['usuario']['id_docente'];

try {
    // Consulta para obtener los grupos asignados al docente con información adicional
    $query = "
        SELECT DISTINCT 
            g.id_grupo,
            g.grupo,
            gr.grado,
            COUNT(DISTINCT adg.id_asignatura) as total_asignaturas,
            (SELECT COUNT(*) FROM grupo_estudiante ge WHERE ge.id_grupo = g.id_grupo AND ge.anio = YEAR(CURDATE())) as total_estudiantes
        FROM grupo g
        INNER JOIN grado gr ON g.id_grado = gr.id_grado
        INNER JOIN asignatura_docente_grupo adg ON g.id_grupo = adg.id_grupo
        WHERE adg.id_docente = ?
        GROUP BY g.id_grupo, g.grupo, gr.grado
        ORDER BY gr.id_grado, g.grupo
    ";
    
    $stmt = mysqli_prepare($conexion, $query);
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta: " . mysqli_error($conexion));
    }
    
    mysqli_stmt_bind_param($stmt, "i", $id_docente);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $grupos = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $grupos[] = [
            'id' => $row['id_grupo'],
            'grupo' => $row['grupo'],
            'grado' => $row['grado'],
            'total_asignaturas' => $row['total_asignaturas'],
            'total_estudiantes' => $row['total_estudiantes']
        ];
    }
    
    mysqli_stmt_close($stmt);
    
    echo json_encode([
        'success' => true,
        'grupos' => $grupos
    ]);
    
} catch (Exception $e) {
    error_log("Error en obtener_grupos_vp.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor'
    ]);
}

if (isset($conexion)) {
    mysqli_close($conexion);
}
?>