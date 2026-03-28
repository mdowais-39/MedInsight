from pydantic import BaseModel, EmailStr


class PatientCreate(BaseModel):

    name: str
    age: int
    gender: str
    phone: str
    email: EmailStr
    address: str