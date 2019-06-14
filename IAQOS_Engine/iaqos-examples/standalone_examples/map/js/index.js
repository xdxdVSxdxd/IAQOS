window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

const recognition = new window.SpeechRecognition();
var synth = window.speechSynthesis;

var map = null;
const body = document.querySelector('body');
var ultimolngocliccato = null;

var lateststories = null;


var gridx = 120;
var gridy = 90;

$( document ).ready(function() {

	/*
	$("#streetview").click(function(){
		hideeverything();
	});
	*/

	$("#crea").click(function(){

		startstory();
	});

	$("#startrecording").click(function(){

		startrecordingf();
	});


	$("#smetti").click(function(){

		finishrecording();
	});


	$("#OKStory").click(function(){
		memorizzastoria();
	});

	$("#NOKStory").click(function(){
		buttastoria();
	});

	$("#stop").click(function(){
		synth.cancel();
		$("#stop").css("display","none");
	});

	


	body.onkeydown = function(e) {
  		/*
  		if (!e.metaKey) {
  			e.preventDefault();
  		}
  		*/
  		console.log(e.keyCode);
  		if(e.keyCode==27 && $("#streetview").css("display")=="block"  ){
  			hideeverything();
  		}
  	};
    
	
});

function showstoryfull(i){

	var voices = synth.getVoices();
	var voice = null;


	if(lateststories!=null){
		var storia = lateststories[i];

		//console.log(storia.language.toUpperCase());

		for(var k = 0; k<voices.length&&voice==null; k++){
			if(voices[k].lang.toUpperCase()==storia.language.toUpperCase()){
				voice = voices[k];
			}
		}

		if(voice!=null){
			$("#stop").css("display","block");
			var utterThis = new SpeechSynthesisUtterance(storia.story);
			utterThis.voice = voice;
			utterThis.onend = function(event) {
				$("#stop").css("display","none");
			}
			synth.speak(utterThis);
		}

		



	}
}

function hideeverything(){
	$("#streetview").css("display","none");
	$("#crea").css("display","none");
	$("#mostrastorie").css("display","none");
	$("#createstory").css("display","none");
	$("#showstory").css("display","none");
	$("#smetti").css("display","none");
	$("#stop").css("display","none");
}

function openstreetview(ll){
	$("#streetview").css("display","block");
	$("#crea").css("display","block");




		var dw = $(document).width()/gridx;
		var dy = $(document).height()/gridy;

		var storiequi = "";

		var cx = -1;
		var cy = -1;

		for(var i = 0; i<gridx; i++){
			for(var j = 0; j<gridy; j++){
				var minx = i*dw;
				var miny = j*dy;
				var maxx = minx + dw;
				var maxy = miny + dy;
				var minlatlng = point2LatLng(  {x: minx, y: miny} , map );
				var maxlatlng = point2LatLng(  {x: maxx, y: maxy} , map );

				//console.log("----------------");
				//console.log("minlat:" + minlatlng.lat() + ";minlng:" + minlatlng.lng());
				//console.log("maxlat:" + maxlatlng.lat() + ";maxlng:" + maxlatlng.lng());

				var minlat = minlatlng.lat();
				var maxlat = maxlatlng.lat();
				if(maxlatlng.lat()<minlat){
					minlat = maxlatlng.lat();
					maxlat = minlatlng.lat();
				}

				var minlng = minlatlng.lng();
				var maxlng = maxlatlng.lng();
				if(maxlatlng.lng()<minlng){
					minlng = maxlatlng.lng();
					maxlng = minlatlng.lng();
				}

				if( ll.lat>=minlat && ll.lng>=minlng && ll.lat<maxlat && ll.lng>maxlng  ){
					cx = i;
					cy = j;
				}


			}
		}


	if(cx!=-1&&cy!=-1){
		// console.log("cx=" + cx + ";cy=" + cy);
		var isthere = false;
		for(var k = 0; k<lateststories.length; k++){
			//console.log("this lat:" + lateststories[k].lat + ";this lng:" + lateststories[k].lng );
			if( Math.abs(lateststories[k].cx-cx)<2 && Math.abs(lateststories[k].cy-cy)<2 ){
				storiequi = storiequi + "<a href='javascript:showstoryfull(" + k + ");' class='anound' ><span class='storyemotion'>" + lateststories[k].emotion + "</span><span class='storyexcerpt'>" +  lateststories[k].story.substring(0,22) + "...</span></a><br />";
				isthere = true;
			}
		}	

		if(isthere){
			var storiequa = "Qui ci sono queste storie:<br />" + storiequi;
			storiequi = storiequa;
		} else {
			storiequi = "<span class='storyemotion'>Non ci sono storie in questo punto.</span><br />";	
		}

	} else {
		storiequi = "<span class='storyemotion'>Non ci sono storie in questo punto.</span><br />";
	}

	console.log(storiequi);
	
	$("#mostrastorie").html(storiequi);




	$("#mostrastorie").css("display","block");

		var posi = {lat: ll.lat, lng: ll.lng };
		var panorama = new google.maps.StreetViewPanorama(
				document.getElementById('streetview'), {
				position: posi
			});


		map.setStreetView(panorama);	
}




function initMap(){

	var mapstyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#EEEEEE"
      }
    ]
  },
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#FFFFFF"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f3f3f3"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#222244"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#333344"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e8e8e8"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#cecdcc"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#aaa9a9"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffeb3b"
      },
      {
        "weight": 4
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

	map = new google.maps.Map(document.getElementById('mapdiv'), {
	  center: {lat: 41.880823, lng: 12.5409047},
	  zoom: 15,
	  clickableIcons: false,
	  disableDefaultUI: true,
	  disableDoubleClickZoom: true,
	  mapTypeControl: false,
	  panControl: false,
	  restriction: {
	  	latLngBounds: {north: 41.892469, south: 41.869496, west: 12.532430, east: 12.553596}, 
	  },
	  rotateControl: false,
	  scaleControl: false,
	  styles: mapstyle
	});


	map.addListener('click',function(event){
		console.log(event);
		var ll = {
			lat: event.latLng.lat(),
			lng: event.latLng.lng()
		};
		openstreetview(ll);
	});


	getstories();

	
}

function initoverlay(){
	var dw = $(document).width()/gridx;
	var dy = $(document).height()/gridy;

	$("#grid").html("");

	var svg = d3.select("#grid").append("svg").attr("width", $(document).width()).attr("height", $(document).height());

	for(var i = 0; i<gridx; i++){
		for(var j = 0; j<gridy; j++){

			var colore = "rgba(255,255,255,0)";
			if(lateststories!=null){
				for(var k = 0; k<lateststories.length; k++){
					if(lateststories[k].cx==i && lateststories[k].cy==j){
						if(lateststories[k].emotion=="Gioia"){
							colore = "rgba(236,248,41,0.8)";
						} else if(lateststories[k].emotion=="Tristezza"){
							colore = "rgba(61,25,243,0.8)";
						} else if(lateststories[k].emotion=="Rabbia"){
							colore = "rgba(255,0,0,0.8)";
						} else if(lateststories[k].emotion=="Paura"){
							colore = "rgba(119,83,7,0.8)";
						} else if(lateststories[k].emotion=="Disgusto"){
							colore = "rgba(211,89,241,0.8)";
						} else if(lateststories[k].emotion=="Sorpresa"){
							colore = "rgba(255,150,0,0.8)";
						} else if(lateststories[k].emotion=="Attesa"){
							colore = "rgba(245,194,122,0.8)";
						} else if(lateststories[k].emotion=="Accettazione"){
							colore = "rgba(37,195,0,0.8)";
						} 
					}
				}	
			}
			


			svg.append("rect")
				.attr("x", i*dw)
				.attr("y", j*dy)
				.attr("width", dw)
				.attr("height", dy)
				.style("fill" , colore)
				.style("stroke" , "rgba(0,0,0,0.01)")
				.on("click", function(d){
					console.log("[click grid]");
					var recto = d3.select(this);
					var pointo = {
							x: parseFloat(recto.attr("x")) + parseFloat(recto.attr("width"))/2,
							y: parseFloat(recto.attr("y")) + parseFloat(recto.attr("height"))/2
						};

					console.log(pointo);
					ultimolngocliccato = point2LatLng(pointo,map);
					openstreetview({
						lat: ultimolngocliccato.lat(),
						lng: ultimolngocliccato.lng()
					});
				});
		}		
	}
}



var storia = "";


function latLng2Point(latLng, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
  return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
}

function point2LatLng(point, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
}


function startrecordingf(){

	$("#createstory").css("display","none");
	$("#smetti").css("display","block");

	// mettere visual cue
	recognition.lang = $("#language").val();
	recognition.continuous = true;
	storia = "";

	var elaborastoria = function(event){
		console.log(event);
		var speechToText = event.results[   event.results.length-1  ][0].transcript;
	  	storia = storia + speechToText + " ";
	};

	recognition.onresult = elaborastoria;

	recognition.start();
}


function startstory(){
	$("#createstory").css("display","block");
	$("#crea").css("display","none");
	$("#mostrastorie").css("display","none");
}


function finishrecording(){
	$("#smetti").css("display","none");
	recognition.stop();
	setTimeout(function(){
		confermastoria();
	},2000);	
}

function confermastoria(){
	$("#showstory").css("display","block");
	$("#emozioneshow").text( $("#emotion").val() );
	$("#testoshow").val( storia );
}

function memorizzastoria(){

	var storiadamemorizzare = $("#testoshow").val();
	var emozionedamemorizzare = $("#emotion").val();
	var coordinatadamemorizzare = map.getStreetView().getPosition();
	console.log("Memorizzo");
	console.log("=========");
	console.log("Storia:");
	console.log(storiadamemorizzare);
	console.log("Emozione:");
	console.log(emozionedamemorizzare);
	console.log("Coordinate:");
	console.log(coordinatadamemorizzare);

	$("#showstory").css("display","none");

	// memorizza e poi nascondi tutto

	$.getJSON("https://iaqos.online/iaqos-engine/stories/storestories.php",{
		"story" : storiadamemorizzare,
		"emotion": emozionedamemorizzare,
		"language": $("#language").val(),
		"lat": coordinatadamemorizzare.lat(),
		"lng": coordinatadamemorizzare.lng()
	},function(data){
		console.log(data);
		getstories();
	});

	storia = "";
	hideeverything();

}

function buttastoria(){

	storia = "";
	$("#showstory").css("display","none");
	hideeverything();
	
}

function getstories(){
	d3.json("https://iaqos.online/iaqos-engine/stories/getstories.php",function(data){
		lateststories = data;

		for(var k = 0; k<lateststories.length; k++){
			lateststories[k].lat = +lateststories[k].lat;
			lateststories[k].lng = +lateststories[k].lng;
			lateststories[k].cx = -1;
			lateststories[k].cy = -1;
		}
		var dw = $(document).width()/gridx;
		var dy = $(document).height()/gridy;

		for(var i = 0; i<gridx; i++){
			for(var j = 0; j<gridy; j++){
				var minx = i*dw;
				var miny = j*dy;
				var maxx = minx + dw;
				var maxy = miny + dy;
				var minlatlng = point2LatLng(  {x: minx, y: miny} , map );
				var maxlatlng = point2LatLng(  {x: maxx, y: maxy} , map );

				//console.log("----------------");
				//console.log("minlat:" + minlatlng.lat() + ";minlng:" + minlatlng.lng());
				//console.log("maxlat:" + maxlatlng.lat() + ";maxlng:" + maxlatlng.lng());

				var minlat = minlatlng.lat();
				var maxlat = maxlatlng.lat();
				if(maxlatlng.lat()<minlat){
					minlat = maxlatlng.lat();
					maxlat = minlatlng.lat();
				}

				var minlng = minlatlng.lng();
				var maxlng = maxlatlng.lng();
				if(maxlatlng.lng()<minlng){
					minlng = maxlatlng.lng();
					maxlng = minlatlng.lng();
				}

				for(var k = 0; k<lateststories.length; k++){
					//console.log("this lat:" + lateststories[k].lat + ";this lng:" + lateststories[k].lng );
					if( lateststories[k].lat>=minlat && lateststories[k].lng>=minlng && lateststories[k].lat<maxlat && lateststories[k].lng>maxlng  ){
						lateststories[k].cx = i;
						lateststories[k].cy = j;
					}
				}

			}
		}

		console.log(lateststories);
		initoverlay();
		
	});
}