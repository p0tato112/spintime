# routers/machines.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import SessionLocal

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

@router.post("", response_model=schemas.MachineRead, status_code=201)
def post_machine(data: schemas.MachineCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_machine(db, data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{machine_id}")
def delete_machine(machine_id: int, db: Session = Depends(get_db)):
    success = crud.delete_machine(db, machine_id)
    if not success:
        raise HTTPException(status_code=404, detail="Machine not found")
    return {"detail": "Machine deleted"}