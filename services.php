<?php
// php/get_services.php
// Ambil daftar layanan berdasarkan game

require_once 'config.php';

$game = isset($_GET['game']) ? $_GET['game'] : '';
$allowed = ['wuthering_waves', 'genshin_impact'];

if (!in_array($game, $allowed)) {
    echo json_encode(['success' => false, 'message' => 'Game tidak valid']);
    exit;
}

$conn = getDB();
$stmt = $conn->prepare("SELECT * FROM services WHERE game = ? AND is_active = 1 ORDER BY id ASC");
$stmt->bind_param('s', $game);
$stmt->execute();
$result = $stmt->get_result();

$services = [];
while ($row = $result->fetch_assoc()) {
    $services[] = $row;
}

echo json_encode(['success' => true, 'data' => $services]);
$conn->close();