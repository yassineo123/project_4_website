<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");


$host = '192.168.157.2'; // of 'localhost' of IP van je DB-server
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

$query = "SELECT announcement_id, titel, bericht, prioriteit, gebouw, gebruiker_id FROM announcement LIMIT 10";
$result = mysqli_query($link, $query);

$data = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
    mysqli_free_result($result);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(['error' => mysqli_error($link)]);
}

mysqli_close($link);
