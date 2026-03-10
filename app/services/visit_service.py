from app.db_connection import get_connection
from app.utils.helpers import print_success

def record_visit(appointment_id, patient_id, doctor_id, diagnosis, notes):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO Visits(appointment_id, patient_id, doctor_id, diagnosis, visit_date, notes)
        VALUES (%s, %s, %s, %s,CURRENT_DATE, %s)
        RETURNING visit_id;
        """
    
    cursor.execute(query, (appointment_id, patient_id, doctor_id, diagnosis, notes))

    visit_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    print_success(f"Visit recorded with ID {visit_id}")

    return visit_id

def add_prescription(visit_id, medicine_name, dosage, duration_days):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO Prescriptions(visit_id, medicine_name, dosage, duration_days)
        VALUES (%s, %s, %s, %s)
        RETURNING prescription_id;
        """
    
    cursor.execute(query, (visit_id, medicine_name, dosage, duration_days))

    prescription_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    print_success(f"Prescription added with ID {prescription_id}")

    return prescription_id

def add_treatment(visit_id, treatment_type, cost, notes):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO Treatments(visit_id, treatment_type, treatment_cost, treatment_notes)
        VALUES (%s, %s, %s, %s)
        RETURNING treatment_id;
        """
    
    cursor.execute(query, (visit_id, treatment_type, cost, notes))

    treatment_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    print_success(f"Treatment added with ID {treatment_id}")

    return treatment_id