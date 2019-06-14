// NOTE: this only works out of the box: if you change your user, change here as well
var standarduser = "IAQOS";
var standardpwd = "IAQOS";
var domain = "test-domain";


$( document ).ready(function() {
    
    $("#domainspan").html( domain );

    getTopicRelations(true);

});



//getTopicRelations()
var wgwidth, wgheight;
var wgcolor;
var wgforce;
var wgsvg1,wgsvg;
var maxn = 1;
var radius = 20;
function redrawwords() {
    //console.log("here", d3.event.translate, d3.event.scale);
    wgsvg.attr("transform",
        "translate(" + d3.event.translate + ")"
        + " scale(" + d3.event.scale + ")");
}

function getTopicRelations(clearGraph){
        $("#viz").html("");
        wgwidth = $("#viz").width();
        wgheight = 900;
        $("#viz").height( wgheight );

        wgcolor = d3.scale.category20();

        wgforce = d3.layout.force()
          .linkDistance(40)
          .linkStrength(0.5)
          .charge(-90)
          .size([wgwidth, wgheight]);

        wgforce.drag()
          .on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); });

        wgsvg1 = d3.select("#viz").append("svg")
          .attr("width", wgwidth)
          .attr("height", wgheight)
          .attr("pointer-events", "all");

        wgsvg = wgsvg1
          .append('svg:g')
          .call(d3.behavior.zoom().on("zoom", redrawwords))
          .append('svg:g');


          wgsvg
          .append('svg:rect')
          .attr('x', -10000)
          .attr('y', -10000)
          .attr('width', 20000)
          .attr('height', 20000)
          .attr('fill', 'white');

         // https://iaqos.online/iaqos-engine/?q={	"name": "IAQOS", "pwd": "IAQOS",	"domain": "test-domain", "function": "getTEXTSnetwork", "params" : [  ]  }

        var query = "{	\"name\": \"" + standarduser + "\", \"pwd\": \"" + standardpwd + "\",	\"domain\": \"" + domain + "\", \"function\": \"getTEXTSnetwork\", \"params\" : [  ]  }";
        $.getJSON("https://iaqos.online/iaqos-engine/", { "q" : query })
        .done(function(data){

        	// console.log(data);

        	data.result.links.forEach( function(d){
        		d.target = +d.target;
        		d.source = +d.source;
        		d.weight = +d.weight;
        	} );

        	data.result.nodes.forEach( function(d){
        		d.id = +d.id;
        		d.weight = +d.weight;
        	} );

            var graph = data.result;

            var nodes = graph.nodes.slice(),
              links = [],
              bilinks = [];

            maxn = 1;

			console.log("[graph.links]");
			console.log(graph.links);

            graph.links.forEach(function(link) {

            	console.log("[foreach]");
                var founds = false;
                var foundt = false;
                for(var k = 0; k<nodes.length && (!founds || !foundt); k++){
                    if(nodes[k].id==link.source){
                        founds = true;
                        link.source = k;
                    }
                    if(nodes[k].id==link.target){
                        foundt = true;
                        link.target = k;
                    }
                }

              
              var s = nodes[link.source],
                  t = nodes[link.target],
                  i = {n: 1, weight: 1}; // intermediate node
              console.log("[foreach:S]");
              console.log(s);
              console.log("[foreach:T]");
              console.log(t);

              nodes.push(i);
              links.push({source: s, target: i}, {source: i, target: t});
              bilinks.push([s, i, t]);
              console.log("[foreach END]");
            });


            nodes.forEach(function(node){
              node.c = +node.weight;
              if(node.c>maxn){ maxn = node.c; }
            });

            console.log(links);
            
            wgforce
              .nodes(nodes)
              .links(links)
              .start();

            
            var link = wgsvg.selectAll(".link")
              .data(bilinks)
              .enter().append("path")
              .attr("class", "link");

            var node = wgsvg.selectAll(".node")
              .data(graph.nodes);


            var nodeEnter = node
                            .enter()
                            .append("svg:g")
                            .attr("class", "node")
                            .call(wgforce.drag);

            wgsvg.selectAll(".node")
              .on("click",function(d){
                if (d3.event.shiftKey) {
                  document.location = "dosomething?iinput=" + d.word + "&w=" + project;
                }
              });

            nodeEnter.append("circle")
              .attr("r", function(d){ return 4+(100*d.c/maxn); });
              //.style("fill", function(d) { return wgcolor(d.n); });

            var wgtexts = nodeEnter.append("svg:text")
              .attr("class", "nodetext")
              .attr("dx", function(d){  return 12; })
              .attr("dy", ".35em")
              .style("font-size",function(d){ return 4 + (40*d.c/maxn); })
              .text(function(d) { return d.name });

            node.append("title")
              .text(function(d) { return d.name; });

            wgforce.on("tick", function() {

              link.attr("d", function(d) {
                return "M" + d[0].x + "," + d[0].y + "S" + d[1].x + "," + d[1].y + " " + d[2].x + "," + d[2].y;
              });
              
              

              node.attr("transform", function(d) {

                var ddx = d.x;
                var ddy = d.y;
                //if(ddx<0){ddx=0;} else if(ddx>wgwidth){ddx=wgwidth;}
                //if(ddy<0){ddy=0;} else if(ddy>wgheight){ddy=wgheight;}

                return "translate(" + ddx + "," + ddy + ")";
              });
              

              //node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min( wgwidth - radius, d.x)); })
              //    .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(wgheight - radius, d.y)); });

              link.attr("x1", function(d) { return d[0].x; })
                  .attr("y1", function(d) { return d[0].y; })
                  .attr("x2", function(d) { return d[1].x; })
                  .attr("y2", function(d) { return d[1].y; });

              wgtexts
                  .attr("dx", function(d) {   

                    val = 0;

                    if(d.x>wgwidth/2){
                      val = -12;// - d.n/4 - this.getComputedTextLength();
                    } else {
                      val = 12;// + d.n/4;
                    }

                    return val;

                  });


            });

        })
        .fail(function( jqxhr, textStatus, error ){
            //fare qualcosa in caso di fallimento
        });
        //
}
//getTopicRelations() end
