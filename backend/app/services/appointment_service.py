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

def get_doctor_appointments(doctor_id):

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        p.patient_id,
        p.name,
        p.age,
        p.gender
    FROM Appointments a
    JOIN Patients p ON a.patient_id = p.patient_id
    WHERE a.doctor_id = %s
    ORDER BY a.appointment_date DESC, a.appointment_time DESC;
    """

    cur.execute(query, (doctor_id,))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "appointment_id": r[0],
            "date": str(r[1]),
            "time": str(r[2]),
            "status": r[3],
            "patient": {
                "patient_id": r[4],
                "name": r[5],
                "age": r[6],
                "gender": r[7]
            }
        }
        for r in rows
    ]


def get_patient_appointments(patient_id):

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        d.doctor_id,
        d.name,
        d.specialization
    FROM Appointments a
    JOIN Doctors d ON a.doctor_id = d.doctor_id
    WHERE a.patient_id = %s
    ORDER BY a.appointment_date DESC, a.appointment_time DESC;
    """

    cur.execute(query, (patient_id,))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "appointment_id": r[0],
            "date": str(r[1]),
            "time": str(r[2]),
            "status": r[3],
            "doctor": {
                "doctor_id": r[4],
                "name": r[5],
                "specialization": r[6]
            }
        }
        for r in rows
    ]

def get_doctor_appointments_detailed(doctor_id):

    from app.db_connection import get_connection

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.status,

        p.patient_id,
        p.name,
        p.age,
        p.gender,

        v.visit_id,
        v.diagnosis,
        v.notes,

        pr.medicine_name,
        pr.dosage,
        pr.duration_days,

        t.treatment_type,
        t.treatment_cost

    FROM Appointments a
    JOIN Patients p ON a.patient_id = p.patient_id

    LEFT JOIN Visits v ON a.appointment_id = v.appointment_id
    LEFT JOIN Prescriptions pr ON v.visit_id = pr.visit_id
    LEFT JOIN Treatments t ON v.visit_id = t.visit_id

    WHERE a.doctor_id = %s
    ORDER BY a.appointment_date DESC;
    """

    cur.execute(query, (doctor_id,))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return format_doctor_data(rows)

def format_doctor_data(rows):

    appointments = {}

    for r in rows:

        appointment_id = r[0]

        if appointment_id not in appointments:
            appointments[appointment_id] = {
                "appointment_id": r[0],
                "date": str(r[1]),
                "time": str(r[2]),
                "status": r[3],

                "patient": {
                    "patient_id": r[4],
                    "name": r[5],
                    "age": r[6],
                    "gender": r[7]
                },

                "visit": None,
                "prescriptions": [],
                "treatments": []
            }

        # Visit
        if r[8]:
            appointments[appointment_id]["visit"] = {
                "visit_id": r[8],
                "diagnosis": r[9],
                "notes": r[10]
            }

        # Prescription
        if r[11]:
            appointments[appointment_id]["prescriptions"].append({
                "medicine_name": r[11],
                "dosage": r[12],
                "duration_days": r[13]
            })

        # Treatment
        if r[14]:
            appointments[appointment_id]["treatments"].append({
                "treatment_type": r[14],
                "cost": r[15]
            })

    return list(appointments.values())

def get_patient_appointments_detailed(patient_id):

    from app.db_connection import get_connection

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT 
        a.appointment_id,
        a.appointment_date,
        a.appointment_time,
        a.status,

        d.doctor_id,
        d.name,
        d.specialization,

        v.visit_id,
        v.diagnosis,
        v.notes,

        pr.medicine_name,
        pr.dosage,
        pr.duration_days,

        t.treatment_type,
        t.treatment_cost

    FROM Appointments a
    JOIN Doctors d ON a.doctor_id = d.doctor_id

    LEFT JOIN Visits v ON a.appointment_id = v.appointment_id
    LEFT JOIN Prescriptions pr ON v.visit_id = pr.visit_id
    LEFT JOIN Treatments t ON v.visit_id = t.visit_id

    WHERE a.patient_id = %s
    ORDER BY a.appointment_date DESC;
    """

    cur.execute(query, (patient_id,))
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return format_patient_data(rows)

def format_patient_data(rows):

    appointments = {}

    for r in rows:

        appointment_id = r[0]

        if appointment_id not in appointments:
            appointments[appointment_id] = {
                "appointment_id": r[0],
                "date": str(r[1]),
                "time": str(r[2]),
                "status": r[3],

                "doctor": {
                    "doctor_id": r[4],
                    "name": r[5],
                    "specialization": r[6]
                },

                "visit": None,
                "prescriptions": [],
                "treatments": []
            }

        # Visit
        if r[7]:
            appointments[appointment_id]["visit"] = {
                "visit_id": r[7],
                "diagnosis": r[8],
                "notes": r[9]
            }

        # Prescription
        if r[10]:
            appointments[appointment_id]["prescriptions"].append({
                "medicine_name": r[10],
                "dosage": r[11],
                "duration_days": r[12]
            })

        # Treatment
        if r[13]:
            appointments[appointment_id]["treatments"].append({
                "treatment_type": r[13],
                "cost": r[14]
            })

    return list(appointments.values())

