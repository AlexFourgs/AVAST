import serial


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

    def state(self):
        """
            Get the actual state of a sensor.
        """
        self.write(b's')
        return self.readline()[:4]

    def ready(self):
        """
            Tell to a sensor to go into Ready mode.
        """
        self.write(b'r')
        return self.readline()[:4]

    def deactivate(self):
        """
            Deactivate a sensor.
        """
        self.write(b'd')
        return self.readline()[:4]

    def alarm(self):
        """
            Trigger the alarm of a sensor.
        """
        self.write(b'a')
        return self.readline()[:4]


def main():

    arduino = Sensor('/dev/ttyACM0')
    arduino.flushInput()

    print(arduino.state())
    print(arduino.ready())
    print(arduino.state())
    print(arduino.deactivate())
    print(arduino.state())
    print(arduino.alarm())

    while(True):
        event = arduino.readline()[:4]
        print(event)
        arduino.flushInput()


if __name__ == '__main__':
    main()
