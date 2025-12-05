<?php
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/php-error.log');
error_reporting(E_ALL);

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Connectie
    $host = '192.168.157.2';
    $user = 'studenthousing';
    $pass = 'P@ssword';
    $db   = 'studenthousing_db';
    $port = 3306;

    $link = mysqli_connect($host, $user, $pass, $db, $port);
    if (!$link) {
        http_response_code(500);
        echo json_encode(['success'=>false,'error' => 'Connectie mislukt: ' . mysqli_connect_error()]);
        exit;
    }
    mysqli_set_charset($link, 'utf8mb4');

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['gebruikersnaam']) || !isset($input['wachtwoord'])) {
        http_response_code(400);
        echo json_encode(['success'=>false,'error' => 'Ongeldige request']);
        exit;
    }

    $gebruikersnaam = $input['gebruikersnaam'];
    $wachtwoord = $input['wachtwoord'];

    $sql = "SELECT gebruiker_id, gebruikersnaam, wachtwoord, rol FROM gebruiker WHERE gebruikersnaam = ? LIMIT 1";
    $stmt = mysqli_prepare($link, $sql);
    if (!$stmt) {
        throw new Exception('DB prepare failed: '.mysqli_error($link));
    }
    mysqli_stmt_bind_param($stmt, "s", $gebruikersnaam);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        $hash = $row['wachtwoord'];
        if (password_verify($wachtwoord, $hash)) {
            $user = [
                'gebruiker_id' => (int)$row['gebruiker_id'],
                'gebruikersnaam' => $row['gebruikersnaam'],
                'rol' => $row['rol']
            ];
            echo json_encode(['success' => true, 'user' => $user], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Onjuist wachtwoord']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Gebruiker niet gevonden']);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($link);
} catch (Exception $e) {
    // Log en return JSON fout
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['success'=>false,'error'=>'Server error']);
}
