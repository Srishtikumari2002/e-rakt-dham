<?php

include('mysql_details.php');

$conn=mysqli_connect($db_hostname,$db_username,$db_password,$db_name);
if(!$conn){
    echo 0;
    exit;
}
    
$name=$_POST['name'];
$email = $_POST['email'];
$address = $_POST['address'];
$blood_group = $_POST['blood_group'];
$phone = $_POST['phone'];
$psd = $_POST['psd'];
$dob = $_POST['dob'];

$sql="INSERT INTO users (name, address, email,phone,dob, psd,blood_group) VALUES ('$name', '$address,'$email', '$phone', '$dob', '$psd', '$blood_group')";

$result = mysqli_query($conn,$sql);
if(!$result){
    echo mysqli_error($conn);
}
else {
    echo 1;
}
mysqli_close($conn);
?>