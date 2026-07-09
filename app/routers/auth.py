from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from pydantic import BaseModel, EmailStr, Field

from app.database.db import get_db
from app.models.user import User

from jose import jwt
from datetime import datetime, timedelta

from app.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

from passlib.context import CryptContext


# 🔥 Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# 🔥 Router
router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


# =========================================
# 🔥 JWT TOKEN
# =========================================

def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# =========================================
# 🔥 SCHEMAS
# =========================================

class UserCreate(BaseModel):

    name: str = Field(..., min_length=2)

    email: EmailStr

    password: str = Field(..., min_length=4)

    role: str


class UserLogin(BaseModel):

    email: EmailStr

    password: str


# =========================================
# 🔥 REGISTER
# =========================================

@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    # check existing email
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered ❌",
            
        )

    # hash password
    hashed_password = pwd_context.hash(
        user.password
    )

    # create user
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role

        # 🔥 force candidate role
        
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User registered successfully ✅",
        "user_id": new_user.id
    }


# =========================================
# 🔥 LOGIN
# =========================================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    # find user
    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials ❌"
        )

    # verify password
    valid = pwd_context.verify(
        user.password,
        db_user.password
    )

    if not valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials ❌"
        )

    # create token
    token = create_access_token({

        "user_id": db_user.id,

        "role": db_user.role
    })

    return {

        "access_token": token,

        "token_type": "bearer",

        "role": db_user.role
    }