from schema import *
from utils import *

import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocketDisconnect
import requests
import websockets
import json


# Port stored as an array to allow other modules to access it correctly
SELF_PORT = []

# Local State of ChatRooms
STATE = [ChatRoom(chat_id = 0,messages = [],user_ws = []), 
         ChatRoom(chat_id = 1,messages = [],user_ws = []),
         ChatRoom(chat_id = 2,messages = [],user_ws = [])]

ACTIVE_CONNECTIONS = {
    'csx1:8000': None,
    'csx2:8001': None,
    'csx3:8002': None,
    'csx3:8003': None,
}

LEADER = []

async def check_server_running(server: int):
    url = f'http://{server}/get/ping-server'
    try:
        data = requests.get(url=url)
        if data.status_code == 200:
            return True
    except Exception:
        pass
    
    return False


async def create_connection(self_server: int, target_server: int):
    uri = f'ws://{target_server}/ws/servers/link-nodes'
    try:
        websocket = await websockets.connect(uri)
        print(f'[LOG] Connected to {target_server}')
        ACTIVE_CONNECTIONS[target_server] = websocket

        message = {"type": "first_connection", "server": f"{self_server}"}
        await websocket.send(json.dumps(message))
    except WebSocketDisconnect:
        ACTIVE_CONNECTIONS[target_server] = None

async def create_reciprocol_connection(self_server: int, target_server: int):
    uri = f'ws://{target_server}/ws/servers/link-nodes'
    try:
        websocket = await websockets.connect(uri)
        print(f'[LOG] Connected to {target_server}')
        ACTIVE_CONNECTIONS[target_server] = websocket

        message = {"type": "reciprocol_connection", "server": f"{self_server}"}
        await websocket.send(json.dumps(message))

        for chat_id, c in enumerate(STATE):
            print(f'[LOG] Updating {target_server} with message state for chat id: {chat_id}')
            msg_json = [message.model_dump() for message in STATE[chat_id].messages]
            updated_chat_information = {
                    "type": "update",
                    "server": SELF_PORT[0],
                    "chat_id": chat_id,
                    "messages": msg_json
            }
            await websocket.send(json.dumps(updated_chat_information))

    except WebSocketDisconnect:
        ACTIVE_CONNECTIONS[target_server] = None


async def connect_to_servers(port: int):
    for server in ACTIVE_CONNECTIONS.keys():
        # Skip self-connection
        if server == port:
            continue 
        if await check_server_running(server):
           asyncio.create_task(create_connection(port, server))
        else:
            print(f'[LOG] {server} is not running')


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('[LOG] Starting server ...')
    SELF_PORT.append(f'{app.state.host}:{app.state.port}')
    LEADER.append(f'{app.state.host}:{app.state.port}')
    
    await connect_to_servers(SELF_PORT[0])
    yield
    
    print('[LOG] Server shutting down ...')
