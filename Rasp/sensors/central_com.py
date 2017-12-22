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
import logging
import time

log = logging.getLogger(__name__)

class RaspManager:
	"""
		Rasp manager is reading the serial port and the server ( websocket ).
		It's a bridge betwween the cc and the arduino
	"""
	def on_message_device(self, message):
		""" 
			Callback method. Call when you receive a message from the arduio board.
			Parse the json and send it to the  central com.
		"""

		self.step_time = time.time()

		data = {}
		data["id"] = self.uid
		log.debug(self.uid)
		if self.uid == "UCAM":
			data["type"] = "camera"
			log.debug("type is cam")

		else :
			data["type"] = ""

		data["state"] = message.decode("UTF-8")
		self.websocket.send(json.dumps(data))
   

	def __init__(self, address, port, device, uid, websocket):
		# Declare datas
		self.central_address = address
		self.central_port = port
		self.device = device
		self.uid = uid
		self.websocket = websocket
		self.is_alive = True
		self.step_time = time.time()

		# Declare serial port listener and server listener
		self.serial_com = SerialCommunication(device, self.on_message_device)
		self.serial_com.start()




