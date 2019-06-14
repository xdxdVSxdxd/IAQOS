<?php

header("Access-Control-Allow-Origin: *");

$res = array();



	$configuration = parse_ini_file("../configuration.ini");

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


	    if($conn!=null){

	    	// memorizzare
	    	try {
	    			$stmt = $conn->prepare("SELECT id,story,emotion,lat,lng,language,t FROM stories ORDER BY t desc, language asc, emotion asc");
					$stmt->execute();

					while($row = $stmt->fetch()){
						$o = new \stdClass();
						$o->id = $row["id"];
						$o->story = $row["story"];
						$o->emotion = $row["emotion"];
						$o->lat = $row["lat"];
						$o->lng = $row["lng"];
						$o->language = $row["language"];
						$o->t = $row["t"];
						$res[] = $o;
					}
					$stmt->closeCursor();
					
			} catch( PDOException $Exception ) {
			    $res[] = "ERROR could not retrieve stories from db";
			}

	    } else {
	    	$res[] = "ERROR could not connect to database";
	    }





header('Content-Type: application/json');
echo(json_encode($res));
  
?>