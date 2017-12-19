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

    def send_cmd(self, cmd):
        """
            Send a command to the sensor
        """
        try:
            self.write(cmd.encode('ASCII'))
        except SerialException as e:
            log.error("Sensor unavailable !")
            return None
        return self.readline()[:4]

    def state(self):
        """
            Get the actual state of a sensor.
        """
        log.debug("issued command state")
        return self.send_cmd('s')

    def ready(self):
        """
            Tell to a sensor to go into Ready mode.
        """
        log.debug("issued command ready")
        return self.send_cmd('r')

    def deactivate(self):
        """
            Deactivate a sensor.
        """
        log.debug("issued command deactivate")
        return self.send_cmd('d')

    def alarm(self):
        """
            Trigger the alarm of a sensor.
        """
        log.debug("issued command alarm")
        return self.send_cmd('a')
