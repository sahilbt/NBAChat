from database import *
from schema import *

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

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

@app.websocket("/messages/send-message")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        message = await websocket.receive_json()
        message_obj = CreatedMessage(**message)
        new_message = write_message_to_db(message_obj)
        await websocket.send_json(new_message.model_dump())
    except WebSocketDisconnect:
        print('Client disconnected')


@app.websocket("/messages/get-all-messages")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        all_messages = read_all_message_from_db()
        messages_json = [message.model_dump() for message in all_messages]
        await websocket.send_json(messages_json)
    except WebSocketDisconnect:
        print('Client disconnected')


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