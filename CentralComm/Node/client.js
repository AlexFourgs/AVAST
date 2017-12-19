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
    console.log("Message received");
    let msg = JSON.parse(evt.data);

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
                    for(dev of msg.devices) {
                        addToMenu(dev);
                    }
                }
                break;
        }
    }
};

ws.onclose = function () {
    // websocket is closed.
    // alert("Connection closed");
    // console.log("Connection closed");
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
    document.getElementById("devicesNav").style.width = "250px";
}

function closeNav() {
    document.getElementById("devicesNav").style.width = "0px";
}

function populateMenu() {
    let avastRq = new AvastRequest();
    avastRq.addDevice(new AvastRequestDevice(guid(), "webclient", "connected"));
    avastRq.addAction(new AvastRequestAction("register", null));
    avastRq.addAction(new AvastRequestAction("listDevices", "rq"));
    ws.sendMessage(JSON.stringify(avastRq));
}

function addToMenu(device) {
    
}
