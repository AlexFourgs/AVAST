#!/usr/bin.env python3
import threading

class Receiver(threading.Thread):
	def __init__(self, websocket):
		threading.Thread.__init__(self)
		self.ws = websocket
		self.stop_event = False
		self.buffer = ""

	def run(self):
		while not self.stop_event:
			self.buffer = self.ws.recv()
			print(self.buffer)

	def get_message(self):
		return self.buffer

	def stop(self):
		self.stop_event = True
	

