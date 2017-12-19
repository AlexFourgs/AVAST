let avastRq = require("./avastRequestObject.js");

let device = []

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-cc';


// Port where we'll run the websocket server
let webSocketsServerPort = 1337;

let cc

// websocket and http servers
let webSocketServer = require('websocket').server;
let http = require('http');

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

/**
 * HTTP server
 */
let server = http.createServer(function (request, response) {
	// Not important for us. We're writing WebSocket server,
	// not HTTP server
});
server.listen(webSocketsServerPort, function () {
	console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
let wsServer = new webSocketServer({
	// WebSocket server is tied to a HTTP server. WebSocket
	// request is just an enhanced HTTP request. For more info
	// http://tools.ietf.org/html/rfc6455#page-6
	httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function (request) {
	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

	// accept connection - you should check 'request.origin' to
	// make sure that client is connecting from your website
	// (http://en.wikipedia.org/wiki/Same_origin_policy)
	let connection = request.accept(null, request.origin);
	// we need to know client index to remove them on 'close' event
	let index = clients.push(connection) - 1;
	let indexIP = clientIPs.push(connection.remoteAddress);


	console.log((new Date()) + ' Connection accepted.');

	// user disconnected
	connection.on('close', function (connection) {

		console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");

		// remove user from the list of connected clients
		clients.splice(index, 1);
		clientIPs.splice(indexIP, 1);

	});

	connection.on('message', function (evt) {

		// console.log((new Date()) + " Peer " + connection.remoteAddress + " sent " + message);

		let msg = JSON.parse(evt.utf8Data);
		console.log(msg);
		for (dev of msg.devices) {
		}
		for (action of msg.actionProvider) {
			switch (action.actionType) {
				case "register":
					register(dev);
					break;
				case "listDevices":
					listDevices();
					break;
			}
		}
	});
});

function register(dev) {
	knownDevices.push(dev);
}

function listDevices() {
	// for()
}
