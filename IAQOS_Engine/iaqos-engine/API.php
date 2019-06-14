<?php

require_once "utilities.php";

class API{

	var $connection;
	var $configuration;

	function __construct($mysqlconn,$conf) {		
		$this->connection = $mysqlconn;		
		$this->configuration = $conf;
	}


	function createuser($token, $params){
		$res = new \stdClass();
		if($token->role!=$this->configuration["ADMIN_ROLE"]){
			$res->error = "Needs to be admin to perform this task";
		} else {

			// can do this thing: do it and produce the results in $res

			if( 
				!isset($params->params["name"]) || 
				!isset($params->params["pwd"]) || 
				!isset($params->params["role"]) || 
				trim($params->params["name"])=="" || 
				trim($params->params["pwd"])==""  || 
				trim($params->params["role"])=="" 
			){
				$res->error = "Error in parameters.";
			} else {
				$name = trim( $params->params["name"] );
				$role = trim(  $params->params["role"] );
				$pwd = password_hash($params->params["pwd"],PASSWORD_BCRYPT);

				try {

					$stmt = $this->connection->prepare("INSERT INTO users(name,pwd,role) VALUES(:name,:pwd,:role)");
					$stmt->bindParam(':name', $name);
					$stmt->bindParam(':pwd', $pwd );
					$stmt->bindParam(':role', $role);
					$stmt->execute();

					$res->message = "User created.";

				} catch( PDOException $Exception ) {
				    $res->error = "User could not be created.";
				}
			}

		}
		return $res;
	}









	function updateuser($token, $params){
		$res = new \stdClass();
		if($token->role!=$this->configuration["ADMIN_ROLE"]){
			$res->error = "Needs to be admin to perform this task";
		} else {

			// can do this thing: do it and produce the results in $res

			if( 
				!isset($params->params["name"]) || 
				!isset($params->params["pwd"]) || 
				!isset($params->params["role"]) || 
				!isset($params->params["namefrom"]) || 
				trim($params->params["name"])=="" || 
				trim($params->params["pwd"])==""  || 
				trim($params->params["namefrom"])==""  || 
				trim($params->params["role"])=="" 
			){
				$res->error = "Error in parameters.";
			} else {
				$name = trim( $params->params["name"] );
				$name2 = trim( $params->params["namefrom"] );
				$role = trim(  $params->params["role"] );
				$pwd = password_hash($params->params["pwd"],PASSWORD_BCRYPT);

				try {

					$stmt = $this->connection->prepare("UPDATE users SET name = :name , pwd = :pwd , role = :role WHERE name = :name2 ");
					$stmt->bindParam(':name', $name);
					$stmt->bindParam(':pwd', $pwd );
					$stmt->bindParam(':role', $role);
					$stmt->bindParam(':name2', $name2);
					$stmt->execute();

					$res->message = "User updated";

				} catch( PDOException $Exception ) {
				    $res->error = "User could not be updated.";
				}
			}

		}
		return $res;
	}








	function deleteuser($token, $params){
		// @TODO: eliminare le cose che stanno appese all'user
		$res = new \stdClass();
		if($token->role!=$this->configuration["ADMIN_ROLE"]){
			$res->error = "Needs to be admin to perform this task";
		} else {

			// can do this thing: do it and produce the results in $res

			if( 
				!isset($params->params["name"]) ||
				trim($params->params["name"])==""
			){
				$res->error = "Error in parameters.";
			} else {
				$name = trim( $params->params["name"] );

				try {

					$stmt = $this->connection->prepare("DELETE FROM users WHERE name = :name and role='" . $this->configuration["USER_ROLE"] . "'");
					$stmt->bindParam(':name', $name);
					$stmt->execute();

					$res->message = "User deleted";

				} catch( PDOException $Exception ) {
				    $res->error = "User could not be deleted.";
				}
			}

		}
		return $res;
	}


	function getdomainlist($token, $params){
		// @TODO: eliminare le cose che stanno appese all'user
		$res = new \stdClass();
		$res->domains = array();

		if ($handle = opendir(  $this->configuration["DOMAINS_DIR"]  )) {

		    while (false !== ($entry = readdir($handle))) {
		        if($entry!="." && $entry!=".." && substr($entry, 0, 1) !== "." ){
		        	$res->domains[] = $entry;	
		        }
		    }

		    closedir($handle);
		}

		return $res;
	}


	function getactionlist($token, $params){
		$res = new \stdClass();
		$res->actions = array();

		if ($handle = opendir('./actions/')) {

		    while (false !== ($entry = readdir($handle))) {
		        if($entry!="." && $entry!=".." && substr($entry, 0, 1) !== "." ){
		        	$res->actions[] = $entry;	
		        }
		    }

		    closedir($handle);
		}

		return $res;
	}


	function getdomainswithactionslist($token, $params){
		$res = new \stdClass();
		$res->actions_in_domains = array();

		$stmt2 = $this->connection->prepare("SELECT domain,action,param1,param2 FROM domain_actions");
		$stmt2->execute();

		while($row = $stmt2->fetch()){
			$o = new \stdClass();
			$o->domain = $row["domain"];
			$o->action = $row["action"];
			$o->param1 = $row["param1"];
			$o->param2 = $row["param2"];
			$res->actions_in_domains[] = $o;
		}
		$stmt2->closeCursor();
		

		return $res;
	}


	function deactivateactionindomain($token, $params){
		$res = new \stdClass();

		$domain = trim( $params->domain );

		$stmt2 = $this->connection->prepare("DELETE FROM domain_actions WHERE domain = :domain ");
		$stmt2->bindParam(':domain', $domain);
		$stmt2->execute();


		if($stmt2->rowCount()>0){
			$res->message = "Activity deactivated.";
		} else {
			$res->error = "It was not possible to deactivate the activity.";
		}

		return $res;
	}



	function setactionindomain($token, $params){
		$res = new \stdClass();
		

			if( 
				!isset($params->params["action"]) ||
				trim($params->params["action"])=="" ||
				!isset($params->params["param1"]) ||
				trim($params->params["param1"])=="" ||
				!isset($params->params["param2"]) ||
				trim($params->params["param2"])=="" ||
				!isset($params->domain) ||
				trim($params->domain)==""
			){
				$res->error = "Error in parameters.";
			} else {
				$domain = trim( $params->domain );
				$action = trim( $params->params["action"] );
				$param1 = trim( $params->params["param1"] );
				$param2 = trim( $params->params["param2"] );
				$domain = trim( $params->domain );

				try {

					if(file_exists( $this->configuration["DOMAINS_DIR"] . $domain)){

						$stmt2 = $this->connection->prepare("SELECT domain FROM domain_actions WHERE domain = :domain");
						$stmt2->bindParam(':domain', $domain);
						$stmt2->execute();

						if($row = $stmt2->fetch()){
							$res->error = "Domain already has an action configured. Please deactivate it before setting a new one.";	
						} else {

							$stmt = $this->connection->prepare("INSERT INTO domain_actions(domain,action,param1,param2) VALUES(:domain, :action, :param1 , :param2 )");
							$stmt->bindParam(':domain', $domain);
							$stmt->bindParam(':action', $action);
							$stmt->bindParam(':param1', $param1);
							$stmt->bindParam(':param2', $param2);
							$stmt->execute();
							
							$res->message = "Action applied to domain.";

						}
						$stmt2->closeCursor();

							
					} else {
						$res->error = "Domain does not exist.";	
					}
					

				} catch( PDOException $Exception ) {
				    $res->error = "Action could not be activated.";
				}
			}

		return $res;
	}



	function addcontent($token, $params){
		$res = new \stdClass();
		

			if( 
				!isset($params->params["content"]) ||
				trim($params->params["content"])=="" ||
				!isset($params->params["type"]) ||
				trim($params->params["type"])=="" ||
				!isset($params->domain) ||
				trim($params->domain)==""
			){
				$res->error = "Error in parameters.";
			} else {
				$domain = trim( $params->domain );
				$content = trim( $params->params["content"] );
				$type = trim( $params->params["type"] );
				$label = trim( $params->params["label"] );

				try {

					if(file_exists( $this->configuration["DOMAINS_DIR"] . $domain)){



						$name = substr($label,0,60);
						$mimetype = $type;
						$extension = "DATA";
						$stmt = $this->connection->prepare("INSERT INTO assets(name,domain,mime,ext,owner_name,type) VALUES( :name , :domain , :mime , :ext , :ownername , :type)");
						$stmt->bindParam(':name', $name);
						$stmt->bindParam(':domain', $domain);
						$stmt->bindParam(':mime', $type);
						$stmt->bindParam(':ext', $extension);
						$stmt->bindParam(':ownername', $token->name);
						$stmt->bindParam(':type', $type);
						$stmt->execute();
						$idasset = $this->connection->lastInsertId() . "." . $extension;


						$stmt = $this->connection->prepare("INSERT INTO data_text(id_asset,domain,content,type,owner_name,label) VALUES( :id_asset , :domain , :content , :type , :ownername , :label)");
						$stmt->bindParam(':id_asset', $idasset);
						$stmt->bindParam(':domain', $domain);
						$stmt->bindParam(':content', $content);
						$stmt->bindParam(':type', $type);
						$stmt->bindParam(':ownername', $token->name);
						$stmt->bindParam(':label', $label);
						$stmt->execute();
						$iddatatext = $this->connection->lastInsertId();


						$res->message = "Content added.";	
					} else {
						$res->message = "Domain does not exist.";	
					}
					

				} catch( PDOException $Exception ) {
				    $res->error = "Content could not be added.";
				}
			}

		return $res;
	}


	function getTEXTSnetwork($token, $params){
		$res = new \stdClass();


		if( 
			!isset($params->domain) ||
			trim($params->domain)==""
		){
			$res->error = "Error in parameters.";
		} else {
			$domain = trim( $params->domain );

			$stmt = $this->connection->prepare("SELECT id, name, weigth FROM TEXTS_graphs_nodes WHERE domain = :domain");
			$stmt->bindParam(':domain', $domain);
			$stmt->execute();
			$res->nodes = array();
			while($row = $stmt->fetch()){
				$o = new \stdClass();
				$o->id = $row["id"];
				$o->domain = $domain;
				$o->name = $row["name"];
				$o->weight = $row["weigth"];
				$res->nodes[] = $o;
			}
			$stmt->closeCursor();


			$stmt = $this->connection->prepare("SELECT l.id1 as id1, l.id2 as id2, n1.name as name1, n2.name as name2, l.weight as weight FROM  TEXTS_graphs_links l ,  TEXTS_graphs_nodes n1 ,  TEXTS_graphs_nodes n2 WHERE l.id1=n1.id AND l.id2=n2.id AND n1.domain = :domain1 AND n2.domain = :domain2 ");
			$stmt->bindParam(':domain1', $domain);
			$stmt->bindParam(':domain2', $domain);
			$stmt->execute();
			$res->links = array();
			while($row = $stmt->fetch()){
				$o = new \stdClass();
				$o->source = $row["id1"];
				$o->target = $row["id2"];
				$o->sourcename = $row["name1"];
				$o->targetname = $row["name2"];
				$o->weight = $row["weight"];
				$res->links[] = $o;
			}
			$stmt->closeCursor();

			
		}
		

		return $res;
	}








	function getKnowledgeAboutString($token, $params){
		$res = new \stdClass();
		$res2 = array();

		if( 
			!isset($params->params["string"]) ||
			trim($params->params["string"])==""
		){
			$res->error = "Error in parameters.";
		} else {
			$string = trim( $params->params["string"] );

			
			$limit = 1000;
			if( 
				isset($params->params["limit"]) ||
				trim($params->params["limit"])!=""
			){
				$limit = intval( $params->params["limit"] );
			}
			

			$string = strtolower($string);
			$string = preg_replace("/[^[:alnum:][:space:]]/u", '', $string);
			$string = str_replace("  ", " ", $string);

			$elements = explode(" ", $string);

			$query = "SELECT id, name, weigth FROM TEXTS_graphs_nodes WHERE ";
			$i = 0;
			foreach($elements as $v){
				$query = $query . " name LIKE :v" . $i  . " OR ";
				$i++;
			}

			$query = $query . " 1=0";


			$stmt = $this->connection->prepare( $query );
			$i = 0;
			foreach($elements as $v){
				$vname = ":v" . $i;
				$vval = substr($v, 0, max(0,strlen($v)-1) ) . "%";
				$stmt->bindParam($vname , $vval );
				

				if(strlen($v)>2){
					$urlo = "http://164.132.225.138/~SLO/HEv3/api/getWordNetworkForWord?researches=126,127&word=" . $v . "&mode=all";
					$json = file_get_contents($urlo);
					$jsonobject = json_decode($json);
					$jsonobject->word = $v;
					$res2[] = $jsonobject;	
				}

				

				$i++;
			}
			$stmt->execute();
			$res->nodes = array();
			while($row = $stmt->fetch()){
				$o = new \stdClass();
				$o->id = $row["id"];
				$o->name = $row["name"];
				$o->weight = $row["weigth"];
				$res->nodes[] = $o;
			}
			$stmt->closeCursor();

		}
		





		$maxnw = 0;
		$maxlw = 0;

		$res = new \stdClass();
		$res->nodes = array();
		$res->links = array();

		for($i = 0 ; $i<count($res2); $i++ ){
			if($res2[$i]->nodes && $res2[$i]->links ){
				foreach ($res2[$i]->nodes as $e) {
					$w = intval($e->weight);
					if($w>$maxnw){
						$maxnw = $w;
					}

				}
				foreach ($res2[$i]->links as $e) {
					$w = intval($e->weight);
					if($w>$maxlw){
						$maxlw = $w;
					}

				}
				$res->nodes = array_merge( $res->nodes, $res2[$i]->nodes );
				$res->links = array_merge( $res->links, $res2[$i]->links );
			}
		}

		//print_r($res);
		//echo("\n----------------------\n");


		// handle duplicates in nodes
		function comparenodes($a,$b){
			$ida = strtoupper( $a->id );
			$idb = strtoupper( $b->id);
			if($ida>$idb){
				return 1;
			} else if($ida<$idb){
				return -1;
			} else {
				return 0;
			}
		}
		usort($res->nodes, "comparenodes" );
	    for($i = 1; $i < count($res->nodes); ){
	        if($res->nodes[$i-1]->id === $res->nodes[$i]->id ){
	        	$res->nodes[$i]->weight = $res->nodes[$i]->weight + $res->nodes[$i-1]->weight;
	        	$res->nodes[$i]->energy = ($res->nodes[$i]->energy + $res->nodes[$i-1]->energy)/2;
	        	$res->nodes[$i]->comfort = ($res->nodes[$i]->comfort + $res->nodes[$i-1]->comfort)/2;
	            array_splice($res->nodes, $i,1);
	        } else {
	            $i++;
	        }
	    }

	    // handle duplicates in links

	    foreach ($res->links as  $d) {
			$sourceTemp = $d->source; $targetTemp = $d->target;
			$sourceTempid = $d->sourceid; $targetTempid = $d->targetid;
			if($d->source > $d->target){
				$d->source = $targetTemp;
				$d->target = $sourceTemp;
				$d->sourceid = $targetTempid;
				$d->targetid = $sourceTempid;
			}
		}

		function comparelinks($a,$b){
			$sourcea = strtoupper( $a->source);
			$sourceb = strtoupper( $b->source);
			$targeta = strtoupper( $a->target);
			$targetb = strtoupper( $b->target);
			$rt = 0;
			if($sourcea > $sourceb){
				$rt = 1;
			} else if($sourcea < $sourceb){
				$rt = -1;
			} else {
				if($targeta > $targetb){
					$rt = 1;
				} else if($targeta < $targetb){
					$rt = -1;
				} else {
					$rt = 0;
				}
			}
			return $rt;
		}
		usort($res->links, "comparelinks" );

		for($i = 1; $i < count($res->links); ){
	        if($res->links[$i-1]->source == $res->links[$i]->source  &&  $res->links[$i-1]->target == $res->links[$i]->target  ){
	        	$res->links[$i]->weight = $res->links[$i]->weight + $res->links[$i-1]->weight;
	        	array_splice($res->links, $i,1);
	        } else {
	            $i++;
	        }
	    }


	    function comparenodesbyweight($a,$b){
    		if($a->weight>$b->weight){
    			return -1;
    		} else if($a->weight<$b->weight){
    			return 1;
    		} else {
    			return 0;
    		}
    	}
    	usort($res->nodes, "comparenodesbyweight" );
	    while(count($res->nodes)>$limit){
	    	$o = array_pop( $res->nodes );
	    	for($i = count($res->links)-1; $i>=0; $i--){
	    		if($res->links[$i]->source==$o->id || $res->links[$i]->target==$o->id){
	    			array_splice($res->links, $i,1);
	    		}
	    	}
	    }
	    for($i = count($res->links)-1; $i>=0; $i--){
    		
    		$founds = false;
    		$foundt = false;
    		for($j = 0; $j<count($res->nodes) && !($founds&&$foundt); $j++){
    			if($res->nodes[$j]->id==$res->links[$i]->source){
    				$founds = true;
    			}
    			if($res->nodes[$j]->id==$res->links[$i]->target){
    				$foundt = true;
    			}
    		}

    		if(!$founds||!$foundt){
    			array_splice($res->links, $i,1);
    		}
    	}
    	
    	$rr = array();
    	$rr[] = $res;

		return $rr;
	}






}

?>