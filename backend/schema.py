from pydantic import BaseModel, Field, ConfigDict
from typing_extensions import Annotated
from bson import ObjectId
from pydantic.functional_validators import BeforeValidator

# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
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
