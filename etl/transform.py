def transform(patients, doctors, appointments):

    # create analytics feature
    patients["age_group"] = patients["age"].apply(
        lambda x: "Senior" if x > 60 else "Adult"
    )

    appointments["appointment_year"] = \
        appointments["appointment_date"].astype(str).str[:4]

    print("Transformation completed")

    # remove derived columns before OLTP load
    patients = patients.drop(columns=["age_group"])
    appointments = appointments.drop(columns=["appointment_year"])

    return patients, doctors, appointments