from app.db_connection import get_connection
from app.utils.helpers import print_success


def book_appointment(patient_id, doctor_id, appointment_date, appointment_time):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    INSERT INTO Appointments(patient_id,
    doctor_id,
    appointment_date,
    appointment_time,
    status
    )
    VALUES (%s, %s, %s, %s, 'Scheduled')
    RETURNING appointment_id;
    """

    cur.execute(query, (patient_id, doctor_id, appointment_date, appointment_time))
    appointment_id = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    print_success(f"Appointment booked with ID {appointment_id}")

    return appointment_id


def get_appointments_by_patient(patient_id):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT a.appointment_id, a.doctor_id, d.name AS doctor_name,
           a.appointment_date, a.appointment_time, a.status
    FROM Appointments a
    JOIN Doctors d ON a.doctor_id = d.doctor_id
    WHERE a.patient_id = %s
    ORDER BY a.appointment_date DESC, a.appointment_time DESC;
    """

    cur.execute(query, (patient_id,))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    appointments = []
    for r in rows:
        appointments.append({
            "appointment_id": r[0],
            "doctor_id": r[1],
            "doctor_name": r[2],
            "appointment_date": str(r[3]),
            "appointment_time": str(r[4]),
            "status": r[5],
        })

    return appointments


def get_appointments_by_doctor(doctor_id):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT a.appointment_id, a.patient_id, p.name AS patient_name,
           a.appointment_date, a.appointment_time, a.status
    FROM Appointments a
    JOIN Patients p ON a.patient_id = p.patient_id
    WHERE a.doctor_id = %s
    ORDER BY a.appointment_date DESC, a.appointment_time DESC;
    """

    cur.execute(query, (doctor_id,))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    appointments = []
    for r in rows:
        appointments.append({
            "appointment_id": r[0],
            "patient_id": r[1],
            "patient_name": r[2],
            "appointment_date": str(r[3]),
            "appointment_time": str(r[4]),
            "status": r[5],
        })

    return appointments
