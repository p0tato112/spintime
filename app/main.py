from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import database, models
from app.routers import machines, reservations, rooms


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

# Health check / hello
@app.get("/")
def root():
    return {"ok": True, "service": "spintime"}
