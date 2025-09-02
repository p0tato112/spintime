# schemas.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Literal

# ROOMS

class RoomBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomRead(RoomBase):
    id: int
    class Config:
        from_attributes = True  # allows reading from SQLAlchemy objects

class Room(RoomBase):
    id: int
    machines: List["Machine"] = []  # nested relationship

    # class Config:
    #     orm_mode = True


# MACHINES

class MachineBase(BaseModel):
    name: str
    type: Literal["washer", "dryer", "combo"]
    cycle_minutes: int = Field(ge=1)
    room_id: int

class MachineCreate(MachineBase):
    room_id: int

class MachineRead(MachineBase):
    id: int
    class Config:
        from_attributes = True  # allows reading from SQLAlchemy objects

class Machine(MachineBase):
    id: int
    room_id: int

    # class Config:
    #     orm_mode: True

# RESERVATIONS

class ReservationBase(BaseModel):
    machine_id: int
    # user_id: str
    # start_time: datetime
    # end_time: datetime

class ReservationCreate(ReservationBase):
    machine_id: int
    duration_minutes: int = Field(gt=0)

class ReservationRead(ReservationBase):
    id: int
    class Config:
        from_attributes = True

class Reservation(ReservationBase):
    id: int
    machine_id: int

    # class Config:
    #     orm_mode = True

class ReservationRead(BaseModel):
    id: int
    machine_id: int
    user_id: str
    start_time: datetime
    end_time: datetime
    duration_minutes: int

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, obj):
        duration = int((obj.end_time - obj.start_time).total_seconds() // 60)
        return cls(
            id=obj.id,
            machine_id=obj.machine_id,
            user_id=obj.user_id,
            start_time=obj.start_time,
            end_time=obj.end_time,
            duration_minutes=duration,
        )
