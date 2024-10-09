<?php
header('Content-Type: application/json; charset=utf-8');

// Disable error display for production
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

// Get the query parameter from URL
$query = isset($_GET['q']) ? $_GET['q'] : '';

if (empty($query)) {
    echo json_encode([]);
    exit;
}

// Database connection parameters
$servername = "localhost:3307";
$dbUsername = "liridenet";
$dbPassword = "liridenetns";
$dbname = "simaks_office";

// Create connection
$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

// Check connection
if ($conn->connect_error) {
    error_log('Database connection failed: ' . $conn->connect_error);
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Set character set to utf8mb4
if (!$conn->set_charset("utf8mb4")) {
    error_log('Error loading character set utf8mb4: ' . $conn->error);
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Prepare and execute SQL statement for search
$searchQuery = '%' . $query . '%';
$stmt = $conn->prepare("SELECT id, code, type, manufacturer, name, model, img_url, description, items, unit, price FROM products WHERE code COLLATE utf8mb4_general_ci LIKE ? OR name COLLATE utf8mb4_general_ci LIKE ? OR model COLLATE utf8mb4_general_ci LIKE ?");
$stmt->bind_param("sss", $searchQuery, $searchQuery, $searchQuery);
$stmt->execute();
$result = $stmt->get_result();

// Prepare results array
$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

// Return the result as JSON
echo json_encode($rows, JSON_UNESCAPED_UNICODE);

// Close statement and connection
$stmt->close();
$conn->close();
?>
