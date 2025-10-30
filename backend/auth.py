from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from datetime import timedelta
from db import db
from auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

# ---------------------------
# Pydantic Models
# ---------------------------
class RegisterModel(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str


# ---------------------------
# Register Endpoint
# ---------------------------
@router.post("/register")
def register(user: RegisterModel):
    # Check for existing email
    if db["users"].find_one({"email": user.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_pw = hash_password(user.password)

    db["users"].insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_pw,
        "created_at": datetime.utcnow()
    })

    return {"message": "User registered successfully"}


# ---------------------------
# Login Endpoint
# ---------------------------
@router.post("/login")
def login(user: LoginModel):
    db_user = db["users"].find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    # ✅ Verify hashed password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")

    # ✅ Create JWT token
    token = create_access_token({"sub": db_user["email"]}, expires_delta=timedelta(hours=3))

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": db_user["username"],
            "email": db_user["email"]
        }
    }
