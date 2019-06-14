var lastknowledgegraph = null;
var lastdata = null;
var nodesscale = null;
var textsscale = null;
var linksscale = null;

$( document ).ready(function() {

	$("#trigger").click(function(){

		var testo = $("#txt").val();
		var language = $("#languageselect").val();
		storeknowledge(testo,language);

	});
	
});

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
