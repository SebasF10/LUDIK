<?php
// obtener_estudiantes.php
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
    // Verificar que el docente tiene acceso a este grupo
    $query_verificacion = "
        SELECT COUNT(*) as count 
        FROM asignatura_docente_grupo adg 
        WHERE adg.id_docente = ? AND adg.id_grupo = ?
    ";
    
    $stmt_verificacion = mysqli_prepare($conexion, $query_verificacion);
    mysqli_stmt_bind_param($stmt_verificacion, "ii", $id_docente, $id_grupo);
    mysqli_stmt_execute($stmt_verificacion);
    $result_verificacion = mysqli_stmt_get_result($stmt_verificacion);
    $row_verificacion = mysqli_fetch_assoc($result_verificacion);
    
    if ($row_verificacion['count'] == 0) {
        echo json_encode(['success' => false, 'message' => 'No tienes acceso a este grupo']);
        exit;
    }
    
    mysqli_stmt_close($stmt_verificacion);
    
    // Consulta para obtener los estudiantes del grupo con información de PIAR
    $query = "
        SELECT 
            e.id_estudiante,
            e.nombre,
            e.apellidos,
            e.tipo_documento,
            e.no_documento,
            e.correo,
            e.telefono,
            CASE 
                WHEN p.id_piar IS NOT NULL THEN 1 
                ELSE 0 
            END as tiene_piar,
            p.id_piar
        FROM estudiante e
        INNER JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante
        LEFT JOIN piar p ON e.id_estudiante = p.id_estudiante
        WHERE ge.id_grupo = ? AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
        ORDER BY e.apellidos, e.nombre
    ";
    
    $stmt = mysqli_prepare($conexion, $query);
    mysqli_stmt_bind_param($stmt, "i", $id_grupo);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $estudiantes = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $estudiantes[] = [
            'id_estudiante' => $row['id_estudiante'],
            'nombre' => $row['nombre'],
            'apellidos' => $row['apellidos'],
            'tipo_documento' => $row['tipo_documento'],
            'no_documento' => $row['no_documento'],
            'correo' => $row['correo'] ?: 'No registrado',
            'telefono' => $row['telefono'] ?: 'No registrado',
            'tiene_piar' => (bool)$row['tiene_piar'],
            'id_piar' => $row['id_piar']
        ];
    }
    
    mysqli_stmt_close($stmt);
    
    echo json_encode([
        'success' => true,
        'estudiantes' => $estudiantes
    ]);
    
} catch (Exception $e) {
    error_log("Error en obtener_estudiantes.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor'
    ]);
}

mysqli_close($conexion);
?>