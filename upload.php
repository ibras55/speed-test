<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Content-Type: application/json");

// Pokewa data ya upload
$data = file_get_contents("php://input");
$dataSize = strlen($data);

// Rejesha ukubwa wa data
echo json_encode(["size" => $dataSize]);
?>