import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from bson import ObjectId

# --- MongoDB setup ---
MONGODB_URL = os.environ.get(
    "MONGODB_URL",
    "mongodb+srv://raj123:dGO25AZ8s8Hp@cluster0.ohn3vgk.mongodb.net/?retryWrites=true&w=majority"
)
client = MongoClient(MONGODB_URL)
db = client["college_social_network"]
users_collection = db["users"]
students_collection = db["students"]
mentors_collection = db["mentors"]
posts_collection = db["posts"]
mentor_requests_collection = db["mentor_requests"]

# --- JWT & Password hashing ---
SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key_change_this_in_production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def obj_id_to_str(doc):
    if not doc:
        return doc
    doc["_id"] = str(doc["_id"])
    return doc

# --- Models ---
class UserCreate(BaseModel):
    username: str
    password: str
    role: str
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    year: Optional[int] = None
    major: Optional[str] = None
    expertise: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: str
    username: str
    role: str
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    year: Optional[int] = None
    major: Optional[str] = None
    expertise: Optional[str] = None

class UserUpdate(BaseModel):
    bio: Optional[str] = None
    year: Optional[int] = None
    major: Optional[str] = None
    expertise: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class StudentIn(BaseModel):
    name: str
    year: int
    major: str

class MentorIn(BaseModel):
    name: str
    graduation_year: int
    expertise: str
    email: str

class MentorAssign(BaseModel):
    student_id: str
    mentor_id: str

class PostIn(BaseModel):
    title: str
    content: str

class PostOut(PostIn):
    id: str
    author_username: str
    created_at: datetime

class MentorRequestIn(BaseModel):
    mentor_name: str
    message: Optional[str] = ""

class MentorRequestAction(BaseModel):
    action: str  # "accept" or "reject"

# --- Auth helpers ---
def get_password_hash(password: str):
    return pwd_context.hash(password[:72])

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None

def get_user(username: str):
    return users_collection.find_one({"username": username})

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user or not verify_password(password, user["password_hash"]):
        return None
    return user

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token", headers={"WWW-Authenticate": "Bearer"})
    user = get_user(payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def require_role(allowed_roles: List[str]):
    def role_checker(user=Depends(get_current_user)):
        if user["role"] not in allowed_roles:
            raise HTTPException(status_code=403, detail="Not authorized")
        return user
    return role_checker

# --- App ---
app = FastAPI(title="CampusConnect API")

ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "CampusConnect API is running"}

# --- Signup & Login ---
@app.post("/signup", response_model=UserOut)
def signup(user: UserCreate):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken")
    hashed_pw = get_password_hash(user.password)
    result = users_collection.insert_one({
        "username": user.username,
        "password_hash": hashed_pw,
        "role": user.role,
        "bio": user.bio,
        "profile_picture": user.profile_picture,
        "year": user.year,
        "major": user.major,
        "expertise": user.expertise,
    })
    return UserOut(id=str(result.inserted_id), username=user.username, role=user.role, bio=user.bio, profile_picture=user.profile_picture, year=user.year, major=user.major, expertise=user.expertise)

@app.post("/login", response_model=Token)
def login(login_data: LoginRequest):
    user = authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password", headers={"WWW-Authenticate": "Bearer"})
    access_token = create_access_token(data={"sub": user["username"], "role": user["role"]}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}

# --- Profile ---
@app.get("/api/profile")
def get_profile(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "username": current_user["username"],
        "role": current_user["role"],
        "bio": current_user.get("bio"),
        "year": current_user.get("year"),
        "major": current_user.get("major"),
        "expertise": current_user.get("expertise"),
        "email": current_user.get("email"),
    }

@app.put("/api/profile")
def update_profile(update: UserUpdate, current_user=Depends(get_current_user)):
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    users_collection.update_one({"username": current_user["username"]}, {"$set": update_data})
    updated = users_collection.find_one({"username": current_user["username"]})
    return {
        "id": str(updated["_id"]),
        "username": updated["username"],
        "role": updated["role"],
        "bio": updated.get("bio"),
        "year": updated.get("year"),
        "major": updated.get("major"),
        "expertise": updated.get("expertise"),
    }

# --- Teachers ---
@app.get("/api/teachers")
def get_teachers(user=Depends(get_current_user)):
    teachers = list(users_collection.find({"role": {"$in": ["teacher", "mentor"]}}))
    return [{
        "username": t["username"],
        "expertise": t.get("expertise", "Not specified"),
        "bio": t.get("bio", ""),
        "major": t.get("major", ""),
    } for t in teachers]

# --- Students ---
@app.get("/api/students")
def list_students(user=Depends(get_current_user)):
    return [obj_id_to_str(d) for d in students_collection.find()]

@app.post("/api/students")
def create_student(student: StudentIn, user=Depends(require_role(["mentor", "admin"]))):
    res = students_collection.insert_one(student.dict())
    return obj_id_to_str(students_collection.find_one({"_id": res.inserted_id}))

# --- Mentors ---
@app.get("/api/mentors")
def list_mentors(user=Depends(get_current_user)):
    return [obj_id_to_str(d) for d in mentors_collection.find()]

@app.post("/api/mentors")
def create_mentor(mentor: MentorIn, user=Depends(require_role(["admin"]))):
    res = mentors_collection.insert_one(mentor.dict())
    return obj_id_to_str(mentors_collection.find_one({"_id": res.inserted_id}))

# --- Mentor Requests ---
@app.post("/api/mentor/request")
def send_mentor_request(data: MentorRequestIn, current_user=Depends(get_current_user)):
    existing = mentor_requests_collection.find_one({
        "student_username": current_user["username"],
        "mentor_name": data.mentor_name,
        "status": "pending"
    })
    if existing:
        raise HTTPException(status_code=400, detail="You already sent a request to this mentor")
    result = mentor_requests_collection.insert_one({
        "student_username": current_user["username"],
        "mentor_name": data.mentor_name,
        "message": data.message,
        "status": "pending",
        "created_at": datetime.utcnow()
    })
    return {"message": "Mentor request sent!", "id": str(result.inserted_id)}

@app.get("/api/mentor/requests")
def get_mentor_requests(user=Depends(require_role(["teacher", "mentor", "admin"]))):
    requests = list(mentor_requests_collection.find().sort("created_at", -1))
    return [{
        "id": str(r["_id"]),
        "student_username": r["student_username"],
        "mentor_name": r["mentor_name"],
        "message": r.get("message", ""),
        "status": r["status"],
        "created_at": r["created_at"].isoformat() if r.get("created_at") else ""
    } for r in requests]

@app.put("/api/mentor/requests/{request_id}")
def update_mentor_request(request_id: str, action: MentorRequestAction, user=Depends(require_role(["teacher", "mentor", "admin"]))):
    try:
        oid = ObjectId(request_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request ID")
    if action.action not in ["accept", "reject"]:
        raise HTTPException(status_code=400, detail="Action must be accept or reject")
    result = mentor_requests_collection.update_one(
        {"_id": oid},
        {"$set": {"status": action.action + "ed", "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"message": f"Request {action.action}ed successfully"}

@app.get("/api/mentor/my-requests")
def get_my_requests(current_user=Depends(get_current_user)):
    requests = list(mentor_requests_collection.find({"student_username": current_user["username"]}).sort("created_at", -1))
    return [{
        "id": str(r["_id"]),
        "mentor_name": r["mentor_name"],
        "message": r.get("message", ""),
        "status": r["status"],
        "created_at": r["created_at"].isoformat() if r.get("created_at") else ""
    } for r in requests]

# --- Posts ---
@app.post("/api/posts", response_model=PostOut)
def create_post(post: PostIn, current_user: dict = Depends(get_current_user)):
    post_data = post.dict()
    post_data.update({"author_username": current_user["username"], "created_at": datetime.utcnow()})
    res = posts_collection.insert_one(post_data)
    new_post = posts_collection.find_one({"_id": res.inserted_id})
    return PostOut(id=str(new_post["_id"]), title=new_post["title"], content=new_post["content"], author_username=new_post["author_username"], created_at=new_post["created_at"])

@app.get("/api/posts", response_model=List[PostOut])
def list_posts():
    posts = list(posts_collection.find().sort("created_at", -1).limit(100))
    return [PostOut(id=str(p["_id"]), title=p["title"], content=p["content"], author_username=p["author_username"], created_at=p["created_at"]) for p in posts]

# --- Admin stats ---
@app.get("/api/dashboard/stats")
def dashboard_stats(user=Depends(require_role(["admin"]))):
    return {
        "users_count": users_collection.count_documents({}),
        "posts_count": posts_collection.count_documents({}),
        "mentor_requests": mentor_requests_collection.count_documents({}),
    }
