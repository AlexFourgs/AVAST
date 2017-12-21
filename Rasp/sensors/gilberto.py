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
        self.central_address = '192.168.43.166'
        self.central_port = '8100'
        self.websocket = WebSocketManager(self.central_address, self.central_port, self.on_message_cc)
        self.sensors = {}
        self.rmanagers = {}
        self.authorized_uids = ['Ubtn', 'Upho']
        log.info("Hello from Gilberto")

    def on_message_cc(self, message):
        log.debug('Got request from cc')
        parsed_json = json.loads(message)
        log.debug('sending to ' + parsed_json['id'] + ' command ' + parsed_json['stateChgt'])
        self.send_command(parsed_json['id'], parsed_json['stateChgt'])

    def discover_sensors(self):
        """
            Tries to discover any sensor that is connected to Gilberto.

        """
        devices = serial.tools.list_ports.comports()

        for device in serial.tools.list_ports.comports():

            if device.device not in self.sensors.keys():

                if(device.product == 'Arduino Uno'):
                    log.debug('Arduino detected: ' + str(device.device))
                    cur_device = sensor.Sensor(device.device)
                    cur_device.wait_helo()
                    cur_device.uid = cur_device.uid().decode('utf-8')
		    
                    if cur_device.uid in self.authorized_uids:
                        log.debug('Recognized sensor')
                        self.sensors[cur_device.port] = cur_device
                        self.rmanagers[cur_device.port] = RaspManager(self.central_address, self.central_port, cur_device, cur_device.uid, self.on_message_cc)
                        self.rmanagers[cur_device.port].device.state()
                    else:
                        log.warn('Unauthorized sensor connected')
                        log.warn(cur_device.uid)
                        log.warn(self.authorized_uids)
            else:
                log.debug("port " + device.device + " already in use")

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
            sends a command to a certain sensor
        """
        log.debug('sending ' + command + ' to ' + uid)
        for rmanager in self.rmanagers.values():
            if rmanager.device.uid == uid:
                if command == "ALRM":
                    rmanager.device.alarm()

                elif command == "REDY":
                    rmanager.device.ready()

                elif command == "DEAC":
                    rmanager.device.deactivate()

                elif command == "STAT":
                    rmanager.device.state()

                return None
            
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
