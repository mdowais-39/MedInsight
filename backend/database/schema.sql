-- =========================
-- Departments
-- =========================

CREATE TABLE Departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);



-- =========================
-- Patients
-- =========================

CREATE TABLE Patients (
    patient_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 0),
    gender VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    registration_date DATE DEFAULT CURRENT_DATE
);



-- =========================
-- Doctors
-- =========================

CREATE TABLE Doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    department_id INT,
    experience_years INT CHECK (experience_years >= 0),
    phone VARCHAR(20),
    email VARCHAR(100),

    FOREIGN KEY (department_id)
    REFERENCES Departments(department_id)
);



-- =========================
-- Appointments
-- =========================

CREATE TABLE Appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,

    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,

    status VARCHAR(20) DEFAULT 'Scheduled',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id)
    REFERENCES Patients(patient_id)
    ON DELETE CASCADE,

    FOREIGN KEY (doctor_id)
    REFERENCES Doctors(doctor_id)
);



-- Prevent double booking for a doctor

ALTER TABLE Appointments
ADD CONSTRAINT unique_doctor_slot
UNIQUE (doctor_id, appointment_date, appointment_time);



-- =========================
-- Visits
-- =========================

CREATE TABLE Visits (
    visit_id SERIAL PRIMARY KEY,

    appointment_id INT UNIQUE,

    patient_id INT,
    doctor_id INT,

    diagnosis TEXT,
    visit_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,

    FOREIGN KEY (appointment_id)
    REFERENCES Appointments(appointment_id),

    FOREIGN KEY (patient_id)
    REFERENCES Patients(patient_id),

    FOREIGN KEY (doctor_id)
    REFERENCES Doctors(doctor_id)
);



-- =========================
-- Prescriptions
-- =========================

CREATE TABLE Prescriptions (
    prescription_id SERIAL PRIMARY KEY,

    visit_id INT NOT NULL,

    medicine_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    duration_days INT,

    FOREIGN KEY (visit_id)
    REFERENCES Visits(visit_id)
    ON DELETE CASCADE
);



-- =========================
-- Treatments
-- ========================= 

CREATE TABLE Treatments (
    treatment_id SERIAL PRIMARY KEY,

    visit_id INT NOT NULL,

    treatment_type VARCHAR(100),
    treatment_cost NUMERIC(10,2),

    treatment_notes TEXT,

    FOREIGN KEY (visit_id)
    REFERENCES Visits(visit_id)
    ON DELETE CASCADE
);
