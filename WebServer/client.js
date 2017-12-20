// import { AvastRequest } from "./avastRequestObject";

// let avastRq = require("avastRequestObject.js");

// Let us open a web socket
let ws = new WebSocket("ws://localhost:1337");
// let ws = new WebSocket("ws://192.168.1.155:8100");

let avastRq;
let selectedCamIndex = -1;
let selectedCamId = "";

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
    console.log(msg);

    for (action of msg.actionProvider) {
        switch (action.actionType) {
            case "listDevices":
                if(action.actionData == "rq") {
                    let json = JSON.stringify(listDevices());
                    ws.send(json);
                }
                else if (action.actionData == "ans") {
                    avastRq = new AvastRequest();
                    for(dev in msg.devices) {
                        avastRq.addDevice(msg.devices[dev]);
                        addToMenu(msg.devices[dev]);
                        resetMenu();
                    }
                }
                break;
            case "refreshAvast":
                let deviceList = new AvastRequest();
                for (dev in msg.devices) {
                    deviceList.addDevice(Object.assign({}, msg.devices[dev]));
                }
                rq = deviceList;
                resetMenu();
                break;
        }
    }
};

ws.onclose = function () {
    // websocket is closed.
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

        }, 5);
}

let states = {
    "REDY": {
        "fr": "Armé",
        "btn": "btnDEAC(",
        "btnFr": "Désarmer"
    },
    "ALRM": {
        "fr": "Alarme",
        "btn": "btnREDY(",
        "btnFr": "Ré-armer"
    },
    "DEAC": {
        "fr": "Désarmé",
        "btn": "btnREDY(",
        "btnFr": "Armer"
    },
    "DECO": {
        "fr": "Déconnecté"
    }
};

function openNav() {
    document.getElementById("devicesNav").style.width = "250px";
}

function closeNav() {
    document.getElementById("devicesNav").style.width = "0px";
}

function init() {
    populateMenu();
}

function populateMenu() {
    let avastRq = new AvastRequest();
    avastRq.addAction(new AvastRequestAction("listDevices", "rq"));
    ws.sendMessage(JSON.stringify(avastRq));
}

function resetMenu() {
    let camCounter = 0;
    let devicesNav = document.getElementById("devicesNav");
    let camSelect = document.getElementById("camSelect");

    selectedCamIndex = camSelect.selectedIndex;
    while (camSelect.firstChild) {
        camSelect.removeChild(camSelect.firstChild);
    }

    for(devI in avastRq.devices) {
        let dev = avastRq.devices[devI];
        let devDiv = document.getElementById(dev.id);
        devicesNav.removeChild(devDiv);
        addToMenu(dev);
        if(dev.type == "camera") {
            let option = document.createElement("option");
            option.value = dev.id;
            option.appendChild(document.createTextNode(dev.id));
            if(camCounter == 0) {
                option.selected = true;
                selectedCamIndex = 0;
                selectedCamId = dev.id;
            }
            camSelect.appendChild(option);
            camCounter ++;
        }
    }
    if(camCounter == 0) {
        document.getElementById("camContainer").style.visibility = "hidden";
    }
    else {
        document.getElementById("camContainer").style.visibility = "visible";
        if(avastRq.devices[selectedCamId].videoProvider != null) {
            client.connect(avastRq.devices[selectedCamId].videoProvider.videoRessouceURI);
        }
    }
}

function changeCam() {
    client.close();
    let newCamId = document.getElementById("camSelect").value;
    client.connect(avastRq.devices[newCamId].videoProvider.videoRessouceURI);
}

function addToMenu(device) {
    let devicesNav = document.getElementById("devicesNav");
    let devDiv = document.createElement('div');
    devDiv.id = device.id;
    devDiv.className = 'deviceDiv';

    let nameDiv = document.createElement('div');
    nameDiv.className = 'nameDiv';
    let nameSpan = document.createElement('span');
    nameSpan.appendChild(document.createTextNode(device.id));
    nameDiv.appendChild(nameSpan);

    let stateDiv = document.createElement('div');
    let stateSpan = document.createElement('span');
    stateSpan.className = 'state state-'+device.state;
    stateSpan.appendChild(document.createTextNode(states[device.state].fr));
    let actionBtn = document.createElement('button');
    actionBtn.type = 'button';
    actionBtn.setAttribute("onclick", states[device.state].btn+"\""+device.id+"\")");
    actionBtn.appendChild(document.createTextNode(states[device.state].btnFr));
    stateDiv.appendChild(stateSpan);
    stateDiv.appendChild(actionBtn);

    devDiv.appendChild(nameDiv);
    devDiv.appendChild(stateDiv);
    devicesNav.appendChild(devDiv);
}

function btnDEAC(id) {
    console.log("DEAC "+id);
    avastRq = rqChangeDevice(id, "DEAC");
    let json = JSON.stringify(avastRq);
    ws.send(json);
}

function btnREDY(id) {
    console.log("REDY "+id);
    avastRq = rqChangeDevice(id, "REDY");
    let json = JSON.stringify(avastRq);
    ws.send(json);
}

function btnShutdown(id) {
    console.log("REDY "+id);
    avastRq = rqChangeDevice(id, "DEAC");
    let json = JSON.stringify(avastRq);
    ws.send(json);
}

function rqChangeDevice(id, newState) {
	let deviceList = new AvastRequest();
	for (devI in avastRq.devices) {
        dev = avastRq.devices[devI];
        if(dev.id == id) {
            dev.state = newState;
        }
		deviceList.addDevice(Object.assign({}, dev));
	}
	return deviceList;
}
