
var avastRq = require("./avastRequestObject.js");

// Port where we'll run the websocket server
var localPort = 8100;




var webServerIp = "192.168.43.155" // "127.0.0.1" //
var webServerPort = 1337;
var isWebServer = false;


var Avast;
function buildFakeDevices() {
	Avast = new avastRq.AvastRequest();
	Avast.addDevice(new avastRq.AvastRequestDevice("photo1", "photo", "REDY"));
	Avast.addDevice(new avastRq.AvastRequestDevice("photo2", "photo", "DEAC"));
	Avast.addDevice(new avastRq.AvastRequestDevice("bouton1", "bouton", "ALRM"));
	let cam1 = new avastRq.AvastRequestDevice("cam1", "camera", "REDY");
	cam1.addVideo(new avastRq.AvastRequestDeviceVideo("H264", "ws://localhost:8000/websocket"));
	Avast.addDevice(cam1); let cam2 = new avastRq.AvastRequestDevice("cam2", "camera", "REDY");
	cam2.addVideo(new avastRq.AvastRequestDeviceVideo("H264", "ws://localhost:8001/websocket"));
	Avast.addDevice(cam2);
}
buildFakeDevices();
/**
* Global variables
*/
// list of currently connected clients (users)
// var Avast = new avastRq.AvastRequest()

var clients = [];
var clientsIPs = [];
var wsc;

//check if we are the webserver
console.log("starting centralCom!");

var WebSocketClient = require("ws");
var WebSocketWebServerURL = 'ws://' + webServerIp + ':' + webServerPort
try {
	wsc = new WebSocketClient(WebSocketWebServerURL);
	wsc.on('open', function open() {
		Avast.addAction(new avastRq.AvastRequestAction("registerCC", null))
		wsc.send(JSON.stringify(Avast));
		Avast.actionProvider = []
	});

	wsc.on('message', function (data) {
		try {
			var ob = JSON.parse(data)
		} catch (e) {
			console.log("cannot parse data : " + data)
		}

		console.log((new Date()) + " Peer "
			+ wsc._socket.remoteAddress + " have send \"" + ob + "\"");


		console.log(ob);
		for (var deviceIdx in ob["devices"]) {
			device = ob["devices"][deviceIdx]

			//if the asked state is different that the one we have in memory

			console.log("device already registered : " + ob["id"] )

			if (Avast["devices"][deviceIdx] != undefined) {
				if (Avast["devices"][deviceIdx].state != device.state) {
					Avast["devices"][deviceIdx].eventProvider.push(new avastRq.AvastRequestDeviceEvent(deviceIdx, new Date(), device.state))
					requestToRasp = {
						id: deviceIdx,
						stateChgt: device.state,
					}
					if ( clientsIPs[ob["id"]] != null && clientsIPs[ob["id"]].readyState === clientsIPs[ob["id"]].OPEN) {
						clientsIPs[deviceIdx].send(JSON.stringify(requestToRasp));
					} else {
						console.error("try to connect a disconnected client");
					}

				}
			} else {
				console.error("unknown client");
			}
		}
///test a supprimer
		Avast.addAction(new avastRq.AvastRequestAction("refreshAvast", null))
		wsc.send(JSON.stringify(Avast))
		Avast.actionProvider = []



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
			+ ws._socket.remoteAddress + " have send \"" + ob + "\"");

		// if that come from the webserver


		// registering the device
		if (ob["id"] != undefined && ob["type"] != undefined && ob["state"] != undefined) {
			if (Avast["devices"][ob["id"]] != undefined && clientsIPs[ob["id"]].readyState === clientsIPs[ob["id"]].OPEN) {
				//the device is already registered
				console.log("device already registered : changing state to" + ob["state"])
				Avast["devices"][ob["id"]].state = ob["state"];
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
			Avast.addAction(new avastRq.AvastRequestAction("refreshAvast", null))
			wsc.send(JSON.stringify(Avast))
			Avast.actionProvider = []


		} catch (e) {
			console.log
		};

	});
});
