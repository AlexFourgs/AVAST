import asyncio
import websockets

async def hello(websocket, path):
    while True:
        name = await websocket.recv()
        #print("< {}".format(name))

        #greeting = "Hello {}!".format(name)
        await websocket.send("fdp")
        print(name)

start_server = websockets.serve(hello, 'localhost', 7777)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
