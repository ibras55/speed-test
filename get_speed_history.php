<?php
header("Access-Control-Allow-Origin: http://localhost");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root"; // Badilisha kwa jina la mtumiaji wa database
$password = ""; // Badilisha kwa nenosiri la database
$dbname = "speed_test_db";

// Kuunganisha na database
$conn = new mysqli($servername, $username, $password, $dbname);

// Kuangalia muunganisho
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Kusoma data kutoka kwenye jedwali
$sql = "SELECT * FROM speed_results ORDER BY test_date DESC";
$result = $conn->query($sql);

$history = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $history[] = $row;
    }
}

// Kufunga muunganisho
$conn->close();

// Kurudisha data kwa njia ya JSON
echo json_encode($history);
?>