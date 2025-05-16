<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Content-Type: application/octet-stream");

// Tuma data ya kufanya majaribio (1MB)
echo str_repeat("0", 1000000);
?>