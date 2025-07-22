from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import post, comment, auth, user, friend, message, websocket, notification, search, upload, emote

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=[
    #     "http://127.0.0.1:3000", 
    #     "http://localhost:3000", 
    #     "http://192.168.100.151:3000", 
    #     "https://xhrjgf2s-3000.asse.devtunnels.ms",
    #     "https://15ea40786327.ngrok-free.app"
    # ],            
    allow_origin_regex=".*",  # Chấp nhận tất cả origin regex
    allow_credentials=True,
    allow_methods=["*"],             # Cho phép tất cả phương thức (GET, POST, ...)
    allow_headers=["*"],             # Cho phép mọi loại header
)

@app.get('/')
async def home():
    return 'hello'

#RESTful
app.include_router(post.router)
app.include_router(comment.router)
app.include_router(emote.router)
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(friend.router)
app.include_router(message.router)
app.include_router(notification.router)
app.include_router(search.router)
app.include_router(upload.router)
#Websocket
app.include_router(websocket.router)