from database import *

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

'''
    Websocket endpoint that receives a websocket connection and receives text
'''
# Message collection
@app.websocket("/sendMessage")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # TODO: Make an actual protocol for checking the payload
            write_message_to_db(data)
            await websocket.send_text(f'Text sent was: {data}')
    except WebSocketDisconnect:
        print('Client disconnected')

@app.websocket("/getMessage")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        data = read_message_from_db()
        await websocket.send_text(f'Text received was: {data}')
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