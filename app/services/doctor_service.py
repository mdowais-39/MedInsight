from app.db_connection import get_connection
from app.utils.helpers import print_success


def add_doctor(name, specialization, department_id, experience, phone, email):

    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO Doctors(name, specialization, department_id, experience_years, phone, email)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING doctor_id;
        """ 
    
    cursor.execute(query, (
        name, 
        specialization,
        department_id,
        experience,
        phone,
        email
    ))

    doctor_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    print_success(f"Doctor added with ID {doctor_id}")

    return doctor_id

def get_all_doctors():

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT doctor_id, name, specialization
    FROM Doctors;
    """

    cur.execute(query)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    doctors = []

    for r in rows:
        doctors.append({
            "doctor_id": r[0],
            "name": r[1],
            "specialization": r[2]
        })

    return doctors