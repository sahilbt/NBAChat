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
    8000: None,
    8001: None,
    8002: None,
    8003: None
}

LEADER = None

async def check_server_running(port: int):
    url = f'http://localhost:{port}/get/ping-server'
    try:
        data = requests.get(url=url)
        if data.status_code == 200:
            return True
    except Exception:
        pass
    
    return False


async def create_connection(self_port: int, target_port: int):
    uri = f'ws://localhost:{target_port}/ws/servers/link-nodes'
    try:
        websocket = await websockets.connect(uri)
        print(f'[LOG] Connected to {target_port}')
        ACTIVE_CONNECTIONS[target_port] = websocket

        message = {"type": "first_connection", "port": f"{self_port}"}
        await websocket.send(json.dumps(message))
    except WebSocketDisconnect:
        ACTIVE_CONNECTIONS[target_port] = None

async def create_reciprocol_connection(self_port: int, target_port: int):
    uri = f'ws://localhost:{target_port}/ws/servers/link-nodes'
    try:
        websocket = await websockets.connect(uri)
        print(f'[LOG] Connected to {target_port}')
        ACTIVE_CONNECTIONS[target_port] = websocket

        message = {"type": "reciprocol_connection", "port": f"{self_port}"}
        await websocket.send(json.dumps(message))

        for chat_id, c in enumerate(STATE):
            print(f'[LOG] Updating {target_port} with message state for chat id: {chat_id}')
            msg_json = [message.model_dump() for message in STATE[chat_id].messages]
            updated_chat_information = {
                    "type": "update",
                    "port": SELF_PORT[0],
                    "chat_id": chat_id,
                    "messages": msg_json
            }
            await websocket.send(json.dumps(updated_chat_information))

    except WebSocketDisconnect:
        ACTIVE_CONNECTIONS[target_port] = None


async def connect_to_servers(port: int):
    for server_port in ACTIVE_CONNECTIONS.keys():
        # Skip self-connection
        if server_port == port:
            continue 
        if await check_server_running(server_port):
           asyncio.create_task(create_connection(port, server_port))
        else:
            print(f'[LOG] Server on port {server_port} is not running')


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('[LOG] Starting server ...')
    SELF_PORT.append(app.state.port)
    
    await connect_to_servers(SELF_PORT[0])
    yield
    
    print('[LOG] Server shutting down ...')
