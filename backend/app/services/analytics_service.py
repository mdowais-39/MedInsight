from app.db_connection import get_connection


# 1. Top doctors (most appointments)
def get_top_doctors():

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT doctor_id, COUNT(*) AS total_appointments
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
        {"doctor_id": r[0], "total_appointments": r[1]}
        for r in rows
    ]


# 2. Department load
def get_department_load():

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT department_id, SUM(total_visits)
    FROM FactVisits
    GROUP BY department_id
    ORDER BY SUM(total_visits) DESC;
    """

    cur.execute(query)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {"department_id": r[0], "total_visits": r[1]}
        for r in rows
    ]


# 3. Monthly visits
def get_monthly_visits():

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT t.year, t.month, SUM(f.total_visits)
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
            "total_visits": r[2]
        }
        for r in rows
    ]


# 4. Doctor workload
def get_doctor_workload():

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT doctor_id, SUM(total_visits)
    FROM FactVisits
    GROUP BY doctor_id
    ORDER BY SUM(total_visits) DESC;
    """

    cur.execute(query)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {"doctor_id": r[0], "total_visits": r[1]}
        for r in rows
    ]

