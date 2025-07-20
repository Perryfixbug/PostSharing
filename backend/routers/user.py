from fastapi import APIRouter, Depends, HTTPException
from backend.models.users import User, UserRead, UserWithFriend, UserUpdate
from backend.models.friends import FriendShip, FriendShipStatus
from backend.db import get_session
from sqlmodel import Session, select, or_
from backend.middlewares.auth import get_current_user_id

router = APIRouter(
    prefix='/user',
    tags=["User"]
)

@router.get('/me')
async def getMe(
    user_id: int = Depends(get_current_user_id),
    session: Session = Depends(get_session)
)->UserWithFriend:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    friend_relationships = session.exec(select(FriendShip)
                                       .where(or_(FriendShip.sender_id == user_id
                                                  , FriendShip.receiver_id == user_id)
                                                  , FriendShip.status == FriendShipStatus.accepted)).all()
    
    # Khởi tạo list bạn bè
    list_friend = [
        fr.sender_id if fr.sender_id != user_id else fr.receiver_id
        for fr in friend_relationships
    ]

    # Tạo user response bao gồm bạn bè
    user_data = UserWithFriend.model_validate(user)
    user_data.list_friend = list_friend
    
    return user_data

@router.get('/{user_id}')
async def getUserById(
    user_id: int,
    session: Session = Depends(get_session)
)->UserRead:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    return user

@router.put('/{user_id}')
async def update_post(
    user_id: int,
    user_data: UserUpdate,
    session: Session = Depends(get_session)
) -> UserWithFriend:
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(status_code=404, detail="Post not found")

    user_data_dict = user_data.model_dump(exclude_unset=True)
    for key, value in user_data_dict.items():
        setattr(user, key, value)
    
    session.add(user)
    session.commit()
    session.refresh(user)

    friend_relationships = session.exec(select(FriendShip)
                                       .where(or_(FriendShip.sender_id == user_id
                                                  , FriendShip.receiver_id == user_id)
                                                  , FriendShip.status == FriendShipStatus.accepted)).all()
    
    # Khởi tạo list bạn bè
    list_friend = [
        fr.sender_id if fr.sender_id != user_id else fr.receiver_id
        for fr in friend_relationships
    ]

    # Tạo user response bao gồm bạn bè
    user_data = UserWithFriend.model_validate(user)
    user_data.list_friend = list_friend
    
    return user_data

