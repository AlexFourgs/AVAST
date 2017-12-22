/*global $, WebSocket, console, window, document*/
"use strict";

/**
 * Connects to Pi server and receives video data.
 */
var client = {

    // Connects to Pi via websocket
    connect: function () {
        var self = this, video = document.getElementById("video");
        
        this.socket = new WebSocket("ws://192.168.43.155:1338");

        // Request the video stream once connected
        this.socket.onopen = function () {
            console.log("Connected!");
            self.socket.send("startStream");
        };

        // Currently, all returned messages are video data. However, this is
        // extensible with full-spec JSON-RPC.
        this.socket.onmessage = function (messageEvent) {
            video.src = "data:image/jpeg;base64," + messageEvent.data;
        };

        this.socket.onclose = function(msg) {
            video.src = "404.jpg";
        };
    },

    close: function() {
        this.socket.close();
    }
};
