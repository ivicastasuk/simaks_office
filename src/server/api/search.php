<?php
header('Content-Type: application/json; charset=utf-8');

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

$query = isset($_GET['q']) ? $_GET['q'] : '';
$table = isset($_GET['table']) ? $_GET['table'] : '';

if (empty($query) || empty($table)) {
    echo json_encode([]);
    exit;
}

// Allowed tables for search (as a safety measure to prevent SQL injection)
$allowedTables = ['products', 'clients'];
if (!in_array($table, $allowedTables)) {
    echo json_encode(['success' => false, 'message' => 'Invalid table']);
    exit;
}

$servername = "localhost:3307";
$dbUsername = "liridenet";
$dbPassword = "liridenetns";
$dbname = "simaks_office";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

if ($conn->connect_error) {
    error_log('Database connection failed: ' . $conn->connect_error);
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
    exit;
}

if (!$conn->set_charset("utf8mb4")) {
    error_log('Error loading character set utf8mb4: ' . $conn->error);
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
    exit;
}

$searchQuery = '%' . $query . '%';

// Dynamic SQL statement based on table
if ($table === 'products') {
    $stmt = $conn->prepare("SELECT id, code, name, model, img_url, price, type, manufacturer, description, items, unit FROM products WHERE code COLLATE utf8mb4_general_ci LIKE ? OR name COLLATE utf8mb4_general_ci LIKE ? OR model COLLATE utf8mb4_general_ci LIKE ?");
} else if ($table === 'clients') {
    $stmt = $conn->prepare("SELECT id, name, address, city, pib, mb FROM clients WHERE name COLLATE utf8mb4_general_ci LIKE ? OR city COLLATE utf8mb4_general_ci LIKE ? OR pib COLLATE utf8mb4_general_ci LIKE ?");
}

$stmt->bind_param("sss", $searchQuery, $searchQuery, $searchQuery);
$stmt->execute();
$result = $stmt->get_result();

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

echo json_encode($rows, JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();
?>