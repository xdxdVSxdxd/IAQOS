<?php

require_once "config.php";
require_once "MainClass.php";


$IAQOS = new IAQOSControl($conn , $configuration );

if(isset($_REQUEST["q"])){
	$parameters = new Parameters();
	$parameters->fromJSON($_REQUEST["q"]);
	$IAQOS->process( $parameters  , $_FILES );
}


?>