import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocketDisconnect
import requests
import websockets

SERVERS = [8000, 8001, 8002]
ACTIVE_CONNECTIONS = {}

async def check_server_running(port: int):
    url = f'http://localhost:{port}/get/ping-server'
    try:
        data = requests.get(url=url)
        if data.status_code == 200:
            return True
    except Exception:
        pass
    
    return False


async def maintain_connection(self_port: int, target_port: int):
    uri = f'ws://localhost:{target_port}/ws/servers/link-nodes'
    try:
        websocket = await websockets.connect(uri)
        print(f'[LOG] Connected to {target_port}')
        ACTIVE_CONNECTIONS[target_port] = websocket

        await websocket.send(f'Hello from server running on port: {self_port}')
    except WebSocketDisconnect:
        ACTIVE_CONNECTIONS[target_port] = None


async def connect_to_servers(port: int):
    for server_port in SERVERS:
        # Skip self-connection
        if server_port == port:
            continue 
        if await check_server_running(server_port):
           asyncio.create_task(maintain_connection(port, server_port))
           break
        else:
            print(f'[LOG] Server on port {server_port} is not running')


@asynccontextmanager
async def lifespan(app: FastAPI):
    print('[LOG] Starting server ...')
    port = app.state.port
    
    await connect_to_servers(port)
    yield
    
    print('[LOG] Server shutting down ...')
