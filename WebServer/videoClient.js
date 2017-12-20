/*global $, WebSocket, console, window, document*/
"use strict";

/**
 * Connects to Pi server and receives video data.
 */
var client = {

    // Connects to Pi via websocket
    connect: function (url) {
        var self = this, video = document.getElementById("video");
        console.log(url);

        this.socket = new WebSocket(url);

        // Request the video stream once connected
        this.socket.onopen = function () {
            console.log("Connected!");
            self.readCamera();
        };

        // Currently, all returned messages are video data. However, this is
        // extensible with full-spec JSON-RPC.
        this.socket.onmessage = function (messageEvent) {
            video.src = "data:image/jpeg;base64," + messageEvent.data;
        };

        this.socket.onclose = function(msg) {
            video.src = "";
        };
    },

    // Requests video stream
    readCamera: function () {
        this.socket.send("read_camera");
    },

    close: function() {
        this.socket.close();
    }
};
