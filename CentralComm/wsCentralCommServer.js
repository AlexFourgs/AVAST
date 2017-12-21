
var avastRq = require("./avastRequestObject.js");
var player = require('play-sound')(opts = {})
var zeroconf = require('zeroconf')()
const { exec } = require('child_process');
var WebSocketClient = require("ws");

// Port where we'll run the websocket server
var localPort = 8100;


// advertise an HTTP server on port 3000 
// zeroconf.tcp.publish('cc-atelier-RT', 8100)
zeroconf.publish({ type: 'cc-atelier-RT', protocol: 'tcp', port: 8100, name: 'cc-atelier-RT' })




var webServerIp = "192.168.43.155" // "127.0.0.1" //
var webServerPort = 1337;
var isWebServer = false;




/**
* Global variables
*/
// list of currently connected clients (users)
// var Avast = new avastRq.AvastRequest()

var clients = [];
var clientsIPs = [];
var wsc;

var wsstreamweb = new WebSocketClient("ws://" + webServerIp + ":" + 1338)
var wsstreamrasp;
// function startstream(deviceId){
// 	wsstreamweb = new WebSocket("ws://"+webServerIp+":"+1338)
// 	wsstreamrasp = new WebSocket("ws://"+clientsIPs[deviceId]._socket.remoteAddress+":"+8000)
// 	wsstreamweb.on('connection', function (wsstreamweb) {
// 		wsstreamrasp.on('connection', function (wsstreamweb) {
// 			wsstreamrasp.on("message" ,  function (data) {
// 				wsstreamweb.send(data);
// 			});
// 		});
// 	});

// }

function startstream(deviceId) {
	try {
		wsstreamrasp = new WebSocketClient("ws://192.168.43.44:8000/websocket")
	} catch (e) {
		console.log("cannot connect to rasp websocket : " )
	}
	
	console.log("webserver ask start stream function");
	wsstreamrasp.on('connection', function (wsstreamrasp) {
		console.log("stream from rasp")
		wsstreamrasp.send("read_camera")

		wsstreamweb.on('connection', function (wsstreamweb) {
			console.log("stream to webserver opened")

			
			wsstreamrasp.on("message", function (data) {
				wsstreamweb.send(data);
				console.log(data)
			});
		});
	});

}

function stopstream() {
	wsstreamweb.close()
	wsstreamrasp.close()


}


var Avast = new avastRq.AvastRequest();
function buildFakeDevices() {

	// Avast.addDevice(new avastRq.AvastRequestDevice("photo1", "photo", "REDY"));
	// Avast.addDevice(new avastRq.AvastRequestDevice("photo2", "photo", "REDY"));
	// Avast.addDevice(new avastRq.AvastRequestDevice("bouton1", "bouton", "REDY"));
	let cam1 = new avastRq.AvastRequestDevice("cam1", "camera", "REDY");
	cam1.addVideo(new avastRq.AvastRequestDeviceVideo("H264", "ws://localhost:8000/websocket"));
	Avast.addDevice(cam1);
	// let cam2 = new avastRq.AvastRequestDevice("cam2", "camera", "REDY");
	// cam2.addVideo(new avastRq.AvastRequestDeviceVideo("H264", "ws://localhost:8001/websocket"));
	// Avast.addDevice(cam2);
}
buildFakeDevices();

function sendToDeviceId(id, data) {
	if (clientsIPs[id] != null) {
		if (clientsIPs[id].readyState == clientsIPs[id].OPEN) {
			clientsIPs[id].send(JSON.stringify(data));
		} else {
			console.error("the websocket i associated with this id " + id + "is closed  data : " + JSON.stringify(data));
		}
	} else {
		console.error("no websocket is associated with this id " + id + " data : " + JSON.stringify(data));
	}
}


console.log("starting centralCom!");


var WebSocketWebServerURL = 'ws://' + webServerIp + ':' + webServerPort
try {
	wsc = new WebSocketClient(WebSocketWebServerURL);
	wsc.on('open', function open() {
		Avast.setAction(new avastRq.AvastRequestAction("registerCC", null))
		wsc.send(JSON.stringify(Avast));
		Avast.actionProvider = []
	});

	wsc.on('message', function (data) {
		try {
			var ob = JSON.parse(data)
		} catch (e) {
			console.log("cannot parse data : " + data)
		}

		console.log((new Date()) + '  ' + wsc._socket.remoteAddress + "  have send \"" + data + "\"");


		// if actionType is defined
		if (ob.actionProvider != null) {
			action = ob.actionProvider
			switch (action.actionType) {
				case "move":
					for (var deviceIdx in ob["devices"]) {
						device = ob["devices"][deviceIdx]
						requestToRasp = {
							id: deviceIdx,
							move: ob.actionProvider
						}
						sendToDeviceId(deviceIdx, requestToRasp)
						console.log("move action")
					}
					break;
				case "state":
					for (var deviceIdx in ob["devices"]) {
						device = ob["devices"][deviceIdx]
						requestToRasp = {
							id: deviceIdx,
							stateChgt: action.actionData
						}
						sendToDeviceId(deviceIdx, requestToRasp)


						Avast.setAction(new avastRq.AvastRequestAction("refreshAvast", null))
						wsc.send(JSON.stringify(Avast))
						Avast.actionProvider = []
					}
					break;

				case "listDevices":
					Avast.setAction(new avastRq.AvastRequestAction("refreshAvast", null))
					wsc.send(JSON.stringify(Avast))
					Avast.actionProvider = []
					console.log("webserver ask list of device");
					break;
				case "startStream":
					startstream(action.actionData)
					console.log("webserver ask start stream");
					break;
				case "stopStream":
					stopstream()
					break;
			}
		}

	});
} catch (exception) {
	console.error("cannot connect to  " + WebSocketWebServerURL + " : " + exception);
}




// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-cc';





var WebSocketServer = require("ws").Server;

var ws = new WebSocketServer({ port: localPort });

console.log("Server started...");


//list of deviceId/ip used to dispatch the device payload

/**
* Helper function for escaping input strings
*/
function htmlEntities(str) {
	return String(str)
		.replace(/&/g, '&amp;').replace(/</g, '&lt;')
		.replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}







ws.on('connection', function (ws) {
	console.log("Browser connected online...")


	console.log((new Date()) + ' Connection from origin '
		+ ws._socket.origin + '.');

	// accept connection - you should check 'request.origin' to
	// make sure that client is connecting from your website
	// (http://en.wikipedia.org/wiki/Same_origin_policy)

	// we need to know client index to remove them on 'close' event
	var index = clients.push(ws) - 1;




	console.log((new Date()) + ' Connection accepted.');

	// user disconnected
	ws.on('close', function (connection) {

		console.log((new Date()) + " Peer number " + index + "  disconnected.");

		// remove user from the list of connected clients
		clients.splice(index, 1);

	});

	ws.on('message', function (data) {

		try {
			var ob = JSON.parse(data)
		} catch (e) {
			console.log("cannot parse data : " + data)
		}
		console.log((new Date()) + " Peer "
			+ ws._socket.remoteAddress + " have send \"" + data + "\"");

		// registering the device
		if (ob["id"] != undefined && ob["type"] != undefined && ob["state"] != undefined) {
			if (Avast["devices"][ob["id"]] != undefined && clientsIPs[ob["id"]].readyState === clientsIPs[ob["id"]].OPEN) {
				//the device is already registered
				console.log("device already registered : changing state to " + ob["state"])
				Avast["devices"][ob["id"]].state = ob["state"];
				if (ob["state"] == "ALRM") {
					// play now and callback when playend 

					exec('/usr/bin/aplay menace_detectee.wav', (err, stdout, stderr) => {
						if (err) {
							console.error(err);
							return;
						}
						console.log(stdout);
					});
					console.log("HALLLLAAAARRRMMMM !!!!!")

				}
			} else {
				Avast.addDevice(new avastRq.AvastRequestDevice(ob["id"], ob["type"], ob["state"]))
				clientsIPs[ob["id"]] = ws
				console.log("registering device: ")
				console.log(ob)

			}
		} else {
			console.error("invalid data ");
		}

		try {
			Avast.setAction(new avastRq.AvastRequestAction("refreshAvast", null))
			wsc.send(JSON.stringify(Avast))
			Avast.actionProvider = []


		} catch (e) {
			console.log
		};

	});
});
