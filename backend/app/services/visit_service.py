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


def get_visits_by_patient(patient_id):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT v.visit_id, v.appointment_id, v.doctor_id, d.name AS doctor_name,
           v.diagnosis, v.visit_date, v.notes
    FROM Visits v
    JOIN Doctors d ON v.doctor_id = d.doctor_id
    WHERE v.patient_id = %s
    ORDER BY v.visit_date DESC;
    """

    cur.execute(query, (patient_id,))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    visits = []
    for r in rows:
        visits.append({
            "visit_id": r[0],
            "appointment_id": r[1],
            "doctor_id": r[2],
            "doctor_name": r[3],
            "diagnosis": r[4],
            "visit_date": str(r[5]),
            "notes": r[6],
        })

    return visits


def get_visit_details(visit_id):
    conn = get_connection()
    cur = conn.cursor()

    # Get visit info
    cur.execute("""
        SELECT v.visit_id, v.appointment_id, v.patient_id, v.doctor_id,
               d.name AS doctor_name, p.name AS patient_name,
               v.diagnosis, v.visit_date, v.notes
        FROM Visits v
        JOIN Doctors d ON v.doctor_id = d.doctor_id
        JOIN Patients p ON v.patient_id = p.patient_id
        WHERE v.visit_id = %s;
    """, (visit_id,))
    visit_row = cur.fetchone()

    if not visit_row:
        cur.close()
        conn.close()
        return None

    # Get prescriptions
    cur.execute("""
        SELECT prescription_id, medicine_name, dosage, duration_days
        FROM Prescriptions WHERE visit_id = %s;
    """, (visit_id,))
    rx_rows = cur.fetchall()

    # Get treatments
    cur.execute("""
        SELECT treatment_id, treatment_type, treatment_cost, treatment_notes
        FROM Treatments WHERE visit_id = %s;
    """, (visit_id,))
    tx_rows = cur.fetchall()

    cur.close()
    conn.close()

    return {
        "visit_id": visit_row[0],
        "appointment_id": visit_row[1],
        "patient_id": visit_row[2],
        "doctor_id": visit_row[3],
        "doctor_name": visit_row[4],
        "patient_name": visit_row[5],
        "diagnosis": visit_row[6],
        "visit_date": str(visit_row[7]),
        "notes": visit_row[8],
        "prescriptions": [
            {
                "prescription_id": r[0],
                "medicine_name": r[1],
                "dosage": r[2],
                "duration_days": r[3],
            }
            for r in rx_rows
        ],
        "treatments": [
            {
                "treatment_id": r[0],
                "treatment_type": r[1],
                "treatment_cost": float(r[2]) if r[2] else 0,
                "treatment_notes": r[3],
            }
            for r in tx_rows
        ],
    }