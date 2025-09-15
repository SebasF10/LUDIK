<?php
// cargar_grupos.php
header('Content-Type: application/json; charset=utf-8');

// Incluir el archivo de conexión
require_once 'conexion.php';

try {
    // Consulta para obtener grupos con información del grado
    $sql = "SELECT g.id_grupo, g.grupo, gr.grado 
            FROM grupo g 
            INNER JOIN grado gr ON g.id_grado = gr.id_grado 
            ORDER BY gr.id_grado, g.grupo";
    
    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        throw new Exception("Error en la consulta: " . mysqli_error($conexion));
    }
    
    $grupos = array();
    
    while ($row = mysqli_fetch_assoc($result)) {
        $grupos[] = array(
            'id_grupo' => $row['id_grupo'],
            'grupo' => $row['grupo'],
            'grado' => $row['grado']
        );
    }
    
    // Devolver los grupos en formato JSON
    echo json_encode($grupos);
    
} catch (Exception $e) {
    // En caso de error
    http_response_code(500);
    echo json_encode(array(
        'error' => true,
        'message' => $e->getMessage()
    ));
}
?>