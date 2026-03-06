from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from main import db, get_current_user

router = APIRouter()

clubs_collection = db["clubs"]

# ---------------------------
# GET ALL CLUBS
# ---------------------------
@router.get("/api/clubs")
async def get_clubs():
    clubs = []
    for club in clubs_collection.find():
        club["id"] = str(club["_id"])
        del club["_id"]
        clubs.append(club)

    return clubs


# ---------------------------
# JOIN CLUB
# ---------------------------
@router.post("/api/clubs/{club_id}/join")
async def join_club(club_id: str, user=Depends(get_current_user)):

    clubs_collection.update_one(
        {"_id": ObjectId(club_id)},
        {"$addToSet": {"members": user["id"]}}
    )

    return {"message": "Joined club"}
