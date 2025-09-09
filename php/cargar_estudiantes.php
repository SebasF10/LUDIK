<?php
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
    
    // Consulta para obtener estudiantes
    $sql = "SELECT id_estudiante, nombre, apellidos, no_documento 
            FROM estudiante 
            ORDER BY apellidos, nombre";
    
    $result = $conn->query($sql);
    
    $estudiantes = array();
    
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $estudiantes[] = array(
                'id_estudiante' => $row['id_estudiante'],
                'nombre' => $row['nombre'],
                'apellidos' => $row['apellidos'],
                'no_documento' => $row['no_documento']
            );
        }
    }
    
    // Cerrar conexión
    $conn->close();
    
    // Devolver JSON
    echo json_encode($estudiantes);
    
} catch (Exception $e) {
    // En caso de error, devolver array vacío con mensaje
    http_response_code(500);
    echo json_encode(array(
        'error' => true,
        'message' => $e->getMessage()
    ));
}
?>