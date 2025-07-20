from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from sqlmodel import Session, select, or_
from backend.db import get_session
from backend.models.posts import Post, PostRead
from backend.models.users import User, UserRead

router = APIRouter(
    prefix='/search',
    tags=['Search']
)

@router.post('/')
async def general_search(
    request: Request,
    type: str = None,
    session: Session = Depends(get_session),
) -> dict:
    body = await request.json()
    data = body.get("data", "")
    result = {}

    if type == "post":
        post = session.exec(select(Post).where(
            or_(Post.title.contains(data), Post.content.contains(data)))).all()
        result["post"] = [PostRead.model_validate(p).model_dump() for p in post]
    
    elif type == "people":
        user = session.exec(select(User).where(User.fullname.contains(data))).all()
        result["user"] = [UserRead.model_validate(u).model_dump() for u in user]
    
    else:
        post = session.exec(select(Post).where(Post.title.contains(data))).all()
        user = session.exec(select(User).where(User.fullname.contains(data))).all()
        result = {
            "post": [PostRead.model_validate(p).model_dump() for p in post],
            "user": [UserRead.model_validate(u).model_dump() for u in user]
        }

    return result
    