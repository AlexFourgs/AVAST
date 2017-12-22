import sensor
import serial.tools.list_ports
import logging
import time

from webSocketManager import WebSocketManager
from central_com import RaspManager
import json

log = logging.getLogger(__name__)

class Gilberto():

    def __init__(self):
        self.central_address = '192.168.43.166' # Address of the webserver
        self.central_port = '8100' # Port of the webserver
        self.websocket = WebSocketManager(self.central_address, self.central_port, self.on_message_cc) # Websocket manager creation
        self.sensors = {} # List sensors
        self.rmanagers = {} # list serial port managers
        self.authorized_uids = ['Ubtn', 'Upho'] # list of authorized uid
        log.info("Hello from Gilberto") 

    def on_message_cc(self, message):
        """
            Callback : define the behaviour of a message reception

        """
        log.debug('New request from CC')
        parsed_json = json.loads(message) # Load message as json

        if 'stateChgt' in parsed_json:
            self.send_command(parsed_json['id'], parsed_json['stateChgt']) # Send command to 
        
        elif 'networkRequest' in parsed_json:
            data = {}
            data['id'] = parsed_json['id']
            data['networkRequest'] = "pong"
            self.websocket.send(json.dumps(data))

    def discover_sensors(self):
        """
            Tries to discover any sensor that is connected to Gilberto :
                 * List all connected ports
                 * Check if it's a new port
                 * Add if yes

        """

        # Browse devices
        for device in serial.tools.list_ports.comports():
            if device.device not in self.sensors.keys():
                # Check if the device is an arduino uno
                if(device.product == 'Arduino Uno'):
                    log.debug('Arduino detected: ' + str(device.device))
                    # Add as new arduino device
                    cur_device = sensor.Sensor(device.device)
                    # Waiting for the first message
                    cur_device.wait_helo()
                    # Waiting for the device uid
                    cur_device.uid = cur_device.uid().decode('utf-8')
		    # Create a new device manager
                    if cur_device.uid in self.authorized_uids:
                        log.debug('Recognized sensor')
                        self.sensors[cur_device.port] = cur_device
                        self.rmanagers[cur_device.port] = RaspManager(self.central_address, self.central_port, cur_device, cur_device.uid, self.websocket)
                        self.rmanagers[cur_device.port].device.state()
                    else:
                        log.warn('Unauthorized sensor connected')

    def heartbeat(self):
        """
            Sees if the registered sensors are still here
        """
        log.debug("Checking if everybody is here")

        log.debug(str(len(self.rmanagers)) + ' to check') 
        offline_devices = []
        for port, rmanager in self.rmanagers.items():
            if rmanager.device.state() is None:
                log.warn("Device offline")
                del self.sensors[port]
                offline_devices.append(port)

        log.debug('offline devices' + str(len(offline_devices)))
        
        self.rmanagers = {k:v for k, v in self.rmanagers.items() if k not in offline_devices}

        log.debug(str(len(self.sensors)) + ' sensors answered') 

    #def sensors_names(self):
    #    """
    #        Gets a list of sensors uids
    #    """
    #    return [v.uid() for v in self.sensors.values()]

    def send_command(self, uid, command):
        """
            sends a command to a certain sensor with the correct uid
        """
        log.debug('sending ' + command + ' to ' + uid)
        for rmanager in self.rmanagers.values():
            if rmanager.device.uid == uid:
                # Send a command regarding the name of the state that you wan't to change
                # Alarm activation
                if command == "ALRM":
                    rmanager.device.alarm()

                # Arm device
                elif command == "REDY":
                    rmanager.device.ready()

                # Disarm device 
                elif command == "DEAC":
                    rmanager.device.deactivate()

                # Ask current state
                elif command == "STAT":
                    rmanager.device.state()

                elif command == "TURR":
                    rmanager.device.turn_right()

                elif command == "TURL":
                    rmanager.device.turn_left()

                elif command == "TURD":
                    rmanager.device.go_down()

                elif command == "TURU":
                    rmanager.device.go_up()

                return True
            
        log.error("uid not foud")
        

def main():
    g = Gilberto()
    g.discover_sensors()
    while(True):
        g.discover_sensors()
        #g.heartbeat()
        time.sleep(5)

if __name__ == '__main__':
    main()
