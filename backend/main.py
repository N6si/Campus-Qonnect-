from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from bson import ObjectId

# --- MongoDB setup ---
client = MongoClient("mongodb+srv://raj123:dGO25AZ8s8Hp@cluster0.ohn3vgk.mongodb.net/?retryWrites=true&w=majority")
db = client["college_social_network"]
users_collection = db["users"]
students_collection = db["students"]
mentors_collection = db["mentors"]
posts_collection = db["posts"]

# --- JWT & Password hashing ---
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# --- Helper to convert ObjectId to str ---
def obj_id_to_str(doc):
    if not doc:
        return doc
    doc["_id"] = str(doc["_id"])
    return doc

# --- Pydantic Models ---
class UserCreate(BaseModel):
    username: str
    password: str
    role: str  # student, mentor, admin
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

# --- Password hashing & verification ---
def get_password_hash(password: str):
    return pwd_context.hash(password[:72])

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)

# --- JWT token creation & verification ---
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

# --- Auth helpers ---
def get_user(username: str):
    return users_collection.find_one({"username": username})

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user or not verify_password(password, user["password_hash"]):
        return None
    return user


# --- Current user dependency ---
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
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

# --- FastAPI setup ---
app = FastAPI(title="CampusConnect API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
    return UserOut(
        id=str(result.inserted_id),
        username=user.username,
        role=user.role,
        bio=user.bio,
        profile_picture=user.profile_picture,
        year=user.year,
        major=user.major,
        expertise=user.expertise,
    )

@app.post("/login", response_model=Token)
def login(login_data: LoginRequest):
    user = authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Students routes ---
@app.get("/api/students")
def list_students(user=Depends(get_current_user)):
    docs = list(students_collection.find())
    return [obj_id_to_str(d) for d in docs]

@app.post("/api/students")
def create_student(student: StudentIn, user=Depends(require_role(["mentor", "admin"]))):
    res = students_collection.insert_one(student.dict())
    return obj_id_to_str(students_collection.find_one({"_id": res.inserted_id}))

# --- Mentors routes ---
@app.get("/api/mentors")
def list_mentors(user=Depends(get_current_user)):
    docs = list(mentors_collection.find())
    return [obj_id_to_str(d) for d in docs]

@app.post("/api/mentors")
def create_mentor(mentor: MentorIn, user=Depends(require_role(["admin"]))):
    res = mentors_collection.insert_one(mentor.dict())
    return obj_id_to_str(mentors_collection.find_one({"_id": res.inserted_id}))

@app.post("/api/assign-mentor")
def assign_mentor(data: MentorAssign, user=Depends(require_role(["admin", "mentor"]))):
    try:
        student_oid = ObjectId(data.student_id)
        mentor_oid = ObjectId(data.mentor_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    student = students_collection.find_one({"_id": student_oid})
    mentor = mentors_collection.find_one({"_id": mentor_oid})
    if not student or not mentor:
        raise HTTPException(status_code=404, detail="Student or Mentor not found")
    students_collection.update_one({"_id": student_oid}, {"$set": {"mentor_id": data.mentor_id}})
    return {"message": f"Mentor {mentor['name']} assigned to {student['name']}"}

@app.get("/api/mentor/requests")
def get_mentor_requests(user=Depends(require_role(["mentor", "admin"]))):
    # Temporary dummy data (replace later with real DB logic)
    return [
        {"student_name": "Raj Sharma", "status": "Pending"},
        {"student_name": "Aditi Mehta", "status": "Accepted"},
    ]


# --- Posts routes ---
@app.post("/api/posts", response_model=PostOut)
def create_post(post: PostIn, current_user: dict = Depends(get_current_user)):
    post_data = post.dict()
    post_data.update({
        "author_username": current_user["username"],
        "created_at": datetime.utcnow()
    })
    res = posts_collection.insert_one(post_data)
    new_post = posts_collection.find_one({"_id": res.inserted_id})
    new_post["id"] = str(new_post["_id"])
    return PostOut(
        id=new_post["id"],
        title=new_post["title"],
        content=new_post["content"],
        author_username=new_post["author_username"],
        created_at=new_post["created_at"]
    )



@app.get("/api/posts", response_model=List[PostOut])
def list_posts():
    posts = list(posts_collection.find().sort("created_at", -1).limit(100))
    return [PostOut(
        id=str(p["_id"]),
        title=p["title"],
        content=p["content"],
        author_username=p["author_username"],
        created_at=p["created_at"]
    ) for p in posts]
