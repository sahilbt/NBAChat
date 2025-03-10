from pymongo import MongoClient
from schema import *

from utils import (
  get_current_timestamp,
  get_env_variable,
)

USERNAME=get_env_variable('MONGO_USER')
PASSWORD=get_env_variable('MONGO_PASSWORD')

CONNECTION_STRING = f'mongodb+srv://{USERNAME}:{PASSWORD}@nbachat.rsqrp.mongodb.net/?retryWrites=true&w=majority&appName=NBAChat'

client = MongoClient(CONNECTION_STRING)
db = client.NBAChat


def write_message_to_db(message: CreatedMessage):
  collection = db.messages

  document = DocumentMessage(
    timestamp=get_current_timestamp(),
    text=message.text,
    user=message.user
  )

  result = collection.insert_one(document.model_dump(by_alias=True))
  print(f'[LOG] Inserted document with ID: {result.inserted_id}')

  create_message = collection.find_one({'_id': result.inserted_id})
  return create_message


def read_all_message_from_db():
  collection = db.messages
  result = list(collection.find({}))
  
  print(f'[LOG] Message collection: {result}')
  return result


# User Collection
def add_user_to_db(data_username: str, data_password: str):
  collection = db.users
  document = {
    'user': data_username, #TODO: Replace with actual user later
    'password': data_password
  }
  result = collection.insert_one(document)
  print(f'[LOG] Inserted document with ID: {result.inserted_id}')

def get_user_from_db():
  collection = db.users
  result = list(collection.find({}))
  
  print(f'[LOG] User collection: {result}')
  return result
