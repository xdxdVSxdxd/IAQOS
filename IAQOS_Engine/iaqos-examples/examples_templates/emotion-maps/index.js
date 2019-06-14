// NOTE: this only works out of the box: if you change your user, change here as well
var standarduser = "IAQOS";
var standardpwd = "IAQOS";
var domain = "test-domain";


var map;


$( document ).ready(function() {
    
    $("#domainspan").html( domain );

    $("#viz").width( 800 );    
    $("#viz").height( 600 );


    map = L.map('viz', {
        center: [41.8776105,12.5427137],
        zoom: 15
    }); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(map);
   
    $.getJSON("locations.json",function(data){


      console.log(data);

      for (var i = data.locations.length - 1; i >= 0; i--) {
        
        var marker = L.marker([data.locations[i].lat, data.locations[i].lon] , {
          "title" : data.locations[i].nome,
          "alt" : data.locations[i].nome
        }).addTo(map);


        // http://164.132.225.138/~SLO/HEv3/api/getMultipleKeywordStatistics?researches=126,127&keywords=sangalli

        var query = "http://164.132.225.138/~SLO/HEv3/api/getMultipleKeywordStatistics?researches=126,127&keywords=" + data.locations[i].search;

        var json = loadJSON(query);

        console.log(json);

        var popupcontent = "";

        var colore = "";
          if( parseFloat(json.results[0].comfort)>0 ){
            colore = "#00FF00";
          } else if( parseFloat(json.results[0].comfort)<0 ){
            colore = "#FF0000";
          } else {
            colore = "#000000";
          }


        if( parseInt(json.results[0].c)>0 && json.results[0].comfort!=null && json.results[0].energy!=null ){
          popupcontent = popupcontent + "<span class='headingo'>" + data.locations[i].nome + "</span><br /><span class='bignumber'>" + json.results[0].c + "</ span>" + "<br /><div class='littlebox' style='background: " + colore + "'></div><br /><span class='smallText'><strong>comfort </strong>: " + json.results[0].comfort + "<br /><strong>energy </strong>: " + json.results[0].energy + "</ span>";  

          

          L.circle([data.locations[i].lat, data.locations[i].lon], {radius: 5*parseInt(json.results[0].c) , color: colore }).addTo(map);

        } else {
          popupcontent = "Non ci sono state particolari espressioni emozionali riferite a questo luogo.";          
        }
        
        
        marker.bindPopup( popupcontent );

        
      }


    });

});


function loadJSON(filePath) {
  // Load json file;
  var json = loadTextFileAjaxSync(filePath, "application/json");
  // Parse json
  return JSON.parse(json);
}


function loadTextFileAjaxSync(filePath, mimeType)
{
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open("GET",filePath,false);
  if (mimeType != null) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();
  if (xmlhttp.status==200)
  {
    return xmlhttp.responseText;
  }
  else {
    // TODO Throw exception
    return null;
  }
}



