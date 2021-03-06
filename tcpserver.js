var net = require('net'),
SerialPort = require("serialport").SerialPort,
twitter = require('twitter-api').createClient(),
twit = require('./twitter'),
fs = require('fs')
var serialPort;
var portName = '/dev/ttyACM0'; //change this to your Arduino port

function startServer(debug)
{
	// on request event
	function onRequest(socket) {
	  console.log("Socket Opened!");
	  socket.setEncoding('utf8');
	  socket.on('data', function(data){
		if(data.toString('utf8').trim() == 'help'){
			socket.write(fs.readFileSync(__dirname+"/pages/helpTcp.txt"));
		}else if(data.toString('utf8').trim() == 'exit'){
			socket.end('Thank you\n');
		}else if(data.toString('utf8').trim() == 'twitter'){
			twit.startTwitter(twitter,serialPort,socket);
		}else{
	  		serialPort.write(data);
		}
	  });
	  socket.on('end', function(){console.log("Socket Closed")});
	}
	
	var netServer = net.createServer(onRequest).listen(3333, function(){
		console.log("Listening at: localhost 3333");
		console.log("TCP Server is up");
	}); 
	serialListener(debug);
}

// Listen to serial port
function serialListener(debug)
{
    var receivedData = "";
    serialPort = new SerialPort(portName, {
        baudrate: 9600,
        // defaults for Arduino serial communication
         dataBits: 8,
         parity: 'none',
         stopBits: 1,
         flowControl: false
    });
 
    serialPort.on("open", function () {
      console.log('open serial communication for TCP');
            // Listens to incoming data
       // serialPort.on('data', function(data) {
          //   receivedData += data.toString();
         // if (receivedData .indexOf('E') >= 0 && receivedData .indexOf('B') >= 0) {
          // sendData = receivedData .substring(receivedData .indexOf('B') + 1, receivedData .indexOf('E'));
          // receivedData = '';
        // }
         // send the incoming data to browser with websockets.
       //socketServer.emit('update', sendData);
      //});  
    });  
}

exports.start = startServer;
