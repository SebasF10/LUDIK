<?php
// Conexión a la base de datos con PDO
$host = "localhost";
$db   = "ludick";   // 👈 nombre correcto de tu base de datos
$user = "root";
$pass = "";
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("Error en la conexión: " . $e->getMessage());
}
// Verificar si llegó el rol
if (!isset($_POST['rol'])) {
    die("Error: Rol no especificado.");
}

$rol = $_POST['rol'];

switch ($rol) {
    case "admin":
        $sql = "INSERT INTO admin (nombre, email, contrasena) 
                VALUES (:nombre, :email, :contrasena)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nombre' => $_POST['nombre'],
            ':email' => $_POST['email'],
            ':contrasena' => password_hash($_POST['contrasena'], PASSWORD_BCRYPT),
        ]);
        echo "Cuenta de administrador creada correctamente.";
        break;

    case "profesor":
        $sql = "INSERT INTO docente (nombre, apellidos, correo, doc_identidad, contraseña, id_sede, id_materia) 
                VALUES (:nombre, :apellidos, :correo, :doc_identidad, :contrasena, :id_sede, :id_materia)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nombre'        => $_POST['nombre'],
            ':apellidos'     => $_POST['apellidos'],
            ':correo'        => $_POST['correo'],
            ':doc_identidad' => $_POST['doc_identidad'],
            ':contrasena'    => password_hash($_POST['contrasena'], PASSWORD_BCRYPT),
            ':id_sede'       => $_POST['id_sede'],
            ':id_materia'    => $_POST['id_materia'],
        ]);
        echo "Cuenta de profesor creada correctamente.";
        break;

    case "acudiente":
        $sql = "INSERT INTO cuidador (nombre_completo, nivel_educativo, parentesco, email, telefono, contrasena) 
                VALUES (:nombre, :nivel, :parentesco, :email, :telefono, :contrasena)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nombre'    => $_POST['nombre_completo'],
            ':nivel'     => $_POST['nivel_educativo'],
            ':parentesco'=> $_POST['parentesco'],
            ':email'     => $_POST['email'],
            ':telefono'  => $_POST['telefono'],
            ':contrasena'=> password_hash($_POST['contrasena'], PASSWORD_BCRYPT),
        ]);
        echo "Cuenta de acudiente creada correctamente.";
        break;

    default:
        echo "Rol inválido.";
}
