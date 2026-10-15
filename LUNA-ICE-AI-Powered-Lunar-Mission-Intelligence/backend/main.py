
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import mission, files
from services.data_service import initialize_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting backend server...")
    initialize_data()
    print("Backend started!")
    yield
    # Shutdown
    print("Shutting down backend...")


app = FastAPI(
    title="Lunar Mission Control API",
    description="API for Bharat Antariksh Hackathon PS-8 - Lunar Ice Detection & Rover Planning",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with API versioning
app.include_router(mission.router, prefix="/api/v1", tags=["mission"])
app.include_router(files.router, prefix="/api/v1", tags=["files"])


@app.get("/")
async def health_check():
    return {"status": "ok", "message": "Lunar Mission Control API is running", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

