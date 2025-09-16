<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir archivo de conexión
require_once 'conexion.php';

try {
    // Verificar si la conexión existe
    if (!$conexion) {
        throw new Exception("No se pudo conectar a la base de datos");
    }
    
    // Obtener parámetros de búsqueda
    $searchName = isset($_GET['search']) ? trim($_GET['search']) : '';
    $showAll = isset($_GET['showAll']) ? true : false;
    
    // Construir la consulta SQL con MySQLi
    $sql = "
        SELECT DISTINCT
            d.id_docente,
            d.nombre_completo,
            d.email,
            d.es_director,
            GROUP_CONCAT(DISTINCT a.nombre_asig ORDER BY a.nombre_asig SEPARATOR ', ') as materias,
            GROUP_CONCAT(DISTINCT g.grupo ORDER BY g.grupo SEPARATOR ', ') as grupos
        FROM docente d
        LEFT JOIN asignatura_docente_grupo adg ON d.id_docente = adg.id_docente
        LEFT JOIN asignatura a ON adg.id_asignatura = a.id_asignatura
        LEFT JOIN grupo g ON adg.id_grupo = g.id_grupo
    ";
    
    // Si hay búsqueda por nombre
    if (!empty($searchName) && !$showAll) {
        $searchName = mysqli_real_escape_string($conexion, $searchName);
        $sql .= " WHERE d.nombre_completo LIKE '%$searchName%'";
    }
    
    $sql .= " GROUP BY d.id_docente, d.nombre_completo, d.email, d.es_director";
    $sql .= " ORDER BY d.nombre_completo ASC";
    
    // Ejecutar consulta
    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        throw new Exception("Error en la consulta: " . mysqli_error($conexion));
    }
    
    $docentes = [];
    while ($row = mysqli_fetch_assoc($result)) {
        // Procesar materias
        $materias = !empty($row['materias']) ? explode(', ', $row['materias']) : [];
        $materias = array_unique($materias);
        $materias = array_filter($materias, function($materia) {
            return !empty(trim($materia));
        });
        
        // Procesar grupos
        $grupos = !empty($row['grupos']) ? explode(', ', $row['grupos']) : [];
        $grupos = array_unique($grupos);
        $grupos = array_filter($grupos, function($grupo) {
            return !empty(trim($grupo));
        });
        
        $docentes[] = [
            'id' => (int)$row['id_docente'],
            'nombre' => $row['nombre_completo'],
            'email' => $row['email'],
            'es_director' => (bool)$row['es_director'],
            'materias' => array_values($materias),
            'grupos' => array_values($grupos)
        ];
    }
    
    // Liberar resultado
    mysqli_free_result($result);
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'data' => $docentes,
        'total' => count($docentes),
        'search_term' => isset($_GET['search']) ? $_GET['search'] : ''
    ]);
    
} catch (Exception $e) {
    // Error general
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage(),
        'data' => [],
        'total' => 0
    ]);
}

// Cerrar conexión
if (isset($conexion)) {
    mysqli_close($conexion);
}
?>