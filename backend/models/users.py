from datetime import date
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class UserBase(SQLModel):
    fullname: str
    phone: str
    email: str
    address: str | None = None
    description: str | None = None
    gender: str | None = None
    dob: date | None = None
    avatar: str | None = None
    background: str | None = None

class User(UserBase, table=True):
    id: int = Field(primary_key=True)
    password: str
    posts: list["Post"] = Relationship(back_populates="user")
    comments: list["Comment"] = Relationship(back_populates="user")
    emotes: list["Emote"] = Relationship(back_populates="user")
    #Message Relationship
    sended_message: list["Message"] = Relationship(
        back_populates="sender",
        sa_relationship_kwargs={"foreign_keys": "[Message.sender_id]"}
    )
    recived_message: list["Message"] = Relationship(
        back_populates="receiver",
        sa_relationship_kwargs={"foreign_keys": "[Message.receiver_id]"}
    )
    notifications: list["Notification"] = Relationship(back_populates="user")
    #Friend Relationship
    sended_invite: list["FriendShip"] = Relationship(
        back_populates="sender",
        sa_relationship_kwargs={"foreign_keys": "[FriendShip.sender_id]"}
    )
    received_invite: list["FriendShip"] = Relationship(
        back_populates="receiver",
        sa_relationship_kwargs={"foreign_keys": "[FriendShip.receiver_id]"}
    )
    
class UserRead(UserBase):
    id: int
    class Config:
        orm_mode = True

class UserLogin(SQLModel):
    email: str
    password: str

class UserRegister(SQLModel):
    email: str
    phone: str
    fullname: str
    password: str

class UserUpdate(SQLModel):
    fullname: str | None = None
    phone: str | None = None
    email: str | None = None
    password: str | None = None
    address: str | None = None
    description: str | None = None
    gender: str | None = None
    dob: date | None = None
    avatar: str | None = None
    background: str | None = None

class UserWithFriend(UserBase):
    id: int
    list_friend: list[int] | None = None

from .posts import Post
from .comments import Comment
from .emotes import Emote
from .messages import Message
from .notifications import Notification
from .friends import FriendShip