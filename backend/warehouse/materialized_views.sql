--Top Doctors--

CREATE MATERIALIZED VIEW mv_top_doctors AS
SELECT
    doctor_id,
    COUNT(*) AS total_appointments
FROM Appointments
GROUP BY doctor_id;

--Department Load--
CREATE MATERIALIZED VIEW mv_department_load AS
SELECT
    department_id,
    SUM(total_visits) AS total_visits
FROM FactVisits
GROUP BY department_id;

--Monthly Visits--
CREATE MATERIALIZED VIEW mv_monthly_visits AS
SELECT
    t.year,
    t.month,
    SUM(f.total_visits) AS total_visits
FROM FactVisits f
JOIN DimTime t ON f.appointment_date = t.date
GROUP BY t.year, t.month;

--Doctor Workload--
CREATE MATERIALIZED VIEW mv_doctor_workload AS
SELECT
    doctor_id,
    SUM(total_visits) AS total_visits
FROM FactVisits
GROUP BY doctor_id;

