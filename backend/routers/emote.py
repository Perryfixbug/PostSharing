from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request
from backend.models.emotes import Emote, EmoteRead, EmoteCreate, EmoteUpdate
from sqlmodel import Session, select
from backend.db import get_session
from backend.middlewares.auth import get_current_user_id
from typing import List

router = APIRouter(
    prefix='/emote',
    tags=["Emote"]
)

# @router.get('/{post_id}')
# async def get_emote_by_post_id(
#     session: Session = Depends(get_session),
#     post_id: int | None = None
# )->List[EmoteRead]:
#     list_emotes = session.exec(select())

@router.post('/')
async def create_emote(
    emote_data: EmoteCreate,
    session: Session = Depends(get_session),
)->EmoteRead:
    emote = session.exec(select(Emote).where(
            (Emote.post_id == emote_data.post_id) & 
            (Emote.user_id == emote_data.user_id))
    ).first()

    if emote:
        if emote.type == emote_data.type:
            # Unreact (bỏ cảm xúc nếu đã bấm lại)
            session.delete(emote)
            session.commit()
            return emote  # hoặc return None / message tuỳ ý bạn
        else:
            # Đổi sang emote khác
            emote.type = emote_data.type
            emote.create_date = emote_data.create_date
    else:
        emote = Emote(**emote_data.model_dump())
        session.add(emote)

    session.commit()
    session.refresh(emote)
    return emote
