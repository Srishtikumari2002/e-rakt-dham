<?php
include('mysql_details.php');
$conn=mysqli_connect($db_hostname,$db_username,$db_password,$db_name);
if(!$conn){
    echo 0;
    exit;
}


$email = $_POST['email'];
$psd = $_POST['psd'];

$sql="select * from users";

$result = mysqli_query($conn,$sql);
if(!$result){
    echo 0;
    exit;
}


while($row=mysqli_fetch_assoc($result)){
    if($row["email"]==$email){
        $abc=1;
        if($row["psd"]==$psd){
            echo 1;
            $_SESSION['id']=$row['id'];
            $_SESSION['name']=$row['name'];
            $_SESSION['email']=$row['email'];
        }
        else{
            echo 2;
        }
    break;
    }
}

mysqli_close($conn);
?>