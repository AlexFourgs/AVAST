import sensor
import serial.tools.list_ports
import logging
import time

from webSocketManager import WebSocketManager
from central_com import RaspManager

log = logging.getLogger(__name__)

class Gilberto():

    def __init__(self):
        self.central_address = '127.0.0.1'
        self.central_port = '7777'
        self.websocket = WebSocketManager(self.central_address, self.central_port, self.on_message_cc)
        self.sensors = {}
        self.rmanagers = {}
        self.authorized_uids = [b'Ubtn', b'Upho']
        log.info("Hello from Gilberto")

    def on_message_cc(self, message):
        log.debug('Got request from cc')
        parsed_json = json.loads(message)
        log.debug('sending to ' + parsed_json['uid'] + ' command ' + parsed_json['stateChgt'])
        self.send_command(parsed_json['uid'], parsed_json['stateChgt'])

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
                    cur_device.wait_helo() #add timeout here

                    if cur_device.uid() in self.authorized_uids:
                        log.debug('Recognized sensor')
                        self.sensors[cur_device.port] = cur_device
                        self.rmanagers[cur_device.port] = RaspManager('localhost', '7777', cur_device, cur_device.uid())
                    else:
                        log.warn('Unauthorized sensor connected')
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
            if rmanager.device.uid() == uid:
                return rmanager.device.send_cmd(command)
        log.error("uid not foud")






def main():
    g = Gilberto()
    g.discover_sensors()
    while(True):
        g.discover_sensors()
        g.heartbeat()
        time.sleep(5)

if __name__ == '__main__':
    main()