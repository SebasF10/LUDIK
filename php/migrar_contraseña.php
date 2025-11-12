<?php
/**
 * SCRIPT DE MIGRACIÓN DE CONTRASEÑAS
 * 
 * Este script encripta todas las contraseñas en texto plano de la base de datos.
 * 
 * INSTRUCCIONES:
 * 1. Subir este archivo al servidor
 * 2. Ejecutarlo UNA SOLA VEZ desde el navegador
 * 3. ELIMINAR este archivo después de ejecutarlo por seguridad
 * 
 * IMPORTANTE: Hacer backup de la base de datos antes de ejecutar
 */

// Configuración de seguridad: cambiar este token por uno aleatorio
define('MIGRATION_TOKEN', 'ed5c4596-11a3-4975-acdb-0f6a7d2b16fb');

// Verificar token de seguridad
if (!isset($_GET['token']) || $_GET['token'] !== MIGRATION_TOKEN) {
    die('❌ Acceso denegado. Token inválido.');
}

require_once 'conexion.php';

// Configuración
set_time_limit(300); // 5 minutos
$conn = $conexion;

// Función para verificar si una contraseña ya está encriptada
function isPasswordHashed($password) {
    // Los hashes de password_hash() siempre comienzan con $2y$ (bcrypt)
    return preg_match('/^\$2[ayb]\$.{56}$/i', $password);
}

// Función para migrar contraseñas de una tabla
function migrateTablePasswords($conn, $tableName, $idField, $passwordField) {
    $results = [
        'table' => $tableName,
        'total' => 0,
        'migrated' => 0,
        'already_hashed' => 0,
        'empty' => 0,
        'errors' => []
    ];
    
    try {
        // Obtener todos los registros
        $query = "SELECT $idField, $passwordField FROM $tableName";
        $result = $conn->query($query);
        
        if (!$result) {
            throw new Exception("Error consultando $tableName: " . $conn->error);
        }
        
        $results['total'] = $result->num_rows;
        
        while ($row = $result->fetch_assoc()) {
            $id = $row[$idField];
            $password = $row[$passwordField];
            
            // Saltar contraseñas vacías
            if (empty($password)) {
                $results['empty']++;
                continue;
            }
            
            // Verificar si ya está encriptada
            if (isPasswordHashed($password)) {
                $results['already_hashed']++;
                continue;
            }
            
            // Encriptar contraseña
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            
            // Actualizar en la base de datos
            $stmt = $conn->prepare("UPDATE $tableName SET $passwordField = ? WHERE $idField = ?");
            if (!$stmt) {
                $results['errors'][] = "Error preparando statement para ID $id: " . $conn->error;
                continue;
            }
            
            $stmt->bind_param("si", $hashedPassword, $id);
            
            if ($stmt->execute()) {
                $results['migrated']++;
            } else {
                $results['errors'][] = "Error actualizando ID $id: " . $stmt->error;
            }
            
            $stmt->close();
        }
        
        $result->free();
        
    } catch (Exception $e) {
        $results['errors'][] = $e->getMessage();
    }
    
    return $results;
}

// HTML Header
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Migración de Contraseñas</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 40px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #4CAF50;
            padding-bottom: 10px;
        }
        .table-result {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #2196F3;
            border-radius: 4px;
        }
        .table-result h3 {
            margin-top: 0;
            color: #2196F3;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin: 15px 0;
        }
        .stat {
            padding: 10px;
            background: white;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
        .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
        }
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .success { color: #4CAF50; }
        .warning { color: #FF9800; }
        .error { color: #f44336; }
        .info { color: #2196F3; }
        .errors {
            background: #ffebee;
            border-left: 4px solid #f44336;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .errors h4 {
            margin-top: 0;
            color: #f44336;
        }
        .summary {
            background: #e8f5e9;
            border-left: 4px solid #4CAF50;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .warning-box {
            background: #fff3cd;
            border: 2px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Migración de Contraseñas a Formato Encriptado</h1>
        
        <div class="warning-box">
            <strong>⚠️ IMPORTANTE:</strong> Este script debe ejecutarse UNA SOLA VEZ y luego ELIMINARSE del servidor.
        </div>

<?php

// Iniciar migración
echo "<h2>Iniciando migración...</h2>";

// Array de tablas a migrar
$tables = [
    ['name' => 'admin', 'id' => 'id_admin', 'password' => 'contrasena'],
    ['name' => 'docente', 'id' => 'id_docente', 'password' => 'contrasena'],
    ['name' => 'docente_apoyo', 'id' => 'id_docente_apoyo', 'password' => 'contrasena'],
    ['name' => 'directivo', 'id' => 'id_directivo', 'password' => 'contrasena'],
    ['name' => 'acudiente', 'id' => 'id_acudiente', 'password' => 'contrasena'],
    ['name' => 'madre', 'id' => 'id_madre', 'password' => 'contrasena'],
    ['name' => 'padre', 'id' => 'id_padre', 'password' => 'contrasena']
];

$totalResults = [
    'total_records' => 0,
    'total_migrated' => 0,
    'total_already_hashed' => 0,
    'total_empty' => 0,
    'total_errors' => 0
];

// Migrar cada tabla
foreach ($tables as $table) {
    $result = migrateTablePasswords($conn, $table['name'], $table['id'], $table['password']);
    
    // Acumular totales
    $totalResults['total_records'] += $result['total'];
    $totalResults['total_migrated'] += $result['migrated'];
    $totalResults['total_already_hashed'] += $result['already_hashed'];
    $totalResults['total_empty'] += $result['empty'];
    $totalResults['total_errors'] += count($result['errors']);
    
    // Mostrar resultados de la tabla
    echo "<div class='table-result'>";
    echo "<h3>📋 Tabla: {$result['table']}</h3>";
    echo "<div class='stats'>";
    echo "<div class='stat'><div class='stat-label'>Total Registros</div><div class='stat-value info'>{$result['total']}</div></div>";
    echo "<div class='stat'><div class='stat-label'>Migradas</div><div class='stat-value success'>{$result['migrated']}</div></div>";
    echo "<div class='stat'><div class='stat-label'>Ya Encriptadas</div><div class='stat-value warning'>{$result['already_hashed']}</div></div>";
    echo "<div class='stat'><div class='stat-label'>Vacías</div><div class='stat-value'>{$result['empty']}</div></div>";
    echo "</div>";
    
    if (!empty($result['errors'])) {
        echo "<div class='errors'>";
        echo "<h4>❌ Errores encontrados:</h4>";
        echo "<ul>";
        foreach ($result['errors'] as $error) {
            echo "<li>" . htmlspecialchars($error) . "</li>";
        }
        echo "</ul>";
        echo "</div>";
    }
    
    echo "</div>";
}

// Resumen final
echo "<div class='summary'>";
echo "<h2>✅ Resumen de Migración</h2>";
echo "<div class='stats'>";
echo "<div class='stat'><div class='stat-label'>Total Registros</div><div class='stat-value info'>{$totalResults['total_records']}</div></div>";
echo "<div class='stat'><div class='stat-label'>Contraseñas Migradas</div><div class='stat-value success'>{$totalResults['total_migrated']}</div></div>";
echo "<div class='stat'><div class='stat-label'>Ya Encriptadas</div><div class='stat-value warning'>{$totalResults['total_already_hashed']}</div></div>";
echo "<div class='stat'><div class='stat-label'>Vacías</div><div class='stat-value'>{$totalResults['total_empty']}</div></div>";
echo "<div class='stat'><div class='stat-label'>Errores</div><div class='stat-value error'>{$totalResults['total_errors']}</div></div>";
echo "</div>";

if ($totalResults['total_migrated'] > 0) {
    echo "<p class='success'><strong>✅ Migración completada exitosamente.</strong></p>";
} else {
    echo "<p class='warning'><strong>⚠️ No se migraron contraseñas (todas ya estaban encriptadas o vacías).</strong></p>";
}

echo "</div>";

// Instrucciones finales
?>
        <div class="warning-box">
            <h3>📋 Siguientes pasos:</h3>
            <ol>
                <li>Verificar que todo funciona correctamente probando el login</li>
                <li><strong>ELIMINAR este archivo</strong> (<span class="code">migrar_contraseñas.php</span>) del servidor</li>
                <li>Asegurarse de que los archivos actualizados estén en producción:
                    <ul>
                        <li><span class="code">Crear_cuentas.php</span></li>
                        <li><span class="code">Login.php</span></li>
                        <li><span class="code">Registrar_estudiante.php</span></li>
                    </ul>
                </li>
            </ol>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 4px;">
            <p><strong>ℹ️ Nota técnica:</strong></p>
            <ul>
                <li>Las contraseñas ahora usan <span class="code">bcrypt</span> (PASSWORD_DEFAULT)</li>
                <li>Cada hash es único incluso para contraseñas idénticas</li>
                <li>El sistema de login maneja automáticamente contraseñas antiguas durante la transición</li>
                <li>Después de 1-2 semanas, todas las contraseñas estarán encriptadas</li>
            </ul>
        </div>
    </div>
</body>
</html>
<?php

$conn->close();
?>