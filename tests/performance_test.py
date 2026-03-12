from app.db_connection import get_connection
import time

def test_query():
    conn = get_connection()
    cur = conn.cursor()

    start = time.time()

    cur.execute("""
    SELECT *
    FROM Appointments
    WHERE doctor_id = 1
    """)
    
    cur.fetchall()

    end = time.time()

    print(f"Query time:", end- start)

    cur.close()
    conn.close()

if __name__ == "__main__":
    test_query()

    