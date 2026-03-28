from app.db_connection import get_connection


def get_top_doctors():
    """Get the top 10 doctors by number of appointments"""
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


def get_department_load():
    """Get total visits per department"""
    conn = get_connection()
    cur = conn.cursor()

    query = """
        SELECT
        department_id,
        SUM(total_visits) AS total_visits
        FROM FactVisits
        GROUP BY department_id
        ORDER BY SUM(total_visits) DESC;
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


def get_monthly_visits():
    """Get monthly patient visits over time"""
    conn = get_connection()
    cur = conn.cursor()

    query = """
        SELECT
        t.year,
        t.month,
        SUM(f.total_visits) AS total_visits
        FROM FactVisits f
        JOIN DimTime t
        ON f.appointment_date = t.date
        GROUP BY t.year, t.month
        ORDER BY t.year, t.month;
    """
    
    cur.execute(query)
    rows = cur.fetchall()
    
    cur.close()
    conn.close()

    return [
        {
            "year": r[0],
            "month": r[1],
            "total_visits": int(r[2]) if r[2] else 0,
        }
        for r in rows
    ]


def get_doctor_workload():
    """Get total visits per doctor"""
    conn = get_connection()
    cur = conn.cursor()

    query = """
        SELECT
        doctor_id,
        SUM(total_visits) AS total_visits
        FROM FactVisits
        GROUP BY doctor_id
        ORDER BY SUM(total_visits) DESC;
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
