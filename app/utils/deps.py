from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from app.config import SECRET_KEY, ALGORITHM


security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):

    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload

    except:
        raise HTTPException(status_code=401, detail="Invalid token ❌")


def require_role(role: str):
    def role_checker(current_user: dict = Depends(get_current_user)):

        if current_user.get("role") != role:
            raise HTTPException(
                status_code=403,
                detail="Access denied ❌"
            )

        return current_user

    return role_checker