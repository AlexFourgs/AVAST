import sensor
import serial.tools.list_ports
import logging
import time

log = logging.getLogger(__name__)

class Gilberto():

    def __init__(self):
        self.sensors = {}
        self.authorized_uids = [b'Ubtn', b'Upho']
        log.info("Hello from Gilberto")

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
                    else:
                        log.warn('Unauthorized sensor connected')
            else:
                log.debug("port " + device.device + " already in use")

    def heartbeat(self):
        """
            Sees if the registered sensors are still here
        """
        log.debug("Checking if everybody is here")

        log.debug(str(len(self.sensors)) + ' sensors checked') 
        self.sensors = {k:v for k, v in self.sensors.items() if v.state() is not None}
        log.debug(str(len(self.sensors)) + ' sensors answered') 

    def sensors_names(self):
        """
            Gets a list of sensors uids
        """
        return [v.uid() for v in self.sensors.values()]

    def send_command(self, uid, command):
        """
            sends a command to a certain sensor
        """
        for sensor in self.sensors.values():
            if sensor.uid() == uid:
                return sensor.send_cmd(command)
        log.error("uid not foud")






def main():
    g = Gilberto()
    g.discover_sensors()
    while(True):
        g.discover_sensors()
        g.heartbeat()
        time.sleep(5)
        print(g.sensors_names())
        print(g.send_command(g.sensors_names()[0], 'a'))

if __name__ == '__main__':
    main()