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

exports.AvastRequestAction = class AvastRequestAction {
	constructor(actionType, actionData) {
		this.actionType = actionType;
		this.actionData = actionData;
	}
};

exports.AvastRequestDevice = class AvastRequestDevice {
	constructor(id, type, state) {
		this.id = id;
		this.type = type;
		this.state = state;
		this.log = [];
		this.eventProvider = [];
		this.videoProvider = null;
	}

	addVideo(avastRequestDeviceVideo) {
		this.videoProvider = avastRequestDeviceVideo;
	}

	addEvent(id, timestamp, state) {
		this.eventProvider.push(new AvastRequestDeviceEvent(id, timestamp, state));
	}

};

exports.AvastRequest = class AvastRequest {
	constructor() {
		this.log = [];
		this.devices = {};
		this.actionProvider = [];
	}

	addDevice(avastRequestDevice) {
		this.devices[avastRequestDevice.id] = avastRequestDevice;
		return avastRequestDevice;
	}

	addAction(avastRequestAction) {
		this.actionProvider.push(avastRequestAction);
		return avastRequestAction;
	}
};
