<?php
// Conexión a la base de datos con PDO
$host = "localhost";
$db   = "ludik";   // 👈 nombre correcto de tu base de datos
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
            ':contrasena' => ($_POST['contrasena']),
        ]);
        echo "Cuenta de administrador creada correctamente.";
        break;

    case "docente":
        try {
            // Iniciar transacción
            $pdo->beginTransaction();
            
            // Crear docente
            $sql = "INSERT INTO docente (nombre_completo, email, contrasena, telefono, es_director) 
                    VALUES (:nombre, :email, :contrasena, :telefono, :es_director)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':nombre'     => $_POST['nombre'],
                ':email'      => $_POST['email'],
                ':contrasena' => $_POST['contrasena'],
                ':telefono'   => $_POST['telefono'],
                ':es_director'=> $_POST['es_director'],
            ]);
            $id_docente = $pdo->lastInsertId();

            // Procesar grupos seleccionados y sus asignaturas
            if (!empty($_POST['grupos_seleccionados'])) {
                foreach ($_POST['grupos_seleccionados'] as $id_grupo) {
                    // Verificar si hay asignaturas seleccionadas para este grupo
                    $campo_asignaturas = "asignaturas_grupo_" . $id_grupo;
                    
                    if (!empty($_POST[$campo_asignaturas])) {
                        foreach ($_POST[$campo_asignaturas] as $id_asignatura) {
                            $sql2 = "INSERT INTO asignatura_docente_grupo (id_docente, id_grupo, id_asignatura, anio) 
                                     VALUES (:id_docente, :id_grupo, :id_asignatura, :anio)";
                            $stmt2 = $pdo->prepare($sql2);
                            $stmt2->execute([
                                ':id_docente'   => $id_docente,
                                ':id_grupo'     => $id_grupo,
                                ':id_asignatura'=> $id_asignatura,
                                ':anio'         => date('Y')
                            ]);
                        }
                    }
                }
            }

            // Si es director, guardar el grupo en docente_grupo con el año actual
            if (isset($_POST['es_director']) && $_POST['es_director'] == "1" && !empty($_POST['grupo_director'])) {
                $anio_actual = date('Y');
                $sql3 = "INSERT INTO docente_grupo (id_docente, id_grupo, anio) VALUES (:id_docente, :id_grupo, :anio)";
                $stmt3 = $pdo->prepare($sql3);
                $stmt3->execute([
                    ':id_docente' => $id_docente,
                    ':id_grupo'   => $_POST['grupo_director'],
                    ':anio'       => $anio_actual,
                ]);
            }

            // Confirmar transacción
            $pdo->commit();
            echo "Cuenta de docente creada correctamente.";
            
        } catch (Exception $e) {
            // Revertir transacción en caso de error
            $pdo->rollback();
            echo "Error al crear la cuenta del docente: " . $e->getMessage();
        }
        break;

    case "directivos":
        $sql = "INSERT INTO directivo (nombre, cargo, email, contrasena) 
                VALUES (:nombre, :cargo, :email, :contrasena)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nombre'    => $_POST['nombre'],
            ':cargo'     => $_POST['cargo'],
            ':email'     => $_POST['email'],
            ':contrasena'=> ($_POST['contrasena']),
        ]);
        echo "Cuenta de directivo creada correctamente.";
        break;

    default:
        echo "Rol inválido.";
}
?>