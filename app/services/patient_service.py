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

