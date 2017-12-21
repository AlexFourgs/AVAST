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

    let action = msg.actionProvider;
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
                }
                resetMenu();
            }
            break;
        case "refreshAvast":
            let deviceList = new AvastRequest();
            for (dev in msg.devices) {
                deviceList.addDevice(Object.assign({}, msg.devices[dev]));
            }
            avastRq = deviceList;
            resetMenu();
            break;
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
                // console.log("wait for connection...")
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
    avastRq.setAction(new AvastRequestAction("listDevices", "rq"));
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

    while (devicesNav.firstChild) {
        devicesNav.removeChild(devicesNav.firstChild);
    }

    let closeA = document.createElement("a");
    closeA.href = "javascript:void(0)";
    closeA.className = "closebtn";
    closeA.setAttribute("onclick", "closeNav()");
    closeA.appendChild(document.createTextNode("×"));
    devicesNav.appendChild(closeA);

    for(devI in avastRq.devices) {
        let dev = avastRq.devices[devI];
        // let devDiv = document.getElementById(dev.id);
        // devicesNav.removeChild(devDiv);
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
        document.getElementById("moveContainer").style.visibility = "hidden";
    }
    else {
        document.getElementById("camContainer").style.visibility = "visible";
        if(avastRq.devices[selectedCamId].videoProvider != null) {
            // client.connect(avastRq.devices[selectedCamId].videoProvider.videoRessouceURI);
            client.connect("ws://localhost:1338");

            let avastRequest = new AvastRequest();
            avastRequest.setAction(new AvastRequestAction("startStream", selectedCamId));
            ws.send(JSON.stringify(avastRequest));
        }
        document.getElementById("moveContainer").style.visibility = "visible";
    }
}

function changeCam() {
    client.close();

    let camSelect = document.getElementById("camSelect");
    selectedCamId = camSelect.value;
    selectedCamIndex = camSelect.selectedIndex;
    // client.connect(avastRq.devices[selectedCamId].videoProvider.videoRessouceURI);
    
    let avastRequest = new AvastRequest();
    avastRequest.setAction(new AvastRequestAction("startstream", selectedCamId));
    ws.send(JSON.stringify(avastRequest));
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
    avastRq = rqChangeDeviceState(id, "DEAC");
    let json = JSON.stringify(avastRq);
    ws.send(json);
}

function btnREDY(id) {
    console.log("REDY "+id);
    avastRq = rqChangeDeviceState(id, "REDY");
    let json = JSON.stringify(avastRq);
    ws.send(json);
}

function rqChangeDeviceState(id, newState) {
	let deviceList = new AvastRequest();
    deviceList.addDevice(avastRq.devices[id]);
    deviceList.setAction(new AvastRequestAction("state", newState))
	return deviceList;
}

function btnMoveCam(direction) {
    let deviceList = new AvastRequest();
    
    console.log("Move "+direction);
    console.log(avastRq.devices[selectedCamId]);
    deviceList.addDevice(Object.assign({}, avastRq.devices[selectedCamId]));
    deviceList.setAction(new AvastRequestAction("move", direction));

    ws.send(JSON.stringify(deviceList));
}
