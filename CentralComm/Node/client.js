// let avastRq = require("avastRequestObject.js");

// Let us open a web socket
let ws = new WebSocket("ws://localhost:1337");

if ("WebSocket" in window) {
    console.log("WebSocket is supported by your Browser!");
}
else {
    // The browser doesn't support WebSocket
    alert("WebSocket NOT supported by your Browser!");
}

ws.onopen = function () {
    // Web Socket is connected, send data using send()
    // ws.send("Message to send");
    // console.log("Message sent");
};

ws.onmessage = function (evt) {
    let data = JSON.parse(evt.data);
    console.log("Message received");
    console.log(data);
};

ws.onclose = function () {
    // websocket is closed.
    alert("Connection closed");
    console.log("Connection closed");
};

ws.sendMessage = function (msg) {
    waitForSocketConnection(ws, function() {
        ws.send(msg);
    });
};

window.onbeforeunload = function (event) {
    ws.close();
};

function waitForSocketConnection(socket, callback) {
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                console.log("Connection is made")
                if(callback != null){
                    callback();
                }
                return;

            } else {
                console.log("wait for connection...")
                waitForSocketConnection(socket, callback);
            }

        }, 5); // wait 5 milisecond for the connection...
}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function populateMenu() {
    let avastRq = new AvastRequest();
    let dev = avastRq.addDevice(guid(), "webclient");
    avastRq.addAction("register", null);
    avastRq.addAction("listDevices", null);
    console.log(ws);
    ws.sendMessage(JSON.stringify(avastRq));
}
