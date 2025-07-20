from datetime import date
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class PostBase(SQLModel):
    title: str
    content: str
    user_id: int = Field(foreign_key = "user.id")

class Post(PostBase, table=True):
    id: int = Field(primary_key=True)
    user: "User" = Relationship(back_populates="posts")
    create_date: date
    comments: list["Comment"] = Relationship(
        back_populates="post",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    emotes: list["Emote"] = Relationship(
        back_populates="post",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

class PostRead(PostBase):
    id: int
    user: Optional["UserRead"] = None
    create_date: date
    # comments: list["Comment"] | None = None
    emotes: list["Emote"] | None = None
    number_of_comments: int = 0


    class Config:
        orm_mode = True

from pydantic import Field as PydanticField
class PostCreate(PostBase):
    create_date: date = PydanticField(default_factory=date.today)
    comments: list["Comment"] | None = None
    emotes: list["Emote"] | None = None

class PostUpdate(PostBase):
    title: str | None = None
    content: str | None = None


from .users import User, UserRead
from .comments import Comment, CommentRead
from .emotes import Emote