<?php
// obtener_asignaturas.php
session_start();
header('Content-Type: application/json');

// Verificar que el usuario esté logueado y tenga rol autorizado
if (!isset($_SESSION['usuario']) || !isset($_SESSION['rol']) || 
    !in_array($_SESSION['rol'], ['docente', 'admin', 'docente_apoyo'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

// Verificar que se proporcione el ID del grupo
if (!isset($_GET['id_grupo']) || empty($_GET['id_grupo'])) {
    echo json_encode(['success' => false, 'message' => 'ID de grupo requerido']);
    exit;
}

require_once 'conexion.php';

$rol = $_SESSION['rol'];
$id_grupo = intval($_GET['id_grupo']);

try {
    if ($rol === 'admin' || $rol === 'docente_apoyo') {
        // Admin y docente_apoyo pueden ver TODAS las asignaturas del grupo
        $query = "
            SELECT DISTINCT 
                a.id_asignatura,
                a.nombre_asig
            FROM asignatura a
            INNER JOIN asignatura_docente_grupo adg ON a.id_asignatura = adg.id_asignatura
            WHERE adg.id_grupo = ?
            ORDER BY a.nombre_asig
        ";
        
        $stmt = mysqli_prepare($conexion, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_grupo);
        
    } else {
        // Docente normal: solo sus asignaturas en el grupo específico
        $id_docente = $_SESSION['usuario']['id_docente'];
        
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
    }
    
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