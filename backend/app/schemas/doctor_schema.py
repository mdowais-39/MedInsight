from pydantic import BaseModel, EmailStr


class DoctorCreate(BaseModel):

    name: str
    specialization: str
    department_id: int
    experience_years: int
    phone: str
    email: EmailStr