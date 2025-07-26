from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select
from backend.db import get_session
from backend.models.posts import Post, PostRead, PostCreate, PostUpdate
from backend.models.comments import Comment
from datetime import date

router = APIRouter(
    prefix='/post',
    tags=["Post"]
)

@router.get('/')
async def get_post(
    limit: int = Query(20, ge=1),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session)
) -> list[PostRead]:
    statment = select(Post).order_by(Post.create_date.desc()).offset(offset).limit(limit)
    posts = session.exec(statment).all()
    # for post in posts:
    #     number_of_cmts = session.exec(
    #         select(Comment).where(Comment.post_id == post.id).limit(None)
    #     ).one()
    #     post["number_of_comments"] = number_of_cmts
    return posts

@router.post('/')
async def create_post(
    post_data: PostCreate,
    session: Session = Depends(get_session)
)-> PostRead:
    post = Post(
        title=post_data.title, 
        content=post_data.content, 
        user_id=post_data.user_id, 
        create_date=post_data.create_date
    )
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

@router.put('/{post_id}')
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    session: Session = Depends(get_session)
) -> PostRead:
    post = session.get(Post, post_id)

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post_data_dict = post_data.model_dump(exclude_unset=True)
    for key, value in post_data_dict.items():
        setattr(post, key, value)
    
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

@router.delete('/{post_id}')
async def delete_post(
    post_id: int,
    session: Session = Depends(get_session)
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    session.delete(post)
    session.commit()
    return {"msg": "Delete post successfully!"}

@router.get('/user/{user_id}')
async def get_post_by_user_id(
    user_id: int,
    session: Session = Depends(get_session)
) -> list[PostRead]:
    posts = session.exec(select(Post).where(Post.user_id == user_id)).all()
    return posts

@router.get('/detail/{post_id}')
async def get_post_by_id(
    post_id: int,
    session: Session = Depends(get_session)
) -> PostRead:
    post = session.get(Post, post_id)
    return post