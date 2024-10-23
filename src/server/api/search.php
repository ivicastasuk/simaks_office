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

// Dozvoljene tabele za pretragu (radi sprečavanja SQL injekcija)
$allowedTables = ['products', 'clients'];
if (!in_array($table, $allowedTables)) {
    echo json_encode(['success' => false, 'message' => 'Invalid table']);
    exit;
}

// Login podaci za bazu
$servername = "localhost:3307";
$dbUsername = "liridenet";
$dbPassword = "liridenetns";
$dbname = "simaks_office";
// $servername = "sql.freedb.tech:3307";
// $dbUsername = "freedb_liridenet";
// $dbPassword = "v$ummPNqzzs4D89";
// $dbname = "freedb_simaks_office";

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

// Dinamička SQL izjava na osnovu tabele
if ($table === 'products') {
    $stmt = $conn->prepare("
        SELECT id, code, name, model, img_url, price, type, manufacturer, description, items, unit
        FROM products
        WHERE
            code COLLATE utf8mb4_general_ci LIKE ? OR
            name COLLATE utf8mb4_general_ci LIKE ? OR
            model COLLATE utf8mb4_general_ci LIKE ? OR
            manufacturer COLLATE utf8mb4_general_ci LIKE ?
    ");
    $stmt->bind_param("ssss", $searchQuery, $searchQuery, $searchQuery, $searchQuery);
} else if ($table === 'clients') {
    $stmt = $conn->prepare("
        SELECT id, name, address, city, pib, mb
        FROM clients
        WHERE
            name COLLATE utf8mb4_general_ci LIKE ? OR
            city COLLATE utf8mb4_general_ci LIKE ? OR
            pib COLLATE utf8mb4_general_ci LIKE ?
    ");
    $stmt->bind_param("sss", $searchQuery, $searchQuery, $searchQuery);
} else {
    echo json_encode([]);
    exit;
}

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
