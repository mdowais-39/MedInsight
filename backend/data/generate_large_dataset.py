import pandas as pd
import random
from faker import Faker

fake = Faker()

NUM_PATIENTS = 10000
NUM_DOCTORS = 200
NUM_APPOINTMENTS = 50000

# Patients

patients = []

for i in range(1,NUM_PATIENTS+1):
    patients.append({
        "patient_id": i ,
        "name": fake.name(),
        "age": random.randint(1, 100),
        "gender": random.choice(["Male", "Female", "Other"]),
        "phone": fake.phone_number(),
        "email": fake.email(),
        "address": fake.address()
    })

patients_df = pd.DataFrame(patients)

patients_df.to_csv("data/generated_data/patients.csv",
    index=False)

print("Patients dataset generated")


# Doctors


specializations = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "General Medicine",
    "Orthopedics",
    "ENT",
    "Ophthalmology"
]

department_map = {
    "Cardiology": 1,
    "Neurology": 2,
    "Orthopedics": 3,
    "Pediatrics": 4,
    "Dermatology": 5,
    "General Medicine": 6,
    "ENT": 7,
    "Ophthalmology": 8
}


doctors = []


fake.unique.clear()
for i in range(1, NUM_DOCTORS+1):

    specialization = random.choice(specializations)

    doctors.append({
        "doctor_id": i,
        "name": fake.name(),
        "specialization": specialization,
        "department_id": department_map[specialization],
        "experience_years": random.randint(2, 40),
        "phone": fake.phone_number(),
        "email": fake.unique.email(),
    })

doctors_df = pd.DataFrame(doctors)

doctors_df.to_csv("data/generated_data/doctors.csv",
                   index=False)

print("Doctors dataset generated")


# Appointments


appointments = []

for i in range(1, NUM_APPOINTMENTS + 1):

    appointments.append({
        "appointment_id": i,
        "patient_id": random.randint(1,NUM_PATIENTS),
        "doctor_id": random.randint(1,NUM_DOCTORS),
        "appointment_date": fake.date_this_year(),
        "appointment_time": fake.time(),
        "status": "Scheduled"
    })

appointments_df = pd.DataFrame(appointments)

appointments_df.to_csv(
    "data/generated_data/appointments.csv",
    index=False
)

print("Appointments dataset generated")
