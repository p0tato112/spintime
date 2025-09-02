from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import database, models
from datetime import datetime, timezone
from .database import SessionLocal
from app.routers import machines, reservations, rooms, auth
import asyncio


# Create tables on startup (simple MVP approach)
database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="spintime API", version="0.1.0")

# CORS setup
origins = [
    "http://localhost:5173",   # Vite dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(machines.router)
app.include_router(reservations.router)
app.include_router(rooms.router)
app.include_router(auth.router)

# async task: delete reservations
async def cleanup_reservations_task():
    while True:
        now = datetime.now(timezone.utc)
        try:
            with SessionLocal() as db:
                db.query(models.Reservation).filter(
                    models.Reservation.end_time <= now
                ).delete()
                db.commit()
        except Exception as e:
            print("Cleanup task error:", e)

        await asyncio.sleep(60)  # run every 60 seconds

@app.on_event("startup")
async def start_cleanup_task():
    asyncio.create_task(cleanup_reservations_task())

# Health check / hello
@app.get("/")
def root():
    return {"ok": True, "service": "spintime"}
