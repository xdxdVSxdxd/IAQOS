<?php

require_once "config.php";
require_once "MainClass.php";

$name = "IAQOS";
$role = "admin";
$pwd = password_hash('IAQOS',PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO users(name,pwd,role) VALUES(:name,:pwd,:role)");
$stmt->bindParam(':name', $name);
$stmt->bindParam(':pwd', $pwd );
$stmt->bindParam(':role', $role);
$stmt->execute();

?>