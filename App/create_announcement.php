<?php
// Basic CORS + JSON headers (dev)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Error logging to file (useful for debugging)
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/php-error.log');
error_reporting(E_ALL);

// DB connect
$host = '192.168.157.2';
$user = 'studenthousing';
$pass = 'P@ssword';
$db   = 'studenthousing_db';
$port = 3306;

$link = mysqli_connect($host, $user, $pass, $db, $port);
if (!$link) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Connectie mislukt: ' . mysqli_connect_error()]);
    exit;
}
mysqli_set_charset($link, 'utf8mb4');

// Parse input JSON
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Geen JSON body ontvangen']);
    exit;
}

// Required fields
$titel = isset($input['titel']) ? trim($input['titel']) : '';
$bericht = isset($input['bericht']) ? trim($input['bericht']) : '';
$prioriteit = isset($input['prioriteit']) ? $input['prioriteit'] : '';
$gebouw = isset($input['gebouw']) ? trim($input['gebouw']) : '';
$gebruiker_id = isset($input['gebruiker_id']) ? (int)$input['gebruiker_id'] : 0;

if ($titel === '' || $bericht === '' || !in_array($prioriteit, ['laag','normaal','hoog']) || $gebruiker_id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Ongeldige of ontbrekende velden']);
    exit;
}

// Prepared insert
$sql = "INSERT INTO announcement (titel, bericht, prioriteit, gebouw, gebruiker_id) VALUES (?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($link, $sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB prepare failed: ' . mysqli_error($link)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "ssssi", $titel, $bericht, $prioriteit, $gebouw, $gebruiker_id);
$ok = mysqli_stmt_execute($stmt);

if (!$ok) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Insert failed: ' . mysqli_stmt_error($stmt)]);
    mysqli_stmt_close($stmt);
    mysqli_close($link);
    exit;
}

$insert_id = mysqli_insert_id($link);
mysqli_stmt_close($stmt);
mysqli_close($link);

echo json_encode(['success' => true, 'announcement_id' => (int)$insert_id], JSON_UNESCAPED_UNICODE);
