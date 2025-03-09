from dotenv import load_dotenv

import time
import os

def get_env_variable(variable: str) -> str:
  load_dotenv()
  return os.getenv(variable)

def get_current_timestamp():
  return time.time()
