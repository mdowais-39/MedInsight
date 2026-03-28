from fastapi import APIRouter
from app.services.analytics_service import (
    get_department_load,
    get_doctor_workload,
    get_monthly_visits,
    get_top_doctors
)

router = APIRouter(
    prefix = "/analytics",
    tags = ["Analytics"]
)

@router.get("/top-doctors")
def top_doctors():
    return get_top_doctors()

@router.get("/department-load")
def department_load():
    return get_department_load()

@router.get("/monthly-visits")
def monthly_visits():
    return get_monthly_visits()

@router.get("/doctor-workload")
def doctor_workload():
    return get_doctor_workload()

