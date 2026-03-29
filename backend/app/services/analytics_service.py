from app.db_connection import get_connection


# 1. Top doctors (most appointments)
def get_top_doctors(role="admin", doctor_id=None, month=None, year=None):

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT doctor_id, SUM(total_appointments)
    FROM mv_top_doctors
    WHERE 1=1
    """

    params = []

    # Role restriction
    if role == "doctor":
        query += " AND doctor_id = %s"
        params.append(doctor_id)

    # Filters
    if month is not None:
        query += " AND month = %s"
        params.append(month)

    if year is not None:
        query += " AND year = %s"
        params.append(year)

    query += """
    GROUP BY doctor_id
    ORDER BY SUM(total_appointments) DESC
    LIMIT 10;
    """

    cur.execute(query, params)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {"doctor_id": r[0], "total_appointments": r[1]}
        for r in rows
    ]


# 2. Department load
def get_department_load(year=None):

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT department_id, SUM(total_visits)
    FROM mv_department_load
    WHERE 1=1
    """

    params = []

    if year is not None:
        query += " AND year = %s"
        params.append(year)

    query += """
    GROUP BY department_id
    ORDER BY SUM(total_visits) DESC;
    """

    cur.execute(query, params)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {"department_id": r[0], "total_visits": r[1]}
        for r in rows
    ]


# 3. Monthly visits
def get_monthly_visits(year=None, month=None):

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT year, month, total_visits
    FROM mv_monthly_visits
    WHERE 1=1
    """

    params = []

    # Filter by year
    if year is not None:
        query += " AND year = %s"
        params.append(year)

    # Filter by month
    if month is not None:
        query += " AND month = %s"
        params.append(month)

    query += " ORDER BY year, month;"

    cur.execute(query, params)
    rows = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "year": int(r[0]),
            "month": int(r[1]),
            "total_visits": r[2]
        }
        for r in rows
    ]


# 4. Doctor workload
def get_doctor_workload(role="admin", doctor_id=None, year=None):

    conn = get_connection()
    cur = conn.cursor()

    query = """
    SELECT doctor_id, SUM(total_visits)
    FROM mv_doctor_workload
    WHERE 1=1
    """

    params = []

    # Doctor can only see their own data
    if role == "doctor":
        query += " AND doctor_id = %s"
        params.append(doctor_id)

    if year is not None:
        query += " AND year = %s"
        params.append(year)

    query += """
    GROUP BY doctor_id
    ORDER BY SUM(total_visits) DESC;
    """

    cur.execute(query, params)
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