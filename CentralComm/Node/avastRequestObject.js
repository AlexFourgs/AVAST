exports.AvastRequestDeviceEvent = class AvastRequestDeviceEvent {
	constructor(id, timestamp, state) {
		this.id = id;
		this.timestamp = timestamp;
		this.state = state;
	}
};

exports.AvastRequestDeviceVideo = class AvastRequestDeviceVideo {
	constructor(videoRessourceType, videoRessourceURI) {
		this.videoRessourceType = videoRessourceType;
		this.videoRessouceURI = videoRessourceURI;
	}
};

exports.AvastRequestDeviceAction = class AvastRequestDeviceAction {
	constructor(actionType, actionData) {
		this.actionType = actionType;
		this.actionData = actionData;
	}
};

exports.AvastRequestDevice = class AvastRequestDevice {
	constructor(id, type, logs) {
		this.id = id;// Valeur par défaut  value of properties
		this.type = type;
		this.log = logs;
		this.eventProvider = [];
		this.videoProvider = [];
		this.actionProvider = [];
	}

	addAction(actionType, actionData) {
		console.log("adding action");
		this.actionProvider.push(new AvastRequestDeviceAction(actionType, actionData));
	}
	addVideo(videoRessourceType, videoRessouceURI) {
		this.videoProvider.push(new AvastRequestDeviceVideo(videoRessourceType, videoRessouceURI));
		console.log("adding videoRessource");
	}
	addEvent(id, timestamp, state) {
		console.log("adding Event");
		this.eventProvider.push(new AvastRequestDeviceEvent(id, timestamp, state));
	}

};

exports.AvastRequest = class AvastRequest {
	constructor() {
		this.log = [];// Valeur par défaut  value of properties
		this.devices = [];
	}

	addDevice(device) {
		this.devices.push(device);
	}

	addDevice(id, type) {
		console.log("adding device " + id);
		let device =
			this.devices.push(new AvastRequestDevice(id, type, []));
	}
};
