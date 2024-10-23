<?php
header('Content-Type: application/json; charset=utf-8');

// Disable error display for production
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

// Get the JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Check if username and password are provided
if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Username and password are required'], JSON_UNESCAPED_UNICODE);
    exit;
}

$username = $data['username'];
$password = $data['password'];

// Database connection parameters
$servername = "localhost:3307";
$dbUsername = "liridenet";
$dbPassword = "liridenetns";
$dbname = "simaks_office";
// $servername = "sql.freedb.tech:3307";
// $dbUsername = "freedb_liridenet";
// $dbPassword = "v$ummPNqzzs4D89";
// $dbname = "freedb_simaks_office";

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

// Prepare and execute SQL statement
$stmt = $conn->prepare("SELECT id, username, password, first_name, last_name, email, phone, company_id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists
if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password'], JSON_UNESCAPED_UNICODE);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (password_verify($password, $user['password'])) {
    // Generate a token
    $token = bin2hex(random_bytes(16));

    // Update the user's token and is_logged status in the database
    $updateStmt = $conn->prepare("UPDATE users SET token = ?, is_logged = 1 WHERE id = ?");
    $updateStmt->bind_param("si", $token, $user['id']);
    $updateStmt->execute();
    $updateStmt->close();

    // Return user data and token
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'password' => $user['password'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'company_id' => $user['company_id'],
        ],
    ], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password'], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conn->close();
?>
