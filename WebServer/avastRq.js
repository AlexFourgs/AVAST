class AvastRequestDeviceEvent {
	constructor(id, timestamp, state) {
		this.id = id;
		this.timestamp = timestamp;
		this.state = state;
	}
};

class AvastRequestDeviceVideo {
	constructor(videoRessourceType, videoRessourceURI) {
		this.videoRessourceType = videoRessourceType;
		this.videoRessouceURI = videoRessourceURI;
	}
};

class AvastRequestAction {
	constructor(actionType, actionData) {
		this.actionType = actionType;
		this.actionData = actionData;
	}
};

class AvastRequestDevice {
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

class AvastRequest {
	constructor() {
		this.log = [];
		this.devices = [];
		this.actionProvider = [];
	}

	addDevice(avastRequestDevice) {
		this.devices.push(avastRequestDevice);
		return avastRequestDevice;
	}

	addAction(avastRequestAction) {
		this.actionProvider.push(avastRequestAction);
		return avastRequestAction;
	}
};
