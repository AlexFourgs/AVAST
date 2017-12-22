import asyncio
import websocket
from websocket import create_connection
import sender
import receiver
import logging
import time

log = logging.getLogger(__name__)

class WebSocketManager:
	"""
		Manage the connection with the server.
		You can send message and receive message by implementing the callback method on_message
	"""
	def __init__(self, address, port, on_message):
		self.address = address
		self.port = port

		while True:
			try:
				ws = create_connection("ws://" + address + ":" + port)
			except ConnectionRefusedError:
				log.warn("Unable to connect to CC")
				time.sleep(5)
				continue
			log.info("Connection established to CC")
			break
		
		# Create Sender and receiver
		self.snder = sender.Sender(ws)
		self.recver = receiver.Receiver(ws, on_message)

		# Launch both
		self.recver.start()


	def send(self,message):
		"""
			send message to the server
		"""
		self.snder.send(message)



