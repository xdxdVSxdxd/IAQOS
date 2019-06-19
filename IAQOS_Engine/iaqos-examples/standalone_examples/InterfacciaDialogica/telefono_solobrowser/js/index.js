var synth = window.speechSynthesis;
var voices = [];
var script = null;
var scriptstep = -1;


var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var lastmatch = null;
var lastdata = null;
var lastknowledgegraph = null;
var language = "it-IT";
var voice = "Luca";
var pitch = 1.9;
var rate = 0.6;


var recognition = null;

var nodesscale = d3.scaleLinear();
var linksscale = d3.scaleLinear();
var textsscale = d3.scaleLinear();

var turnedon = false;

var phrases = null;
function updateLanguage(){
	$.getJSON("phrases-" + language + ".json",function(data){
		phrases = data;
		//console.log("[Phrases loaded]");
		//console.log(phrases);
	});
}

var caratteri = "/|\\-=+<>.";
var loopOffMode = null;
function displayOffMode(){
	var stringona = "";
	for(var i = 0; i<18000; i++){
		stringona = stringona + caratteri.charAt(  Math.round(  Math.random()*(caratteri.length-1)  )  );
	}
	$("#offmodediv").text(stringona);
	$("#offmodediv").css("display", "block");
	/*
	if(loopOffMode!=null){
		clearTimeout(loopOffMode);
		loopOffMode = null;
	}
	setTimeout(displayOffMode,100);
	*/
}
function stopOffMode(){
	if(loopOffMode!=null){
		clearInterval(loopOffMode);
		//loopOffMode = null;
	}
	$("#offmodediv").css("display", "none");
}

$( document ).ready(function() {

	// $("#spritecontainer").width( $(window).width() );
	// $("#spritecontainer").height( $(window).height() );
	$("#activator").click(function(){

			updateLanguage();

		   	populateVoiceList();

		    $.getJSON("script.json",function(data){
		    	script = data;
		    	loopOffMode = setInterval( displayOffMode , 100 );
		    	connectToPhone();
		    });

		    // speak("Ciao! sono IAQOS!");

	});


});

var ctptimer = null;
function connectToPhone(){

	$("#offmodediv").click(function(){

		if(!turnedon){
			turnedon = true;
			stopOffMode();
			init();
		}

	});
	$("#deactivator").click(function(){

		if(turnedon){
			turnedon = false;
			if(recognition){
				recognition.abort();	
			}
			if(synth){
				synth.cancel();	
			}
			scriptstep = -1;
			//stop everything
			//document.location = document.location;
			loopOffMode = setInterval( displayOffMode , 100 );
		}

	});
	/*
	$.getJSON("http://127.0.0.1:8081/",function(data){})
	.done(function(data){
		var val = +(data[0].value);
		//console.log(val);
		if(val==1 ){
			if(!turnedon){
				turnedon = true;
				stopOffMode();
				init();
			}
		} else {
			if(turnedon){
				turnedon = false;
				//stop everything
				//document.location = document.location;
				loopOffMode = setInterval( displayOffMode , 100 );
			}
		}
	})
	.fail(function(){})
	.always(function(){
		if(ctptimer!=null){
			clearTimeout(ctptimer);
		}
		ctptimer = null;
		ctptimer = setTimeout(connectToPhone,400);
	});
	*/
}


function init(){
	console.log("INIT");
	lastmatch = null;
	lastdata = null;
	lastknowledgegraph = null;
	scriptstep = -1;
	executeScript();
    
}


function setupOffMode(){
	console.log("OFF MODE");
	lastmatch = null;
	lastdata = null;
	lastknowledgegraph = null;
	scriptstep = -1;
	$("#textcontainer").html("");
	$("#vizcontainer").html("");
	displayOffMode();
	if (synth.speaking) {
        synth.cancel();
    }

    
	
}

function getPhrase(ph){
	console.log("[GetPhrase]");
	var res = null;

	//console.log("[Searching for:" + ph + "]");
	//console.log(phrases);

	if(phrases!=null){
		if(phrases.phrases && phrases.phrases.length>0 ){
			for(var i = 0; i<phrases.phrases.length && res==null ; i++){
				if(phrases.phrases[i].name==ph){
					//console.log(phrases.phrases[i]);
					//console.log("[phrases.phrases[i].phrase.length:" + phrases.phrases[i].phrase.length + "]");
					var idx = Math.round( d3.randomUniform(0,phrases.phrases[i].phrase.length-1)() );
					if(phrases.phrases[i].phrase.length==1){
						idx = 0;
					}
					//console.log("[idx:" + idx + "]");
					res = phrases.phrases[i].phrase[   idx     ];
					//console.log("[Found:" + res + "]");
				}
			}
		}
	}

	if(res==null){
		//console.log("[Not found]")
		res = ph;
	}

	console.log("[GetPhrase][End]");
	return res;
}


function speak( what , goon, next , timeout ){
	console.log("[speak]");
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }

    synth.cancel();

    whatwhat = getPhrase(what.what);

    var utterThis = new SpeechSynthesisUtterance( whatwhat );

    console.log( utterThis );

    utterThis.onend = function (event) {
        //console.log('SpeechSynthesisUtterance.onend');
        console.log("[speak][onend]");
        if(goon){ 
        	if(next==null){
        		setTimeout(executeScript,what.delay);
        	} else {
        		if(timeout!=null){
        			setTimeout(next,timeout);	
        		} else {
        			setTimeout(next,what.delay);
        		}
        		
        	}
        }
    }
    utterThis.onerror = function (event) {
        console.log("[speak][onerror]");
        if(goon){ 
        	if(next==null){
        		setTimeout(executeScript,what.delay);
        	} else {
        		if(timeout!=null){
        			setTimeout(next,timeout);	
        		} else {
        			setTimeout(next,what.delay);
        		}
        		
        	}
        }
    }
    var idx = -1;
    for(var i = 0; i<voices.length && idx==-1; i++){
    	if(voices[i].name==voice && voices[i].lang==language){
    		idx = i;
    	}
    }
    if(idx==-1){
    	idx = 0;
    }
    //console.log(what);
    utterThis.voice = voices[idx];
    utterThis.pitch = pitch;
    utterThis.rate = rate;
    
    synth.speak(utterThis);
    animateIAQOStext( whatwhat );
    console.log("[speak][end]");
}


function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
  //console.log(voices);
}

function animateIAQOStext( what ){
	$("#textcontainer").animate({
		opacity: 0
	},100,function(){
		$("#textcontainer").text( what );
		$("#textcontainer").animate({
			opacity: 1
		},1000,function(){
			// finished
		});
	});
	
}


function executeScript(){
	if(!turnedon){
		return;
	}
	scriptstep++;
	console.log("Step:" + scriptstep + "; script lengh:" + script.length );
	if(scriptstep>script.length-1){
		scriptstep = 0;
	}
	var step = script[scriptstep];
	if(step.action=="speak"){
		speak(step,true,null,null);
	} else if(step.action=="capture"){
		capture(step);
	} else if(step.action=="manageinput"){
		manageInput(step);
	} else if(step.action=="storeknowledge"){
		storeknowledge(step);
	}
}

var capturetimeout = null;

function capture(what){

	console.log("[capture]");

	var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
	var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

	recognition = new SpeechRecognition();
	var speechRecognitionList = new SpeechGrammarList();
	speechRecognitionList.addFromString(grammar, 1);
	recognition.grammars = speechRecognitionList;
	//recognition.continuous = false;
	recognition.lang = language;
	recognition.interimResults = false;
	recognition.maxAlternatives = 1;
	recognition.start();

	lastmatch = null;
	lastknowledgegraph = null;
	lastdata = null;


	recognition.onresult = function(event) {
		console.log("[capture][onresult]");
		if(capturetimeout!=null){
			clearTimeout(capturetimeout);
			capturetimeout = null;
		}
	  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
	  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
	  // It has a getter so it can be accessed like an array
	  // The [last] returns the SpeechRecognitionResult at the last position.
	  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
	  // These also have getters so they can be accessed like arrays.
	  // The [0] returns the SpeechRecognitionAlternative at position 0.
	  // We then return the transcript property of the SpeechRecognitionAlternative object

	  var last = event.results.length - 1;
	  var res = event.results[last][0].transcript;

	  //console.log(event.results);

	  lastmatch = res;

	  console.log('Result received: ' + res + '.');
	  console.log('Confidence: ' + event.results[0][0].confidence);
	  speak(  { 
	  		"what" : res,
			"delay" : 1,
			"language": language,
			"voice" : voice,
			"pitch": pitch,
			"rate": rate
	  } , true , null , null );

	}

	recognition.onspeechend = function() {
		console.log("[capture][onspeechend]");
	  //recognition.stop();
	}

	/*
	recognition.onnomatch = function(event) {
	  console.log("I didn't recognise that color.");
	}
	*/

	recognition.onerror = function(event) {
		console.log("[capture][onerror]");
	  console.log('Error occurred in recognition: ' + event.error);
	  scriptstep = -1;
	  executeScript();
	}

	capturetimeout = setTimeout(  function(){
		recognition.abort();
		scriptstep = -1;
		executeScript();
	}  , 10000 );

	console.log("[capture][end]");

}





function captureMore(){

	console.log("[captureMore]");

	var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
	var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

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
		console.log("[captureMore][onresult]");
		if(capturetimeout!=null){
			clearTimeout(capturetimeout);
			capturetimeout = null;
		}
	  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
	  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
	  // It has a getter so it can be accessed like an array
	  // The [last] returns the SpeechRecognitionResult at the last position.
	  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
	  // These also have getters so they can be accessed like arrays.
	  // The [0] returns the SpeechRecognitionAlternative at position 0.
	  // We then return the transcript property of the SpeechRecognitionAlternative object

	  var last = event.results.length - 1;
	  var res = event.results[last][0].transcript;

	  //console.log(event.results);

	  if(lastmatch==null){
	  	lastmatch = "";
	  }

	  lastmatch = lastmatch + " . " + res;

	  console.log('Result received: ' + res + '.');
	  console.log('Confidence: ' + event.results[0][0].confidence);
	  
	  executeScript();
	  
	}

	recognition.onspeechend = function() {
		console.log("[captureMore][onspeechend]");
	  recognition.stop();
	}

	/*
	recognition.onnomatch = function(event) {
	  console.log("I didn't recognise that color.");
	}
	*/

	recognition.onerror = function(event) {
		console.log("[captureMore][onerror]");
	  console.log('Error occurred in recognition: ' + event.error);
	  scriptstep = -1;
	  executeScript();
	}

	capturetimeout = setTimeout(  function(){
		recognition.abort();
		scriptstep = -1;
		executeScript();
	}  , 10000 );

	console.log("[captureMore][end]");

}


function manageInput(step){
	console.log("[manageInput]");
	if(lastmatch!=null){
		
		$.getJSON('https://iaqos.online/iaqos-engine/?q={"name": "IAQOS", "pwd": "IAQOS","domain": "", "app": "", "function": "getKnowledgeAboutString", "params" : [  [ "string" , "' + lastmatch + '"] , [ "limit" , "50"]  ]  }' , function(data){
			//console.log(data);

			lastdata = data;

			var areThereResults = false;

			if(data.result.length!=0){
				for(var i = 0; i<data.result.length&&!areThereResults;i++){
					if(data.result[i].nodes){
						if(data.result[i].nodes.length>0){
							areThereResults = true;
						}
					}
				}
			}


			if(areThereResults){
				//IAQOS sa qualcosa circa la frase
				//console.log("[c]");
				setTimeout(expressKnowldge,3000);
			} else {
				//IAQOS non sa nulla circa la frase
				//console.log("[d]");
				setTimeout(expressNoKnowldge,3000);
			}


		});

	} else {
		speak(  { 
		  		"what" : "[NonCiSiamoCapiti]",
				"delay" : 1,
				"language": language,
				"voice" : voice,
				"pitch": pitch,
				"rate": rate
		  } , true, null, null );

	}

	console.log("[manageInput][end]");
}



function expressKnowldge(){

	console.log("[expressKnowldge]");

	//console.log("[f]");

	processData();

	if(lastdata!=null){
		// show viz of the knowledge
		showViz();
		// and then

		// express yourself
		speak(  { 
		  		"what" : "[QuestoQuelCheSo]",
				"delay" : 1,
				"language": language,
				"voice" : voice,
				"pitch": pitch,
				"rate": rate
		  } , true, generateMessage,3000 );

	} else {
		// then ask for more
		setTimeout(askForMoreKnowledge,2000);
	}
	console.log("[expressKnowldge][end]");
}


function generateMessage(){
	console.log("[generateMessage]");

	if(lastknowledgegraph!=null){

		var howmany = Math.min(3 , Math.round( lastknowledgegraph.links.length/4  ) );
		var results = new Array();
		for(var i = 0; i<howmany; i++){
			//console.log(lastknowledgegraph.links.length-1);
			var which = Math.round( d3.randomUniform(0,lastknowledgegraph.links.length-1)() );
			//console.log(which);
			//console.log(lastknowledgegraph.links[which]);
			var string = lastknowledgegraph.links[which].source.id + getPhrase("[DealsWith]") + lastknowledgegraph.links[which].target.id;
			results.push(string);
		}
		var totalString = getPhrase("[IncipitOfGeneratedMessage]") + results.join(",");
		console.log(totalString);
		speak(  { 
		  		"what" : totalString,
				"delay" : 1,
				"language": language,
				"voice" : voice,
				"pitch": pitch,
				"rate": rate
		} , true,askForMoreKnowledge,200 );
	} else {
		setTimeout(askForMoreKnowledge,2000);
	}

	console.log("[generateMessage][end]");
	
}

function expressNoKnowldge(){

	console.log("[expressNoKnowldge]");

	speak(  { 
	  		"what" : "[NonSoMolto]",
			"delay" : 1,
			"language": language,
			"voice" : voice,
			"pitch": pitch,
			"rate": rate
	  } , true, askForMoreKnowledge,2000 );

	console.log("[expressNoKnowldge][end]");

}

function askForMoreKnowledge(){
	console.log("[askForMoreKnowledge]");

	speak(  { 
	  		"what" : "[DammiDiPiu]",
			"delay" : 1,
			"language": language,
			"voice" : voice,
			"pitch": pitch,
			"rate": rate
	  } , true, captureMore, 2000 );

	console.log("[askForMoreKnowledge][end]");

}

var svg = null;
var simulation = null;
var g = null;
var link = null;
var node = null;
var labels = null;
var wwidth;
var hheight;
function showViz(){
	console.log("[showViz]");
	// show viz with knowledge
	wwidth = $("#vizcontainer").width();
	hheight = $("#vizcontainer").height();

	svg = null;
	$("#vizcontainer").html("");
	simulation = null;
	g = null;

	if(svg == null){
		svg = d3.select("#vizcontainer").append("svg")
		.style("width", $("#vizcontainer").width() + 'px')
  		.style("height", $("#vizcontainer").height() + 'px');
	}
	if(simulation == null){

		simulation = d3.forceSimulation(lastknowledgegraph.nodes)
		    .force("charge", d3.forceManyBody().strength(-500))
		    .force("link", d3.forceLink(lastknowledgegraph.links).distance(60))
		    .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
		    .force("x", d3.forceX())
		    .force("y", d3.forceY())
		    .alphaTarget(1)
		    .on("tick", ticked);

		
	}

	if(g==null){
		g = svg.append("g").attr("transform", "translate(" + wwidth / 2 + "," + hheight / 2 + ")");
		//g = svg.append("g");
	    link = g.append("g").selectAll(".link");
	    node = g.append("g").selectAll(".node");
	    labels = g.append("g").selectAll(".label");	
	}
	

	node = node.data(lastknowledgegraph.nodes, function(d) { return d.id;});

	node.exit().transition()
	  .attr("r", 0)
	  .remove();

	node = node.enter().append("circle")
	  .attr("fill", function(d) { return "#FFFF00"; })
	  .attr("class","node")
	  .attr("r", function(d) {
	  	//console.log(d); 
	  	var ww = +(d.weight); 
	  	//console.log("ww:" + ww + "-->" + nodesscale( ww ) );
	  	return nodesscale( ww); 
	  })
	  //.call(function(nn) { console.log(nn); nn.transition().attr("r", nn.weight); })
	.merge(node);



	labels = labels.data(lastknowledgegraph.nodes, function(d) { return d.id;});

	labels.exit().transition()
	  .attr("opacity", 0)
	  .remove();

	labels = labels.enter().append("text")
	  .attr("x", function(d) { return d.x; })
	  .attr("y", function(d) { return d.y; })
	  .attr("stroke", "#004400")
	  .attr("class","label")
	  .text(function(d){
	  	return d.id;
	  })
	  .attr("font-size",function(d){
	  	var ww = +(d.weight);
	  	return textsscale( ww ) + "px";
	  })
	  //.call(function(node) { node.transition().attr("font-size", "10px"); })
	.merge(node);


	// Apply the general update pattern to the links.
	link = link.data(lastknowledgegraph.links, function(d) { return d.source.id + "-" + d.target.id; });

	// Keep the exiting links connected to the moving remaining nodes.
	link.exit().transition()
	  .attr("stroke-opacity", 0)
	  .attrTween("x1", function(d) { return function() { return d.source.x; }; })
	  .attrTween("x2", function(d) { return function() { return d.target.x; }; })
	  .attrTween("y1", function(d) { return function() { return d.source.y; }; })
	  .attrTween("y2", function(d) { return function() { return d.target.y; }; })
	  .remove();

	link = link.enter().append("line")
	  .call(function(link) { 
	  	link.attr("class","link");
	  	link.transition().attr("stroke-opacity", 0.7); 
	  	link.attr("stroke", "#999999"); 
	  	link.transition().attr("stroke-width", function(d){ 
	  		var ww = +(d.weight);
	  		return linksscale(ww); 
	  	} ); 
	  })
	.merge(link);

	// Update and restart the simulation.
	simulation.nodes(lastknowledgegraph.nodes);
	simulation.force("link").links(lastknowledgegraph.links);
	simulation.alpha(1).restart();

	console.log("[showViz][end]");

}

function ticked() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

  labels.attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
}

function processData(){
	var maxnw = 0;
	var maxlw = 0;
	if(lastdata!=null){
		if(lastknowledgegraph==null){
			lastknowledgegraph = new Object();
			lastknowledgegraph.nodes = new Array();
			lastknowledgegraph.links = new Array();
		}
		for(var i = 0 ; i<lastdata.result.length; i++ ){
			if(lastdata.result[i].nodes && lastdata.result[i].links ){
				lastdata.result[i].nodes.forEach(function(e){
					var w = +(e.weight);
					if(w>maxnw){
						maxnw = w;
					}
				});
				lastdata.result[i].links.forEach(function(e){
					var w = +(e.weight);
					if(w>maxlw){
						maxlw = w;
					}
				});
				lastknowledgegraph.nodes = lastknowledgegraph.nodes.concat(  lastdata.result[i].nodes  );
				lastknowledgegraph.links = lastknowledgegraph.links.concat(  lastdata.result[i].links  );
			}
		}

		// handle duplicates in nodes
		function comparenodes(a,b){
			var ida = a.id.toUpperCase();
			var idb = b.id.toUpperCase();
			if(ida>idb){
				return 1;
			} else if(ida<idb){
				return -1;
			} else {
				return 0;
			}
		}
		lastknowledgegraph.nodes.sort( comparenodes );
	    for(var i = 1; i < lastknowledgegraph.nodes.length; ){
	        if(lastknowledgegraph.nodes[i-1].id === lastknowledgegraph.nodes[i].id ){
	        	lastknowledgegraph.nodes[i].weight = lastknowledgegraph.nodes[i].weight + lastknowledgegraph.nodes[i-1].weight;
	        	lastknowledgegraph.nodes[i].energy = (lastknowledgegraph.nodes[i].energy + lastknowledgegraph.nodes[i-1].energy)/2;
	        	lastknowledgegraph.nodes[i].comfort = (lastknowledgegraph.nodes[i].comfort + lastknowledgegraph.nodes[i-1].comfort)/2;
	            lastknowledgegraph.nodes.splice(i, 1);
	        } else {
	            i++;
	        }
	    }

	    //console.log("maxnw:" + maxnw);
	    //console.log("maxlw:" + maxlw);

	    nodesscale = d3.scaleLinear().domain([0,maxnw]).range([8,50]);
		textsscale = d3.scaleLinear().domain([0,maxnw]).range([10,50]);
		linksscale = d3.scaleLinear().domain([0,maxlw]).range([0.2,3]);


	    // handle duplicates in links

	    lastknowledgegraph.links.forEach(function(d){
			var sourceTemp = d.source; targetTemp = d.target;
			var sourceTempid = d.sourceid; targetTempid = d.targetid;
			if(d.source > d.target){
				d.source = targetTemp;
				d.target = sourceTemp;
				d.sourceid = targetTempid;
				d.targetid = sourceTempid;
			}
		});

		function comparelinks(a,b){
			var sourcea = a.source.toUpperCase();
			var sourceb = b.source.toUpperCase();
			var targeta = a.target.toUpperCase();
			var targetb = b.target.toUpperCase();
			var rt = 0;
			if(sourcea > sourceb){
				rt = 1;
			} else if(sourcea < sourceb){
				rt = -1;
			} else {
				if(targeta > targetb){
					rt = 1;
				} else if(targeta < targetb){
					rt = -1;
				} else {
					rt = 0;
				}
			}
			return rt;
		}

		lastknowledgegraph.links.sort(comparelinks);

	    for(var i = 1; i < lastknowledgegraph.links.length; ){
	        if(lastknowledgegraph.links[i-1].source === lastknowledgegraph.links[i].source  &&  lastknowledgegraph.links[i-1].target === lastknowledgegraph.links[i].target  ){
	        	lastknowledgegraph.links[i].weight = lastknowledgegraph.links[i].weight + lastknowledgegraph.links[i-1].weight;
	            lastknowledgegraph.links.splice(i, 1);
	        } else {
	            i++;
	        }
	    }


	    function comparenodesbyweight(a,b){
    		if(a.weight>b.weight){
    			return -1;
    		} else if(a.weight<b.weight){
    			return 1;
    		} else {
    			return 0;
    		}
    	}
    	lastknowledgegraph.nodes.sort(comparenodesbyweight);
	    while(lastknowledgegraph.nodes.length>200){
	    	var o = lastknowledgegraph.nodes.pop();
	    	for(var i = lastknowledgegraph.links.length-1; i>=0; i--){
	    		if(lastknowledgegraph.links[i].source==o.id || lastknowledgegraph.links[i].target==o.id){
	    			lastknowledgegraph.links.splice(i,1);
	    		}
	    	}
	    }
	    for(var i = lastknowledgegraph.links.length-1; i>=0; i--){
    		
    		var founds = false;
    		var foundt = false;
    		for(var j = 0; j<lastknowledgegraph.nodes.length && !(founds&&foundt); j++){
    			if(lastknowledgegraph.nodes[j].id==lastknowledgegraph.links[i].source){
    				founds = true;
    			}
    			if(lastknowledgegraph.nodes[j].id==lastknowledgegraph.links[i].target){
    				foundt = true;
    			}
    		}

    		if(!founds||!foundt){
    			lastknowledgegraph.links.splice(i,1);
    		}
    	}


	    //console.log("[ProcessedData]");
	    //console.log(lastknowledgegraph);

	}
}

function storeknowledge(step){
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
			speak(  { 
			  		"what" : "[AggiungoAQuelCheSo]",
					"delay" : 1,
					"language": language,
					"voice" : voice,
					"pitch": pitch,
					"rate": rate
			  } , true, null, null );
		}
	);

	console.log("[storeknowledge][end]");

}
