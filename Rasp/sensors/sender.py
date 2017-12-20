#!/usr/bin/env python3

class Sender:
	def __init__(self,websocket):
		self.ws = websocket
		
	def send(self,message):
		self.ws.send(message)


