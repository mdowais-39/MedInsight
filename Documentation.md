# MedInsight

-----------------------------------------------------
## Phase 1 - System Design & Database MOdeling

Clear system requirements
- Entities and attributes
- Relationships
- ER Diagram
- Relational schema
- Normalization (3NF)

- Our system simulates a **hospital management and analytics platform**

### 1. System Requirements

Should support the following operations:

**Patient Management**
Register a new patient
Store patient details
Track patient visits

**Doctor Management**
Store doctor details
Associate doctors with departments

**Appointment System**
Patients can book appointments with doctors
Appointments have status:
- Scheduled
- Completed
- Cancelled

**Visit Records**
When a patient meets a doctor, a visit record is created
Doctor records diagnosis and notes

**Prescription Management**
During visits, doctors prescribe medicines
Treatment Records
Treatments performed during visits are stored
Treatments include cost

### 2. Core Entities

Patient : patient_id (Primary Key)
name
age
gender
phone
email
address
registration_date

Departments : department_id (Primary Key)
department_name
location

Doctors : doctor_id (Primary Key)
name
specialization
department_id (Foreign Key)
experience_years
phone
email

Appointments : appointment_id (Primary Key)
patient_id (Foreign Key)
doctor_id (Foreign Key)
appointment_time
status
created_at

Visits : visit_id (Primary Key)
appointment_id (Foreign Key)
patient_id (Foreign Key)
doctor_id (Foreign Key)
diagnosis
visit_date
notes

Prescriptions : prescription_id (Primary Key)
visit_id (Foreign Key)
medicine_name
dosage
duration_days

Treatments : treatment_id (Primary Key)
visit_id (Foreign Key)
treatment_type
treatment_cost
treatment_notes

### 3. Relationships Between Entities

Patient → books → Appointment

Doctor → receives → Appointment

Appointment → generates → Visit

Visit → produces → Prescription

Visit → includes → Treatment

Department → contains → Doctors

### 4. Cardinality

Cardinality describes how many records can relate

Patient → Appointment
- 1 Patient → Many Appointments

Doctor → Appointment
- 1 Doctor → Many Appointments

Appointment → Visit
- 1 Appointment → 0 or 1 Visit

Visit → Prescription
- 1 Visit → Many Prescriptions

Visit → Treatment
- 1 Visit → Many Treatments

Department → Doctor
- 1 Department → Many Doctors

### 5. ER Diagram

### 6. Relational Schema

### 7. Normalization

1. 1NF : All attributes contain **atomic vlaues**
- medicine_name stored individually

2. 2NF : All attributes depend on the entire primary key

3. 3NF : No transitive dependencies
- Doctor department stored in Doctors table, not repeated elsewhere.

---------------------------------------------------

## Phase 2 - OLTP Database Implementation

### 1. Install PostgreSQL

### 2. Open PostgreSQL
In terminal
 - psql -U postgres

Enter password

### 3. Create Database

- CREATE DATABASE healthcare_db
Connect to it - \c healthcare_db

### 4. Create Tables

Always create independent tables first

Department table: 
CREATE TABLE Departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    location VARCHAR(100)
);

Patient table:
CREATE TABLE Patients (
    patient_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    registration_date DATE DEFAULT CURRENT_DATE
);

Doctors table:
CREATE TABLE Doctors (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    department_id INT,
    experience_years INT,
    phone VARCHAR(20),
    email VARCHAR(100),

    FOREIGN KEY (department_id)
    REFERENCES Departments(department_id)
);

Appointments table:
CREATE TABLE Appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    appointment_time TIMESTAMP,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id)
    REFERENCES Patients(patient_id),

    FOREIGN KEY (doctor_id)
    REFERENCES Doctors(doctor_id)
);

Visit table:
CREATE TABLE Visits (
    visit_id SERIAL PRIMARY KEY,
    appointment_id INT,
    patient_id INT,
    doctor_id INT,
    diagnosis TEXT,
    visit_date DATE,
    notes TEXT,

    FOREIGN KEY (appointment_id)
    REFERENCES Appointments(appointment_id),

    FOREIGN KEY (patient_id)
    REFERENCES Patients(patient_id),

    FOREIGN KEY (doctor_id)
    REFERENCES Doctors(doctor_id)
);

Prescription table:
CREATE TABLE Prescriptions (
    prescription_id SERIAL PRIMARY KEY,
    visit_id INT,
    medicine_name VARCHAR(100),
    dosage VARCHAR(50),
    duration_days INT,

    FOREIGN KEY (visit_id)
    REFERENCES Visits(visit_id)
);

Treatments table:
CREATE TABLE Treatments (
    treatment_id SERIAL PRIMARY KEY,
    visit_id INT,
    treatment_type VARCHAR(100),
    treatment_cost NUMERIC(10,2),
    treatment_notes TEXT,

    FOREIGN KEY (visit_id)
    REFERENCES Visits(visit_id)
);

### 5. Verify all the tables

-\dt

             List of relations
 Schema |     Name      | Type  |  Owner
--------+---------------+-------+----------
 public | appointments  | table | postgres
 public | departments   | table | postgres
 public | doctors       | table | postgres
 public | patients      | table | postgres
 public | prescriptions | table | postgres
 public | treatments    | table | postgres
 public | visits        | table | postgres
(7 rows)


### 6. Check table structure

-d Patients

Working Good

-----------------------------------------------------


