import pandas as pd

def extract():
     patients = pd.read_csv("data/generated_data/patients.csv")
     doctors = pd.read_csv("data/generated_data/doctors.csv")
     appointments = pd.read_csv("data/generated_data/appointments.csv")

     print("Extraction Completed")

     return patients, doctors, appointments

