from fastapi import WebSocket, APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select, or_, and_
from backend.models.messages import Message, MessageCreate, MessageUpdate, MessageRead
from backend.models.users import UserRead, User
from backend.lib.websocket_manager import message_manager
from backend.middlewares.auth import get_current_user_id
from backend.db import get_session
from backend.lib.token import decode_token
from typing import List
from fastapi.encoders import jsonable_encoder


router = APIRouter(
    prefix='/message',
    tags=['Message']
)

@router.get('/')
async def get_user_chatted_with(
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
)->List[UserRead]:
    statement = select(Message).where(or_(Message.sender_id == user_id, Message.receiver_id == user_id))
    messages = session.exec(statement).all()

    user_ids = set()
    for message in messages:
        if message.sender_id != user_id:
            user_ids.add(message.sender_id)
        if message.receiver_id != user_id:
            user_ids.add(message.receiver_id)

    if not user_ids:
        return []

    users_statement = select(User).where(User.id.in_(user_ids))
    users = session.exec(users_statement).all()
    return users


@router.get('/{partner_id}')
async def get_user_chatted_with(
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user_id),
    partner_id: int = None,
    limit: int = 20,
    offset: int = 0
)->List[MessageRead]:
    statement = select(Message).where(
        or_(
            and_(Message.sender_id == user_id, Message.receiver_id == partner_id),
            and_(Message.sender_id == partner_id, Message.receiver_id == user_id),
        )
    ).order_by(Message.create_date.desc()).offset(offset).limit(limit)

    messages = session.exec(statement).all()
    return messages

@router.put('/{message_id}')
async def update_message(
    message_id: int,
    message_update: MessageUpdate,
    session: Session = Depends(get_session)
)->MessageRead:
    message = session.get(Message, message_id)
    
    if not message:
        raise HTTPException(status_code=400, detail="Message not found")

    message_data = message_update.model_dump(exclude_unset=True)
    for key, value in message_data.items():
        setattr(message, key, value)

    session.add(message)
    session.commit()
    session.refresh(message)

    return message