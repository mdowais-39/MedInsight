from fastapi import APIRouter
from app.services.appointment_service import book_appointment, get_appointments_by_patient, get_appointments_by_doctor
from app.schemas.appointment_schema import AppointmentCreate


router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)


@router.post("/book")
def create_appointment(appointment: AppointmentCreate):

    appointment_id = book_appointment(
        appointment.patient_id,
        appointment.doctor_id,
        appointment.appointment_date,
        appointment.appointment_time
    )

    return {"appointment_id": appointment_id}


@router.get("/patient/{patient_id}")
def list_patient_appointments(patient_id: int):
    return get_appointments_by_patient(patient_id)


@router.get("/doctor/{doctor_id}")
def list_doctor_appointments(doctor_id: int):
    return get_appointments_by_doctor(doctor_id)