from datetime import date
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from enum import Enum
from datetime import date

class FriendShipStatus(Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"

class FriendShipBase(SQLModel):
    sender_id: int = Field(foreign_key="user.id")
    receiver_id: int = Field(foreign_key="user.id")
    

class FriendShip(FriendShipBase, table=True):
    id: int = Field(primary_key=True)
    status: FriendShipStatus #Sửa
    create_date: date 
    sender: "User" = Relationship(
        back_populates="sended_invite",
        sa_relationship_kwargs={"foreign_keys":"[FriendShip.sender_id]"}
    )
    receiver: "User" = Relationship(
        back_populates="received_invite",
        sa_relationship_kwargs={"foreign_keys":"[FriendShip.receiver_id]"}
    )
    

class FriendShipCreate(FriendShipBase):
    status: FriendShipStatus = Field(default=FriendShipStatus.pending)
    create_date: date = Field(default_factory=date.today)

class FriendShipUpdate(FriendShipBase):
    status: FriendShipStatus

class FriendShipRead(SQLModel):
    friend_id: int
    create_date: date
    info: "User"
    class Config:
        orm_mode = True
    
from .users import User