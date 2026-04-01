from fastapi import APIRouter, HTTPException
from app.services.patient_service import register_patient, get_patient_by_id
from app.schemas.patient_schema import PatientCreate
import traceback


router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


@router.post("/register")
def create_patient(patient: PatientCreate):
    try:
        patient_id = register_patient(
            patient.name,
            patient.age,
            patient.gender,
            patient.phone,
            patient.email,
            patient.address
        )

        return {"patient_id": patient_id}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{patient_id}")
def get_patient(patient_id: int):
    try:
        patient = get_patient_by_id(patient_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))