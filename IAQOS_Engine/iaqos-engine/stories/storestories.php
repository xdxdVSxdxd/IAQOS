<?php
header("Access-Control-Allow-Origin: *");


$res = array();


if( !is_null( $_REQUEST["story"] ) &&   trim($_REQUEST["story"])!=""  && !is_null( $_REQUEST["emotion"] ) &&   trim($_REQUEST["emotion"])!=""  && !is_null( $_REQUEST["lat"] ) &&   trim($_REQUEST["lat"])!=""   && !is_null( $_REQUEST["lng"] ) &&   trim($_REQUEST["lng"])!="" && !is_null( $_REQUEST["language"] ) &&   trim($_REQUEST["language"])!=""  ) {



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

	    	$story = trim($_REQUEST["story"]);
	    	$language = trim($_REQUEST["language"]);
	    	$emotion = trim($_REQUEST["emotion"]);
	    	$lat = floatval($_REQUEST["lat"]);
	    	$lng = floatval($_REQUEST["lng"]);

	    	// memorizzare
	    	try {
	    			$stmt = $conn->prepare("INSERT INTO stories(story,emotion,lat,lng,language) VALUES(:story,:emotion,:lat,:lng,:language)");
					$stmt->bindParam(':story', $story);
					$stmt->bindParam(':emotion', $emotion );
					$stmt->bindParam(':lat', $lat);
					$stmt->bindParam(':lng', $lng);
					$stmt->bindParam(':language', $language);
					$stmt->execute();
					$res[] = "OK story stored";
			} catch( PDOException $Exception ) {
			    $res[] = "ERROR could not store story to db";
			}

	    } else {
	    	$res[] = "ERROR could not connect to database";
	    }


} else {
	$res[] = "ERROR in parameters";
}


header('Content-Type: application/json');
echo(json_encode($res));
  
?>