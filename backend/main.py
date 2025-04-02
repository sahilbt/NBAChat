from nba import *
from schema import *
import server as server_state
from utils import *

import argparse
import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


app = FastAPI(lifespan=server_state.lifespan)

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


@app.get('/get/todays_games')
async def get_nba_games():
    return {'message': get_live_games()}


@app.websocket("/ws/client/link_client")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    CHAT_ID_FOR_DISCONNECT = None
    USERNAME_FOR_DISCONNECT = None
    try:
        while True:
            message = await websocket.receive_json()
            print(f'[LOG] Received message from client: {message}')
            if message["type"] == "join_chat_room":
                chat_id = int(message["chat_id"])
                username = message["username"]
                CHAT_ID_FOR_DISCONNECT = chat_id
                USERNAME_FOR_DISCONNECT = username
                print(f'[LOG] Client attempting to join the chat room: {chat_id}')
                server_state.STATE[chat_id].user_ws.append(websocket)
                
                # send state back to client
                msg_json = [message.model_dump() for message in server_state.STATE[chat_id].messages]

                updated_chat_information = {
                    "type": "update",
                    "chat_id": chat_id,
                    "messages": msg_json
                }
                await websocket.send_json(json.dumps(updated_chat_information))
                print(f'[LOG] Sent client updated chat messages for chat room: {chat_id}')

            elif message["type"] == "send_message":
                print(f'[LOG] Client attempting to send message: {message}')
                chat_id = int(message["chat_id"])
                chat_message = Message(
                    username=message["username"],
                    text=message["text"],
                    timestamp=get_current_timestamp()
                )
                server_state.STATE[chat_id].messages.append(chat_message)
                msg_json = [message.model_dump() for message in server_state.STATE[chat_id].messages]

                updated_chat_information = {
                    "type": "update",
                    "server": server_state.SELF_PORT[0],
                    "chat_id": chat_id,
                    "messages": msg_json
                }

                # update servers and clients
                print(f'[LOG] Updating all clients with new chat messages')
                await update_clients(updated_chat_information, chat_id)
                print(f'[LOG] Updating all servers with new chat messages')
                await update_servers(updated_chat_information)

    except WebSocketDisconnect:
        if CHAT_ID_FOR_DISCONNECT is not None and websocket in server_state.STATE[CHAT_ID_FOR_DISCONNECT].user_ws:
            print(f'[LOG] {USERNAME_FOR_DISCONNECT} has disconnected from chat room {CHAT_ID_FOR_DISCONNECT}. Removing from chat room list')
            server_state.STATE[CHAT_ID_FOR_DISCONNECT].user_ws.remove(websocket)


@app.websocket("/ws/servers/link-nodes")
async def link_server(websocket: WebSocket):
    await websocket.accept()
    SERVER_FOR_DISCONNECT = None
    try:
        while True:
            message = await websocket.receive_json()
            print(f'[LOG] Received message from peer server: {message}')

            if message["type"] == "first_connection":
                server = message["server"]
                
                SERVER_FOR_DISCONNECT = server
                print(f'[LOG] Received connection from server: {server}')

                if server_state.ACTIVE_CONNECTIONS[server] is None:
                    print(f'[LOG] Connection to {server} does not exist. Creating reciprocol connection...')
                    await server_state.create_reciprocol_connection(server_state.SELF_PORT[0], server)
                    
                    await leader_election()
                else:
                    print(f'[LOG] Connection to {server} already exists')

            if message["type"] == "reciprocol_connection":
                server = message["server"]
                SERVER_FOR_DISCONNECT = server
                print(f'[LOG] Recieved reciprocol connection from server: {server}')
                await leader_election()

            if message["type"] == "update":
                server = message["server"]
                print(f'[LOG] Received update message from server: {server}')

                chat_id = int(message["chat_id"])
                all_messages = message["messages"]
                new_messages = []

                for m in all_messages:
                    message_obj = Message(
                        username=m["username"],
                        text=m["text"],
                        timestamp=m["timestamp"]
                    )
                    new_messages.append(message_obj)

                server_state.STATE[chat_id].messages = new_messages
                
                print(f'[LOG] State updated from server at server: {server}')
            
            if message["type"] == "leader":
                leader = message["leader"]
                server_state.LEADER[0] = leader
                print(f'[LOG] New leader instated: {leader}')

    except WebSocketDisconnect:
        print(f'[LOG] A peer server on port {SERVER_FOR_DISCONNECT} has disconnected, removing from active connections')
        server_state.ACTIVE_CONNECTIONS[SERVER_FOR_DISCONNECT] = None
        
        await leader_election()


@app.post("/servers/update")
async def update_servers(updated_chat_info: dict):
    for port, websocket in server_state.ACTIVE_CONNECTIONS.items():
        if websocket:
            try: 
                # This is a python websocket, not a FastAPI websocket
                await websocket.send(json.dumps(updated_chat_info))
                print(f'[LOG] Update was delivered to server running on port {port}')
            except Exception as e:
                print(f'[LOG] Error: Server running on port {port} is not running. Deleting from active connections')
                server_state.ACTIVE_CONNECTIONS[port] = None
                print(f"[LOG] Error info: {e}")


async def update_clients(updated_chat_info: dict, chat_id: int):
    for websocket in server_state.STATE[chat_id].user_ws:
        try:
            await websocket.send_json(json.dumps(updated_chat_info))
        except WebSocketDisconnect:
            print(f'[LOG] A client has disconnected from chat room {chat_id}. Removing from chat room list')
            server_state.STATE[chat_id].user_ws.remove(websocket)
        except Exception as e:
            print(f"[LOG] An unexpected error occured: {e}")


@app.post("/servers/leader")
async def leader_election():
    smallest_active_server = server_state.SELF_PORT[0]
    # Find who should be the next leader (Smallest port number)
    for server_port in server_state.ACTIVE_CONNECTIONS.keys():        
        # If there is an active connection to a server port smaller than current port
        smallestActivePort = server_state.SELF_PORT[0]
        if (server_port < smallestActivePort) and (server_state.ACTIVE_CONNECTIONS[server_port] != None):
            smallest_active_server = server_port
    
    # If own port is the leader, announce to everyone
    if smallest_active_server == server_state.SELF_PORT[0]:
        server_state.LEADER[0] = server_state.SELF_PORT[0]
        print(f'[LOG] New leader instated: {server_state.LEADER[0]}')
        
        leader_message = {
            "type": "leader",
            "leader": server_state.SELF_PORT[0]
        }
        
        for port, websocket in server_state.ACTIVE_CONNECTIONS.items():
            if websocket:
                try: 
                    # This is a python websocket, not a FastAPI websocket
                    await websocket.send(json.dumps(leader_message))
                    print(f'[LOG] Leader was delivered to server running on port {port}')
                except Exception as e:
                    print(f'[LOG] Error: Server running on port {port} is not running. Deleting from active connections')
                    server_state.ACTIVE_CONNECTIONS[port] = None
                    print(f"[LOG] Error info: {e}")
    

@app.get("/get/ping-server")
async def ping_server():
    return {'message': f'Hello from server {app.state.port}'}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, required=True, help='Port number to run server on')
    parser.add_argument('--host', default='localhost', type=str, help='Host to bind the server to')
    args = parser.parse_args()
    app.state.port = args.port
    app.state.host = args.host

    uvicorn.run(app, host=args.host, port=args.port)
