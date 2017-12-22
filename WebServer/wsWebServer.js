let avastRq = require("./avastRequestObject.js");
let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'group4',
    password: 'group4',
    database: 'avast'
});
connection.connect();

// connection.end();

let device = []

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-cc';

// Port where we'll run the websocket server
let webSocketServerPort = 1337;

let videoClients = [];

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
    var index = videoClients.push(videoWs) - 1;

    // user disconnected
    videoWs.on('close', function (connection) {

        videoClients.splice(index, 1);

    });

    videoWs.on('message', function (data) {
        if(data == "startStream") {
            if (CCIP != null) {
                console.log("\n" + videoWs._socket.remoteAddress + " requesting start stream 1338");
                let startStreamRq = new avastRq.AvastRequest();
                startStreamRq.setAction(new avastRq.AvastRequestAction("startStream", null));
                CCIP.send(JSON.stringify(startStreamRq));
            } else {
                console.log("No CC, couldn't start stream");
                console.log(msg);
            }
        }
        for (c of videoClients) {
            if (c._socket != null) {
                if (c._socket.remoteAddress != videoWs._socket.remoteAddress) {
                    c.send(data);
                }
            }
        }
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

console.log("Server started on " + webSocketServerPort);
ws.on('connection', function (ws) {

    // accept connection - you should check 'request.origin' to
    // make sure that client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)

    // we need to know client index to remove them on 'close' event
    var index = clients.push(ws) - 1;
    console.log("\n" + (new Date()) + ' Peer ' + index + ' from origin ' + ws._socket.remoteAddress + '.');


    console.log((new Date()) + ' Connection accepted.');

    // user disconnected
    ws.on('close', function (connection) {

        console.log("\n" + (new Date()) + " Peer " + index + " disconnected.");

        // remove user from the list of connected clients
        clients.splice(index, 1);

    });

    ws.on('message', function (data) {

        try {
            let msg = JSON.parse(data);

            let action = msg.actionProvider;
            if (action.actionType) {
                switch (action.actionType) {
                    case "state":
                        console.log("\n" + ws._socket.remoteAddress + " changing device state :");
                        console.log(data);
                        if (CCIP != null) {
                            CCIP.send(data);
                        } else {
                            console.log("No CC, couldn't send new device state");
                            console.log(msg);
                        }
                        break;
                    case "listDevices":
                        if (CCIP != null) {
                            CCIP.send(data);
                        } else {
                            console.log("No CC, couldn't ask for devices list");
                            console.log(msg);
                        }
                        break;
                    case "registerCC":
                        console.log("\nRegistered CC at " + ws._socket.remoteAddress);
                        CCIP = ws;
                        rq = msg;
                        break;
                    case "refreshAvast":
                        // console.log("\nReceived refreshAvast : "+data);
                        console.log("\nReceived refreshAvast");
                        logToDB(msg);
                        rq = new avastRq.AvastRequest();
                        for (d in msg.devices) {
                            rq.addDevice(msg.devices[d]);
                        }
                        dispatchToClients(data, ws);
                        break;
                    case "move":
                        if (CCIP != null) {
                            console.log("\nSending to CC : " + action.actionData);
                            CCIP.send(data);
                        } else {
                            console.log("\nNo CC, couldn't send : " + action.actionData);
                            console.log(msg);
                        }
                        break;
                    case "networkAlert":
                        console.log("\nReceived networkAlert : " + data);
                        dispatchToClients(data, ws);
                        break;
                    default:
                        console.log("\nReceived unknown data :");
                        console.log(data);
                }
            }
            else {
                console.log("\nReceived unknown data :");
                console.log(data);
            }
        } catch (e) {
            console.error(e);
        }
    });
});

function logToDB(data) {
    if (rq != null) {
        for (d in rq.devices) {
            console.log(d + " " + rq.devices[d].state + " " + data.devices[d].state);
            if (rq.devices[d].state != data.devices[d].state) {
                console.log("Logging to DB : " + d + " : " + data.devices[d].state + " -> " + rq.devices[d].state);
                let sql = "INSERT INTO Log (content, deviceId, stack) VALUES ('" + rq.devices[d].state + " -> " + data.devices[d].state + "', '" + d + "', '" + JSON.stringify(data).replace(/'/g, "\\'") + "')";
                connection.query(sql, function (error, results) {
                    if (error) throw error;
                });
            }
        }
    }
}

function dispatchToClients(data, ws) {
    for (c of clients) {
        if (c._socket != null) {
            if (c._socket.remoteAddress != ws._socket.remoteAddress) {
                console.log("Dispatching to " + c._socket.remoteAddress);
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
