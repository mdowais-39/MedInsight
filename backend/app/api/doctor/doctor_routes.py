from fastapi import APIRouter, HTTPException
from app.services.doctor_service import get_all_doctors, add_doctor, get_doctor_by_id
from app.schemas.doctor_schema import DoctorCreate
import traceback


router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"]
)


@router.post("/register")
def register_doctor(doctor: DoctorCreate):
    try:
        doctor_id = add_doctor(
            doctor.name,
            doctor.specialization,
            doctor.department_id,
            doctor.experience_years,
            doctor.phone,
            doctor.email
        )

        return {"doctor_id": doctor_id}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
def doctors():
    try:
        return get_all_doctors()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{doctor_id}")
def get_doctor(doctor_id: int):
    try:
        doctor = get_doctor_by_id(doctor_id)
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")
        return doctor
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))