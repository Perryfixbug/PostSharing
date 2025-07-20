from fastapi import Request, HTTPException, Depends
from backend.lib.token import decode_token
from jose import JWTError

def get_current_user_id(request: Request)->int:
    token = request.cookies.get("access_token")
    print("access_token",token)
    if not token:
        raise HTTPException(status_code=401, detail="Access token missing")

    try:
        payload = decode_token(token)  # bạn có thể dùng JWT.decode nếu cần
        user_id = int(payload.get("sub"))
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except (JWTError, ValueError):
        raise HTTPException(status_code=500, detail="500 Internal Server Error")

    return user_id