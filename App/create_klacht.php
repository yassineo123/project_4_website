<?php
// CORS + JSON headers
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

// Preflight voor POST
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// DB connectie
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

// JSON body lezen
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Geen geldige JSON ontvangen']);
    exit;
}

$klacht = isset($input['klacht']) ? trim($input['klacht']) : '';
$gebruiker_id = isset($input['gebruiker_id']) ? (int)$input['gebruiker_id'] : 0;

if ($klacht === '' || $gebruiker_id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Ongeldige of ontbrekende velden']);
    exit;
}

// Prepared insert
$sql = "INSERT INTO klacht (klacht, datum, gebruiker_id) VALUES (?, CURDATE(), ?)";
$stmt = mysqli_prepare($link, $sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB prepare failed: ' . mysqli_error($link)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "si", $klacht, $gebruiker_id);
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

echo json_encode(['success' => true, 'klacht_id' => (int)$insert_id], JSON_UNESCAPED_UNICODE);
