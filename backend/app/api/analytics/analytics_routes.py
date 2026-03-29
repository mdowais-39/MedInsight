from fastapi import APIRouter
from app.services.analytics_service import (
    get_department_load,
    get_doctor_workload,
    get_monthly_visits,
    get_top_doctors,
    get_refresh_views
)

router = APIRouter(
    prefix = "/analytics",
    tags = ["Analytics"]
)

@router.get("/top-doctors")
def top_doctors(
    role: str = "admin",
    doctor_id: int = None,
    month: int = None,
    year: int = None
):
    return get_top_doctors(role, doctor_id, month, year)

@router.get("/department-load")
def department_load(year: int = None):
    return get_department_load(year)

@router.get("/monthly-visits")
def monthly_visits(year: int = None, month: int = None):
    return get_monthly_visits(year, month)

@router.get("/doctor-workload")
def doctor_workload(
    role: str = "admin",
    doctor_id: int = None,
    year: int = None
):
    return get_doctor_workload(role, doctor_id, year)

@router.post("/refresh")
def refresh_views():
    return get_refresh_views()
