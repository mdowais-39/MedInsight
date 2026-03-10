from app.db_connection import get_connection

def get_departments():
    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT department_id, department_name
    FROM departments;
    """

    cur.execute(query)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    departments = []
    for r in rows:
        departments.append({
            "department_id": r[0],
            "department_name": r[1]
        })
    
    return departments

def get_doctors_by_department(department_id):

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT doctor_id, name, specialization
    FROM doctors
    WHERE department_id = %s;
    """

    cur.execut(query,(department_id,))

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

