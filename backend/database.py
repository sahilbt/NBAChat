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

def write_message_to_db(data: str):
  collection = db.messages
  document = {
    'timestamp': get_current_timestamp(),
    'text': data,
    'user': USERNAME #TODO: Replace with actual user later
  }
  result = collection.insert_one(document)
  print(f'[LOG] Inserted document with ID: {result.inserted_id}')
