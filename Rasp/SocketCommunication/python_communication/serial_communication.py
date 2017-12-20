import threading

class SerialCommunication(threading.Thread):
	"""
		Manage the reception of a message from the serial port.
		read the message and apply the on_message callback
	"""
	def __init__(self, device, on_message):
		threading.Thread.__init__(self)
		self.stop_event = False
		self.on_message = on_message
		self.device = device

	def run(self):
		while not self.stop_event:
			event = self.device.readline()[:4]
			self.on_message(event)
			self.device.flushInput()

	def stop(self):
		self.stop_event = True
