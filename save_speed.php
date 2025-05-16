<?php
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

// Kupokea data kutoka kwa AJAX request
$downloadSpeed = $_POST['downloadSpeed'];
$uploadSpeed = $_POST['uploadSpeed'];
$networkStatus = $_POST['networkStatus'];

// Kuhifadhi data kwenye database
$sql = "INSERT INTO speed_results (download_speed, upload_speed, network_status) VALUES ('$downloadSpeed', '$uploadSpeed', '$networkStatus')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>