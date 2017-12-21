let avastRq = require("./avastRequestObject.js");
let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'group4',
    password: 'group4',
    database: 'avast'
});
connection.connect();
connection.query('SELECT * FROM Log', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    console.log(fields);
});

connection.end();

let device = []

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-cc';

// Port where we'll run the websocket server
let webSocketServerPort = 1337;

// Websocket
var WebSocketServer = require("ws").Server;
var ws = new WebSocketServer({
    port: webSocketServerPort
});

var videoWs = new WebSocketServer({
    port: 1338
});
videoWs.on('connection', function (videoWs) {
    console.log((new Date()) + ' Video connection from origin ' + videoWs._socket.remoteAddress + '.');

    // user disconnected
    videoWs.on('close', function (connection) {

        // remove user from the list of connected clients
        // clients.splice(index, 1);

    });

    videoWs.on('message', function (data) {
        console.log(clients.length);
        dispatchToClients(data, ws)
    });
});


/**
 * Global letiables
 */

// list of currently connected clients (users)
let clients = [];

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let rq;

function buildFakeDevices() {
    rq = new avastRq.AvastRequest();
    rq.addDevice(new avastRq.AvastRequestDevice("photo1", "photo", "REDY"));
    rq.addDevice(new avastRq.AvastRequestDevice("photo2", "photo", "DEAC"));
    rq.addDevice(new avastRq.AvastRequestDevice("bouton1", "bouton", "ALRM"));
    let cam1 = new avastRq.AvastRequestDevice("cam1", "camera", "REDY");
    cam1.addVideo(new avastRq.AvastRequestDeviceVideo("H264", "ws://localhost:8000/websocket"));
    rq.addDevice(cam1);
    let cam2 = new avastRq.AvastRequestDevice("cam2", "camera", "REDY");
    cam2.addVideo(new avastRq.AvastRequestDeviceVideo("H264", "ws://localhost:8001/websocket"));
    rq.addDevice(cam2);
}
// buildFakeDevices();
let CCIP = null;

ws.on('connection', function (ws) {
    console.log("Server started on " + webSocketServerPort);
    console.log((new Date()) + ' Connection from origin ' + ws._socket.remoteAddress + '.');

    // accept connection - you should check 'request.origin' to
    // make sure that client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)

    // we need to know client index to remove them on 'close' event
    var index = clients.push(ws) - 1;


    console.log((new Date()) + ' Connection accepted.');

    // user disconnected
    ws.on('close', function (connection) {

        // console.log((new Date()) + " Peer " + ws._socket.remoteAddress + " disconnected.");

        // remove user from the list of connected clients
        clients.splice(index, 1);

    });

    ws.on('message', function (data) {

        try {
            let msg = JSON.parse(data);

            let action = msg.actionProvider;
            if (action == null) {
                console.log(msg);
                dispatchToClients(data, ws);
            }

            if (action.actionType) {
                switch (action.actionType) {
                    case "state":
                        if (CCIP != null) {
                            CCIP.send(data);
                        } else {
                            console.log("No CC, couldn't send new device state");
                            console.log(msg);
                        }
                        break;
                    case "listDevices":
                        CCIP.send(data);
                        break;
                    case "startStream":
                        CCIP.send(data);
                        break;
                    case "registerCC":
                        CCIP = ws;
                        rq = msg;
                        break;
                    case "refreshAvast":
                        logToDB(data);
                        dispatchToClients(data, ws);
                        break;
                    case "move":
                        if (CCIP != null) {
                            console.log("Sending move camera to CC");
                            CCIP.send(data);
                        } else {
                            console.log("No CC, couldn't send move camera");
                            console.log(msg);
                        }
                        break;
                    case "networkAlert":
                        dispatchToClients(data, ws);
                        break;
                }
            }
        } catch (e) {
            console.error(e);
        }
    });
});

function dispatchToClients(data, ws) {
    for (c of clients) {
        if (c._socket != null) {
            if (c._socket.remoteAddress != ws._socket.remoteAddress) {
                c.send(data);
            }
        }
    }
}

function listDevices() {
    let deviceList = new avastRq.AvastRequest();
    for (dev in rq.devices) {
        deviceList.addDevice(Object.assign({}, rq.devices[dev]));
    }
    deviceList.setAction(new avastRq.AvastRequestAction("listDevices", "ans"))
    return deviceList;
}