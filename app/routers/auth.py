# routes_auth.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserRead)
def register_user(data: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed = auth.hash_password(data.password)
    user = models.User(username=data.username, hashed_password=hashed, role="user")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/register_admin", response_model=schemas.UserRead)
def register_admin(data: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.role == "admin").first() is None:
        # First admin creation allowed without restriction
        pass
    else:
        raise HTTPException(status_code=403, detail="Admin account already exists")

    hashed = auth.hash_password(data.password)
    admin = models.User(username=data.username, hashed_password=hashed, role="admin")
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}
