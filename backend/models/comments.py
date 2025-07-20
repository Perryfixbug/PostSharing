from datetime import date
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class CommentBase(SQLModel):
    content: str
    user_id: int = Field(foreign_key="user.id")
    post_id: int = Field(foreign_key="post.id")

class Comment(CommentBase, table=True):
    id: int = Field(primary_key=True)
    create_date: date
    user: "User" = Relationship(back_populates="comments")
    post: "Post" = Relationship(back_populates="comments")

from pydantic import Field as PydanticField

class CommentRead(CommentBase):
    id: int
    user: Optional["UserRead"] = None
    class Config:
        orm_mode = True

class CommentCreate(CommentBase):
    create_date: date = PydanticField(default_factory=date.today)
    
from .posts import Post
from .users import User, UserRead