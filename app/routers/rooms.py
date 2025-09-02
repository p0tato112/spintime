from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas, crud
from app.database import SessionLocal

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

@router.post("/", response_model=schemas.RoomRead, status_code=201)
def create_room(data: schemas.RoomCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_room(db, data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.delete("/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db)):
    success = crud.delete_room(db, room_id)
    if not success:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"detail": "Room deleted"}