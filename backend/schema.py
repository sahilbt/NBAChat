from typing import List
from fastapi import WebSocket
from pydantic import BaseModel, Field, ConfigDict
from typing_extensions import Annotated
from bson import ObjectId
from pydantic.functional_validators import BeforeValidator

# It will be represented as a `str` on the model so that it can be serialized to JSON.
# Represents an ObjectId field in the database.
PyObjectId = Annotated[str, BeforeValidator(str)]
MODEL_CONFIG = ConfigDict(populate_by_name = True, arbitrary_types_allowed = True, extra = "forbid")


class RetrievedMessage(BaseModel):
    model_config = MODEL_CONFIG
    id: PyObjectId = Field(alias="_id", default=None)
    timestamp: float
    text: str
    user: str

class CreatedMessage(BaseModel):
    model_config = MODEL_CONFIG
    text: str
    user: str

class DocumentMessage(BaseModel):
    model_config = MODEL_CONFIG
    timestamp: float
    text: str
    user: str
    
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

class ChatRoom(BaseModel):
    model_config = MODEL_CONFIG
    chat_id: int
    messages: List[Message]
    user_ws: List[WebSocket]
