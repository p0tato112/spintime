# crud.py
from sqlalchemy.orm import Session
from datetime import datetime
from app import models, schemas

# ROOMS

def get_rooms(db: Session):
    return db.query(models.Room).all()

def create_room(db: Session, room: schemas.RoomCreate):
    db_room = models.Room(name=room.name, description=room.description)
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def delete_room(db: Session, room_id: int):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if room:
        db.delete(room)
        db.commit()
        return True
    return False

# MACHINES

def create_machine(db: Session, data: schemas.MachineCreate) -> models.Machine:
    m = models.Machine(
        name=data.name,
        type=data.type,
        cycle_minutes=data.cycle_minutes,
        room_id=data.room_id,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

def delete_machine(db: Session, machine_id: int):
    machine = db.query(models.Machine).filter(models.Machine.id == machine_id).first()
    if machine:
        db.delete(machine)
        db.commit()
        return True
    return False

def list_machines(db: Session):
    return db.query(models.Machine).all()

# RESERVATIONS

def create_reservation(db: Session, data: schemas.ReservationCreate):
    # basic conflict guard (MVP): ensure [start,end) doesn't overlap existing for same machine
    overlap = db.query(models.Reservation).filter(
        models.Reservation.machine_id == data.machine_id,
        models.Reservation.start_time < data.end_time,
        models.Reservation.end_time > data.start_time,
    ).first()
    if overlap:
        raise ValueError("Time slot already reserved.")

    r = models.Reservation(
        machine_id=data.machine_id,
        user_id=data.user_id,
        start_time=data.start_time,
        end_time=data.end_time,
    )
    db.add(r)
    db.commit()
    db.refresh(r)
    return r

def delete_reservation(db: Session, reservation_id: int):
    r = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if r:
        db.delete(r)
        db.commit()
        return True
    return False

def list_reservations(db: Session, machine_id: int | None = None):
    q = db.query(models.Reservation)
    if machine_id is not None:
        q = q.filter(models.Reservation.machine_id == machine_id)
    return q.all()