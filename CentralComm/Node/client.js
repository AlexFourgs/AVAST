if ("WebSocket" in window) {
    console.log("WebSocket is supported by your Browser!");

    // Let us open a web socket
    let ws = new WebSocket("ws://localhost:1337");

    ws.onopen = function () {
        // Web Socket is connected, send data using send()
        ws.send("Message to send");
        console.log("Message sent");
    };

    ws.onmessage = function (evt) {
        let data = JSON.parse(evt.data);
        console.log("Message received");
        console.log(data);
    };

    ws.onclose = function () {
        // websocket is closed.
        console.log("Connection closed");
    };

    window.onbeforeunload = function (event) {
        ws.close();
    };

    function openNav() {
        document.getElementById("mySidenav").style.width = "250px";
    }
    
    function closeNav() {
        document.getElementById("mySidenav").style.width = "0";
    }
    
    function populateMenu() {
        let avastRq = new AvastRequest()
    }    
}

else {
    // The browser doesn't support WebSocket
    alert("WebSocket NOT supported by your Browser!");
}
