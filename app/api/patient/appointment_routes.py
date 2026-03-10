from fastapi import APIRouter
from app.services.appointment_service import book_appointment
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