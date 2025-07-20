from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, desc
from backend.models.notifications import Notification, NotificationRead, NotificationUpdate
from backend.middlewares.auth import get_current_user_id
from backend.db import get_session
from typing import List


router = APIRouter(
    prefix='/notification',
    tags=['Notification']
)

@router.get('/')
async def get_noti(
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session)
)->List[NotificationRead]:
    noti = session.exec(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(desc(Notification.create_date))
    ).all()
    return noti

@router.put('/{noti_id}')
async def read_noti(
    noti_id : int,
    session: Session = Depends(get_session)
)->NotificationRead:
    noti = session.get(Notification, noti_id)
    if not noti:
        raise HTTPException(status_code=400, detail="Noti not found")

    if not noti.is_read:
        noti.is_read = True
        session.commit()
        session.refresh(noti)
        
    return noti

