
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent



$( document ).ready(function() {

	$("#trigger").click(function(){
		getSpeech();
	});
	
});


function getSpeech(){
	var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
	var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';


	var language = $("#languageselect").val();


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

	  if(confirm("Vuoi aggiungere '" + res + "' alle cose che sa IAQOS?")){
	  	storeknowledge(res,language);
	  }

	}

	recognition.onspeechend = function() {
		console.log("[capture][onspeechend]");
	  //recognition.stop();
	}


	recognition.onerror = function(event) {
		console.log("[capture][onerror]");
	  console.log('Error occurred in recognition: ' + event.error);
	}
}



function storeknowledge(lastmatch,language){
	console.log("[storeknowledge][end]");
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
			alert("memorizzato!");
		}
	);

	console.log("[storeknowledge][end]");

}
