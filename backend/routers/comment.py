from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select, desc
from backend.db import get_session
from backend.models.comments import Comment, CommentCreate, CommentRead
from datetime import date
from backend.middlewares.auth import get_current_user_id

router = APIRouter(
    prefix='/comment',
    tags=["Comment"]
)

@router.get('/{post_id}')
async def get_comment_in_post(
    post_id: int,
    limit: int = Query(5, ge=1),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session)
)->list[CommentRead]:
    statement = (
        select(Comment)
        .where(post_id==Comment.post_id)
        .order_by(desc(Comment.create_date))
        .offset(offset)
        .limit(limit)
    )
    comments = session.exec(statement).all()
    return comments

@router.post('/')
async def create_comment(
    comment_data: CommentCreate,   
    session: Session = Depends(get_session)
)-> CommentRead:
    comment = Comment(
        content=comment_data.content, 
        user_id=comment_data.user_id,
        post_id=comment_data.post_id,
        create_date=comment_data.create_date
    )
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment

