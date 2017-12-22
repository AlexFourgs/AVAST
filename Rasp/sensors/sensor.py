import serial
from serial.serialutil import SerialException
import logging


logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger('sensor')

class Sensor(serial.Serial):
    """
        Sensor class, wraps a serial object,
        adds specific methods for our project

        Sensors have 3 states :

        * Ready (REDY):
            In Ready mode, a sensor is active and is reacting to changes.
            It can go in Alarm mode if certain conditions are met.
        * Alarm (ALRM):
            In Alarm mode, the sensor alarm is on,
            and it's up to the rest of the project to inform the client.
        * Deactivated (DEAC):
            In Deactivated mode,
            the sensor won't react to anything based on the sensor value.

        :params: See pyserial's class Serial.
    """

    def wait_helo(self):
        log.info("Waiting for sensor...")
        self.flushInput()
        self.readline()[:4]

    def send_cmd(self, cmd):
        """
            Send a command to the sensor
        """
        try:
            self.flushInput()
            self.write(cmd.encode('ASCII'))
            print(cmd.encode('ASCII'))
            #return self.readline()[:4]
        except Exception as e:
            log.error("Sensor unavailable !")
            return None

    def state(self):
        """
            Get the actual state of a sensor.
        """
        log.debug("issued command state")
        self.send_cmd('s')

    def ready(self):
        """
            Tell to a sensor to go into Ready mode.
        """
        log.debug("issued command ready")
        self.send_cmd('r')

    def deactivate(self):
        """
            Deactivate a sensor.
        """
        log.debug("issued command deactivate")
        self.send_cmd('d')

    def alarm(self):
        """
            Trigger the alarm of a sensor.
        """
        log.debug("issued command alarm")
        self.send_cmd('a')

    def uid(self):
        """
            Get the uid of the sensor
        """
        log.debug("issued command uid")
        self.send_cmd('u')
        return self.readline()[:4]
