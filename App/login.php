<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

$host = '192.168.157.2';
$user = 'studenthousing';
$pass = 'P@ssword';
$db   = 'studenthousing_db';
$port = 3306;

$link = mysqli_connect($host, $user, $pass, $db, $port);
if (!$link) {
    http_response_code(500);
    echo json_encode(['error' => 'Connectie mislukt: ' . mysqli_connect_error()]);
    exit;
}
mysqli_set_charset($link, 'utf8mb4');

// Verwacht JSON body (fetch POST JSON)
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['gebruikersnaam']) || !isset($input['wachtwoord'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Ongeldige request']);
    exit;
}

$gebruikersnaam = $input['gebruikersnaam'];
$wachtwoord = $input['wachtwoord'];

// Prepared statement: zoek gebruiker op gebruikersnaam
$sql = "SELECT gebruiker_id, gebruikersnaam, wachtwoord, rol FROM gebruiker WHERE gebruikersnaam = ? LIMIT 1";
$stmt = mysqli_prepare($link, $sql);
mysqli_stmt_bind_param($stmt, "s", $gebruikersnaam);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    $hash = $row['wachtwoord']; // opgeslagen hash in DB
    if (password_verify($wachtwoord, $hash)) {
        // Succes: geef gebruiker terug zonder wachtwoord
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
