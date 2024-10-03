<?php
header('Content-Type: application/json');

// Specify the directory where the file will be saved
$target_dir = "../img/products/";

// Create the directory if it doesn't exist
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0775, true);
}

// Check if the image file is present
if (!isset($_FILES['image'])) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded']);
    exit;
}

$target_file = $target_dir . basename($_FILES["image"]["name"]);
$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

// Validate file type
$valid_extensions = array("jpg", "jpeg", "png", "gif");
if (!in_array($imageFileType, $valid_extensions)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type']);
    exit;
}

// Check for errors during upload
if ($_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'File upload error']);
    exit;
}

// Generate a unique file name to prevent overwriting
$unique_name = uniqid() . "." . $imageFileType;
$unique_target_file = $target_dir . $unique_name;

// Move the uploaded file to the target directory
if (move_uploaded_file($_FILES["image"]["tmp_name"], $unique_target_file)) {
    echo json_encode(['success' => true, 'message' => 'Image uploaded successfully', 'filename' => $unique_name]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error saving the file']);
}
?>
