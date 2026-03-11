from app.db_connection import get_connection

def transaction_demo():
    conn = get_connection()
    cur = conn.cursor()

    try :
        conn.autocommit = False

        # Create Patient
        cur.execute("""
                    INSERT INTO Patients(name, age, gender, phone, email, address)
                    VALUES ('Alice', 28, 'Female', '99999999999', 'alice@test.com', 'NY')
                    RETURNING patient_id;
                    """)
        
        patient_id = cur.fetchone()[0]

        # Book Appointment
        cur.execute("""
                    INSERT INTO Appointments(patient_id, doctor_id, appointment_date, appointment_time, status)
                    VALUES (%s, 2, '2026-04-01', '10:00:00', 'Scheduled');
                    """, (patient_id,))
        
        conn.commit()

        print("Transaction commited successfully.")

    except Exception as e:
        conn.rollback()
        print("Transaction rolled back due to error:", e)

    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    transaction_demo()
    