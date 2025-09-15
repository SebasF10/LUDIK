<?php
// debug_obtener_grupos.php - Archivo temporal para depuración
session_start();
header('Content-Type: application/json');

// Información completa de depuración
$debug_info = [
    'session_status' => session_status(),
    'session_id' => session_id(),
    'session_data' => $_SESSION,
    'post_data' => $_POST,
    'get_data' => $_GET,
    'server_method' => $_SERVER['REQUEST_METHOD'],
    'cookies' => $_COOKIE,
    'headers' => getallheaders(),
    'php_session_id' => session_id()
];

// Verificaciones específicas
$checks = [
    'session_exists' => isset($_SESSION),
    'session_not_empty' => !empty($_SESSION),
    'usuario_exists' => isset($_SESSION['usuario']),
    'rol_exists' => isset($_SESSION['rol']),
    'id_docente_exists' => isset($_SESSION['usuario']['id_docente']),
    'rol_is_docente' => isset($_SESSION['rol']) && $_SESSION['rol'] === 'docente'
];

// Condición actual del código original
$original_condition = isset($_SESSION['usuario']['id_docente']) && 
                      isset($_SESSION['rol']) && 
                      $_SESSION['rol'] === 'docente';

echo json_encode([
    'debug_info' => $debug_info,
    'checks' => $checks,
    'original_condition_passes' => $original_condition,
    'timestamp' => date('Y-m-d H:i:s')
], JSON_PRETTY_PRINT);
?>