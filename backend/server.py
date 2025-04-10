from nba import *
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
STATE = {}

# List of ports of peer servers
ACTIVE_CONNECTIONS = {
    8000: None,
    8001: None,
    8002: None,
    8003: None,
    8004: None,
}

LEADER = []

# Method to check if a server is running by pinging it
async def check_server_running(server: int):
    url = f'http://localhost:{server}/get/ping-server'
    try:
        data = requests.get(url=url)
        if data.status_code == 200:
            return True
    except Exception:
        pass
    
    return False

# Creating websocket connection for newly spawned server
async def create_connection(self_server: int, target_server: int):
    uri = f'ws://localhost:{target_server}/ws/servers/link-nodes'
    try:
        websocket = await websockets.connect(uri)
        print(f'[LOG] Connected to {target_server}')
        ACTIVE_CONNECTIONS[target_server] = websocket
        
        message = {"type": "first_connection", "server": self_server}        
        await websocket.send(json.dumps(message))
    except WebSocketDisconnect:
        ACTIVE_CONNECTIONS[target_server] = None

# Creating websocket connection from existing servers to a newly spawned server
async def create_reciprocol_connection(self_server: int, target_server: int):
    uri = f'ws://localhost:{target_server}/ws/servers/link-nodes'
    try:
        websocket = await websockets.connect(uri)
        print(f'[LOG] Connected to {target_server}')
        ACTIVE_CONNECTIONS[target_server] = websocket

        message = {"type": "reciprocol_connection", "server": self_server}
        await websocket.send(json.dumps(message))

        # Send updated chat information to new server from existing servers
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

# Creating a server with a specified port
async def connect_to_servers(port: int):
    for server in ACTIVE_CONNECTIONS.keys():
        # Skip self-connection
        if server == port:
            continue 
        if await check_server_running(server):
           asyncio.create_task(create_connection(port, server))
        else:
            print(f'[LOG] {server} is not running')

# Populate local state with current game information
async def populate_state_with_current_games():
    games = get_live_games()

    for game in games:
        id = game["id"]
        STATE[id] = ChatRoom(chat_id = id, messages = [], user_ws = [])


# Server startup configuring the port, leader & lives games     
@asynccontextmanager
async def lifespan(app: FastAPI):
    print('[LOG] Starting server ...')
    SELF_PORT.append(app.state.port)
    LEADER.append(app.state.port)
    
    await connect_to_servers(SELF_PORT[0])
    await populate_state_with_current_games()
    yield
    
    print('[LOG] Server shutting down ...')
