
var avastRq = require("./avastRequestObject.js");
var player = require('play-sound')(opts = {})
var zeroconf = require('zeroconf')()
const { exec } = require('child_process');
var WebSocketClient = require("ws");
var AsyncPolling = require('async-polling');

// Port where we'll run the websocket server
var localPort = 8100;


// advertise an HTTP server on port 3000 
// zeroconf.tcp.publish('cc-atelier-RT', 8100)
// zeroconf.publish({ type: 'cc-atelier-RT', protocol: 'tcp', port: 8100, name: 'cc-atelier-RT' })



try {
	// 
} catch (e) {
	console.error("stream to server web not connected")
}
var wsstreamrasp;
var wsstreamweb;
var webServerIp = "192.168.43.155" // "127.0.0.1" //
var webServerPort = 1337;
var isWebServer = false;
var WebSocketWebServerURL = 'ws://' + webServerIp + ':' + webServerPort



/**
* Global variables
*/
// list of currently connected clients (users)
// var Avast = new avastRq.AvastRequest()

var clients = [];
var clientsIPs = [];
var wsc


var Avast = new avastRq.AvastRequest();

try {
	wsc = new WebSocketClient(WebSocketWebServerURL);
} catch (e) {
	console.log("unable to connect the server")
}

data_temp = []

function handle_socketNetworkFail_rasp(clientidX) {

	if (Avast.devices[clientidX].state != "DECO") {
		Avast.devices[clientidX].state = "DECO"
		Avast.setAction(new avastRq.AvastRequestAction("networkAlert", {
			type: "DECO",
			path: "cc." + clientidX
		}))

		sendToWebServer(JSON.stringify(Avast));
		Avast.actionProvider = null

		Avast.setAction(new avastRq.AvastRequestAction("refreshAvast", null))
		sendToWebServer(JSON.stringify(Avast))
		Avast.actionProvider = []
		console.log("raspberry with device "+ clientidX + " disconected")
 
 	}


}


function handle_reco_rasp(clientidX) {

	if (Avast.devices[clientidX].state != "DECO") {
		Avast.setAction(new avastRq.AvastRequestAction("networkAlert", {
			type: "RECO",
			path: "cc." + clientidX
		}))

		sendToWebServer(JSON.stringify(Avast));
		Avast.actionProvider = null


	}


}

AsyncPolling(function (end) {


	for (clientidX in clientsIPs) {
		client = clientsIPs[clientidX];
		if (clientsIPs[clientidX].readyState != clientsIPs[clientidX].OPEN) {
			handle_socketNetworkFail_rasp(clientidX);
			continue
		}


		try {
			console.log("ping devices " + clientidX)
			requesttoclient = {
				id: clientidX,
				networkRequest: "ping"
			}
			client.send(JSON.stringify(requesttoclient))
		} catch (e) {
			handle_socketNetworkFail_rasp(clientidX);
		};



	};
	end();
	// This will schedule the next call. 
}, 1000).run();


exec('/usr/bin/aplay base_maj.wav', (err, stdout, stderr) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log(stdout);
});

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
		wsstreamrasp = new WebSocketClient("ws://192.168.43.212:"+8000+"/websocket")

		wsstreamweb = new WebSocketClient("ws://" + webServerIp + ":" + 1338)
	} catch (e) {
		console.log("cannot connect to rasp websocket : ")
	}
	var wsstreamraspOpen;
	var wsstreamwebOpen;
	console.log("webserver ask start stream function");
	wsstreamrasp.on('open', function open() {
		wsstreamraspOpen = true;
		wsstreamrasp.send("read_camera");
		console.log("stream to rasp opened")
	});
	wsstreamrasp.on('close', function close() {
		wsstreamraspOpen = false;
		console.log("stream to rasp closed")
	});
	wsstreamweb.on('open', function open() {
		wsstreamwebOpen = true;
		console.log("stream to webserver closed")

	});
	wsstreamweb.on('close', function close() {
		wsstreamwebOpen = false;
		console.log("stream to webserver closed")
	});

	wsstreamrasp.on("message", function (data) {
		if (wsstreamwebOpen == true && wsstreamweb.readyState == wsstreamweb.OPEN){
			wsstreamweb.send(data);
		}
			
	});


}

function stopstream() {
	wsstreamweb.close()
	wsstreamrasp.close()


}



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
// buildFakeDevices();

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

function sendToWebServer(data) {
	if (wsc.readyState == wsc.OPEN) {
		wsc.send(data);
	} else {
		data.push(data)
		console.log("serverWeb Disconected")

		setTimeout(function () {
			try {
				wsc = new WebSocketClient(WebSocketWebServerURL);
			} catch (e) {
				console.log("Webserver: reconnecting...");
			}
		}, 500);
	}

}



console.log("starting centralCom!");



try {

	wsc.on('open', function open() {
		console.log("webserver online");
		Avast.setAction(new avastRq.AvastRequestAction("registerCC", null))
		sendToWebServer(JSON.stringify(Avast));
		Avast.actionProvider = []
		console.log(" registering on webserver");
		for (dataIDX in data_temp) {
			sendToWebServer(data);
		}

	});

	wsc.on("error", function error() {
		console.log("the web server is unreachable")

		setTimeout(function () {

			try {
				wsc = new WebSocketClient(WebSocketWebServerURL);
			} catch (e) {
				console.log("WebSocketClient: reconnecting...");
			}
		}, 500);
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
							move: ob.actionProvider.actionData
						}
						sendToDeviceId(deviceIdx, requestToRasp)
						console.log("sending move action " + data + "  to " + deviceIdx)
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
						sendToWebServer(JSON.stringify(Avast))
						Avast.actionProvider = null;
					}
					break;

				case "listDevices":
					Avast.setAction(new avastRq.AvastRequestAction("refreshAvast", null))
					sendToWebServer(JSON.stringify(Avast))
					Avast.actionProvider = null
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
		if (ob["id"] != undefined && ob["networkRequest"] != undefined) {
			// console.log("networkService  id : " + ob["id"] + " ans:" + ob["networkRequest"])
			return;

		} else if (ob["id"] != undefined && ob["state"] != undefined) {

			//the device is already registered

			switch (ob["state"]) {
				// play now and callback when playend 
				case "ALRM":
					exec('/usr/bin/aplay menace_detectee.wav', (err, stdout, stderr) => {
						if (err) {
							console.error(err);
							return;
						}
						console.log(stdout);
					});
					console.log("HALLLLAAAARRRMMMM !!!!!")


					break;
				case "DECO":
					Avast.setAction(new avastRq.AvastRequestAction("networkAlert", {
						type: "DECO",
						path: "rasp." + ob["id"]
					}))
					sendToWebServer(JSON.stringify(Avast));
					Avast.actionProvider = null
					console.log("device id" + ob["id"] + "is disconnected")
					break;
				default:

					if (Avast["devices"][ob["id"]] == undefined) {
						Avast.addDevice(new avastRq.AvastRequestDevice(ob["id"], ob["type"], ob["state"]))
						clientsIPs[ob["id"]] = ws
						console.log("registering device: ")
						console.log(ob)
					} else {
						if (Avast["devices"][ob["id"]].state == "DECO") {
							clientsIPs[ob["id"]] = ws
							handle_reco_rasp(ob["id"]);
						}
						console.log("device already registered : changing state from " + Avast["devices"][ob["id"]].state + " to " + ob["state"])

					}
					break;
			}
			Avast["devices"][ob["id"]].state = ob["state"];

		}

		try {
			Avast.setAction(new avastRq.AvastRequestAction("refreshAvast", null))
			sendToWebServer(JSON.stringify(Avast))
			Avast.actionProvider = []
		} catch (e) {
			console.log
		};
	});
});
