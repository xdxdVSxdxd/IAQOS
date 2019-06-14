const Firmata = require("firmata");
const http = require("http");
const board = new Firmata("/dev/cu.usbmodem1421");

var isBrowserOpen = false;
var v = 0;

board.on("ready", () => {
  // Arduino is ready to communicate
  //console.log(board.pins.length);
  board.pinMode(8,board.MODES.PULLUP);
  console.log(board.pins);
  

  /*
  board.digitalRead(2, function(value) {
	  console.log("The value of digital pin 2 changed to: " + value);
	});
	*/

  board.digitalRead(8, function(value) {
	  //console.log("The value of pin A0 is " + value + " as reported at the sampling interval");
		v = value;  
	});

});

http.createServer(function (request, response) {
   // Send the HTTP header 

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader('Access-Control-Allow-Headers', '*');

   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'application/json'});
   
   response.write('[{ "value": ' + v + ' }]');

   response.end();
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');

