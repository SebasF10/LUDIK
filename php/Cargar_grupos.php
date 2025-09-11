<?php
// cargar_grupos.php
header('Content-Type: application/json; charset=utf-8');

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ludik";

try {
    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Verificar conexión
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }
    
    // Configurar charset
    $conn->set_charset("utf8");
    
    // Consulta para obtener grupos con información del grado
    $sql = "SELECT g.id_grupo, g.grupo, gr.grado 
            FROM grupo g 
            INNER JOIN grado gr ON g.id_grado = gr.id_grado 
            ORDER BY gr.id_grado, g.grupo";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }
    
    $grupos = array();
    
    while ($row = $result->fetch_assoc()) {
        $grupos[] = array(
            'id_grupo' => $row['id_grupo'],
            'grupo' => $row['grupo'],
            'grado' => $row['grado']
        );
    }
    
    // Cerrar conexión
    $conn->close();
    
    // Devolver los grupos en formato JSON
    echo json_encode($grupos);
    
} catch (Exception $e) {
    // En caso de error
    if (isset($conn)) {
        $conn->close();
    }
    
    http_response_code(500);
    echo json_encode(array(
        'error' => true,
        'message' => $e->getMessage()
    ));
}
?>