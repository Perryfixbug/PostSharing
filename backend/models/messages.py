from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional

class MessageBase(SQLModel):
    sender_id: int = Field(foreign_key="user.id")
    receiver_id: int = Field(foreign_key="user.id")
    content: str

class Message(MessageBase, table=True):
    id :int = Field(primary_key=True)
    create_date: datetime
    is_read: bool = Field(default=False)
    sender: "User" = Relationship(
        back_populates="sended_message",
        sa_relationship_kwargs={"foreign_keys": "[Message.sender_id]"}
    )
    receiver: "User" = Relationship(
        back_populates="recived_message",
        sa_relationship_kwargs={"foreign_keys": "[Message.receiver_id]"}
    )

class MessageCreate(MessageBase):
    is_read: bool = False
    create_date: datetime = Field(default_factory=datetime.now)

class MessageUpdate(SQLModel):
    is_read: Optional[bool] = None
    content: Optional[str] = None

class MessageRead(MessageBase):
    id: int
    is_read: bool
    create_date: datetime
    
    class Config:
        from_attributes = True  # Cho phép chuyển từ SQLModel

from .users import User