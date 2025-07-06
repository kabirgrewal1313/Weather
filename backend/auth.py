from jose import JWTError,jwt
from datetime import datetime,timedelta,timezone
from fastapi import FastAPI,Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
oauth2_scheme=OAuth2PasswordBearer(tokenUrl="login")
def create_access_token(data:dict):
    to_encode=data.copy()
    expire=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})
    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

def verify_token(token: str=Depends(oauth2_scheme)):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        username=payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401,detail="Invalid Token")
        return username
    except JWTError:
        raise HTTPException(status_code=401,detail="Invalid Token")

