<?php


require_once "API.php";
require_once "utilities.php";

	class Parameters{
		var $name = NULL;
		var $pwd = NULL;
		var $token = NULL;
		var $domain = "";
		var $function = "";
		var $params = array();

		function fromJSON($JSON){
			$request = json_decode( $JSON );
			if(isset($request->name)){
				$this->name = $request->name;
			}
			if(isset($request->token)){
				$this->token = $request->token;
			}
			if(isset($request->pwd)){
				$this->pwd = $request->pwd;
			}
			if(isset($request->domain)){
				$this->domain = $request->domain;
			}
			if(isset($request->function)){
				$this->function = $request->function;
			}
			if(isset($request->params) && is_array($request->params)  ){
				foreach( $request->params as $p){
					if(is_array($p)){
						$this->params[$p[0]] = $p[1];	
					}
					
				}
			}
		}

		function toJSON(){
			$o = new \stdClass();
			$o->name = $this->name;
			$o->pwd = $this->pwd;
			$o->token = $this->token;
			$o->domain = $this->domain;
			$o->function = $this->function;
			$o->params = $this->params;

			$s = json_encode(utf8ize($o));

			return $s;
		}

		function toString(){
			
			$s = json_decode($this->toJSON());

			return $s;
		}

	}



	class IAQOSControl{
		var $mysqlconnection = NULL;
		var $api = NULL;
		var $configuration = NULL;

		function __construct($mysqlconn , $conf) {		
			$this->mysqlconnection = $mysqlconn;
			$this->api = new API($mysqlconn , $conf );
			$this->configuration = $conf;
		}


		function status() {
			$s = true;

			if($s){
				return "running...";
			} else{
				return "stopped";
			}
		}


		function process(  $params  , $files ){

			$token = $this->checkAuth( $params );

			if( !is_null( $token->token) && !is_null( $token->role) ){
				// user authntified, can do stuff
				// echo("[Processing files]");
				$filesreult = $this->processFiles($files , $params , $token );
				// echo("[Finished processing files]");
				$result = $this->route( $token , $params , $filesreult );
				$this->display(  $token , $params , $result  );
			}


		}

		function checkAuth( $params ){
			$res = new \stdClass();
			$res->token = NULL;
			$res->role = NULL;
			if(is_object($params)){
				if(isset($params->token) && $params->token!=NULL ){
					// ha un token, controllare e restituire
					$stmt = $this->mysqlconnection->prepare("SELECT name,token,role FROM users WHERE token=:token AND token_expiry > NOW() LIMIT 0,1");
					$stmt->bindParam(':token', $params->token);

					$stmt->execute();
					if($row = $stmt->fetch()){

						$res->name = $row["name"];
						$res->token = $row["token"];
						$res->role = $row["role"];

						$stmt2 = $this->mysqlconnection->prepare("UPDATE users SET token_expiry = DATE_ADD(NOW(), INTERVAL " .  $this->configuration["TOKENEXPIRYINTERVAL"] . ") WHERE token=:token");
						//$stmt2->bindParam(':interval', $TOKENEXPIRYINTERVAL);
						$stmt2->bindParam(':token', $params->token);

						$stmt2->execute();

					}
					$stmt->closeCursor();

				} else if(isset($params->name) && $params->name!=NULL  &&  isset($params->pwd) && $params->pwd!=NULL ){
					// non ha un token, controllare se corrispondono e, nel caso, produrre il token e restituirlo

					$stmt = $this->mysqlconnection->prepare("SELECT id,name,pwd,role FROM users WHERE name=:name LIMIT 0,1");
					$stmt->bindParam(':name', $params->name);

					$stmt->execute();
					if($row = $stmt->fetch()){

						$pwd = $row["pwd"];
						$id = intval($row["id"]);
						$interval = $this->configuration["TOKENEXPIRYINTERVAL"];

						if( password_verify( $params->pwd , $pwd ) ){

							$res->token = $this->getNewToken();
							$res->role = $row["role"];
							$res->name = $row["name"];

							$q2 = "UPDATE users SET token = :token, token_expiry = DATE_ADD(NOW(), INTERVAL " . $this->configuration["TOKENEXPIRYINTERVAL"] . " ) WHERE id=:id";
							$stmt2 = $this->mysqlconnection->prepare($q2);
							$stmt2->bindParam(':token', $res->token );
							//$stmt2->bindParam(':interval', $interval);
							$stmt2->bindParam(':id', $id);

							$stmt2->execute();

						}

					}
					$stmt->closeCursor();
				} else {
					// non fare nulla, e restituire NULL
				}
			}

			return $res;
		}


		function processFiles($files , $params , $token){
			$res = array();

			$domain = $params->domain;
			$user = $token->name;
			$function = $params->function;


			create_domain($domain , $this->configuration );
				
				
				// with each file:
				foreach ($files as $key => $value) {

				

					if($value['error']==UPLOAD_ERR_OK){

						$name = $value['name'];;
						//		get temp file name
						// echo("[Name:" . $name . "]");

						$tmpfilename = $value['tmp_name'];
						//		get mime type
						// echo("[tmpfilename:" . $tmpfilename . "]");

						$mimetype = $value['type'];
						// echo("[mimetype:" . $mimetype . "]");

						//		get extension for mimetype
						$extension = mime2ext($mimetype);
						// echo("[extension:" . $extension . "]");

						//		get appropriate folder for mimetype
						$folder = mime2folder($mimetype);
						// echo("[folder:" . $folder . "]");

						//		generate file name
						$dirname = $this->configuration["DOMAINS_DIR"] . $domain . "/" . $folder . "/";
						// echo("[dirname:" . $dirname . "]");

						
						$stmt = $this->mysqlconnection->prepare("INSERT INTO assets(name,domain,mime,ext,owner_name,type) VALUES( :name , :domain , :mime , :ext , :ownername , :type)");
						$stmt->bindParam(':name', $name);
						$stmt->bindParam(':domain', $domain);
						$stmt->bindParam(':mime', $mimetype);
						$stmt->bindParam(':ext', $extension);
						$stmt->bindParam(':ownername', $token->name);
						$stmt->bindParam(':type', $folder);
						$stmt->execute();

						$fname = $this->mysqlconnection->lastInsertId() . "." . $extension;

						//		move file to new filename
						if (move_uploaded_file($value['tmp_name'], $dirname . $fname )) {
							// echo("[Moved!]");
						    // 		add processed file to result array
							$res[$name] = [  $fname , $mimetype , $folder  ];
						} else {
						    $res["error"] = "Error uploading file.";
						}

						

					} else {
						$res["error"] = "Error uploading file.";
					}

							
				}
			

			return $res;
		}

		// @TODO: implement serious token generation scheme
		function getNewToken(){
			$res = "aaaaaaaaaaaa";
			return $res;
		}


		function route($token, $params , $files ){

			
			$res = new \stdClass();
			if($token->role==$this->configuration["ADMIN_ROLE"]){
				// l'utente è un admin, facciamogli fare cose da admin
				if(  !(    !is_null($params->domain)  || !is_null($params->app) || trim($params->domain)!="" || trim($params->app)!=""   )  ){
					switch($params->function){
						case "createuser":
							$res = $this->api->createuser($token, $params);
							break;
						case "updateuser":
							$res = $this->api->updateuser($token, $params);
							break;
						case "deleteuser":
							$res = $this->api->deleteuser($token, $params);
							break;
						default:
							//
					}	
				}
			}

					switch($params->function){
						case "addfile":
							$res = new \stdClass();
							$res ->results = $files;
							break;
						case "getdomainlist":
							$res = $this->api->getdomainlist($token, $params);
							break;
						case "getactionlist":
							$res = $this->api->getactionlist($token, $params);
							break;
						case "setactionindomain":
							$res = $this->api->setactionindomain($token, $params);
							break;
						case "getdomainswithactionslist":
							$res = $this->api->getdomainswithactionslist($token, $params);
							break;
						case "deactivateactionindomain":
							$res = $this->api->deactivateactionindomain($token, $params);
							break;
						case "addcontent":
							$res = $this->api->addcontent($token, $params);
							break;
						case "getTEXTSnetwork":
							$res = $this->api->getTEXTSnetwork($token, $params);
							break;
						case "getKnowledgeAboutString":
							$res = $this->api->getKnowledgeAboutString($token, $params);
							break;
						default:
							//
					}	

			return $res;

		}

		function display(  $token , $params , $result  ){
			// mostrare, anche con un echo

			$res = new \stdClass();
			$res->token = $token;
			$res->params = $params;
			$res->result = $result;

			header('Content-Type: application/json');
			header('Access-Control-Allow-Origin: *');
			header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
      		header('Access-Control-Max-Age: 1000');
      		header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
      
			echo(  json_encode(utf8ize( $res ))  );
		}


	}


?>