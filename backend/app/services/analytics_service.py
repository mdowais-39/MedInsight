from app.db_connection import get_connection


# 1. Top doctors (most appointments)
def get_top_doctors():

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT doctor_id, total_appointments
    FROM mv_top_doctors
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
    SELECT department_id, total_visits
    FROM mv_department_load
    ORDER BY total_visits DESC;
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
    SELECT year, month, total_visits
    FROM mv_monthly_visits
    ORDER BY year, month;
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
    SELECT doctor_id, total_visits
    FROM mv_doctor_workload
    ORDER BY total_visits DESC;
    """

    cur.execute(query)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {"doctor_id": r[0], "total_visits": r[1]}
        for r in rows
    ]

def get_refresh_views():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("REFRESH MATERIALIZED VIEW mv_top_doctors")
    cur.execute("REFRESH MATERIALIZED VIEW mv_department_load")
    cur.execute("REFRESH MATERIALIZED VIEW mv_monthly_visits")
    cur.execute("REFRESH MATERIALIZED VIEW mv_doctor_workload")

    conn.commit()

    cur.close()
    conn.close()

    return {"message": "Materialized views refreshed"}