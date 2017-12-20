import asyncio
import websocket
from websocket import create_connection
import sender
import receiver

class WebSocketManager:
	def __init__(self, address, port, on_message):
		self.address = address
		self.port = port
		ws = create_connection("ws://" + address + ":" + port)
		
		# Create Sender and receiver
		self.snder = sender.Sender(ws)
		self.recver = receiver.Receiver(ws, on_message)

		# Launch both
		self.recver.start()


	def send(self,message):
		self.snder.send(message)



