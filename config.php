<?php
// php/config.php
// Konfigurasi Database

error_reporting(E_ALL);
ini_set('display_errors', '0');
mysqli_report(MYSQLI_REPORT_OFF);

define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // Ganti dengan username MySQL Anda
define('DB_PASS', '');            // Ganti dengan password MySQL Anda
define('DB_NAME', 'yasshiro_game');

// Header CORS & JSON
if (!headers_sent()) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

// Koneksi database
function getDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        if (!headers_sent()) {
            header('Content-Type: application/json');
        }
        echo json_encode(['success' => false, 'message' => 'Koneksi database gagal. Mohon cek pengaturan database.']);
        exit;
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}