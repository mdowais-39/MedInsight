from fastapi import APIRouter
from app.services.visit_service import record_visit, add_prescription, add_treatment
from app.schemas.visit_schema import VisitCreate, PrescriptionCreate, TreatmentCreate


router = APIRouter(
    prefix="/doctor",
    tags=["Doctor Operations"]
)


@router.post("/record-visit")
def visit(data: VisitCreate):

    visit_id = record_visit(
        data.appointment_id,
        data.patient_id,
        data.doctor_id,
        data.diagnosis,
        data.notes
    )

    return {"visit_id": visit_id}

@router.post("/add-prescription")
def prescription(data: PrescriptionCreate):

    add_prescription(
        data.visit_id,
        data.medicine_name,
        data.dosage,
        data.duration_days
    )

    return {"message": "Prescription added"}

@router.post("/add-treatment")
def treatment(data: TreatmentCreate):

    add_treatment(
        data.visit_id,
        data.treatment_type,
        data.cost,
        data.notes
    )

    return {"message": "Treatment recorded"}