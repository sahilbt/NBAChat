# Server backend

## Installation

1. Create a python virtual environment and activate
```
python3 -m venv venv
source venv/bin/activate
```
**Note:** This is for MacOS

2. Install dependencies from `requirements.txt`
```
pip install -r requirements.txt
```

3. Add a file called `.env` and copy content from `.env.example`. Add your actual MongoDB credentials
```
# .env
MONGO_USER=USERNAME
MONGO_PASSWORD=PASSWORD
```

## Running the server

How to run the server

### Running the server in dev mode
1. Run the server in dev
```
fastapi dev
```

### Running the server in prod mode
1. Run the server in prod mode
```
fastapi run
```
