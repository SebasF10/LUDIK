<?php
// Registrar_estudiante.php - VERSION CON ENCRIPTACIÓN DE CONTRASEÑAS
header('Content-Type: application/json; charset=utf-8');

require_once 'conexion.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    $phase = $_POST['phase'] ?? '1';
    $conn = $conexion;
    $conn->autocommit(false);
    
    if ($phase === '1') {
        $result = registerStudentAndFamily($conn);
    } else {
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

function handlePhotoUpload($studentId) {
    if (!isset($_FILES['student_photo']) || $_FILES['student_photo']['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    
    $file = $_FILES['student_photo'];
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Error en la subida del archivo: ' . $file['error']);
    }
    
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    $fileType = strtolower($file['type']);
    if (!in_array($fileType, $allowedTypes)) {
        throw new Exception('Tipo de archivo no válido. Solo se permiten JPG, PNG y GIF.');
    }
    
    $maxSize = 2 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        throw new Exception('El archivo es demasiado grande. Máximo 2MB.');
    }
    
    $imageInfo = getimagesize($file['tmp_name']);
    if ($imageInfo === false) {
        throw new Exception('El archivo no es una imagen válida.');
    }
    
    if ($imageInfo[0] < 100 || $imageInfo[1] < 100) {
        throw new Exception('La imagen es demasiado pequeña. Mínimo 100x100 píxeles.');
    }
    
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if ($extension === 'jpeg') $extension = 'jpg';
    
    $fileName = 'student_' . $studentId . '_' . time() . '.' . $extension;
    $uploadPath = '../photos/' . $fileName;
    
    if (!is_dir('../photos/')) {
        if (!mkdir('../photos/', 0755, true)) {
            throw new Exception('No se pudo crear el directorio de fotos.');
        }
    }
    
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new Exception('Error al guardar la foto en el servidor.');
    }
    
    return 'photos/' . $fileName;
}

function registerStudentAndFamily($conn) {
    $ids = [];

    // STEP 1: Register Mother (with password encryption)
    $madre_skipped = $_POST['madre_skipped'] ?? 'false';
    
    if ($madre_skipped === 'true') {
        $skip_reason = $_POST['madre_skip_reason_value'] ?? '';
        
        if ($skip_reason === 'no_presente') {
            $stmt = $conn->prepare("INSERT INTO madre (nombre_completo, nivel_educativo, ocupacion, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
            $placeholder_data = ['NO_REGISTRADA', 'N/A', 'No presente', '', '', ''];
            $stmt->bind_param("ssssss", ...$placeholder_data);
            
            if (!$stmt->execute()) {
                throw new Exception("Error insertando placeholder madre: " . $stmt->error);
            }
            $id_madre = $conn->insert_id;
            $stmt->close();
            
        } elseif ($skip_reason === 'es_acudiente') {
            $stmt = $conn->prepare("INSERT INTO madre (nombre_completo, nivel_educativo, ocupacion, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
            $marker_data = ['REGISTRADA_COMO_ACUDIENTE', 'Ver acudiente', 'Ver datos de acudiente', '', '', ''];
            $stmt->bind_param("ssssss", ...$marker_data);
            
            if (!$stmt->execute()) {
                throw new Exception("Error insertando marker madre: " . $stmt->error);
            }
            $id_madre = $conn->insert_id;
            $stmt->close();
        }
    } else {
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
        
        // Encriptar contraseña
        $contrasena_hash = password_hash($madre_data['contrasena'], PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO madre (nombre_completo, nivel_educativo, ocupacion, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $madre_data['nombre_completo'], $madre_data['nivel_educativo'], $madre_data['ocupacion'], $madre_data['email'], $madre_data['telefono'], $contrasena_hash);
        
        if (!$stmt->execute()) {
            throw new Exception("Error insertando madre: " . $stmt->error);
        }
        $id_madre = $conn->insert_id;
        $stmt->close();
    }
    
    // STEP 2: Register Father (with password encryption)
    $padre_skipped = $_POST['padre_skipped'] ?? 'false';
    
    if ($padre_skipped === 'true') {
        $skip_reason = $_POST['padre_skip_reason_value'] ?? '';
        
        if ($skip_reason === 'no_presente') {
            $stmt = $conn->prepare("INSERT INTO padre (nombre_completo, nivel_educativo, ocupacion, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
            $placeholder_data = ['NO_REGISTRADO', 'N/A', 'No presente', '', '', ''];
            $stmt->bind_param("ssssss", ...$placeholder_data);
            
            if (!$stmt->execute()) {
                throw new Exception("Error insertando placeholder padre: " . $stmt->error);
            }
            $id_padre = $conn->insert_id;
            $stmt->close();
            
        } elseif ($skip_reason === 'es_acudiente') {
            $stmt = $conn->prepare("INSERT INTO padre (nombre_completo, nivel_educativo, ocupacion, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
            $marker_data = ['REGISTRADO_COMO_ACUDIENTE', 'Ver acudiente', 'Ver datos de acudiente', '', '', ''];
            $stmt->bind_param("ssssss", ...$marker_data);
            
            if (!$stmt->execute()) {
                throw new Exception("Error insertando marker padre: " . $stmt->error);
            }
            $id_padre = $conn->insert_id;
            $stmt->close();
        }
    } else {
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
        
        // Encriptar contraseña
        $contrasena_hash = password_hash($padre_data['contrasena'], PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO padre (nombre_completo, nivel_educativo, ocupacion, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $padre_data['nombre_completo'], $padre_data['nivel_educativo'], $padre_data['ocupacion'], $padre_data['email'], $padre_data['telefono'], $contrasena_hash);
        
        if (!$stmt->execute()) {
            throw new Exception("Error insertando padre: " . $stmt->error);
        }
        $id_padre = $conn->insert_id;
        $stmt->close();
    }
    
    // STEP 3: Register Caregiver (with password encryption)
    $cuidador_data = [
        'nombre_completo' => trim($_POST['cuidador_nombre'] ?? ''),
        'nivel_educativo' => trim($_POST['cuidador_educacion'] ?? ''),
        'parentesco' => trim($_POST['cuidador_parentesco'] ?? ''),
        'email' => trim($_POST['cuidador_email'] ?? ''),
        'telefono' => trim($_POST['cuidador_telefono'] ?? ''),
        'contrasena' => trim($_POST['cuidador_contrasena'] ?? '')
    ];
    
    if (empty($cuidador_data['nombre_completo']) || empty($cuidador_data['nivel_educativo']) || empty($cuidador_data['parentesco'])) {
        throw new Exception("Faltan datos obligatorios del cuidador/acudiente");
    }
    
    // Encriptar contraseña
    $contrasena_hash = password_hash($cuidador_data['contrasena'], PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO acudiente (nombre_completo, nivel_educativo, parentesco, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $cuidador_data['nombre_completo'], $cuidador_data['nivel_educativo'], $cuidador_data['parentesco'], $cuidador_data['email'], $cuidador_data['telefono'], $contrasena_hash);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando cuidador: " . $stmt->error);
    }
    $id_cuidador = $conn->insert_id;
    $stmt->close();
    
    // STEP 4: Register Student (resto del código igual...)
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
        'afiliacion_salud' => trim($_POST['afiliacion_salud'] ?? ''),
        'regimen_salud' => trim($_POST['regimen_salud'] ?? ''),
        'url_foto' => null
    ];
    
    $required_fields = ['nombre', 'apellidos', 'tipo_documento', 'no_documento', 'fecha_nacimiento', 'sector', 'direccion', 'victima_conflicto', 'grupo_etnico', 'con_quien_vive', 'quien_apoya_crianza', 'afiliacion_salud', 'regimen_salud'];
    foreach ($required_fields as $field) {
        if (empty($estudiante_data[$field])) {
            throw new Exception("Faltan datos obligatorios del estudiante: $field");
        }
    }
    
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
        sector, direccion, telefono, correo, victima_conflicto, registro_victima, 
        centro_proteccion, grupo_etnico, no_hermanos, lugar_que_ocupa, con_quien_vive, 
        quien_apoya_crianza, afiliacion_salud, regimen_salud, id_madre, id_padre, id_acudiente, url_foto
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param(
        "ssssssssssssssisssssiiii",
        $estudiante_data['nombre'], $estudiante_data['apellidos'], $estudiante_data['tipo_documento'], 
        $estudiante_data['no_documento'], $estudiante_data['lugar_nacimiento'], $estudiante_data['fecha_nacimiento'], 
        $estudiante_data['sector'], $estudiante_data['direccion'], $estudiante_data['telefono'], 
        $estudiante_data['correo'], $estudiante_data['victima_conflicto'], 
        $estudiante_data['registro_victima'], $estudiante_data['centro_proteccion'], $estudiante_data['grupo_etnico'], 
        $estudiante_data['no_hermanos'], $estudiante_data['lugar_que_ocupa'], $estudiante_data['con_quien_vive'], 
        $estudiante_data['quien_apoya_crianza'], $estudiante_data['afiliacion_salud'], $estudiante_data['regimen_salud'],
        $id_madre, $id_padre, $id_cuidador, $estudiante_data['url_foto']
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando estudiante: " . $stmt->error);
    }
    $id_estudiante = $conn->insert_id;
    $stmt->close();
    
    $photo_info = null;
    try {
        $photo_path = handlePhotoUpload($id_estudiante);
        if ($photo_path) {
            $stmt = $conn->prepare("UPDATE estudiante SET url_foto = ? WHERE id_estudiante = ?");
            $stmt->bind_param("si", $photo_path, $id_estudiante);
            if (!$stmt->execute()) {
                throw new Exception("Error actualizando ruta de foto: " . $stmt->error);
            }
            $stmt->close();
            $photo_info = "Foto guardada correctamente en " . $photo_path;
        }
    } catch (Exception $photoError) {
        error_log("Error subiendo foto para estudiante $id_estudiante: " . $photoError->getMessage());
        $photo_info = "Error al subir foto: " . $photoError->getMessage();
    }
    
    // STEP 5: Register Educational Environment (resto del código igual...)
    $entorno_data = [
        'ultimo_grado_cursado' => trim($_POST['ultimo_grado_cursado'] ?? ''),
        'vinculado_otra_inst' => trim($_POST['vinculado_otra_inst'] ?? ''),
        'nombre_institucion_anterior' => isset($_POST['nombre_institucion_anterior']) && $_POST['vinculado_otra_inst'] === 'Si' ? trim($_POST['nombre_institucion_anterior']) : null,
        'informe_pedagogico' => intval($_POST['informe_pedagogico'] ?? 0),
        'modalidad_proveniente' => isset($_POST['modalidad_proveniente']) ? trim($_POST['modalidad_proveniente']) : null,
        'asiste_programas_complementarios' => trim($_POST['asiste_programas_complementarios'] ?? ''),
        'detalle_programas_complementarios' => isset($_POST['detalle_programas_complementarios']) && $_POST['asiste_programas_complementarios'] === 'Si' ? trim($_POST['detalle_programas_complementarios']) : null,
        'observacion' => isset($_POST['observacion_entorno']) ? trim($_POST['observacion_entorno']) : null,
        'estado' => 1
    ];

    $required_entorno_fields = ['ultimo_grado_cursado', 'vinculado_otra_inst', 'asiste_programas_complementarios'];
    foreach ($required_entorno_fields as $field) {
        if (empty($entorno_data[$field])) {
            throw new Exception("Faltan datos obligatorios del entorno educativo: $field");
        }
    }

    if ($entorno_data['vinculado_otra_inst'] === 'Si' && empty($entorno_data['nombre_institucion_anterior'])) {
        throw new Exception("Debe especificar el nombre de la institución educativa anterior");
    }

    if ($entorno_data['asiste_programas_complementarios'] === 'Si' && empty($entorno_data['detalle_programas_complementarios'])) {
        throw new Exception("Debe especificar los programas complementarios a los que asiste");
    }

    $observacion_completa = $entorno_data['observacion'];
    if ($entorno_data['nombre_institucion_anterior']) {
        $observacion_completa = ($observacion_completa ? $observacion_completa . ' | ' : '') .
                            'Institución anterior: ' . $entorno_data['nombre_institucion_anterior'];
    }
    if ($entorno_data['detalle_programas_complementarios']) {
        $observacion_completa = ($observacion_completa ? $observacion_completa . ' | ' : '') .
                            'Programas complementarios: ' . $entorno_data['detalle_programas_complementarios'];
    }

    $stmt = $conn->prepare("INSERT INTO entorno_educativo (
        estado, ultimo_grado_cursado, vinculado_otra_inst, informe_pedagogico,
        modalidad_proveniente, asiste_programas_complementarios, observacion, id_estudiante
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param(
        "ississsi",
        $entorno_data['estado'],
        $entorno_data['ultimo_grado_cursado'],
        $entorno_data['vinculado_otra_inst'],
        $entorno_data['informe_pedagogico'],
        $entorno_data['modalidad_proveniente'],
        $entorno_data['asiste_programas_complementarios'],
        $observacion_completa,
        $id_estudiante
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando entorno educativo: " . $stmt->error);
    }
    $id_entorno_educativo = $conn->insert_id;
    $stmt->close();

    if (isset($_POST['id_grupo']) && !empty($_POST['id_grupo'])) {
        $id_grupo = intval($_POST['id_grupo']);
        $anio_actual = date('Y');

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

    $skip_info = [];
    if ($madre_skipped === 'true') {
        $skip_info['madre'] = $_POST['madre_skip_reason_value'] ?? '';
    }
    if ($padre_skipped === 'true') {
        $skip_info['padre'] = $_POST['padre_skip_reason_value'] ?? '';
    }

    return [
        'success' => true,
        'phase' => 1,
        'id_estudiante' => $id_estudiante,
        'id_entorno_educativo' => $id_entorno_educativo,
        'message' => 'Estudiante, familia y entorno educativo registrados exitosamente. Ahora puede proceder con la descripción general.',
        'skip_info' => $skip_info,
        'photo_info' => $photo_info,
        'data' => [
            'id_madre' => $id_madre,
            'id_padre' => $id_padre,
            'id_acudiente' => $id_cuidador,
            'id_entorno_educativo' => $id_entorno_educativo,
            'nombre_completo' => $estudiante_data['nombre'] . ' ' . $estudiante_data['apellidos']
        ]
    ];
}

function registerDescription($conn) {
    // Esta función permanece igual que en el original
    $id_estudiante = intval($_POST['id_estudiante'] ?? 0);
    
    if (!$id_estudiante) {
        throw new Exception("ID de estudiante requerido para registrar descripción");
    }
    
    $stmt = $conn->prepare("SELECT nombre, apellidos FROM estudiante WHERE id_estudiante = ?");
    $stmt->bind_param("i", $id_estudiante);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("El estudiante especificado no existe");
    }
    $student = $result->fetch_assoc();
    $stmt->close();
    
    $descriptions = [
        'capacidades' => trim($_POST['capacidades'] ?? ''),
        'gustos_intereses' => trim($_POST['gustos_intereses'] ?? ''),
        'expectativas_estudiante' => trim($_POST['expectativas_estudiante'] ?? ''),
        'expectativas_familia' => trim($_POST['expectativas_familia'] ?? ''),
        'red_apoyo' => trim($_POST['red_apoyo'] ?? ''),
        'otra_descripcion' => trim($_POST['otra_descripcion'] ?? '')
    ];
    
    foreach ($descriptions as $key => $value) {
        if (empty($value)) {
            throw new Exception("Faltan datos obligatorios en la descripción: $key");
        }
    }
    
    $stmt = $conn->prepare("SELECT id_descripcion_general FROM descripcion_general WHERE id_estudiante = ?");
    $stmt->bind_param("i", $id_estudiante);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        throw new Exception("Ya existe una descripción general para este estudiante");
    }
    $stmt->close();
    
    $description_ids = [];
    
    $stmt = $conn->prepare("INSERT INTO capacidad (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['capacidades']);
    if (!$stmt->execute()) throw new Exception("Error insertando capacidad: " . $stmt->error);
    $description_ids['capacidad'] = $conn->insert_id;
    $stmt->close();
    
    $stmt = $conn->prepare("INSERT INTO gusto_interes (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['gustos_intereses']);
    if (!$stmt->execute()) throw new Exception("Error insertando gusto_interes: " . $stmt->error);
    $description_ids['gusto_interes'] = $conn->insert_id;
    $stmt->close();
    
    $stmt = $conn->prepare("INSERT INTO expectativa (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['expectativas_estudiante']);
    if (!$stmt->execute()) throw new Exception("Error insertando expectativa: " . $stmt->error);
    $description_ids['expectativa'] = $conn->insert_id;
    $stmt->close();
    
    $stmt = $conn->prepare("INSERT INTO expectativa_familia (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['expectativas_familia']);
    if (!$stmt->execute()) throw new Exception("Error insertando expectativa_familia: " . $stmt->error);
    $description_ids['expectativa_familia'] = $conn->insert_id;
    $stmt->close();
    
    $stmt = $conn->prepare("INSERT INTO red_apoyo (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['red_apoyo']);
    if (!$stmt->execute()) throw new Exception("Error insertando red_apoyo: " . $stmt->error);
    $description_ids['red_apoyo'] = $conn->insert_id;
    $stmt->close();
    
    $stmt = $conn->prepare("INSERT INTO otra_descripcion (descripcion) VALUES (?)");
    $stmt->bind_param("s", $descriptions['otra_descripcion']);
    if (!$stmt->execute()) throw new Exception("Error insertando otra_descripcion: " . $stmt->error);
    $description_ids['otra_descripcion'] = $conn->insert_id;
    $stmt->close();
    
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