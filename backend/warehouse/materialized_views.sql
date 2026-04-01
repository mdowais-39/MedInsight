--Top Doctors--

DROP MATERIALIZED VIEW IF EXISTS mv_top_doctors;

CREATE MATERIALIZED VIEW mv_top_doctors AS
SELECT
    doctor_id,
    EXTRACT(YEAR FROM appointment_date) AS year,
    EXTRACT(MONTH FROM appointment_date) AS month,
    COUNT(*) AS total_appointments
FROM Appointments
GROUP BY doctor_id, year, month;

--Department Load--
DROP MATERIALIZED VIEW IF EXISTS mv_department_load;

CREATE MATERIALIZED VIEW mv_department_load AS
SELECT
    d.department_id,
    EXTRACT(YEAR FROM a.appointment_date) AS year,
    COUNT(*) AS total_visits
FROM Appointments a
JOIN Doctors d ON a.doctor_id = d.doctor_id
GROUP BY d.department_id, year;

--Monthly Visits--
DROP MATERIALIZED VIEW IF EXISTS mv_monthly_visits;

CREATE MATERIALIZED VIEW mv_monthly_visits AS
SELECT
    EXTRACT(YEAR FROM appointment_date) AS year,
    EXTRACT(MONTH FROM appointment_date) AS month,
    COUNT(*) AS total_visits
FROM Appointments
GROUP BY year, month;

--Doctor Workload--
DROP MATERIALIZED VIEW IF EXISTS mv_doctor_workload;

CREATE MATERIALIZED VIEW mv_doctor_workload AS
SELECT
    doctor_id,
    EXTRACT(YEAR FROM appointment_date) AS year,
    COUNT(*) AS total_visits
FROM Appointments
GROUP BY doctor_id, year;

