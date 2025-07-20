from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class EmoteBase(SQLModel):
    type: str
    create_date: datetime
    user_id: int = Field(foreign_key="user.id")
    post_id: int = Field(foreign_key="post.id")

class Emote(EmoteBase, table=True):
    id: int = Field(primary_key=True)
    user: "User" = Relationship(back_populates="emotes")
    post: "Post" = Relationship(back_populates="emotes")

class EmoteCreate(EmoteBase):
    create_date: datetime = Field(default_factory=datetime.now)
    

class EmoteUpdate(EmoteBase): 
    pass
    
class EmoteRead(EmoteBase):
    id: int
    

from .posts import Post
from .users import User