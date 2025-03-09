from pymongo import MongoClient

from utils import (
  get_current_timestamp,
  get_env_variable,
)

USERNAME=get_env_variable('MONGO_USER')
PASSWORD=get_env_variable('MONGO_PASSWORD')

CONNECTION_STRING = f'mongodb+srv://{USERNAME}:{PASSWORD}@nbachat.rsqrp.mongodb.net/?retryWrites=true&w=majority&appName=NBAChat'

client = MongoClient(CONNECTION_STRING)
db = client.NBAChat

# Message collection
def write_message_to_db(data: str):
  collection = db.messages
  document = {
    'timestamp': get_current_timestamp(),
    'text': data,
    'user': USERNAME #TODO: Replace with actual user later
  }
  result = collection.insert_one(document)
  print(f'[LOG] Inserted document with ID: {result.inserted_id}')

# Example of getting only messages from one user
#result = list(collection.find({"user":"richardhoang1"}))
def read_message_from_db():
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