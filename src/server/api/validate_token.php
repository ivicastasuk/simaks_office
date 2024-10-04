<?php
function validateToken($conn) {
    $headers = getallheaders();

    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $authHeader = $headers['Authorization'];
    list($type, $token) = explode(' ', $authHeader, 2);

    if ($type !== 'Bearer' || empty($token)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid token']);
        exit;
    }

    // Check if the token exists in the database
    $stmt = $conn->prepare("SELECT id FROM users WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
        exit;
    }

    $stmt->close();
}
?>
