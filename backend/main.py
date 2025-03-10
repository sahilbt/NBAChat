from database import *
from schema import *

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
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

@app.post("/messages/send-message", response_model = RetrievedMessage)
async def send_message(message: CreatedMessage):
    return write_message_to_db(message)


@app.get("/messages/get-all", response_model = List[RetrievedMessage])
async def get_all_messages():
    return read_all_message_from_db()


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