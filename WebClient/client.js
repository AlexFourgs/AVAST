// Let us open a web socket
let ws = new WebSocket("ws://192.168.43.155:1337");

let admin = false;

let avastRq;
let selectedCamIndex = -1;
let selectedCamId = "";

function init(mode) {
    if (mode == 'admin') {
        admin = true;
    }
    populateMenu();
}

/////////////////////////////////////////////////////////////////////////////
//////////////////////////////// WEBSOCKET //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

if ("WebSocket" in window) {
    console.log("WebSocket is supported by your Browser!");
}
else {
    // The browser doesn't support WebSocket
    alert("WebSocket NOT supported by your Browser!");
}

ws.onopen = function () {
    // Web Socket is connected
};

ws.onmessage = function (evt) {
    console.log("Message received");
    let msg = JSON.parse(evt.data);
    console.log(msg);

    let action = msg.actionProvider;
    switch (action.actionType) {
        case "listDevices":
            if (action.actionData == "rq") {
                let json = JSON.stringify(listDevices());
                ws.send(json);
            }
            else if (action.actionData == "ans") {
                avastRq = new AvastRequest();
                for (dev in msg.devices) {
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
        case "networkAlert":
            if (admin) {
                let path = action.actionData.path.split(".");
                let obj1 = path[0];
                let obj2 = path[1];

                if (obj1 == "cc") {
                    switch (path[1]) {
                        case "Ubtn":
                        case "Upho":
                            obj2 = "rasp1";
                            break;
                        case "UCAM":
                        case "Uben":
                            obj2 = "rasp2";
                            break;

                    }
				}
				else {
					switch (path[1]) {
                        case "Ubtn":
                        case "Upho":
                            obj1 = "rasp1";
                            break;
                        case "UCAM":
                        case "Uben":
                            obj1 = "rasp2";
                            break;

                    }
				}
				
				console.log(obj1);
				console.log(obj2);

                let td = document.getElementById("connection-" + obj1 + "-" + obj2);
                console.log("connection-" + obj1 + "-" + obj2 + " " + action.actionData.type);
                switch (action.actionData.type) {
                    case "DECO":
                        td.style.color = "red";
                        break;
                    case "RECO":
                        td.style.color = "green";
                        break;
                }
            }
            break;
    }
};

ws.onclose = function () {
    // websocket is closed.
    console.log("Connection closed");
};

ws.sendMessage = function (msg) {
    waitForSocketConnection(ws, function () {
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
                if (callback != null) {
                    callback();
                }
                return;

            } else {
                // console.log("wait for connection...")
                waitForSocketConnection(socket, callback);
            }

        }, 5);
}

/////////////////////////////////////////////////////////////////////////////
//////////////////////////////// REQUESTS ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function populateMenu() {
    let avastRq = new AvastRequest();
    avastRq.setAction(new AvastRequestAction("listDevices", "rq"));
    ws.sendMessage(JSON.stringify(avastRq));
}

function rqChangeDeviceState(id, newState) {
    let deviceList = new AvastRequest();
    deviceList.addDevice(avastRq.devices[id]);
    deviceList.setAction(new AvastRequestAction("state", newState))
    return deviceList;
}

function changeCam() {
	console.log("Changing cam");
    let camSelect = document.getElementById("camSelect");
    selectedCamId = camSelect.value;
	selectedCamIndex = camSelect.selectedIndex;
	client.connect();
}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////// HTML BUILDER ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

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

function resetMenu() {
    let camCounter = 0;
    let devicesNav = document.getElementById("devicesNav");
    let camSelect = document.getElementById("camSelect");

    if (!admin) {
        selectedCamIndex = camSelect.selectedIndex;
        while (camSelect.firstChild) {
            camSelect.removeChild(camSelect.firstChild);
        }
    }

    while (devicesNav.firstChild) {
        devicesNav.removeChild(devicesNav.firstChild);
    }

	let adminA = document.createElement("a");
	adminA.setAttribute("id", "admin");
	if(admin) {
		adminA.setAttribute("href", "client.html");
		adminA.appendChild(document.createTextNode("Client"));
	}
	else {
		adminA.setAttribute("href", "admin.php");
		adminA.appendChild(document.createTextNode("Admin"));
	}
	devicesNav.appendChild(adminA);
    let closeA = document.createElement("a");
    closeA.href = "javascript:void(0)";
	closeA.setAttribute("id", "closebtn");
    closeA.setAttribute("onclick", "closeNav()");
    closeA.appendChild(document.createTextNode("×"));
    devicesNav.appendChild(closeA);

    for (devI in avastRq.devices) {
        let dev = avastRq.devices[devI];
        addToMenu(dev);
        if (dev.type == "camera" && !admin) {
            let option = document.createElement("option");
            option.value = dev.id;
            option.appendChild(document.createTextNode(dev.id));
            if (camCounter == 0) {
                option.selected = true;
                selectedCamIndex = 0;
                selectedCamId = dev.id;
            }
            camSelect.appendChild(option);
            camCounter++;
        }
    }
    if (!admin) {
        if (camCounter == 0) {
            document.getElementById("camContainer").style.visibility = "hidden";
            document.getElementById("moveContainer").style.visibility = "hidden";
        }
        else {
            document.getElementById("camContainer").style.visibility = "visible";
			// client.connect();
            document.getElementById("moveContainer").style.visibility = "visible";
        }
    }
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
	stateSpan.className = 'state state-' + device.state;
	if(states[device.state]) {
		stateSpan.appendChild(document.createTextNode(states[device.state].fr));
	}
	stateDiv.appendChild(stateSpan);
	
    if (device.state != "DECO" && states[device.state]) {
        let actionBtn = document.createElement('button');
        actionBtn.type = 'button';
        actionBtn.setAttribute("onclick", states[device.state].btn + "\"" + device.id + "\")");
        actionBtn.appendChild(document.createTextNode(states[device.state].btnFr));
        stateDiv.appendChild(actionBtn);
    }

    devDiv.appendChild(nameDiv);
    devDiv.appendChild(stateDiv);
    devicesNav.appendChild(devDiv);
}

/////////////////////////////////////////////////////////////////////////////
////////////////////////////////// BUTTONS //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function openNav() {
    document.getElementById("devicesNav").style.width = "250px";
}

function closeNav() {
    document.getElementById("devicesNav").style.width = "0px";
}

function btnDEAC(id) {
    console.log("DEAC " + id);
    avastRq = rqChangeDeviceState(id, "DEAC");
    let json = JSON.stringify(avastRq);
    ws.send(json);
}

function btnREDY(id) {
    console.log("REDY " + id);
    avastRq = rqChangeDeviceState(id, "REDY");
    let json = JSON.stringify(avastRq);
    ws.send(json);
}

function btnMoveCam(direction) {
    let deviceList = new AvastRequest();

    console.log("Move " + direction);
    console.log(avastRq.devices[selectedCamId]);
    deviceList.addDevice(Object.assign({}, avastRq.devices[selectedCamId]));
    deviceList.setAction(new AvastRequestAction("move", direction));

    ws.send(JSON.stringify(deviceList));
}
