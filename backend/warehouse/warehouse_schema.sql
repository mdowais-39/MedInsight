-- Dimension Table

CREATE TABLE DimPatient(
    patient_id INT PRIMARY KEY,
    age INT,
    gender VARCHAR(10)
);

CREATE TABLE DimDoctor(
    doctor_id INT PRIMARY KEY,
    specialization VARCHAR(100),
    department_id INT
);

CREATE TABLE DimDepartment(
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100)
);

CREATE TABLE DimTime(
    date DATE PRIMARY KEY,
    year INT,
    month INT,
    day INT
);


-- FACT TABLE

CREATE TABLE FactVisits(

    visit_id SERIAL PRIMARY KEY,

    patient_id INT, 
    doctor_id INT,
    department_id INT,
    appointment_date DATE,

    total_visits INT
);

