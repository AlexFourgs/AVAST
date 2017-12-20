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
	"""
		Rasp manager is reading the serial port and the server ( websocket ).
		It's a bridge betwween the cc and the arduino
	"""
	def on_message_cc(self, message):	
		"""
			Callback method. Call when you receive a message from the central com.
			Parse the json message and send the good command to the arduino board
		"""
		parsed_json = json.loads(message)
		
		if parsed_json["stateChgt"] == "ALRM":
			self.device.alarm()
	
		elif parsed_json["stateChgt"] == "DEAC":
			self.device.deactivate()

		elif parsed_json["stateChgt"] == "REDY":
			self.device.ready()
		 
	def on_message_device(self, message):
		""" 
			Callback method. Call when you receive a message from the arduio board.
			Parse the json and send it to the  central com.
		"""
		data = {}
		data["id"] = self.uid.decode('UTF-8')
		data["state"] = message.decode("UTF-8")
		self.websocket.send(json.dumps(data))

	def __init__(self, address, port, device, uid):
		# Declare datas
		self.central_address = address
		self.central_port = port
		self.device = device
		self.uid = uid

		# Declare serial port listener and server listener
		self.websocket = webSocketManager.WebSocketManager(self.central_address, self.central_port, self.on_message_cc)
		self.serial_com = SerialCommunication(device, self.on_message_device)
		self.serial_com.start()



# Just a testing main : to remove after
if __name__ == '__main__':
	arduino = Sensor('/dev/ttyACM0')
	arduino.flushInput()
	rasp = RaspManager("192.168.1.155", "8100", arduino)
	 
	

