from fastapi import APIRouter
from app.services.department_service import get_departments

router = APIRouter(
    prefix = "/departments",
    tags = ["Departments"]
)

@router.get("/")
def list_departments():
    return get_departments()

@router.get("/{department_id}/doctors")
def doctors_by_department(department_id: int):

    from app.services.department_service import get_doctors_by_department

    return get_doctors_by_department(department_id)

