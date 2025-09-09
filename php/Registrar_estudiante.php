<?php
// filepath: c:\xampp\htdocs\LUDIK\php\registrar_estudiante.php

// Iniciar sesión
session_start();

// Conectar a la base de datos
$servername = "localhost";
$username = "root"; // Cambiar según la configuración de tu base de datos
$password = ""; // Cambiar según la configuración de tu base de datos
$dbname = "ludik"; // Nombre de la base de datos

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Procesar el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Registrar Madre
    $madre_nombre = $_POST['madre_nombre'];
    $madre_nivel = $_POST['madre_nivel'];
    $madre_ocupacion = $_POST['madre_ocupacion'];
    $madre_email = $_POST['madre_email'];
    $madre_contrasena = $_POST['madre_contrasena'];

    $stmt = $conn->prepare("INSERT INTO madre (nombre_completo, nivel_educativo, ocupacion, email, contrasena) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $madre_nombre, $madre_nivel, $madre_ocupacion, $madre_email, $madre_contrasena);
    $stmt->execute();
    $id_madre = $stmt->insert_id;
    $stmt->close();

    // 2. Registrar Padre
    $padre_nombre = $_POST['padre_nombre'];
    $padre_nivel = $_POST['padre_nivel'];
    $padre_ocupacion = $_POST['padre_ocupacion'];
    $padre_email = $_POST['padre_email'];
    $padre_contrasena = $_POST['padre_contrasena'];

    $stmt = $conn->prepare("INSERT INTO padre (nombre_completo, nivel_educativo, ocupacion, email, contrasena) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $padre_nombre, $padre_nivel, $padre_ocupacion, $padre_email, $padre_contrasena);
    $stmt->execute();
    $id_padre = $stmt->insert_id;
    $stmt->close();

    // 3. Registrar Cuidador
    $cuidador_nombre = $_POST['cuidador_nombre'];
    $cuidador_parentesco = $_POST['cuidador_parentesco'];
    $cuidador_nivel = $_POST['cuidador_nivel'];
    $cuidador_ocupacion = $_POST['cuidador_ocupacion'];
    $cuidador_email = $_POST['cuidador_email'];
    $cuidador_contrasena = $_POST['cuidador_contrasena'];
    $cuidador_telefono = $_POST['cuidador_telefono'];

    $stmt = $conn->prepare("INSERT INTO acudiente (nombre_completo, nivel_educativo, parentesco, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $cuidador_nombre, $cuidador_nivel, $cuidador_parentesco, $cuidador_email, $cuidador_telefono, $cuidador_contrasena);
    $stmt->execute();
    $id_cuidador = $stmt->insert_id;
    $stmt->close();

    // 4. Registrar Estudiante
    $estudiante_nombre = $_POST['estudiante_nombre'];
    $estudiante_apellidos = $_POST['estudiante_apellidos'];
    $tipo_documento = $_POST['tipo_documento'];
    $no_documento = $_POST['no_documento'];
    $lugar_nacimiento = $_POST['lugar_nacimiento'];
    $fecha_nacimiento = $_POST['fecha_nacimiento'];
    $sector = $_POST['sector'];
    $direccion = $_POST['direccion'];
    $telefono = $_POST['telefono'];
    $correo = $_POST['correo'];
    $contrasena = $_POST['contrasena'];
    $victima_conflicto = $_POST['victima_conflicto'];
    $victima_tipo = isset($_POST['victima_tipo']) ? $_POST['victima_tipo'] : null;
    $registro_victima = $_POST['registro_victima'];
    $centro_proteccion = $_POST['centro_proteccion'];
    $grupo_etnico = $_POST['grupo_etnico'];
    $etnico_tipo = isset($_POST['etnico_tipo']) ? $_POST['etnico_tipo'] : null;
    $no_hermanos = $_POST['no_hermanos'];
    $lugar_que_ocupa = $_POST['lugar_que_ocupa'];
    $con_quien_vive = $_POST['con_quien_vive'];
    $quien_apoya_crianza = $_POST['quien_apoya_crianza'];
    $afiliacion_salud = $_POST['afiliacion_salud'];

    $stmt = $conn->prepare("INSERT INTO estudiante (
        nombre, apellidos, tipo_documento, no_documento, lugar_nacimiento, fecha_nacimiento, sector, direccion, telefono, correo, contrasena, victima_conflicto, registro_victima, centro_proteccion, grupo_etnico, no_hermanos, lugar_que_ocupa, con_quien_vive, quien_apoya_crianza, afiliacion_salud, id_madre, id_padre, id_cuidador
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "ssssssssssssssssssssiii",
        $estudiante_nombre,
        $estudiante_apellidos,
        $tipo_documento,
        $no_documento,
        $lugar_nacimiento,
        $fecha_nacimiento,
        $sector,
        $direccion,
        $telefono,
        $correo,
        $contrasena,
        $victima_conflicto,
        $registro_victima,
        $centro_proteccion,
        $grupo_etnico,
        $no_hermanos,
        $lugar_que_ocupa,
        $con_quien_vive,
        $quien_apoya_crianza,
        $afiliacion_salud,
        $id_madre,
        $id_padre,
        $id_cuidador
    );
    if ($stmt->execute()) {
        echo "<script>alert('Registro exitoso');window.location='../Registrar_estudiante.html';</script>";
    } else {
        echo "Error al registrar estudiante: " . $stmt->error;
    }
    $stmt->close();
}

$conn->close();
?>