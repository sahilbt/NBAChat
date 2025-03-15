from database import *
from schema import *
from server import *

import argparse
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

new_message_event = asyncio.Event()


@app.websocket("/messages/send-message")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            message = await websocket.receive_json()
            message_obj = CreatedMessage(**message)
            new_message = write_message_to_db(message_obj)
            new_message_event.set()
            await websocket.send_json(new_message.model_dump())
    except WebSocketDisconnect:
        print('Client disconnected')


@app.websocket("/messages/get-all-messages")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    # Send inital messages
    all_messages = read_all_message_from_db()
    messages_json = [message.model_dump() for message in all_messages]
    await websocket.send_json(messages_json)
    try:
        while True:
            # Wait for message event, and send updated messages
            await new_message_event.wait()
            all_messages = read_all_message_from_db()
            messages_json = [message.model_dump() for message in all_messages]
            await websocket.send_json(messages_json)
            new_message_event.clear()
    except WebSocketDisconnect:
        print('Client disconnected')


@app.websocket("/ws/servers/link-nodes")
async def link_server(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            message = await websocket.receive_json()
            print(f'[LOG] Received message: {message}')

            if message["type"] == "first_connection":
                target_port = int(message["port"])
                print(f'[LOG] Received connection from port: {target_port}')

                if ACTIVE_CONNECTIONS[target_port] is None:
                    print(f'[LOG] Connection to {target_port} does not exist. Creating connection...')
                    print(SELF_PORT[0])
                    asyncio.create_task(create_connection(SELF_PORT[0], target_port))
                else:
                    print(f'[LOG] Connection to {target_port} already exists')

    except WebSocketDisconnect:
        print(f'[ERROR] Connection went down!')


@app.post("/post/servers/message/{port}")
async def message_server(port: int, message: str):
    # TODO: Fix this so it sends the JSON payload of server state
    websocket = ACTIVE_CONNECTIONS.get(port)
    if websocket:
        try: 
            await websocket.send(message)
            return {'message': f'message was delivered to port {port}'}
        except:
            print(f'[LOG] Server running on port {port} is not running. Deleting from active connections')
            ACTIVE_CONNECTIONS[port] = None


@app.get("/get/ping-server")
async def ping_server():
    return {'message': f'Hello from server {app.state.port}'}


# User collection
@app.websocket("/addUser")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data_Username = await websocket.receive_text()
            data_Password = await websocket.receive_text()
            # TODO: Make an actual protocol for checking the payload
            add_user_to_db(data_Username, data_Password)
            await websocket.send_text(f'Text sent was: {data_Username, data_Password}')
    except WebSocketDisconnect:
        print('Client disconnected')

@app.websocket("/getUser")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        data = get_user_from_db()
        await websocket.send_text(f'Text received was: {data}')
    except WebSocketDisconnect:
        print('Client disconnected')


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, required=True, help='Port number to run server on')
    args = parser.parse_args()
    app.state.port = args.port

    uvicorn.run(app, host='localhost', port=args.port)
