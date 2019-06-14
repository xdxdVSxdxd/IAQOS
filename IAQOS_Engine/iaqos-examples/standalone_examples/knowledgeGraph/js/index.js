var lastknowledgegraph = null;
var lastdata = null;
var nodesscale = null;
var textsscale = null;
var linksscale = null;

$( document ).ready(function() {

	$("#parola").val("mamma");
	getDataAboutWord("mamma");

	$("#sub").click(function(){
		var p = $("#parola").val();
		p = p.trim();
		getDataAboutWord(p);
	});

});



function getDataAboutWord(word){
	console.log("[getDataAboutWord]");
		
		$.getJSON('https://iaqos.online/iaqos-engine/?q={"name": "IAQOS", "pwd": "IAQOS","domain": "", "app": "", "function": "getKnowledgeAboutString", "params" : [  [ "string" , "' + word + '"], [ "limit" , "50"]  ]  }' , function(data){
			console.log(data);

			lastknowledgegraph = null;
			lastdata = data;

			processData();

			showViz();

		});


	console.log("[getDataAboutWord][end]");
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
		
	} else {
		//
	}

	console.log("[generateMessage][end]");
	
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
	



		var dragstarted = function(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        var dragged = function(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        
        var dragended = function(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
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
	  .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
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
	  		var ww = +(d.weight) ;
	  		return linksscale(ww); 
	  	} ); 
	  })
	.merge(link);


	//add zoom capabilities 
	var zoom_handler = d3.zoom()
	    .on("zoom", zoom_actions);

	zoom_handler(svg);

	// Update and restart the simulation.
	simulation.nodes(lastknowledgegraph.nodes);
	simulation.force("link").links(lastknowledgegraph.links);
	simulation.alpha(1).restart();

	console.log("[showViz][end]");

}

function zoom_actions(){
    g.attr("transform", d3.event.transform)
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
		textsscale = d3.scaleLinear().domain([0,maxnw]).range([8,40]);
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
			var sourcea = a.source;
			var sourceb = b.source;
			var targeta = a.target;
			var targetb = b.target;
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


	    console.log("[ProcessedData]");
	    console.log(lastknowledgegraph);

	}
}

function storeknowledge(){
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
		}
	);

	console.log("[storeknowledge][end]");

}
