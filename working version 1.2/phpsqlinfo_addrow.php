<?php
$servername = "localhost";
$username = "id884420_root";
$password = "matthew";
$dbname = "id884420_routeplanner";


// Opens a connection to a MySQL server.
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$id = mysqli_real_escape_string($conn, $_REQUEST['id']);
$name = mysqli_real_escape_string($conn, $_REQUEST['name']);
$address = mysqli_real_escape_string($conn, $_REQUEST['address']);
$lat = mysqli_real_escape_string($conn, $_REQUEST['lat']);
$lng = mysqli_real_escape_string($conn, $_REQUEST['lng']);
$type = mysqli_real_escape_string($conn, $_REQUEST['type']);


// Inserts new row with place data.
$sql = "INSERT INTO markers (id, name, address, lat, lng, type) 
VALUES ('$id', '$name', '$address', '$lat', '$lng', '$type')";

if(mysqli_query($conn, $sql)){
    echo "Records added successfully.";
} else{
    echo "ERROR: Could not able to execute $sql. " . mysqli_error($conn);
}
 
// close connection
mysqli_close($conn);
?>
