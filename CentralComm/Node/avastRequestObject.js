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
	constructor(id, type) {
		this.id = id;// Valeur par défaut  value of properties
		this.type = type;
		this.log = [];
		this.eventProvider = [];
		this.videoProvider = [];
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
		this.actionProvider = [];
	}

	addDevice(device) {
		this.devices.push(device);
	}

	addDevice(id, type) {
		let device = new AvastRequestDevice(id, type);
		this.devices.push(device);
		return device;
	}
	
	addAction(actionType, actionData) {
		let action = new AvastRequestAction(actionType, actionData);
		this.actionProvider.push(action);
		return action;
	}
};
