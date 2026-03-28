import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.patient.patient_routes import router as patient_router
from app.api.patient.appointment_routes import router as appointment_router
from app.api.doctor.doctor_routes import router as doctor_router
from app.api.doctor.visit_routes import router as visit_router
from app.api.patient.department_routes import router as department_router
from app.api.analytics.analytics_routes import router as analytics_router

load_dotenv()

app = FastAPI(
    title="MedInsight Healthcare API",
    description="Production-ready Smart Healthcare Database Management System",
    version="1.0.0"
)

# CORS — allow configured origins (set ALLOWED_ORIGINS in env vars)
allowed_origins_raw = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [o.strip() for o in allowed_origins_raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patient_router)
app.include_router(appointment_router)
app.include_router(doctor_router)
app.include_router(visit_router)
app.include_router(department_router)
app.include_router(analytics_router)


@app.get("/")
def root():
    return {
        "message": "MedInsight Healthcare API is running",
        "docs": "/docs",
        "version": "1.0.0"
    }
