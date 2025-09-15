<?php
// Registrar_estudiante.php - MODIFIED VERSION USING conexion.php
header('Content-Type: application/json; charset=utf-8');

// Incluir archivo de conexión universal
require_once 'conexion.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    // Check if this is Phase 1 (Student + Family) or Phase 2 (Description)
    $phase = $_POST['phase'] ?? '1';
    
    // Usar la conexión del archivo incluido
    $conn = $conexion;
    
    // Establecer autocommit para transacciones
    $conn->autocommit(false);
    
    if ($phase === '1') {
        // PHASE 1: Register Student and Family Data (Steps 1-4)
        $result = registerStudentAndFamily($conn);
    } else {
        // PHASE 2: Register Description (Steps 5-11)
        $result = registerDescription($conn);
    }
    
    $conn->commit();
    echo json_encode($result);
    
} catch (Exception $e) {
    if (isset($conn) && $conn->connect_errno === 0) {
        $conn->rollback();
    }
    
    error_log("Error en registro estudiante: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'error_code' => $e->getCode()
    ]);
}
// Nota: No cerramos la conexión aquí ya que se maneja en conexion.php

function registerStudentAndFamily($conn) {
    // STEP 1: Register Mother
    $madre_data = [
        'nombre_completo' => trim($_POST['madre_nombre'] ?? ''),
        'nivel_educativo' => trim($_POST['madre_educacion'] ?? ''),
        'ocupacion' => trim($_POST['madre_ocupacion'] ?? ''),
        'email' => trim($_POST['madre_email'] ?? ''),
        'telefono' => trim($_POST['madre_telefono'] ?? ''),
        'contrasena' => trim($_POST['madre_contrasena'] ?? '')
    ];
    
    if (empty($madre_data['nombre_completo']) || empty($madre_data['nivel_educativo']) || empty($madre_data['ocupacion'])) {
        throw new Exception("Faltan datos obligatorios de la madre");
    }
    
    $stmt = $conn->prepare("INSERT INTO madre (nombre_completo, nivel_educativo, ocupacion, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $madre_data['nombre_completo'], $madre_data['nivel_educativo'], $madre_data['ocupacion'], $madre_data['email'], $madre_data['telefono'], $madre_data['contrasena']);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando madre: " . $stmt->error);
    }
    $id_madre = $conn->insert_id;
    $stmt->close();
    
    // STEP 2: Register Father
    $padre_data = [
        'nombre_completo' => trim($_POST['padre_nombre'] ?? ''),
        'nivel_educativo' => trim($_POST['padre_educacion'] ?? ''),
        'ocupacion' => trim($_POST['padre_ocupacion'] ?? ''),
        'email' => trim($_POST['padre_email'] ?? ''),
        'telefono' => trim($_POST['padre_telefono'] ?? ''),
        'contrasena' => trim($_POST['padre_contrasena'] ?? '')
    ];
    
    if (empty($padre_data['nombre_completo']) || empty($padre_data['nivel_educativo']) || empty($padre_data['ocupacion'])) {
        throw new Exception("Faltan datos obligatorios del padre");
    }
    
    $stmt = $conn->prepare("INSERT INTO padre (nombre_completo, nivel_educativo, ocupacion, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $padre_data['nombre_completo'], $padre_data['nivel_educativo'], $padre_data['ocupacion'], $padre_data['email'], $padre_data['telefono'], $padre_data['contrasena']);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando padre: " . $stmt->error);
    }
    $id_padre = $conn->insert_id;
    $stmt->close();
    
    // STEP 3: Register Caregiver
    $cuidador_data = [
        'nombre_completo' => trim($_POST['cuidador_nombre'] ?? ''),
        'nivel_educativo' => trim($_POST['cuidador_educacion'] ?? ''),
        'parentesco' => trim($_POST['cuidador_parentesco'] ?? ''),
        'email' => trim($_POST['cuidador_email'] ?? ''),
        'telefono' => trim($_POST['cuidador_telefono'] ?? ''),
        'contrasena' => trim($_POST['cuidador_contrasena'] ?? '')
    ];
    
    if (empty($cuidador_data['nombre_completo']) || empty($cuidador_data['nivel_educativo']) || empty($cuidador_data['parentesco'])) {
        throw new Exception("Faltan datos obligatorios del cuidador");
    }
    
    $stmt = $conn->prepare("INSERT INTO acudiente (nombre_completo, nivel_educativo, parentesco, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $cuidador_data['nombre_completo'], $cuidador_data['nivel_educativo'], $cuidador_data['parentesco'], $cuidador_data['email'], $cuidador_data['telefono'], $cuidador_data['contrasena']);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando cuidador: " . $stmt->error);
    }
    $id_cuidador = $conn->insert_id;
    $stmt->close();
    
    // STEP 4: Register Student
    $estudiante_data = [
        'nombre' => trim($_POST['estudiante_nombre'] ?? ''),
        'apellidos' => trim($_POST['estudiante_apellidos'] ?? ''),
        'tipo_documento' => trim($_POST['tipo_documento'] ?? ''),
        'no_documento' => trim($_POST['no_documento'] ?? ''),
        'lugar_nacimiento' => trim($_POST['lugar_nacimiento'] ?? ''),
        'fecha_nacimiento' => $_POST['fecha_nacimiento'] ?? '',
        'sector' => trim($_POST['sector'] ?? ''),
        'direccion' => trim($_POST['direccion'] ?? ''),
        'telefono' => trim($_POST['telefono'] ?? ''),
        'correo' => trim($_POST['correo'] ?? ''),
        'contrasena' => trim($_POST['contrasena'] ?? ''),
        'victima_conflicto' => trim($_POST['victima_conflicto'] ?? ''),
        'victima_tipo' => isset($_POST['victima_tipo']) && $_POST['victima_conflicto'] === 'Si' ? trim($_POST['victima_tipo']) : null,
        'registro_victima' => isset($_POST['registro_victima']) ? trim($_POST['registro_victima']) : 'No',
        'centro_proteccion' => isset($_POST['centro_proteccion']) ? trim($_POST['centro_proteccion']) : 'No',
        'grupo_etnico' => trim($_POST['grupo_etnico'] ?? ''),
        'etnico_tipo' => isset($_POST['etnico_tipo']) && $_POST['grupo_etnico'] === 'Si' ? trim($_POST['etnico_tipo']) : null,
        'no_hermanos' => isset($_POST['no_hermanos']) && !empty($_POST['no_hermanos']) ? intval($_POST['no_hermanos']) : 0,
        'lugar_que_ocupa' => trim($_POST['lugar_que_ocupa'] ?? ''),
        'con_quien_vive' => trim($_POST['con_quien_vive'] ?? ''),
        'quien_apoya_crianza' => trim($_POST['quien_apoya_crianza'] ?? ''),
        'afiliacion_salud' => trim($_POST['afiliacion_salud'] ?? '')
    ];
    
    // Validation
    $required_fields = ['nombre', 'apellidos', 'tipo_documento', 'no_documento', 'fecha_nacimiento', 'sector', 'direccion', 'victima_conflicto', 'grupo_etnico', 'con_quien_vive', 'quien_apoya_crianza', 'afiliacion_salud'];
    foreach ($required_fields as $field) {
        if (empty($estudiante_data[$field])) {
            throw new Exception("Faltan datos obligatorios del estudiante: $field");
        }
    }
    
    // Check document uniqueness
    $stmt = $conn->prepare("SELECT id_estudiante FROM estudiante WHERE no_documento = ?");
    $stmt->bind_param("s", $estudiante_data['no_documento']);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        throw new Exception("Ya existe un estudiante con el número de documento: " . $estudiante_data['no_documento']);
    }
    $stmt->close();
    
    $stmt = $conn->prepare("INSERT INTO estudiante (
        nombre, apellidos, tipo_documento, no_documento, lugar_nacimiento, fecha_nacimiento, 
        sector, direccion, telefono, correo, contrasena, victima_conflicto, registro_victima, 
        centro_proteccion, grupo_etnico, no_hermanos, lugar_que_ocupa, con_quien_vive, 
        quien_apoya_crianza, afiliacion_salud, id_madre, id_padre, id_cuidador
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param(
        "sssssssssssssssissssiii",
        $estudiante_data['nombre'], $estudiante_data['apellidos'], $estudiante_data['tipo_documento'], 
        $estudiante_data['no_documento'], $estudiante_data['lugar_nacimiento'], $estudiante_data['fecha_nacimiento'], 
        $estudiante_data['sector'], $estudiante_data['direccion'], $estudiante_data['telefono'], 
        $estudiante_data['correo'], $estudiante_data['contrasena'], $estudiante_data['victima_conflicto'], 
        $estudiante_data['registro_victima'], $estudiante_data['centro_proteccion'], $estudiante_data['grupo_etnico'], 
        $estudiante_data['no_hermanos'], $estudiante_data['lugar_que_ocupa'], $estudiante_data['con_quien_vive'], 
        $estudiante_data['quien_apoya_crianza'], $estudiante_data['afiliacion_salud'], 
        $id_madre, $id_padre, $id_cuidador
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando estudiante: " . $stmt->error);
    }
    $id_estudiante = $conn->insert_id;
    $stmt->close();
    
    // STEP 5: Assign to group if provided
    if (isset($_POST['id_grupo']) && !empty($_POST['id_grupo'])) {
        $id_grupo = intval($_POST['id_grupo']);
        $anio_actual = date('Y');
        
        // Verify group exists
        $stmt = $conn->prepare("SELECT id_grupo FROM grupo WHERE id_grupo = ?");
        $stmt->bind_param("i", $id_grupo);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 0) {
            throw new Exception("El grupo especificado no existe");
        }
        $stmt->close();
        
        $stmt = $conn->prepare("INSERT INTO grupo_estudiante (id_grupo, id_estudiante, anio) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $id_grupo, $id_estudiante, $anio_actual);
        
        if (!$stmt->execute()) {
            throw new Exception("Error asignando grupo al estudiante: " . $stmt->error);
        }
        $stmt->close();
    }
    
    return [
        'success' => true,
        'phase' => 1,
        'id_estudiante' => $id_estudiante,
        'message' => 'Estudiante y familia registrados exitosamente. Ahora puede proceder con la descripción general.',
        'data' => [
            'id_madre' => $id_madre,
            'id_padre' => $id_padre,
            'id_cuidador' => $id_cuidador,
            'nombre_completo' => $estudiante_data['nombre'] . ' ' . $estudiante_data['apellidos']
        ]
    ];
}

function registerDescription($conn) {
    $id_estudiante = intval($_POST['id_estudiante'] ?? 0);
    
    if (!$id_estudiante) {
        throw new Exception("ID de estudiante requerido para registrar descripción");
    }
    
    // Verify student exists
    $stmt = $conn->prepare("SELECT nombre, apellidos FROM estudiante WHERE id_estudiante = ?");
    $stmt->bind_param("i", $id_estudiante);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("El estudiante especificado no existe");
    }
    $student = $result->fetch_assoc();
    $stmt->close();
    
    // Get description data
    $descriptions = [
        'capacidades' => trim($_POST['capacidades'] ?? ''),
        'gustos_intereses' => trim($_POST['gustos_intereses'] ?? ''),
        'expectativas_estudiante' => trim($_POST['expectativas_estudiante'] ?? ''),
        'expectativas_familia' => trim($_POST['expectativas_familia'] ?? ''),
        'red_apoyo' => trim($_POST['red_apoyo'] ?? ''),
        'otra_descripcion' => trim($_POST['otra_descripcion'] ?? '')
    ];
    
    // Validation
    foreach ($descriptions as $key => $value) {
        if (empty($value)) {
            throw new Exception("Faltan datos obligatorios en la descripción: $key");
        }
    }
    
    // Check if description already exists for this student
    $stmt = $conn->prepare("SELECT id_descripcion_general FROM descripcion_general WHERE id_estudiante = ?");
    $stmt->bind_param("i", $id_estudiante);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        throw new Exception("Ya existe una descripción general para este estudiante");
    }
    $stmt->close();
    
    // Insert each description type
    $description_ids = [];
    
    // Capacidad
    $stmt = $conn->prepare("INSERT INTO capacidad (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['capacidades']);
    if (!$stmt->execute()) throw new Exception("Error insertando capacidad: " . $stmt->error);
    $description_ids['capacidad'] = $conn->insert_id;
    $stmt->close();
    
    // Gusto e interés
    $stmt = $conn->prepare("INSERT INTO gusto_interes (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['gustos_intereses']);
    if (!$stmt->execute()) throw new Exception("Error insertando gusto_interes: " . $stmt->error);
    $description_ids['gusto_interes'] = $conn->insert_id;
    $stmt->close();
    
    // Expectativa
    $stmt = $conn->prepare("INSERT INTO expectativa (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['expectativas_estudiante']);
    if (!$stmt->execute()) throw new Exception("Error insertando expectativa: " . $stmt->error);
    $description_ids['expectativa'] = $conn->insert_id;
    $stmt->close();
    
    // Expectativa familia
    $stmt = $conn->prepare("INSERT INTO expectativa_familia (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['expectativas_familia']);
    if (!$stmt->execute()) throw new Exception("Error insertando expectativa_familia: " . $stmt->error);
    $description_ids['expectativa_familia'] = $conn->insert_id;
    $stmt->close();
    
    // Red apoyo
    $stmt = $conn->prepare("INSERT INTO red_apoyo (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['red_apoyo']);
    if (!$stmt->execute()) throw new Exception("Error insertando red_apoyo: " . $stmt->error);
    $description_ids['red_apoyo'] = $conn->insert_id;
    $stmt->close();
    
    // Otra descripción
    $stmt = $conn->prepare("INSERT INTO otra_descripcion (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['otra_descripcion']);
    if (!$stmt->execute()) throw new Exception("Error insertando otra_descripcion: " . $stmt->error);
    $description_ids['otra_descripcion'] = $conn->insert_id;
    $stmt->close();
    
    // Create general description with student reference
    $stmt = $conn->prepare("INSERT INTO descripcion_general (id_capacidad, id_gusto_e_interes, id_expectativa, id_expectativa_familia, id_red_apoyo, id_otra_descripcion, id_estudiante) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iiiiiii", 
        $description_ids['capacidad'], 
        $description_ids['gusto_interes'], 
        $description_ids['expectativa'], 
        $description_ids['expectativa_familia'], 
        $description_ids['red_apoyo'], 
        $description_ids['otra_descripcion'],
        $id_estudiante
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando descripcion_general: " . $stmt->error);
    }
    $id_descripcion_general = $conn->insert_id;
    $stmt->close();
    
    return [
        'success' => true,
        'phase' => 2,
        'id_estudiante' => $id_estudiante,
        'id_descripcion_general' => $id_descripcion_general,
        'message' => 'Descripción general registrada exitosamente para ' . $student['nombre'] . ' ' . $student['apellidos'] . '. Registro completo.',
        'student_name' => $student['nombre'] . ' ' . $student['apellidos'],
        'complete' => true
    ];
}
?>