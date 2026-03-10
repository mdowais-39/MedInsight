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

