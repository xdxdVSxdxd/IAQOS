<?php

$configuration = parse_ini_file("./configuration.ini");

$conn;


try {
    $conn = new PDO("mysql:host=" . $configuration["DB_HOST"] . ";dbname=" . $configuration["DB_NAME"] , $configuration["DB_USER"], $configuration["DB_PWD"]);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connected successfully";
    }
catch(PDOException $e)
    {
    // echo "Connection failed: " . $e->getMessage();
    }

  
?>