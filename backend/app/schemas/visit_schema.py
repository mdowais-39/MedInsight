from pydantic import BaseModel


class VisitCreate(BaseModel):

    appointment_id: int
    patient_id: int
    doctor_id: int
    diagnosis: str
    notes: str


class PrescriptionCreate(BaseModel):

    visit_id: int
    medicine_name: str
    dosage: str
    duration_days: int


class TreatmentCreate(BaseModel):

    visit_id: int
    treatment_type: str
    cost: float
    notes: str