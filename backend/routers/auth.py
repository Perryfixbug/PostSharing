from fastapi import APIRouter, Depends, HTTPException, Response, Request
from fastapi.responses import JSONResponse
from backend.models.users import User, UserLogin, UserRead, UserRegister
from backend.models.token import RefreshToken
from backend.db import get_session
from sqlmodel import Session, select, or_
from backend.lib.token import create_access_token, create_refresh_token, decode_token

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post('/login')
async def login(
    response: Response,
    login_data: UserLogin,
    session: Session = Depends(get_session)
):
    statement = select(User).where(User.email == login_data.email, User.password == login_data.password)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=400, detail="Wrong email or password")
    
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    rf_token = RefreshToken(refresh_token=refresh_token)
    session.add(rf_token)
    session.commit()
    session.refresh(rf_token)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True, # hoặc True nếu dùng HTTPS
        samesite="none", # hoặc "none" nếu frontend và backend khác domain
        path='/'
        # secure=False,          # ⚠️ Phải là False nếu dùng HTTP
        # samesite="lax",         
        # path='/'
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False, # hoặc True nếu dùng HTTPS
        samesite="none", # hoặc "none" nếu frontend và backend khác domain
        path='/'
        # secure=False,          # ⚠️ Phải là False nếu dùng HTTP
        # samesite="lax",
        # path='/'         

    )
    print("==== HEADERS ====")
    print(response.headers)

    return {"message": "Login successfully"}

@router.post('/register')
async def register(
    register_data: UserRegister,
    session: Session = Depends(get_session)
):
    statement = select(User).where(or_(register_data.phone==User.phone, register_data.email==User.email))
    user = session.exec(statement).all()
    if user:
        raise HTTPException(status_code=400, detail="User existed")
    
    user = User(
        fullname=register_data.fullname,
        phone=register_data.phone,
        email=register_data.email,
        password=register_data.password
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"message": "Sign in successfully!"}

@router.post('/refresh')
async def refresh_access_token(
    response: Response,
    request: Request,
    session: Session = Depends(get_session)
    
):
    token = request.cookies.get("refresh_token")
    rf_token = session.exec(select(RefreshToken).where(RefreshToken.refresh_token == token)).first()

    if not rf_token:
        raise HTTPException(status_code=400, detail="Expired token")

    user_id = decode_token(rf_token.refresh_token).get("sub")
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid token")

    access_token = create_access_token({"sub": str(user_id)})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True, # hoặc True nếu dùng HTTPS
        samesite="none", # hoặc "none" nếu frontend và backend khác domain
        path='/'
        # secure=False,          # ⚠️ Phải là False nếu dùng HTTP
        # samesite="lax"         
    )

    return {"message": "Refresh token successfully"}

@router.post('/logout')
async def logout(
    request: Request,
    response: Response,
    session: Session = Depends(get_session)
):
    refresh_token = request.cookies.get("refresh_token")

    statement = select(RefreshToken).where(RefreshToken.refresh_token == refresh_token)
    rf_token = session.exec(statement).first()
    if not rf_token:
        raise HTTPException(status_code=400, detail="Token has been deleted")

    response.delete_cookie(
        key="refresh_token",
        path="/",
        samesite="none",   # hoặc "none" nếu bạn dùng sameSite="none"
        secure=True      # hoặc True nếu đang chạy HTTPS
    )
    response.delete_cookie(
        key="access_token",
        path="/",
        samesite="none",   # hoặc "none" nếu bạn dùng sameSite="none"
        secure=True      # hoặc True nếu đang chạy HTTPS
    )
    session.delete(rf_token)
    session.commit()
    
    return {"message": "Logout successfully"}

@router.post('/check_cookie')
async def refresh_access_token(
    request: Request,
)->dict:
    print(request.cookies)
    return {"cookie": request.cookies.get("refresh_token")}