from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from db import db
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Environment variables
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")  # fallback for safety
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# ✅ Pydantic model for incoming data
class User(BaseModel):
    username: str | None = None
    email: str
    password: str

# ✅ Helper: Create JWT token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ✅ Register route
@router.post("/register")
def register(user: User):
    existing = db["users"].find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = pwd_context.hash(user.password)

    # Default role assigned as "student" unless you decide otherwise
    db["users"].insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_pw,
        "role": "student"
    })

    return {"message": "User registered successfully"}

# ✅ Login route
@router.post("/login")
def login(user: User):
    db_user = db["users"].find_one({"email": user.email})
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Create JWT token
    token = create_access_token({"email": db_user["email"]})

    # ✅ Return token + user info (for frontend)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": db_user.get("username"),
            "email": db_user.get("email"),
            "role": db_user.get("role", "student")
        }
    }
