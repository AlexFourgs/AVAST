let avastRq = require("./avastRequestObject.js");

let device = []

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-cc';

// Port where we'll run the websocket server
let webSocketServerPort = 1337;

// Websocket
var WebSocketServer = require("ws").Server;
var ws = new WebSocketServer({ port: webSocketServerPort });

/**
 * Global letiables
 */

// list of currently connected clients (users)
let clients = [];
let clientIPs = [];

// Liste des appareils connus et enregistrés
let knownDevices = [];

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
	return String(str)
		.replace(/&/g, '&amp;').replace(/</g, '&lt;')
		.replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

ws.on('connection', function (ws) {
	console.log("Server started on " + webSocketServerPort);
	console.log((new Date()) + ' Connection from origin ' + ws._socket.origin + '.');

	// accept connection - you should check 'request.origin' to
	// make sure that client is connecting from your website
	// (http://en.wikipedia.org/wiki/Same_origin_policy)

	// we need to know client index to remove them on 'close' event
	var index = clients.push(ws) - 1;
	var indexIP = clientIPs.push(ws._socket.remoteAddress);


	console.log((new Date()) + ' Connection accepted.');

	// user disconnected
	ws.on('close', function (connection) {

		console.log((new Date()) + " Peer " + ws._socket.remoteAddress + " disconnected.");

		// remove user from the list of connected clients
		clients.splice(index, 1);
		clientsIPs.splice(indexIP, 1);

	});

	ws.on('message', function (data) {
		let msg = JSON.parse(data);
		for (dev of msg.devices) {
		}
		for (action of msg.actionProvider) {
			switch (action.actionType) {
				case "register":
					register(dev);
					break;
				case "listDevices":
					if(action.actionData == "rq") {
						let json = JSON.stringify(listDevices());
						ws.send(json);
					}
					else if (action.actionData == "ans") {

					}
					break;
			}
		}
	});
});

function register(dev) {
	knownDevices.push(dev);
}

function listDevices() {
	let deviceList = new avastRq.AvastRequest();
	for (dev of knownDevices) {
		let device = Object.assign({}, dev);
		device.eventProvider = [];
		deviceList.addDevice(device);
	}
	deviceList.addAction(new avastRq.AvastRequestAction("listDevices", "ans"))
	return deviceList;
}
