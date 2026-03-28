import threading
from app.db_connection import get_connection


def book_slot(patient_id):

    conn = get_connection()
    cur = conn.cursor()

    try:

        conn.autocommit = False

        # Step 4: Set isolation level
        cur.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE")


        cur.execute("""
        INSERT INTO Appointments(
            patient_id,
            doctor_id,
            appointment_date,
            appointment_time,
            status
        )
        VALUES (%s,2,'2026-04-05','11:00:00','Scheduled')
        """,(patient_id,))

        conn.commit()
        print(f"Patient {patient_id} booked successfully")

    except Exception as e:

        conn.rollback()
        print(f"Patient {patient_id} failed:", e)

    finally:
        cur.close()
        conn.close()


def run_test():

    t1 = threading.Thread(target=book_slot,args=(1,))
    t2 = threading.Thread(target=book_slot,args=(2,))

    t1.start()
    t2.start()

    t1.join()
    t2.join()


if __name__ == "__main__":
    run_test()