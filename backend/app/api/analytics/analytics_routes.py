from fastapi import APIRouter
from app.services.analytics_service import (
    get_top_doctors,
    get_department_load,
    get_monthly_visits,
    get_doctor_workload,
)


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/top-doctors")
def list_top_doctors():
    """Get the top 10 doctors by number of appointments"""
    return get_top_doctors()


@router.get("/department-load")
def list_department_load():
    """Get total visits per department"""
    return get_department_load()


@router.get("/monthly-visits")
def list_monthly_visits():
    """Get monthly patient visits over time"""
    return get_monthly_visits()


@router.get("/doctor-workload")
def list_doctor_workload():
    """Get total visits per doctor"""
    return get_doctor_workload()
