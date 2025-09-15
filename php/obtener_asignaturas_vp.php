<?php
// obtener_asignaturas.php
session_start();
header('Content-Type: application/json');

// Verificar que el docente esté logueado
if (!isset($_SESSION['usuario']['id_docente']) || !isset($_SESSION['rol']) || $_SESSION['rol'] !== 'docente') {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}
// Verificar que se proporcione el ID del grupo
if (!isset($_GET['id_grupo']) || empty($_GET['id_grupo'])) {
    echo json_encode(['success' => false, 'message' => 'ID de grupo requerido']);
    exit;
}

require_once 'conexion.php';

$id_docente = $_SESSION['usuario']['id_docente'];
$id_grupo = intval($_GET['id_grupo']);

try {
    // Consulta para obtener las asignaturas que dicta el docente en el grupo específico
    $query = "
        SELECT DISTINCT 
            a.id_asignatura,
            a.nombre_asig
        FROM asignatura a
        INNER JOIN asignatura_docente_grupo adg ON a.id_asignatura = adg.id_asignatura
        WHERE adg.id_docente = ? AND adg.id_grupo = ?
        ORDER BY a.nombre_asig
    ";
    
    $stmt = mysqli_prepare($conexion, $query);
    mysqli_stmt_bind_param($stmt, "ii", $id_docente, $id_grupo);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $asignaturas = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $asignaturas[] = [
            'id_asignatura' => $row['id_asignatura'],
            'nombre_asig' => $row['nombre_asig']
        ];
    }
    
    mysqli_stmt_close($stmt);
    
    echo json_encode([
        'success' => true,
        'asignaturas' => $asignaturas
    ]);
    
} catch (Exception $e) {
    error_log("Error en obtener_asignaturas.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor'
    ]);
}

mysqli_close($conexion);
?>