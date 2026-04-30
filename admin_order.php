<?php
// php/admin_order.php
// Lihat & update status pesanan (simple admin)

require_once 'config.php';

// Update status jika ada request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_status') {
    $id     = intval($_POST['id']);
    $status = in_array($_POST['status'], ['pending','proses','selesai','dibatalkan']) ? $_POST['status'] : 'pending';
    $conn   = getDB();
    $stmt   = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->bind_param('si', $status, $id);
    $stmt->execute();
    echo json_encode(['success' => true]);
    exit;
}

// Ambil semua pesanan
$conn   = getDB();
$result = $conn->query("SELECT * FROM orders ORDER BY created_at DESC");
$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode(['success' => true, 'data' => $orders, 'total' => count($orders)]);
$conn->close();