from typing import List
from fastapi import WebSocket
from pydantic import BaseModel, Field, ConfigDict
from typing_extensions import Annotated

MODEL_CONFIG = ConfigDict(populate_by_name = True, arbitrary_types_allowed = True, extra = "forbid")
class Game(BaseModel):
    model_config = MODEL_CONFIG
    chat_id: int
    game_title: str

class User(BaseModel):
    model_config = MODEL_CONFIG
    user_id: str
    name: str
    ws: WebSocket

class Message(BaseModel):
    model_config = MODEL_CONFIG
    username: str
    text: str
    timestamp: float
    
    def __lt__(self, other):
        return self.timestamp < other.timestamp
    
    def __gt__(self, other):
        return self.timestamp > other.timestamp
    
    def __eq__(self, other):
        return self.timestamp == other.timestamp

class ChatRoom(BaseModel):
    model_config = MODEL_CONFIG
    chat_id: int
    messages: List[Message]
    user_ws: List[WebSocket]
