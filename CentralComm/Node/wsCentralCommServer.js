
var avastRq = require( "./avastRequestObject.js");
var webServerIp = "192.168.1.100"

var device = []

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-cc';


// Port where we'll run the websocket server
var webSocketsServerPort = 8100 ;


var WebSocketServer = require("ws").Server;
var ws = new WebSocketServer( { port: webSocketsServerPort } );

console.log("Server started...");
/**
 * Global variables
 */

// list of currently connected clients (users)
var clients = [ ];
var clientsIPs = [ ];

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
  var indexIP =  clientsIPs.push(ws._socket.remoteAddress);


  console.log((new Date()) + ' Connection accepted.');

  // user disconnected
  ws.on('close', function(connection) {

      console.log((new Date()) + " Peer "
          + ws._socket.remoteAddress + " disconnected.");

      // remove user from the list of connected clients
      clients.splice(index, 1);
      clientsIPs.splice(indexIP , 1);

  });

  ws.on('message', function( data) {

  var ob = JSON.parse(data)

       console.log((new Date()) + " Peer "
          + ws._socket.remoteAddress + " have send \""+ ob+"\"");

           ws.send(JSON.stringify( new avastRq.avastRequest()));

});

  });
