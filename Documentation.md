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

## Phase 3 - Application Layer

Build a **Python interface** that **interacts with the PostgreSQL database** to simulate hospital operations.

Instead of manually writing SQL every time, we will create Python functions that perform operations like:
register a patient
book an appointment
record a visit
add prescriptions
add treatments

This simulates how a real hospital backend service works.

### 1. Project Folder structure

smart-healthcare-dbms/
│
├── database/
│   │
│   ├── schema.sql
│   ├── sample_data.sql
│   └── indexes.sql
│
├── app/
│   │
│   ├── db_connection.py
│   │
│   ├── services/
│   │   ├── patient_service.py
│   │   ├── doctor_service.py
│   │   ├── appointment_service.py
│   │   └── visit_service.py
│   │
│   └── utils/
│       └── helpers.py
│
├── transactions/
│   │
│   ├── transaction_demo.py
│   ├── rollback_demo.py
│   └── concurrency_test.py
│
├── etl/
│   │
│   ├── extract.py
│   ├── transform.py
│   └── load.py
│
├── warehouse/
│   │
│   ├── warehouse_schema.sql
│   └── analytics_queries.sql
│
├── data/
│   │
│   └── generated_data/
│
├── tests/
│   │
│   ├── test_patients.py
│   └── test_appointments.py
│
├── docs/
│   │
│   ├── project_plan.docx
│   ├── er_diagram.png
│   └── architecture.md
│
├── main.py
│
├── requirements.txt
│
└── README.md

### 2. Install postgres driver

- pip install psycopg2

### 3. Database Connection Module

### 4. Implementing Core operations

Operation	File
Register patient	patient_service.py
Add doctor	doctor_service.py
Book appointment	appointment_service.py
Record visit	visit_service.py
Add prescription	visit_service.py
Add treatment	visit_service.py

And they will be executed through
 - main.py

### 5. Including the patient doctor role based access design

Updated Folder structure

smart-healthcare-dbms/
│
├── database/
├── app/
│   ├── db_connection.py
│
│   ├── api/
│   │   ├── patient/
│   │   │   ├── patient_routes.py
│   │   │   └── appointment_routes.py
│   │   │
│   │   └── doctor/
│   │       ├── doctor_routes.py
│   │       └── visit_routes.py
│   │
│   ├── services/
│   │   ├── patient_service.py
│   │   ├── doctor_service.py
│   │   ├── appointment_service.py
│   │   └── visit_service.py
│   │
│   └── utils/
│       └── helpers.py
│
├── transactions/
├── etl/
├── warehouse/
├── data/
├── tests/
├── docs/
│
├── main.py
├── requirements.txt
└── README.md

### 6. Updating the requirements
psycopg2-binary
fastapi
uvicorn
pandas
sqlalchemy
faker
python-dotenv

### 7. Updating the ***main.py*** FastAPI application

Getting all the routes of respective patient and doctor role

### 8. Patient registration endpoint

- app/api/patient/patient_routes.py

### 9. Patient Book Apointment endpoint

- app/api/patient/appointment_routes.py

### 10. Viewing Doctors Endpoint

- app/api/doctor/doctor_routes.py

### 11. Adding Doctor Service Function

- app/services/doctor_service.py

### 12. Docotr's Record Visit

- app/api/doctor/visit_routes.py

- Doctor - Add Prescription

- Doctor - Add Treatment

### 13. Running the api server
----------------------------------------------------

## Complete **Data Flow** of the system

System Setup
   ↓
Departments + Doctors (initial data)
   ↓
Doctor Registration API
   ↓
Patient Registration API
   ↓
Appointment Booking
   ↓
Doctor Visit
   ↓
Prescriptions + Treatments
   ↓
Large dataset generation
   ↓
Transactions testing
   ↓
ETL pipeline
   ↓
Data warehouse analytics

## Phase 3 Extended

### Adding three missing API
- Doctor registration - ***app/api/doctor/doctor_routes.py***
- List departments - ***app/api/patient/department_routes.py***
- List doctors by department - ***app/api/patient/department_routes.py***

### Creating a new service - **Department Service**

- app/services/department_service.py

- Registering new routes - ***main.py***


### New APIs Added
API	Purpose
POST /doctors/register	Doctor self-registration
GET /doctors	List all doctors
GET /departments	List departments
GET /departments/{id}/doctors	Doctors in department


**Patient flow**:
GET /departments
GET /departments/{id}/doctors
POST /patients/register
POST /appointments/book


**Doctor flow**:
POST /doctors/register
GET /doctor/{id}/appointments
POST /doctor/record-visit
POST /doctor/add-prescription
POST /doctor/add-treatment


### Converting to pydantic for better api requests

- Creating the ***schema*** folder

FastAPI Routes
        ↓
Pydantic Schemas
        ↓
Service Layer
        ↓
PostgreSQL Database

### Adding some predefined doctor departments to make appointments and get prescreption and treatment api working

-----------------------------------------------------

## Phase 4 - Transaction Management And Concurrency

- **ACID**
- **Isolation Levels**
- **Rollback**
- **Handling cometing booking**

### 1. Transaction Demo(ACID-Atomic Commit)

- Showing that **multiple operations** succeed together inside **one transaction**

### 2. Rollbakc Demonstration

- **Showing Atomicity** - if **one operation fails** **all operations are rolled back**

### 3. Concurrency Test ( Two Patients Same Slot)

- Simulating **two users booking the same doctor/time slot**


- **Unique constraint**:
UNIQUE (doctor_id, appointment_date, appointment_time)

**Expected result**:
Patient 1 booked successfully
Patient 2 failed: duplicate key value violates unique constraint

### 4. Isolation Level Experiment


- cur.execute("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE")


Example levels:
READ COMMITTED
REPEATABLE READ
SERIALIZABLE

- This helps demonstrate concurrency transaction behavior

### Testing Documentation

**Transaction Test**
Operation: Insert patient and appointment in single transaction
Result: Both operations committed successfully
Conclusion: Demonstrates Atomicity

**Rollback Test**
Operation: Intentional SQL error inside transaction
Result: Entire transaction rolled back
Conclusion: Demonstrates Atomicity

**Concurrency Test**
Operation: Two users attempt to book same slot
Result: Only one transaction succeeded
Conclusion: Demonstrates Isolation and Consistency

- A concurrency test was conducted where two patients attempted
to book the same doctor appointment slot simultaneously.

Due to the UNIQUE constraint on (doctor_id, appointment_date,
appointment_time), the database allowed only one transaction
to commit successfully while the other transaction failed and
was rolled back.

This demonstrates the role of database constraints and
transaction isolation in maintaining data consistency.

Patient 2 booked successfully
Patient 1 failed

-----------------------------------------------------------

## Phase 5 - Database Performance Optimization

- Query performance
- Indexing
- Query planning
- Optimization

- IMP because **databases becomes slow when the tables grow**

This phase will mostly affect the database folder.

database/
│
├── schema.sql
├── sample_data.sql
└── indexes.sql   ← new file

And we will create a performance test script.

tests/
│
└── performance_test.py

### 1. Identify all the slow queries

Common queries:
- Fetch doctors
- Fetch doctors by department
- Fetch patient appointments
- Fetch doctor's schedule

### 2. Analyze query performance

PostgreSQL provides

- EXPLAIN ANALYZE

EXPLAIN ANALYZE
SELECT * FROM Appointments
WHERE doctor_id = 1;

If postgreSQL scans the entire table, we will see:
Seq Scan on appointments
-this means full table scan(slow)

### 3. Add Indexes

Indexes allows postgreSQL to find records quickly

Add indexes
- doctor lookup
- patient appointment lookup
- doctor schedule lookup
- date based queries
- visit lookup
- prescreption lookup

### 4. Run the index Script

Run the index script
- \i database/indexes.sql

Check Indexes
- \d Appointments


Inside PostgreSQL:
\i database/indexes.sql

Check indexes:
\d Appointments

Indexes:
    "appointments_pkey" PRIMARY KEY, btree (appointment_id)
    "idx_appointments_date" btree (appointment_date)
    "idx_appointments_doctor" btree (doctor_id)
    "idx_appointments_patient" btree (patient_id)
    "unique_doctor_slot" UNIQUE CONSTRAINT, btree (doctor_id, appointment_date, appointment_time)


### 5. Re-run Performance Analysis

- EXPLAIN ANALYZE
SELECT * FROM Appointments
WHERE doctor_id = 1;

                                                           QUERY PLAN
---------------------------------------------------------------------------------------------------------------------------------------   
 Index Scan using idx_appointments_doctor on appointments  (cost=0.13..8.15 rows=1 width=90) (actual time=0.109..0.109 rows=0 loops=1)    
   Index Cond: (doctor_id = 1)
 Planning Time: 0.251 ms
 Execution Time: 0.151 ms
(4 rows)


Initially, PostgreSQL used a sequential scan due to the small size of the table.
After increasing the dataset size, the query planner switched to an index scan, demonstrating the effectiveness of indexing for large datasets.

### 6. Performance Test Script

- tests/performance_test.py

### 7. Phase 5 observables

Optimization	Benefit
Indexes	faster lookup
Query analysis	detect slow queries
Execution plans	understand DB behavior
Performance measurement	validate improvements

- Performance optimization was performed by analyzing
query execution plans using **EXPLAIN ANALYZE.**

- Indexes were created on frequently queried attributes
such as **doctor_id, patient_id, and appointment_date, visit_id, department_id**.

- **Before indexing**, PostgreSQL performed **sequential scans** which required scanning the entire table.

- After indexing, the database used index scans which
significantly **improved query performance**.

-----------------------------------------------------------

## Phase 6 - ETL Pipeline + Large Dataset Generation

Transforming from **DBMS system** into also **data engineering concepts**

Will Implement:
ETL = Extract → Transform → Load

Operational Database (OLTP)
        ↓
Extract data
        ↓
Transform data
        ↓
Load analytics-ready tables

### 1. Generating Large Dataset

- data/generate_large_dataset.py

### 2. Extract Phase

- etl/extract.py

### 3. Transform Phase

- etl/transform.py

### 4. Load Phase

- etl/load.py

### 5. ETL RUnner

- etl/run_etl.py

Extraction Completed
Transformation completed
patients loaded successfully
doctors loaded successfully
appointments loaded successfully

### 6. Verify Large Dataset

- SELECT COUNT(*) FROM Patients;
- SELECT COUNT(*) FROM Doctors;
- SELECT COUNT(*) FROM Appointments;


Patients      ~10000
Doctors       ~200
Appointments  ~50000