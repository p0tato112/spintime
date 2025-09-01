# routers/reservations.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import SessionLocal

router = APIRouter(prefix="/reservations", tags=["reservations"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=list[schemas.ReservationRead])
def get_reservations(
    machine_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return crud.list_reservations(db, machine_id)

@router.post("", response_model=schemas.ReservationRead, status_code=201)
def post_reservation(data: schemas.ReservationCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_reservation(db, data)
    except ValueError as ve:
        raise HTTPException(status_code=409, detail=str(ve))

@router.delete("/{reservation_id}")
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    success = crud.delete_reservation(db, reservation_id)
    if not success:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return {"detail": "Reservation deleted"}