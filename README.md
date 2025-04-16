# CPSC559

## Server backend

### Installation

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

### Running single server

1. Initialize server and specify port number and hostname (optional)
```
python3 main.py --port 8000
```

### Running multiple servers

With the current implementation, it's assumed that the server with lowest value/first server to be instantiated is the primary server.

For example, given the ports `[8000, 8001, 8002]`, the primary server would be 8000.

1. Initialize primary server
```
python3 main.py --port 8000
```
2. Initialize replica servers
```
python3 main.py --port 8001
python3 main.py --port 8002
python3 main.py --port 8002
```
**Note:** 
- This is assuming you're running on University of Calgary linux machines
- If no argument is provided, it'll default to localhost.

### Testing

1. Initialize servers
```
python3 main.py --port 8000
python3 main.py --port 8001
python3 main.py --port 8002
```

2. Open swagger docs for port 8001 or 8002
```
https://localhost:8001/docs
```

3. Send a message using the `/post/servers/message/{port}` endpoint. Specify the `port = 8000`

4. Check terminal of server running on port 8000 for the results
