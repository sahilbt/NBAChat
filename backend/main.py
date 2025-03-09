from database import (
    write_message_to_db
)

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

'''
    Websocket endpoint that receives a websocket connection and receives text
'''
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # TODO: Make an actual protocol for checking the payload
            write_message_to_db(data)
            await websocket.send_text(f'Text received was: {data}')
    except WebSocketDisconnect:
        print('Client disconnected')
