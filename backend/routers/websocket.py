from fastapi import WebSocket, APIRouter, Depends, Query
from sqlmodel import Session, select, or_, and_
from backend.models.messages import Message, MessageCreate, MessageUpdate, MessageRead
from backend.models.notifications import Notification, NotificationCreate, NotiType
from backend.lib.websocket_manager import message_manager
from backend.db import get_session
from backend.lib.token import decode_token
from typing import List
from fastapi.encoders import jsonable_encoder


router = APIRouter(
    prefix='/ws',
    tags=['Websocket']
)

@router.websocket('/{user_id}')
async def send_message(
    websocket: WebSocket,
    user_id: int = None,
    session: Session = Depends(get_session)
):
    # sender_id = int(decode_token(token).get("sub"))
    # if not sender_id:
    #     raise Exception("Invalid token")
    
    # if sender_id != user_id:
    #     await websocket.close()
    #     return
    
    await message_manager.connect(user_id, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            if data["type"] == "message":
                receiver_id = data["to"]
                content = data["content"]

                message_create = MessageCreate(
                    sender_id=user_id,
                    receiver_id=receiver_id,
                    content=content
                )
                message = Message(**message_create.model_dump())
                session.add(message)
                session.commit()
                session.refresh(message)

                payload = {
                    "type": "message",
                    "data": jsonable_encoder(message)  # chuyển Pydantic model sang dict
                }
                await message_manager.send_personal_message(receiver_id, payload)
                await message_manager.send_personal_message(user_id, payload)

            if data["type"] == "noti":
                receiver_id = data["to"]
                noti_type = data["noti_type"]
                content = data["content"]
                link=data["link"]
                # {
                #     type: noti,
                #     to: abc,
                #     noti_type: Comment,
                #     content: A vua moi binh luan comment cua b
                # }
                if receiver_id != user_id:
                    noti_create = NotificationCreate(
                        user_id = receiver_id,
                        type= NotiType[noti_type],
                        content=content,
                        link=link
                    )

                    noti = Notification(**noti_create.model_dump())
                    session.add(noti)
                    session.commit()
                    session.refresh(noti)

                    payload = {
                        "type": "noti",
                        "data": jsonable_encoder(noti)
                    }

                    await message_manager.send_personal_message(receiver_id, payload) #Receiver received noti
            
    except:
        print("bad")
        await message_manager.disconnect(websocket)
        session.rollback()