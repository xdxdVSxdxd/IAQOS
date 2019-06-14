// NOTE: this only works out of the box: if you change your user, change here as well
var standarduser = "IAQOS";
var standardpwd = "IAQOS";
var domain = "test-domain";


$( document ).ready(function() {
    
    $("#domainspan").html( domain );

    generateText();

});



function generateText(){

  //var query = "{  \"name\": \"" + standarduser + "\", \"pwd\": \"" + standardpwd + "\", \"domain\": \"" + domain + "\", \"function\": \"getTEXTSnetwork\", \"params\" : [  ]  }";
  $.getJSON("http://164.132.225.138/~SLO/HEv3/api/getWordNetwork?researches=126,127&limit=200") //, { "q" : query })
  .done(function(data){
    console.log(data);

    var output = "";

    var idx = Math.round(  Math.random()*(data.nodes.length - 1 ) );
    
    var currentnode = data.nodes[idx];
    console.log(currentnode);

    var links = getLinks(data,currentnode);



    var uniquelinks = [];
    $.each(links, function(i, el){
        if($.inArray(el, uniquelinks) === -1) uniquelinks.push(el);
    });

    console.log(uniquelinks);

    for(var i = 0; i<uniquelinks.length; i++){
      output = output + uniquelinks[i].target + " ";
    }

    $("#viz").html( output );

    
  })
  .fail(function( jqxhr, textStatus, error ){
      //fare qualcosa in caso di fallimento
  });
        

}



function getLinks(data,node){

  var r = new Array();

  for(var i = 0; i<data.links.length; i++){
    if(data.links[i].source==node.id ) { //|| data.links[i].target==node.id ){
      r.push( data.links[i]);
    }
  }

  return r;
}