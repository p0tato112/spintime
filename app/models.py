# models.py
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class MachineType(str, enum.Enum):
    washer = "washer"
    dryer = "dryer"
    combo = "combo"

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=True)
    machines = relationship("Machine", back_populates="room", cascade="all, delete-orphan")

class Machine(Base):
    __tablename__ = "machines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)              # e.g., "Washer 1"
    type = Column(Enum(MachineType), nullable=False)
    cycle_minutes = Column(Integer, nullable=False, default=45)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)

    room = relationship("Room", back_populates="machines")
    reservations = relationship("Reservation", back_populates="machine", cascade="all, delete-orphan")

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=False)
    user_id = Column(String, index=True)           # simple UUID/string for MVP
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)

    machine = relationship("Machine", back_populates="reservations")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")  # "user" or "admin"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reservations = relationship("Reservation", back_populates="user")