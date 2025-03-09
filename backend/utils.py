from dotenv import load_dotenv

import time
import os

load_dotenv()
  
def get_env_variable(variable: str) -> str:
  return os.getenv(variable)

def get_current_timestamp():
  return time.time()
