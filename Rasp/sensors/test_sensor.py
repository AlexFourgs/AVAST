from sensor import Sensor
import time
# Demo code for python sensors


def main():

    arduino = Sensor('/dev/ttyACM0')  # Create a Sensor object
    arduino.flushInput()  # Flushing input to clean it before doing things
    arduino.wait_helo()

    print(arduino.state())  # Asking the sensor its current state
    time.sleep(1)
    print(arduino.deactivate())  # Putting the sensor in Deactivate state
    time.sleep(1)
    print(arduino.alarm())  # Putting the sensor in Alarm state
    time.sleep(3)
    print(arduino.deactivate())
    while(True):  # Waiting for events
        # This will block until the Sensor sends something
        # [:-4] is used to get rid of '\r\n'
        event = arduino.readline()[:4]
        print(event)  # Printing the 4 character code of the event
        arduino.flushInput()  # Cleaning input


if __name__ == '__main__':
    main()
