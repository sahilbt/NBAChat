from pymongo import MongoClient
from typing import List

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