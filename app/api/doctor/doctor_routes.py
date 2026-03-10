from fastapi import APIRouter
from app.services.doctor_service import get_all_doctors, add_doctor
from app.schemas.doctor_schema import DoctorCreate


router = APIRouter(
    prefix="/doctors",
    tags=["Doctors"]
)

@router.post("/register")
def register_doctor(doctor: DoctorCreate):

    doctor_id = add_doctor(
        doctor.name,
        doctor.specialization,
        doctor.department_id,
        doctor.experience_years,
        doctor.phone,
        doctor.email
    )

    return {"doctor_id": doctor_id}

@router.get("/")
def doctors():

    doctors = get_all_doctors()

    return doctors