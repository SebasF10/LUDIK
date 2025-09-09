<?php
header('Content-Type: application/json; charset=utf-8');

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ludik";

try {
    // Verificar que se recibieron los datos POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    // Validar campos requeridos
    $camposRequeridos = [
        'capacidad_desc', 
        'gusto_interes_desc', 
        'expectativa_desc', 
        'expectativa_familia_desc', 
        'red_apoyo_desc', 
        'otra_descripcion_desc', 
        'id_estudiante'
    ];
    
    foreach ($camposRequeridos as $campo) {
        if (!isset($_POST[$campo]) || trim($_POST[$campo]) === '') {
            throw new Exception("El campo $campo es obligatorio");
        }
    }
    
    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Verificar conexión
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }
    
    // Configurar charset
    $conn->set_charset("utf8");
    
    // Iniciar transacción
    $conn->autocommit(false);
    
    // Variables para los IDs generados
    $id_capacidad = null;
    $id_gusto_interes = null;
    $id_expectativa = null;
    $id_expectativa_familia = null;
    $id_red_apoyo = null;
    $id_otra_descripcion = null;
    
    // 1. Insertar en tabla capacidad
    $stmt = $conn->prepare("INSERT INTO capacidad (descripcion) VALUES (?)");
    if (!$stmt) {
        throw new Exception("Error preparando consulta capacidad: " . $conn->error);
    }
    
    $capacidad_desc = trim($_POST['capacidad_desc']);
    $stmt->bind_param("s", $capacidad_desc);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando capacidad: " . $stmt->error);
    }
    $id_capacidad = $conn->insert_id;
    $stmt->close();
    
    // 2. Insertar en tabla gusto_interes
    $stmt = $conn->prepare("INSERT INTO gusto_interes (descripcion) VALUES (?)");
    if (!$stmt) {
        throw new Exception("Error preparando consulta gusto_interes: " . $conn->error);
    }
    
    $gusto_interes_desc = trim($_POST['gusto_interes_desc']);
    $stmt->bind_param("s", $gusto_interes_desc);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando gusto_interes: " . $stmt->error);
    }
    $id_gusto_interes = $conn->insert_id;
    $stmt->close();
    
    // 3. Insertar en tabla expectativa
    $stmt = $conn->prepare("INSERT INTO expectativa (descripcion) VALUES (?)");
    if (!$stmt) {
        throw new Exception("Error preparando consulta expectativa: " . $conn->error);
    }
    
    $expectativa_desc = trim($_POST['expectativa_desc']);
    $stmt->bind_param("s", $expectativa_desc);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando expectativa: " . $stmt->error);
    }
    $id_expectativa = $conn->insert_id;
    $stmt->close();
    
    // 4. Insertar en tabla expectativa_familia
    $stmt = $conn->prepare("INSERT INTO expectativa_familia (descripcion) VALUES (?)");
    if (!$stmt) {
        throw new Exception("Error preparando consulta expectativa_familia: " . $conn->error);
    }
    
    $expectativa_familia_desc = trim($_POST['expectativa_familia_desc']);
    $stmt->bind_param("s", $expectativa_familia_desc);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando expectativa_familia: " . $stmt->error);
    }
    $id_expectativa_familia = $conn->insert_id;
    $stmt->close();
    
    // 5. Insertar en tabla red_apoyo
    $stmt = $conn->prepare("INSERT INTO red_apoyo (descripcion) VALUES (?)");
    if (!$stmt) {
        throw new Exception("Error preparando consulta red_apoyo: " . $conn->error);
    }
    
    $red_apoyo_desc = trim($_POST['red_apoyo_desc']);
    $stmt->bind_param("s", $red_apoyo_desc);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando red_apoyo: " . $stmt->error);
    }
    $id_red_apoyo = $conn->insert_id;
    $stmt->close();
    
    // 6. Insertar en tabla otra_descripcion
    $stmt = $conn->prepare("INSERT INTO otra_descripcion (descripcion) VALUES (?)");
    if (!$stmt) {
        throw new Exception("Error preparando consulta otra_descripcion: " . $conn->error);
    }
    
    $otra_descripcion_desc = trim($_POST['otra_descripcion_desc']);
    $stmt->bind_param("s", $otra_descripcion_desc);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando otra_descripcion: " . $stmt->error);
    }
    $id_otra_descripcion = $conn->insert_id;
    $stmt->close();
    
    // 7. Verificar que el estudiante existe
    $id_estudiante = intval($_POST['id_estudiante']);
    $stmt = $conn->prepare("SELECT id_estudiante FROM estudiante WHERE id_estudiante = ?");
    if (!$stmt) {
        throw new Exception("Error preparando consulta estudiante: " . $conn->error);
    }
    
    $stmt->bind_param("i", $id_estudiante);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("El estudiante seleccionado no existe");
    }
    $stmt->close();
    
    // 8. Verificar que el estudiante no tenga ya una descripción general
    $stmt = $conn->prepare("SELECT id_descripcion_general FROM descripcion_general WHERE id_estudiante = ?");
    if (!$stmt) {
        throw new Exception("Error preparando consulta verificación: " . $conn->error);
    }
    
    $stmt->bind_param("i", $id_estudiante);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        throw new Exception("El estudiante ya tiene una descripción general registrada");
    }
    $stmt->close();
    
    // 9. Insertar en tabla descripcion_general
    $stmt = $conn->prepare("INSERT INTO descripcion_general (id_capacidad, id_gusto_e_interes, id_expectativa, id_expectativa_familia, id_red_apoyo, id_otra_descripcion, id_estudiante) VALUES (?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Error preparando consulta descripcion_general: " . $conn->error);
    }
    
    $stmt->bind_param("iiiiiii", $id_capacidad, $id_gusto_interes, $id_expectativa, $id_expectativa_familia, $id_red_apoyo, $id_otra_descripcion, $id_estudiante);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando descripcion_general: " . $stmt->error);
    }
    $id_descripcion_general = $conn->insert_id;
    $stmt->close();
    
    // Si todo salió bien, confirmar transacción
    $conn->commit();
    
    // Cerrar conexión
    $conn->close();
    
    // Respuesta exitosa
    echo json_encode(array(
        'success' => true,
        'message' => 'Descripción general registrada exitosamente',
        'id_descripcion_general' => $id_descripcion_general
    ));
    
} catch (Exception $e) {
    // En caso de error, deshacer transacción si existe conexión
    if (isset($conn)) {
        $conn->rollback();
        $conn->close();
    }
    
    // Respuesta de error
    http_response_code(400);
    echo json_encode(array(
        'success' => false,
        'message' => $e->getMessage()
    ));
}
?>