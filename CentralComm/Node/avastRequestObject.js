


exports.avastRequestDeviceEvent =   class avastRequestDeviceEvent{
  constructor(id , timestamp , state) {
    this.id =  id;
    this.timestamp = timestamp;
    this.state = state;
  }
};

exports.avastRequestDeviceVideo =  class avastRequestDeviceVideo  {
  constructor(videoRessourceType , videoRessouceURI ){
    this.videoRessourceType =  videoRessourceType;
    this.videoRessouceURI = videoRessourceURI;
  }
};

exports.avastRequestDeviceAction = class avastRequestDeviceAction {
  constructor(actionType , actionData) {
    this.actionType= actionType;
    this.actionData = actionData;
}
};

exports.avastRequestDevice =  class avastRequestDevice  {
  constructor(id , type , logs){
    this.id = "";// Valeur par défaut  value of properties
    this.type = "";
    this.log = [];
    this.eventProvider = [];
    this.videoProvider = [];
    this.actionProvider =  [];
  }

  addAction(actionType , actionData){
    console.log("adding action");
    this.actionProvider.push(new avastRequestDeviceAction(actionType, actionData));
  }
  addVideo( videoRessourceType , videoRessouceURI ){
    this.videoProvider.push(new avastRequestDeviceVideo(videoRessourceType, videoRessouceURI));
    console.log("adding videoRessource");
  }
  addEvent( id , timestamp , state){
    console.log("adding Event");
    this.eventProvider.push(new avastRequestDeviceEvent(id , timestamp , state));
  }

};


exports.avastRequest  = class avastRequest {
  constructor() {
    this.log= [];// Valeur par défaut  value of properties
    this.devices = [];
  }

  addDevice(id , state){
    console.log("adding device " + id);
    this.devices.push(new avastRequestDeviceEvent( id , Date.now() , state ));
  }
};
