from app.db_connection import get_connection


def rollback_demo():

    conn = get_connection()
    cur = conn.cursor()

    try:

        conn.autocommit = False

        # create patient
        cur.execute("""
        INSERT INTO Patients(name, age, gender, phone, email, address)
        VALUES ('Bob', 40, 'Male', '9999990002', 'bob@test.com', 'Chicago')
        RETURNING patient_id;
        """)

        patient_id = cur.fetchone()[0]

        # intentional error (wrong column)
        cur.execute("""
        INSERT INTO Appointments(
            patient_id,
            doctor_id,
            appointment_date,
            wrong_column
        )
        VALUES (%s,1,'2026-04-02','10:00:00')
        """,(patient_id,))

        conn.commit()

    except Exception as e:

        conn.rollback()
        print("Rollback triggered:", e)

    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    rollback_demo()