#!/usr/bin.env python3
import threading

class Receiver(threading.Thread):
	def __init__(self, websocket, on_message):
		threading.Thread.__init__(self)
		self.ws = websocket
		self.stop_event = False
		self.buffer = ""
		self.on_message = on_message
		
	def run(self):
		while not self.stop_event:
			self.buffer = self.ws.recv()
			self.on_message(self.buffer)
			
	def stop(self):
		self.stop_event = True
	

