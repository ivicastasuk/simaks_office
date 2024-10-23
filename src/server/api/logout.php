<?php
header('Content-Type: application/json');

// Get the Authorization header
$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    echo json_encode(['success' => false, 'message' => 'No authorization token provided']);
    exit;
}

$authHeader = $headers['Authorization'];
list($type, $token) = explode(' ', $authHeader, 2);

if ($type !== 'Bearer' || empty($token)) {
    echo json_encode(['success' => false, 'message' => 'Invalid authorization header']);
    exit;
}

// Database connection parameters
$servername = "localhost";
$dbUsername = "your_db_username";
$dbPassword = "your_db_password";
$dbname = "simaks_office";
// $servername = "sql.freedb.tech:3307";
// $dbUsername = "freedb_liridenet";
// $dbPassword = "v$ummPNqzzs4D89";
// $dbname = "freedb_simaks_office";

// Create connection
$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Update the user's token and is_logged status
$updateStmt = $conn->prepare("UPDATE users SET token = NULL, is_logged = 0 WHERE token = ?");
$updateStmt->bind_param("s", $token);
$updateStmt->execute();

if ($updateStmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Logout successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid token or user already logged out']);
}

$updateStmt->close();
$conn->close();
?>
