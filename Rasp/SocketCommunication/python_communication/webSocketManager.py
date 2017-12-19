import asyncio
import websocket
from websocket import create_connection
import sender
import receiver

class WebSocketManager:
	def __init__(self, address, port):
		self.address = address
		self.port = port
		ws = create_connection("ws://" + address + ":" + port)
		
		# Create Sender and receiver
		self.snder = sender.Sender(ws)
		self.recver = receiver.Receiver(ws)

		# Launch both
		self.recver.start()


	def send(self,message):
		self.snder.send(message)

	def get_message(self):
		return recver.get_message()


if __name__ == "__main__":
	webso = WebSocketManager("localhost", "7777")
	webso.send("tamere manager")
