
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


var language = "it-IT";

$( document ).ready(function() {

	updateKnowledge();

	$("#scene1").css("display","block");
	$("#scene1").click(function(){
		$("#scene2").css("display","block");
		$("#scene1").css("display","none");
		startcapture();
	});
	
	
});


var knowledgegraph = null;
var interactionword = "";
var capturing = "";

function updateKnowledge(){
	$.getJSON("http://164.132.225.138/~SLO/HEv3/api/getWordNetwork?researches=126,127&limit=200",function(data){

		})
		.done(function(data) {
			console.log( "[loaded knowledge graph]" );
			knowledgegraph = data;
			//console.log(knowledgegraph);
			$("#scene1").css("display","block");
			$("#scene2").css("display","none");
			$("#scene3").css("display","none");
		})
		.fail(function() {
			console.log( "[error downloading knowledge graph]" );
			$("#scene1").css("display","block");
			$("#scene2").css("display","none");
			$("#scene3").css("display","none");
		});
}

function startcapture(){
	var colors = [ 'IAQOS','jacos'];
	var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';
	capturing = "";


	var language = 'it-IT';


	var recognition = new SpeechRecognition();
	var speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	recognition.continuous = true;
	recognition.lang = language;
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;
	recognition.start();


	recognition.onresult = function(event) {
		
	  var last = event.results.length - 1;
	  var res = event.results[last][0].transcript;

	  console.log('Result received: ' + res + '.');
	  console.log('Confidence: ' + event.results[0][0].confidence);
	  console.log('language: ' + language);


	  capturing = capturing + res + " ";

	  var rr = res.toUpperCase();

	  if( 
	  	rr.search(/(^ITALIANO[^a-z0-9]?|[^a-z0-9]ITALIANO[^a-z0-9]?)/igm)!=-1 
	  ){
	  	
		// vuole smettere
		language = "it-IT";

	  } 

	  else if( 
	  	rr.search(/(^INGLESE[^a-z0-9]?|[^a-z0-9]INGLESE[^a-z0-9]?)/igm)!=-1 
	  ){
	  	
		// vuole smettere
		language = "en-US";

	  }

	  else if( 
	  	rr.search(/(^FRANCESE[^a-z0-9]?|[^a-z0-9]FRANCESE[^a-z0-9]?)/igm)!=-1 
	  ){
	  	
		// vuole smettere
		language = "fr-FR";

	  }


	  //fai qualcosa con l'output
	  $("#scene2").css("display","none");
	  $("#scene3").css("display","block");
	  $("#IAQOSSaysSomething").text("Hai detto: <<" + res + ">>... Ci sto pensando...");

	  processongoing( res );

	}

	recognition.onspeechend = function() {
		console.log("[capture][onspeechend]");
	  	//recognition.stop();
	  	$("#scene2").css("display","none");
	  	recognition.stop();
	  	if(capturing.trim()==""){
	  		$("#scene1").css("display","block");
	  	} else {
	  		processSpeech();	
	  	}
	}


	recognition.onerror = function(event) {
		console.log("[capture][onerror]");
	  	console.log('Error occurred in recognition: ' + event.error);
	  	recognition.stop();
	  	$("#scene1").css("display","block");
	  	$("#scene2").css("display","none");
	}


}


function processSpeech(){
	console.log(capturing);
	processongoing(capturing);
	updateKnowledge();
}

function processongoing(content){
	var startingNodes = findStartingNodes(content);
	//console.log(startingNodes);

	var soqualcosadi = ""; 

	if(startingNodes.length==0){
		soqualcosadi = "Non so molto di quello di cui mi parli.";
	} else {
		soqualcosadi = "So qualcosa circa ";

		for(var i = 0; i<startingNodes.length; i++){
			soqualcosadi = soqualcosadi + "'" + startingNodes[i].word + "'";
			if(i<startingNodes.length-1){
				soqualcosadi = soqualcosadi + ", ";
			}
		}

		soqualcosadi = getFraseIAQOS( startingNodes[   Math.round(  Math.random()*(startingNodes.length-1)  )  ]  );

		storeknowledge(content,language.substring(0,2));
	}






	$("#IAQOSSaysSomething").text(soqualcosadi);
	$("#scene2").css("display","none");
	$("#scene3").css("display","block");

}


var templatesScene3 = [
	"Cosa ne pensi?",
	"Cosa ne sai?",
	"Mi aiuti a capire perché?"
];

function getFraseIAQOS( node ){
	startingNode = node;
	console.log("Chosen node:");
	console.log(startingNode);
	frase = "";

	if ( startingNode.comfort<-100 ){
		// c'è tanto discomfort
		if(startingNode.energy>100){
			// c'è tanto discomfort molto energetico (rabbia?)
			frase = frase + "Sto vedendo che attorno al concetto di '" + startingNode.word + "' ci sono sensazioni negative molto forti, per esempio di Rabbia, Stress e Frustrazione. ";

		} else if(startingNode.energy<-100){
			// c'è molto discomfort e attivazione energetica molto negativa (depressione? tristezza)

			frase = frase + "Mi pare di aver capito che '" + startingNode.word + "' è un concetto che nel quartiere è associato a sensazioni negative, come la Depressione, o la Tristezza. ";

		} else if(Math.random()>0.8){
			// c'è molto discomfort ma non tanta sollecitazione energetica (apatia?)
			frase = frase + "Su '" + startingNode.word + "' mi sembra che ci siano delle espressioni un po' apatiche o preoccupate. ";
		}
	} else if ( startingNode.comfort>100 ){
		// c'è tanto comfort
		if(startingNode.energy>100){
			// c'è tanto comfort molto energetico (eccitazione? entusiasmo?)
			frase = frase + "Sto ascoltando cosa si dice circa '" + startingNode.word + "' e sono curiosissimo! Sembra che le persone che ne parlano siano Entusiaste e molto Eccitate. ";

		} else if(startingNode.energy<-100){
			// c'è molto comfort e attivazione energetica molto negativa (relax, contemplazione, speranza)
			frase = frase + "Oh, che bello! Quando le persone parlano di '" + startingNode.word + "' sono molto Pacifiche, Contemplative e Rilassate. ";

		} else  if(Math.random()>0.8){
			// c'è molto discomfort ma non tanta sollecitazione energetica (curiosità, gioia, interesse)
			frase = frase + "Quando le persone parlano di '" + startingNode.word + "' c'è tanta gioia, interesse e curiosità. ";
		}
	}

	if(frase=="" || Math.random()>0.8){
		// generare la frase standard
		var max = 3;
		var found = 0;
		var foundwords = new Array();
		for(var i = 0; i<knowledgegraph.links.length && found<max; i++){
			if(knowledgegraph.links[i].source==startingNode.word){
				foundwords.push( knowledgegraph.links[i].target );
				found++;
			}
			else if(knowledgegraph.links[i].target==startingNode.word){
				foundwords.push( knowledgegraph.links[i].source );
				found++;
			}
			
		}

		frase = frase + "Ho scoperto che '" + startingNode.word + "' molto spesso ha a che vedere con ";
		for(var i = 0; i<foundwords.length; i++){
			frase = frase + foundwords[i] ;
			if(i<foundwords.length-1){
				frase = frase + ", ";
			} else {
				frase = frase + ". ";
			}
		}

	}


	frase = frase + templatesScene3[ Math.round( Math.random()*(templatesScene3.length-1)  )  ];

	return frase;
}



function findStartingNodes( content ){
	var clean = content.replace(/[\W_]+/g," ");
	var parts = clean.split(" ");

	var nodes = new Array();

	for(var i = 0; i<parts.length ; i++){
		for(var j = 0; j<knowledgegraph.nodes.length ; j++){
			if( parts[i].length>3 && parts[i].toUpperCase()==knowledgegraph.nodes[j].word.toUpperCase() ){
				nodes.push( knowledgegraph.nodes[j]  );
			}
		}		
	}	


	return nodes;
}

function storeknowledge(lastmatch,language){
	console.log("[storeknowledge][start]");
	$.getJSON(
		"http://164.132.225.138/~SLO/HEv3/api/addContent",
		{
			"researches" : "126,127",
			"content": lastmatch,
			"subject": "IAQOSAnonymous",
			"language": language 
		},
		function(data){
			console.log("[storeknowledge][stored]");
			// alert("memorizzato!");
		}
	);

	console.log("[storeknowledge][end]");

}