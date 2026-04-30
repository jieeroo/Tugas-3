<?php
// php/kirim_pesanan.php
// Simpan pesanan baru ke database

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    $data = $_POST;
}

// Validasi field wajib
$required = ['nama_pelanggan', 'whatsapp', 'game', 'layanan', 'target', 'akun_game', 'password_game', 'harga'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => "Field '$field' wajib diisi"]);
        exit;
    }
}

// Sanitasi input
$nama       = htmlspecialchars(strip_tags(trim($data['nama_pelanggan'])));
$wa         = htmlspecialchars(strip_tags(trim($data['whatsapp'])));
$game       = in_array($data['game'], ['wuthering_waves', 'genshin_impact']) ? $data['game'] : '';
$layanan    = htmlspecialchars(strip_tags(trim($data['layanan'])));
$target     = htmlspecialchars(strip_tags(trim($data['target'])));
$akun       = htmlspecialchars(strip_tags(trim($data['akun_game'])));
$pass       = htmlspecialchars(strip_tags(trim($data['password_game'])));
$server     = isset($data['server']) ? htmlspecialchars(strip_tags(trim($data['server']))) : null;
$catatan    = isset($data['catatan']) ? htmlspecialchars(strip_tags(trim($data['catatan']))) : null;
$harga      = floatval($data['harga']);

if (empty($game)) {
    echo json_encode(['success' => false, 'message' => 'Game tidak valid']);
    exit;
}

$conn = getDB();
$stmt = $conn->prepare("
    INSERT INTO orders (nama_pelanggan, whatsapp, game, layanan, target, akun_game, password_game, server, catatan, harga)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param('sssssssssd', $nama, $wa, $game, $layanan, $target, $akun, $pass, $server, $catatan, $harga);

if ($stmt->execute()) {
    $order_id = $conn->insert_id;
    echo json_encode([
        'success' => true,
        'message' => 'Pesanan berhasil dikirim!',
        'order_id' => $order_id
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan pesanan: ' . $conn->error]);
}

$conn->close();