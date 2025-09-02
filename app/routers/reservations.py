# routers/reservations.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import schemas, crud, models
from app.database import SessionLocal, get_db
from app import models
from app.auth import get_current_user, get_current_admin


router = APIRouter(prefix="/reservations", tags=["reservations"])

@router.get("/", response_model=list[schemas.ReservationRead])
def get_reservations(
    machine_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return crud.list_reservations(db, machine_id)

@router.get("/by_machine/{machine_id}", response_model=list[schemas.ReservationRead])
def get_reservations_by_machine(machine_id: int, db: Session = Depends(get_db)):
    reservations = (
        db.query(models.Reservation)
        .filter(models.Reservation.machine_id == machine_id)
        .all()
    )
    return [schemas.ReservationRead.from_orm(r) for r in reservations]

@router.post("", response_model=schemas.ReservationRead, status_code=201)
def post_reservation(
    data: schemas.ReservationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    try:
        # enforce that user_id = current user
        data.user_id = current_user.id
        return crud.create_reservation(db, data)
    except ValueError as ve:
        raise HTTPException(status_code=409, detail=str(ve))

@router.delete("/{reservation_id}", status_code=204)
def delete_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    # only allow if admin OR owner
    if current_user.role != "admin" and reservation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this reservation")

    db.delete(reservation)
    db.commit()
    return