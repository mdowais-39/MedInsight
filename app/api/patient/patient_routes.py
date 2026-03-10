from fastapi import APIRouter
from app.services.patient_service import register_patient
from app.schemas.patient_schema import PatientCreate


router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


@router.post("/register")
def create_patient(patient: PatientCreate):

    patient_id = register_patient(
        patient.name,
        patient.age,
        patient.gender,
        patient.phone,
        patient.email,
        patient.address
    )

    return {"patient_id": patient_id}