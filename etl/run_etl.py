from etl.extract import extract
from etl.transform import transform
from etl.load import load_dataframe

def run():
    patients, doctors, appointments = extract()

    patients, doctors, appointments = transform(
        patients, doctors, appointments
    )

    load_dataframe(patients, "patients")
    load_dataframe(doctors, "doctors")
    load_dataframe(appointments, "appointments")

if __name__ == "__main__":
    run()

    