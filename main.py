from fastapi import FastAPI

from app.api.patient.patient_routes import router as patient_router
from app.api.patient.appointment_routes import router as appointment_router

from app.api.doctor.doctor_routes import router as doctor_router
from app.api.doctor.visit_routes import router as visit_router

from app.api.patient.department_routes import router as department_router


app = FastAPI(title="Smart Healthcare DBMS")


app.include_router(patient_router)
app.include_router(appointment_router)
app.include_router(doctor_router)
app.include_router(visit_router)
app.include_router(department_router)


@app.get("/")
def root():
    return {"message": "Healthcare API running"}