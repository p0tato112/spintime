# routers/machines.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, models
from app.database import SessionLocal
from app.auth import get_current_user, get_current_admin


router = APIRouter(prefix="/machines", tags=["machines"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=list[schemas.MachineRead])
def get_machines(db: Session = Depends(get_db)):
    return crud.list_machines(db)

@router.get("/{machine_id}", response_model=schemas.MachineRead)
def get_machine(machine_id: int, db: Session = Depends(get_db)):
    machine = crud.get_machine(db, machine_id)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@router.post("", response_model=schemas.MachineRead)
def create_machine(
    data: schemas.MachineCreate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),  # admin only
):
    return crud.create_machine(db, data)


@router.delete("/{machine_id}")
def delete_machine(
    machine_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),  # admin only
):
    success = crud.delete_machine(db, machine_id)
    if not success:
        raise HTTPException(status_code=404, detail="Machine not found")
    return {"detail": "Machine deleted"}