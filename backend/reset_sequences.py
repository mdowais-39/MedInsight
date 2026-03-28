from app.db_connection import get_connection

conn = get_connection()
cur = conn.cursor()

tables = [
    ("patients_patient_id_seq", "Patients", "patient_id"),
    ("doctors_doctor_id_seq", "Doctors", "doctor_id"),
    ("departments_department_id_seq", "Departments", "department_id"),
    ("appointments_appointment_id_seq", "Appointments", "appointment_id"),
    ("visits_visit_id_seq", "Visits", "visit_id"),
    ("prescriptions_prescription_id_seq", "Prescriptions", "prescription_id"),
    ("treatments_treatment_id_seq", "Treatments", "treatment_id"),
]

for seq_name, table, col in tables:
    cur.execute(f"SELECT setval('{seq_name}', COALESCE((SELECT MAX({col}) FROM {table}), 1))")
    val = cur.fetchone()[0]
    print(f"{seq_name} -> {val}")

conn.commit()
cur.close()
conn.close()
print("All sequences reset successfully!")
