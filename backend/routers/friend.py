from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from backend.middlewares.auth import get_current_user_id
from sqlmodel import Session, select, or_
from backend.db import get_session
from backend.models.users import UserRead, User
from backend.models.friends import FriendShip, FriendShipRead, FriendShipCreate, FriendShipUpdate, FriendShipStatus

router = APIRouter(
    prefix='/friendship',
    tags=['FriendShip']
)

@router.get('/')
async def get_list_friend(
    type: str,
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session)
)->list[FriendShipRead]:
    if type == "accepted":
        statement = select(FriendShip).where(or_(FriendShip.sender_id == user_id, FriendShip.receiver_id == user_id), 
                                                FriendShip.status == FriendShipStatus["accepted"])
        friend_relationship = session.exec(statement).all()

        # if not friend_relationship:
        #     raise HTTPException(status_code=401, detail="User dont have friend")

        friends = []
        for fl in friend_relationship:
            friend_id = fl.sender_id if fl.sender_id != user_id else fl.receiver_id 

            user = session.get(User, friend_id)
            friend = FriendShipRead(friend_id=friend_id, create_date=fl.create_date, info=user)
            friends.append(friend)

        return friends
    
    elif type == "pending":
        statement = select(FriendShip).where(FriendShip.receiver_id == user_id, 
                                            FriendShip.status == FriendShipStatus["pending"])
        friend_relationship = session.exec(statement).all()

        friends = []
        for fl in friend_relationship:
            friend_id = fl.sender_id if fl.sender_id != user_id else fl.receiver_id 

            user = session.get(User, friend_id)
            friend = FriendShipRead(friend_id=friend_id, create_date=fl.create_date, info=user)
            friends.append(friend)

        return friends


@router.post('/{receiver_id}')
async def add_friend(
    session: Session = Depends(get_session),
    sender_id: int = Depends(get_current_user_id),
    receiver_id: int = None
):
    user = session.get(User, receiver_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Không cho gửi trùng lời mời
    exists = session.exec(
        select(FriendShip).where(
            (FriendShip.sender_id == sender_id) &
            (FriendShip.receiver_id == receiver_id)
        )
    ).first()
    if exists:
        raise HTTPException(status_code=400, detail="Invited addfriend")

    friend_create = FriendShipCreate(sender_id=sender_id, receiver_id=receiver_id)
    friend = FriendShip(**friend_create.model_dump())

    session.add(friend)
    session.commit()
    session.refresh(friend)

    return JSONResponse(status_code=201, content="Send invite successful")

@router.put('/{sender_id}')
async def accpeted_invite(
    session: Session = Depends(get_session),
    receiver_id: int = Depends(get_current_user_id),
    sender_id : int = None
):
    user = session.get(User, sender_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    statement = select(FriendShip).where(FriendShip.sender_id == sender_id, FriendShip.receiver_id == receiver_id)
    friend = session.exec(statement).first()
    friend.status = FriendShipStatus.accepted
    session.add(friend)
    session.commit()
    session.refresh(friend)

    return JSONResponse(status_code=201, content="Add friend successful")

