
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


$( document ).ready(function() {

	$("#scene0").on("click",function(){
		if(confirm("Vuoi incominciare?")){
			if(generaltimeout!=null){
				clearTimeout(generaltimeout);
				generaltimeout = null;
			}
					stopScene1();
					stopScene2();
					stopScene3();
					stopScene4();
					stopScene5();
					stopScene6();
					interactionword=null;
					scene2();	
		}
	});

	$("#scene3").on("click",function(){
		stopScene3();
		scene4();
	});

	scene1();
	
});


var interactionword = null;

var timerlargeiaqos = null;

var knowledgegraph = null;

var frase = "";

var startingNode = null;

var generaltimeout = null;
var GENERALTIME = 6000;

function restartall(){
	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}
			stopScene1();
			stopScene2();
			stopScene3();
			stopScene4();
			stopScene5();
			stopScene6();
			interactionword=null;
			scene1();
}


function stopScene1(){

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}


	clearInterval(timerlargeiaqos);
	$("#IAQOSgrande").stop( true, true );
	$("#scene1").css("display","none");
	console.log("[stopped scene 1]");
}

function scene1(){
	console.log("[starting scene 1]");
	$("#scene1").css("display","block");

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}
	generaltimeout = setTimeout("restartall",GENERALTIME);

	var f = function(){

		$("#IAQOSgrande").animate({
          color: "#FF0000"
        }, 1000 ,function(){

        	$("#IAQOSgrande").animate({
		          color: "#00FF00"
		        }, 1000 ,function(){

		        });


        });	
	}

	timerlargeiaqos = setInterval(f, 4000);

	
}

function stopScene2(){

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}


	$("#scene2").css("display","none");
	console.log("[stopped scene 2]");
}

function scene2(){
	console.log("[starting scene 2]");
	$("#scene2").css("display","block");

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}
	generaltimeout = setTimeout("restartall",GENERALTIME);

	var f = function(){
		stopScene2();
		scene3();
	}
	//setTimeout(f,3000);
	if(interactionword==null){
		$.getJSON("http://164.132.225.138/~SLO/HEv3/api/getWordNetwork?researches=126,127&limit=200",function(data){

		})
		.done(function(data) {
			console.log( "[loaded knowledge graph]" );
			knowledgegraph = data;
			//console.log(knowledgegraph);
			stopScene2();
			scene3();
		})
		.fail(function() {
			console.log( "[error downloading knowledge graph]" );
			stopScene2();
			scene1();
		});
	} else {
		$.getJSON("http://164.132.225.138/~SLO/HEv3/api/getWordNetworkForWord?researches=126,127&limit=200&word=" + interactionword ,function(data){

		})
		.done(function(data) {
			console.log( "[loaded knowledge graph]" );
			knowledgegraph = data;
			//console.log(knowledgegraph);
			stopScene2();
			scene3();
		})
		.fail(function() {
			console.log( "[error downloading knowledge graph]" );
			stopScene2();
			scene1();
		});
	}
	
}






function stopScene3(){

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}

	$("#scene3").css("display","none");
	console.log("[stopped scene 3]");

}

function scene3(){
	console.log("[starting scene 3]");
	$("#scene3").css("display","block");

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}
	generaltimeout = setTimeout("restartall",GENERALTIME);

	var frase = "Ops! Ho avuto dei problemi di memoria: riproviamo a interagire tra poco."

	if(knowledgegraph!=null){

		// generare frase e gestire interazione

		frase = getFraseForScene3();
		$("#IAQOSSaysSomething").html(frase);
		
		setTimeout(function(){
			stopScene3();
			scene4();	
		},4000);


	} else {
		// non ho preso il knowledge graph
		stopScene3();
		scene1();
	}

}



function stopScene4(){

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}

	$("#scene4").css("display","none");
	console.log("[stopped scene 4]");

}

function scene4(){
	console.log("[starting scene 4]");

	$("#scene4").css("display","block");

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}
	generaltimeout = setTimeout("restartall",GENERALTIME);

	$("#IAQOSSaysSomething2").html(frase);


	getSpeech();


}



var templatesScene5 = [
	"Quindi mi stai dicendo che se mi interessa '[1]' dovrei capire qualcosa circa '[2]'. Benissimo!",
	"Oh, bene, quindi '[1]' c'entra con '[2]'. Me lo ricorderò."
];

function stopScene5(){

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}

	$("#scene5").css("display","none");
	console.log("[stopped scene 5]");

}

function scene5(input){
	// ringrazia, prendi una parola dall'output, vedi se c'è nel knowledge graph, se cè costruiscici sopra una richiesta e riinizia
	console.log("[starting scene 5]");

	$("#scene5").css("display","block");

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}
	generaltimeout = setTimeout("restartall",GENERALTIME);

	var frasepulita = input.replace(/[\W_]+/g," ");

	var parolalunga = "";
	var partirisposta = frasepulita.split(" ");
	for(var i = 0; i<partirisposta.length; i++){
		if(partirisposta[i].length>parolalunga.length || Math.random()>0.99 ){
			parolalunga = partirisposta[i];
		}
	}

	var idx = Math.round( Math.random()*(templatesScene5.length-1) );
	var template = templatesScene5[idx];
	template = template.replace("[1]" , startingNode.word);
	template = template.replace("[2]" , parolalunga);

	$("#IAQOSSaysSomething3").html(template);

	storeknowledge( startingNode.word + ":" + input,"it");

	interactionword = parolalunga;

	setTimeout(function(){
		stopScene5();
		scene6();
	},4000);

}



function stopScene6(){

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}
	$("#scene6").css("display","none");
	console.log("[stopped scene 6]");

}

function scene6(){
	// ringrazia, prendi una parola dall'output, vedi se c'è nel knowledge graph, se cè costruiscici sopra una richiesta e riinizia
	console.log("[starting scene 6]");

	$("#scene6").css("display","block");

	if(generaltimeout!=null){
		clearTimeout(generaltimeout);
		generaltimeout = null;
	}
	generaltimeout = setTimeout("restartall",GENERALTIME);

	var frase = "E quindi mi vuoi parlare ancora di come [1] ha a che fare con [2]?";
	frase = frase.replace("[1]",startingNode.word);
	frase = frase.replace("[2]",interactionword);
	$("#IAQOSSaysSomething4").html(frase);

	getSpeechFor6();

}


var templatesScene3 = [
	"Cosa ne pensi?",
	"Cosa ne sai?",
	"Mi aiuti a capire perché?"
];
function getFraseForScene3(){
	var idx = Math.round(  Math.random() * (knowledgegraph.nodes.length-1)  );
	startingNode = knowledgegraph.nodes[idx];
	console.log("Chosen node:");
	console.log(startingNode);
	frase = "Ciao! ";

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

	if(frase=="Ciao! " || Math.random()>0.8){
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










function getSpeech(){
	var colors = [ 'IAQOS','jacos'];
	var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';


	var language = 'it-IT';


	var recognition = new SpeechRecognition();
	var speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	//recognition.continuous = false;
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

	  /*
	  if(confirm("Vuoi aggiungere '" + res + "' alle cose che sa IAQOS?")){
	  	storeknowledge(res,language);
	  }
	  */

	  var rr = res.toUpperCase();

	  if( rr.search(/(^NIENTE[^a-z0-9]?|[^a-z0-9]NIENTE[^a-z0-9]?)/igm)!=-1 || rr.search(/(^NULLA[^a-z0-9]?|[^a-z0-9]NULLA[^a-z0-9]?)/igm)!=-1 || rr.search(/(^NO[^a-z0-9]?|[^a-z0-9]NO[^a-z0-9]?)/igm)!=-1  || rr.search(/(^BOH[^a-z0-9]?|[^a-z0-9]BOH[^a-z0-9]?)/igm)!=-1   || rr.search(/(^CHE NE SO[^a-z0-9]?|[^a-z0-9]CHE NE SO[^a-z0-9]?)/igm)!=-1    || rr.search(/(^COSA NE SO[^a-z0-9]?|[^a-z0-9]COSA NE SO[^a-z0-9]?)/igm)!=-1   || rr.search(/(^SO NULLA[^a-z0-9]?|[^a-z0-9]SO NULLA[^a-z0-9]?)/igm)!=-1   ){
	  	stopScene4(); // mandare una scena in cui IAQOS dice qualcosa come "Ah! Mi dispiace! Se scopro qualcosa te la dico."
	  	interactionword = null;
	  	scene3();
	  } else {
	  	//fai qualcosa con l'output
	  	stopScene4();
	  	scene5(res);
	  }

	}

	recognition.onspeechend = function() {
		console.log("[capture][onspeechend]");
	  //recognition.stop();
	}


	recognition.onerror = function(event) {
		console.log("[capture][onerror]");
	  console.log('Error occurred in recognition: ' + event.error);
	  stopScene4();
	  scene1();
	}
}





function getSpeechFor6(){
	var colors = [ 'IAQOS','jacos'];
	var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';


	var language = 'it-IT';


	var recognition = new SpeechRecognition();
	var speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	//recognition.continuous = false;
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

	  /*
	  if(confirm("Vuoi aggiungere '" + res + "' alle cose che sa IAQOS?")){
	  	storeknowledge(res,language);
	  }
	  */

	  var rr = res.toUpperCase();

	  if( rr.search(/(^NIENTE[^a-z0-9]?|[^a-z0-9]NIENTE[^a-z0-9]?)/igm)!=-1 || rr.search(/(^NULLA[^a-z0-9]?|[^a-z0-9]NULLA[^a-z0-9]?)/igm)!=-1 || rr.search(/(^NO[^a-z0-9]?|[^a-z0-9]NO[^a-z0-9]?)/igm)!=-1  || rr.search(/(^BOH[^a-z0-9]?|[^a-z0-9]BOH[^a-z0-9]?)/igm)!=-1   || rr.search(/(^CHE NE SO[^a-z0-9]?|[^a-z0-9]CHE NE SO[^a-z0-9]?)/igm)!=-1    || rr.search(/(^COSA NE SO[^a-z0-9]?|[^a-z0-9]COSA NE SO[^a-z0-9]?)/igm)!=-1   || rr.search(/(^SO NULLA[^a-z0-9]?|[^a-z0-9]SO NULLA[^a-z0-9]?)/igm)!=-1   ){
	  	stopScene6(); // mandare una scena in cui IAQOS dice qualcosa come "Ah! Mi dispiace! Se scopro qualcosa te la dico."
	  	interactionword = null;
	  	scene1();
	  } else {
	  	//fai qualcosa con l'output
	  	stopScene6();
	  	scene5(res);
	  }

	}

	recognition.onspeechend = function() {
		console.log("[capture][onspeechend]");
	  //recognition.stop();
	}


	recognition.onerror = function(event) {
		console.log("[capture][onerror]");
	  console.log('Error occurred in recognition: ' + event.error);
	  stopScene6();
	  scene1();
	}
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
