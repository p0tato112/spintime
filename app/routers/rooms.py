from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, crud
from app.database import SessionLocal
from app.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/rooms", tags=["rooms"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.Room])
def get_rooms(db: Session = Depends(get_db)):
    return crud.get_rooms(db)

# @router.post("/", response_model=schemas.Room)
# def create_room(room: schemas.RoomCreate, db: Session = Depends(get_db)):
#     return crud.create_room(db, room)

@router.post("", response_model=schemas.RoomRead)
def create_room(
    data: schemas.RoomCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),  # only admin can create
):
    return crud.create_room(db, data)

    
@router.delete("/{room_id}")
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),  # admin only
):
    success = crud.delete_room(db, room_id)
    if not success:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"detail": "Room deleted"}