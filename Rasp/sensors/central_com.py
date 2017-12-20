import asyncio
import websocket
from websocket import create_connection
import sender
import receiver
import webSocketManager
import time
from sensor import Sensor
from serial_communication import SerialCommunication
import json

class RaspManager:

	def on_message_cc(self, message):	
		parsed_json = json.loads(message)
		
		if parsed_json["stateChgt"] == "ALRM":
			self.device.alarm()
			print("setting alarm")

	def on_message_device(self, message):
		data = {}
		data["id"] = "UJ01"
		data["type"] = "0"
		data["state"] = message.decode("UTF-8")
		self.websocket.send(json.dumps(data))

	def __init__(self, address, port, device):
		self.central_address = address
		self.central_port = port
		self.device = device

		self.websocket = webSocketManager.WebSocketManager(self.central_address, self.central_port, self.on_message_cc)
		self.serial_com = SerialCommunication(device, self.on_message_device)
		self.serial_com.start()


if __name__ == '__main__':
	arduino = Sensor('/dev/ttyACM0')
	arduino.flushInput()
	rasp = RaspManager("192.168.1.155", "8100", arduino)
	 
	

