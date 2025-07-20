from typing import Dict, Any
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    async def disconnect(self, websocket: WebSocket):
        # Remove the user whose WebSocket matches
        for uid, ws in list(self.active_connections.items()):
            if ws == websocket:
                del self.active_connections[uid]
                break

    async def send_personal_message(self, user_id: int, message: Any):
        websocket = self.active_connections.get(user_id)
        if websocket:
            try:
                await websocket.send_json(message)
            except Exception:
                await self.disconnect(websocket)

    async def broadcast(self, message: str):
        disconnected = []
        for uid, websocket in self.active_connections.items():
            try:
                await websocket.send_text(message)
            except Exception:
                disconnected.append(uid)
        for uid in disconnected:
            del self.active_connections[uid]

message_manager = ConnectionManager()