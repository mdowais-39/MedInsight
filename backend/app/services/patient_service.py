from app.db_connection import get_connection
from app.utils.helpers import print_success


def register_patient(name, age, gender, phone, email, address):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO Patients(name, age, gender, phone, email, address)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING patient_id;
        """
    
    cursor.execute(query, (name, age, gender, phone, email, address))

    patient_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    print_success(f"Patient registered with ID {patient_id}")

    return patient_id


def get_patient_by_id(patient_id: int):
    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT patient_id, name, age, gender, phone, email, address
    FROM Patients
    WHERE patient_id = %s;
    """

    cur.execute(query, (patient_id,))
    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return None

    return {
        "patient_id": row[0],
        "name": row[1],
        "age": row[2],
        "gender": row[3],
        "phone": row[4],
        "email": row[5],
        "address": row[6],
    }
