from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from datetime import datetime

class NotiType(Enum):
    # NewMessage = "new message"
    Comment = "comment"
    Emote = "emote"

class NotificationBase(SQLModel):
    user_id: int = Field(foreign_key="user.id")
    type: str
    content: str
    link: str | None = None
    
class Notification(NotificationBase, table=True):
    id : int = Field(primary_key=True)
    is_read: bool
    user: "User" = Relationship(back_populates="notifications")
    create_date: datetime

class NotificationCreate(NotificationBase):
    is_read: bool = False
    create_date: datetime = Field(default_factory=datetime.now)

class NotificationUpdate(SQLModel):
    is_read: bool

class NotificationRead(NotificationBase):
    id: int
    is_read: bool
    create_date: datetime


from .users import User