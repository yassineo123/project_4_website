<?php
$host = '192.168.157.2';
$user = 'studenthousing';
$pass = 'P@ssword';
$db   = 'studenthousing_db';
$port = 3306;

$conn = mysqli_connect($host, $user, $pass, $db, $port);
if (!$conn) { die("DB connect error"); }

$gebruikersnaam = 'testuser';
$plain          = 'testpass';
$hash           = password_hash($plain, PASSWORD_DEFAULT);
$rol            = 'student';

$sql = "INSERT INTO gebruiker (gebruikersnaam, wachtwoord, rol) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "sss", $gebruikersnaam, $hash, $rol);
mysqli_stmt_execute($stmt);

echo "User created with ID: " . mysqli_insert_id($conn);
