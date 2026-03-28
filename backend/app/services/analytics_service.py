from app.db_connection import get_connection


def get_top_doctors():
    """Get the top 10 doctors by number of appointments"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
            SELECT doctor_id,
            COUNT(*) AS total_appointments
            FROM Appointments
            GROUP BY doctor_id
            ORDER BY total_appointments DESC
            LIMIT 10;
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        
        cur.close()
        conn.close()

        return [
            {
                "doctor_id": r[0],
                "total_appointments": r[1],
            }
            for r in rows
        ]
    except Exception as e:
        print(f"Error in get_top_doctors: {str(e)}")
        return []


def get_department_load():
    """Get total visits per department"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
            SELECT
            d.department_id,
            COUNT(v.visit_id) AS total_visits
            FROM Departments d
            LEFT JOIN Doctors doc ON d.department_id = doc.department_id
            LEFT JOIN Visits v ON doc.doctor_id = v.doctor_id
            GROUP BY d.department_id
            ORDER BY COUNT(v.visit_id) DESC;
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        
        cur.close()
        conn.close()

        return [
            {
                "department_id": r[0],
                "total_visits": int(r[1]) if r[1] else 0,
            }
            for r in rows
        ]
    except Exception as e:
        print(f"Error in get_department_load: {str(e)}")
        return []


def get_monthly_visits():
    """Get monthly patient visits over time"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
            SELECT
            EXTRACT(YEAR FROM v.visit_date)::INT AS year,
            EXTRACT(MONTH FROM v.visit_date)::INT AS month,
            COUNT(v.visit_id) AS total_visits
            FROM Visits v
            GROUP BY EXTRACT(YEAR FROM v.visit_date), EXTRACT(MONTH FROM v.visit_date)
            ORDER BY year, month;
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        
        cur.close()
        conn.close()

        return [
            {
                "year": int(r[0]) if r[0] else 0,
                "month": int(r[1]) if r[1] else 0,
                "total_visits": int(r[2]) if r[2] else 0,
            }
            for r in rows
        ]
    except Exception as e:
        print(f"Error in get_monthly_visits: {str(e)}")
        return []


def get_doctor_workload():
    """Get total visits per doctor"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        query = """
            SELECT
            v.doctor_id,
            COUNT(v.visit_id) AS total_visits
            FROM Visits v
            GROUP BY v.doctor_id
            ORDER BY COUNT(v.visit_id) DESC;
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        
        cur.close()
        conn.close()

        return [
            {
                "doctor_id": r[0],
                "total_visits": int(r[1]) if r[1] else 0,
            }
            for r in rows
        ]
    except Exception as e:
        print(f"Error in get_doctor_workload: {str(e)}")
        return []


def get_kpis():
    """Get key performance indicators: total patients, doctors, appointments, visits"""
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Get total patients
        cur.execute("SELECT COUNT(*) FROM Patients;")
        total_patients = cur.fetchone()[0] or 0

        # Get total doctors
        cur.execute("SELECT COUNT(*) FROM Doctors;")
        total_doctors = cur.fetchone()[0] or 0

        # Get total appointments
        cur.execute("SELECT COUNT(*) FROM Appointments;")
        total_appointments = cur.fetchone()[0] or 0

        # Get total visits
        cur.execute("SELECT COUNT(*) FROM Visits;")
        total_visits = cur.fetchone()[0] or 0

        cur.close()
        conn.close()

        return {
            "total_patients": int(total_patients),
            "total_doctors": int(total_doctors),
            "total_appointments": int(total_appointments),
            "total_visits": int(total_visits),
        }
    except Exception as e:
        print(f"Error in get_kpis: {str(e)}")
        return {
            "total_patients": 0,
            "total_doctors": 0,
            "total_appointments": 0,
            "total_visits": 0,
        }
